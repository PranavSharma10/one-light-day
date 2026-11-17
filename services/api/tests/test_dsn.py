from datetime import datetime, timezone
from pathlib import Path

import pytest
from defusedxml import EntitiesForbidden

from app.dsn import parse_dsn

FIXTURE = Path(__file__).parent / "fixtures" / "dsn_20261117.xml"
C_KMS = 299_792.458


@pytest.fixture
def xml():
    return FIXTURE.read_text(encoding="utf-8")


def test_voyager_not_tracked_in_this_snapshot(xml):
    status = parse_dsn(xml)  # defaults to Voyager 1 (-31)
    assert status.in_contact is False
    assert status.links == ()


def test_reads_feed_time(xml):
    assert parse_dsn(xml).timestamp == datetime(2026, 11, 17, 19, 50, 31, tzinfo=timezone.utc)


def test_spacecraft_in_contact(xml):
    status = parse_dsn(xml, naif_id=-49)  # Lucy
    assert status.in_contact
    (link,) = status.links
    assert (link.station, link.dish) == ("Goldstone", "DSS24")
    (down,) = link.active_signals
    assert (down.direction, down.band, down.data_rate_bps) == ("down", "X", 20000)


def test_round_trip_time_matches_range(xml):
    link = parse_dsn(xml, naif_id=-49).links[0]
    assert link.rtlt_s == pytest.approx(2 * link.range_km / C_KMS, rel=0.01)


def test_pointed_but_silent_is_not_contact(xml):
    status = parse_dsn(xml, naif_id=-8)  # WIND: dish assigned, signals off
    assert len(status.links) == 1
    assert status.in_contact is False


def test_dishes_belong_to_the_station_before_them(xml):
    assert parse_dsn(xml, naif_id=-85).links[0].station == "Madrid"    # LRO on DSS56
    assert parse_dsn(xml, naif_id=-61).links[0].station == "Canberra"  # Juno on DSS43


def test_rejects_xml_entity_tricks():
    evil = '<?xml version="1.0"?><!DOCTYPE d [<!ENTITY a "aaaa">]><dsn>&a;</dsn>'
    with pytest.raises(EntitiesForbidden):
        parse_dsn(evil)