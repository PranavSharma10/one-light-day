from pathlib import Path

import httpx
import pytest
from fastapi.testclient import TestClient

from app.main import app, cache, get_http

FIXTURE = Path(__file__).parent / "fixtures" / "horizons_real.txt"
URL = "/api/v1/voyager1/ephemeris"


def horizons_ok(request: httpx.Request) -> httpx.Response:
    return httpx.Response(200, json={"result": FIXTURE.read_text(encoding="utf-8")})


def client_with(handler) -> TestClient:
    fake = httpx.AsyncClient(transport=httpx.MockTransport(handler))
    app.dependency_overrides[get_http] = lambda: fake
    return TestClient(app)


@pytest.fixture(autouse=True)
def reset():
    cache.clear()
    yield
    app.dependency_overrides.clear()
    cache.clear()


def test_returns_nasa_samples():
    with client_with(horizons_ok) as c:
        r = c.get(URL)
    assert r.status_code == 200
    body = r.json()
    assert body["source"] == "JPL Horizons"
    assert len(body["samples"]) == 4
    assert body["samples"][0]["t"].startswith("2026-11-17T19:00")
    assert "s-maxage" in r.headers["cache-control"]


def test_asks_for_voyager_1():
    seen = {}

    def handler(request):
        seen.update(request.url.params)
        return horizons_ok(request)

    with client_with(handler) as c:
        c.get(URL)
    assert seen["COMMAND"] == "'-31'"
    assert seen["CENTER"] == "'500@399'"


def test_second_request_is_cached():
    calls = []

    def handler(request):
        calls.append(request)
        return horizons_ok(request)

    with client_with(handler) as c:
        c.get(URL)
        c.get(URL)
    assert len(calls) == 1


def test_nasa_down_gives_503():
    with client_with(lambda request: httpx.Response(500)) as c:
        assert c.get(URL).status_code == 503


def test_horizons_error_text_gives_503():
    error = lambda request: httpx.Response(200, json={"result": 'No ephemeris for target "-31"'})
    with client_with(error) as c:
        assert c.get(URL).status_code == 503

DSN_FIXTURE = Path(__file__).parent / "fixtures" / "dsn_20261117.xml"
DSN_ENDPOINT = "/api/v1/dsn/voyager1"


def dsn_ok(request: httpx.Request) -> httpx.Response:
    return httpx.Response(200, text=DSN_FIXTURE.read_text(encoding="utf-8"))


def test_dsn_reports_no_contact():
    with client_with(dsn_ok) as c:
        r = c.get(DSN_ENDPOINT)
    assert r.status_code == 200
    body = r.json()
    assert body["in_contact"] is False
    assert body["links"] == []
    assert body["timestamp"].startswith("2026-11-17T19:50:31")
    assert "s-maxage=5" in r.headers["cache-control"]


def test_dsn_reads_the_nasa_feed():
    urls = []

    def handler(request):
        urls.append(str(request.url))
        return dsn_ok(request)

    with client_with(handler) as c:
        c.get(DSN_ENDPOINT)
    assert urls == ["https://eyes.nasa.gov/dsn/data/dsn.xml"]


def test_dsn_broken_xml_gives_503():
    with client_with(lambda request: httpx.Response(200, text="<dsn><dish")) as c:
        assert c.get(DSN_ENDPOINT).status_code == 503


def test_dsn_down_gives_503():
    with client_with(lambda request: httpx.Response(502)) as c:
        assert c.get(DSN_ENDPOINT).status_code == 503