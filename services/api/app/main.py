"""One Light-Day API: live Voyager 1 data from NASA/JPL."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from dataclasses import asdict
from datetime import datetime, timedelta, timezone

import httpx
from fastapi import Depends, FastAPI, HTTPException, Request, Response
from pydantic import BaseModel

from . import dsn, horizons
from .cache import TTLCache

from xml.etree.ElementTree import ParseError

from defusedxml import DefusedXmlException


log = logging.getLogger("onelightday")
cache = TTLCache()
USER_AGENT = "onelightday/0.1 (+https://github.com/PranavSharma10)"


@asynccontextmanager
async def lifespan(app: FastAPI):
    # One HTTP client for the whole app: it reuses connections to NASA.
    async with httpx.AsyncClient(timeout=20, headers={"User-Agent": USER_AGENT}) as client:
        app.state.http = client
        yield


app = FastAPI(title="One Light-Day API", version="0.1.0", lifespan=lifespan)


def get_http(request: Request) -> httpx.AsyncClient:
    """Dependency: tests swap this for a fake client."""
    return request.app.state.http


class SampleOut(BaseModel):
    t: datetime
    helio_au: float
    helio_rate_kms: float
    range_km: float
    range_rate_kms: float
    owlt_s: float


class EphemerisOut(BaseModel):
    source: str
    target: str
    observer: str
    time_tag: str
    fetched_at: datetime
    samples: list[SampleOut]


async def fetch_ephemeris(client: httpx.AsyncClient) -> EphemerisOut:
    now = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0)
    params = horizons.build_params(now - timedelta(hours=30), now + timedelta(hours=54))
    r = await client.get(horizons.HORIZONS_URL, params=params)
    r.raise_for_status()
    samples = horizons.parse_observer_table(r.json().get("result", ""))
    return EphemerisOut(
        source="JPL Horizons",
        target="Voyager 1 (-31)",
        observer="Earth geocentre (500@399)",
        time_tag="t is when the light is received at Earth",
        fetched_at=datetime.now(timezone.utc),
        samples=[SampleOut(**asdict(s)) for s in samples],
    )


@app.get("/api/healthz")
async def healthz() -> dict:
    return {"ok": True}


@app.get("/api/v1/voyager1/ephemeris", response_model=EphemerisOut)
async def ephemeris(response: Response, client: httpx.AsyncClient = Depends(get_http)):
    """Hourly Voyager 1 positions, 30 h back to 54 h ahead. The browser interpolates."""
    try:
        data = await cache.get("ephemeris", ttl_s=3600, load=lambda: fetch_ephemeris(client))
    except (httpx.HTTPError, horizons.HorizonsError, ValueError) as exc:
        log.warning("Horizons unavailable: %s", exc)
        raise HTTPException(status_code=503, detail="JPL Horizons is unavailable") from exc
    # Let browsers keep it 5 min, and Firebase's CDN 30 min.
    response.headers["Cache-Control"] = "public, max-age=300, s-maxage=1800"
    return data

async def fetch_dsn(client: httpx.AsyncClient) -> dsn.DsnStatus:
    r = await client.get(dsn.DSN_URL)
    r.raise_for_status()
    return dsn.parse_dsn(r.text)


@app.get("/api/v1/dsn/voyager1", response_model=dsn.DsnStatus)
async def dsn_voyager1(response: Response, client: httpx.AsyncClient = Depends(get_http)):
    """Which Deep Space Network dish, if any, is talking to Voyager 1 right now."""
    try:
        data = await cache.get("dsn", ttl_s=5, load=lambda: fetch_dsn(client))
    except (httpx.HTTPError, ParseError, DefusedXmlException) as exc:
        log.warning("DSN Now unavailable: %s", exc)
        raise HTTPException(status_code=503, detail="DSN Now is unavailable") from exc
    response.headers["Cache-Control"] = "public, max-age=5, s-maxage=5"
    return data