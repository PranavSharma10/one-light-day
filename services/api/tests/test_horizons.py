from datetime import datetime, timezone
from pathlib import Path

import pytest

from app.horizons import AU_KM, C_KMS, HorizonsError, build_params, parse_observer_table

FIXTURE = Path(__file__).parent / "fixtures" / "horizons_real.txt"


@pytest.fixture
def samples():
    return parse_observer_table(FIXTURE.read_text(encoding="utf-8"))


def test_reads_every_hourly_row(samples):
    assert len(samples) == 4
    assert samples[0].t == datetime(2026, 11, 17, 19, 0, tzinfo=timezone.utc)
    assert samples[-1].t.hour == 22


def test_converts_units(samples):
    s = samples[0]
    assert s.range_km == pytest.approx(173.125507000362 * AU_KM)
    assert s.owlt_s == pytest.approx(1439.84093662 * 60)
    assert s.range_rate_kms == pytest.approx(25.6603489)


def test_light_time_equals_distance_over_c(samples):
    # Physics sanity check on NASA's own numbers.
    for s in samples:
        assert s.owlt_s == pytest.approx(s.range_km / C_KMS, abs=0.001)


def test_voyager_is_moving_away(samples):
    assert all(b.range_km > a.range_km for a, b in zip(samples, samples[1:]))


def test_keeps_horizons_error_text():
    with pytest.raises(HorizonsError, match="-999"):
        parse_observer_table('No ephemeris for target "-999"')


def test_names_the_missing_column():
    broken = FIXTURE.read_text(encoding="utf-8").replace("deldot", "speed")
    with pytest.raises(HorizonsError, match="deldot"):
        parse_observer_table(broken)


def test_params_are_quoted_for_horizons():
    p = build_params(datetime(2026, 11, 18, 5, tzinfo=timezone.utc),
                     datetime(2026, 11, 20, 5, tzinfo=timezone.utc))
    assert p["COMMAND"] == "'-31'"
    assert p["START_TIME"] == "'2026-11-18 05:00'"