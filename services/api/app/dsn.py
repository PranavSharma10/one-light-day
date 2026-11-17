"""NASA Deep Space Network status, from the DSN Now feed."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone

from defusedxml.ElementTree import fromstring

DSN_URL = "https://eyes.nasa.gov/dsn/data/dsn.xml"
VOYAGER1_ID = -31  # the same NAIF ID Horizons uses


@dataclass(frozen=True)
class Signal:
    direction: str               # "up" (Earth -> spacecraft) or "down"
    band: str | None             # S, X, K, Ka
    data_rate_bps: float | None
    power_dbm: float | None


@dataclass(frozen=True)
class Link:
    station: str | None          # Goldstone, Madrid, Canberra
    dish: str                    # e.g. DSS63
    elevation_deg: float | None
    active_signals: tuple[Signal, ...]
    range_km: float | None
    rtlt_s: float | None         # round-trip light time


@dataclass(frozen=True)
class DsnStatus:
    timestamp: datetime | None
    in_contact: bool
    links: tuple[Link, ...]


def _num(value: str | None) -> float | None:
    try:
        return float(value) if value not in (None, "") else None
    except ValueError:
        return None


def _distance(value: str | None) -> float | None:
    """The feed uses -1 for 'no target'."""
    n = _num(value)
    return n if n is not None and n >= 0 else None


def parse_dsn(xml_text: str, naif_id: int = VOYAGER1_ID) -> DsnStatus:
    root = fromstring(xml_text)
    station: str | None = None
    timestamp: datetime | None = None
    links: list[Link] = []

    for el in root:
        if el.tag == "station":
            # Dishes that follow belong to this station.
            station = el.get("friendlyName") or el.get("name")
        elif el.tag == "timestamp" and el.text:
            timestamp = datetime.fromtimestamp(int(el.text) / 1000, tz=timezone.utc)
        elif el.tag == "dish":
            # Signals carry the negative NAIF ID (-31); the target carries it unsigned (31).
            signals = [s for s in el if s.tag in ("upSignal", "downSignal")
                       and s.get("spacecraftID") == str(naif_id)]
            target = next((t for t in el.findall("target") if t.get("id") == str(abs(naif_id))), None)
            if target is None and not signals:
                continue
            active = tuple(
                Signal(
                    direction="up" if s.tag == "upSignal" else "down",
                    band=s.get("band") or None,
                    data_rate_bps=_num(s.get("dataRate")),
                    power_dbm=_num(s.get("power")),
                )
                for s in signals
                if s.get("active") == "true"
            )
            links.append(
                Link(
                    station=station,
                    dish=el.get("name", ""),
                    elevation_deg=_num(el.get("elevationAngle")),
                    active_signals=active,
                    range_km=_distance(target.get("downlegRange")) if target is not None else None,
                    rtlt_s=_distance(target.get("rtlt")) if target is not None else None,
                )
            )

    return DsnStatus(
        timestamp=timestamp,
        in_contact=any(link.active_signals for link in links),
        links=tuple(links),
    )