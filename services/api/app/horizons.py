"""JPL Horizons: build the query and parse the observer table for Voyager 1."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone

HORIZONS_URL = "https://ssd.jpl.nasa.gov/api/horizons.api"
VOYAGER1_ID = "-31"

AU_KM = 149_597_870.7   # Horizons states these in its own header
C_KMS = 299_792.458

REQUIRED = ("r", "rdot", "delta", "deldot", "1-way_down_LT")


class HorizonsError(RuntimeError):
    """Horizons answered, but not with a table we can read."""


@dataclass(frozen=True)
class Sample:
    t: datetime              # UTC, when the light is received at Earth
    helio_au: float          # distance from the Sun
    helio_rate_kms: float
    range_km: float          # distance from Earth
    range_rate_kms: float    # + means moving apart
    owlt_s: float            # one-way light time, Voyager -> Earth


def build_params(start: datetime, stop: datetime, step: str = "1 h") -> dict[str, str]:
    """Query for an Earth-centred observer table of Voyager 1."""
    fmt = "%Y-%m-%d %H:%M"
    return {
        "format": "json",
        "COMMAND": f"'{VOYAGER1_ID}'",
        "OBJ_DATA": "'NO'",
        "MAKE_EPHEM": "'YES'",
        "EPHEM_TYPE": "'OBSERVER'",
        "CENTER": "'500@399'",
        "START_TIME": f"'{start.astimezone(timezone.utc).strftime(fmt)}'",
        "STOP_TIME": f"'{stop.astimezone(timezone.utc).strftime(fmt)}'",
        "STEP_SIZE": f"'{step}'",
        "QUANTITIES": "'19,20,21'",
        "CSV_FORMAT": "'YES'",
    }


def parse_observer_table(text: str) -> list[Sample]:
    """Turn the text in Horizons' JSON `result` field into Samples."""
    lines = [line.strip() for line in text.splitlines()]

    # 1. Find the data block. Errors (bad target, bad dates) come back as plain text.
    if "$$SOE" not in lines or "$$EOE" not in lines:
        snippet = " ".join(text.split())[:300]
        raise HorizonsError(f"No ephemeris table in response: {snippet}")
    soe, eoe = lines.index("$$SOE"), lines.index("$$EOE")

    # 2. Find columns by name, not position, so extra quantities can't shift them.
    header = next((l for l in reversed(lines[:soe]) if l.startswith("Date__")), None)
    if header is None:
        raise HorizonsError("No column header found above $$SOE")
    cols = [c.strip() for c in header.split(",")]
    missing = [name for name in REQUIRED if name not in cols]
    if missing:
        raise HorizonsError(f"Missing columns {missing}; header was {cols}")
    i = {name: cols.index(name) for name in REQUIRED}

    # 3. Read each row and convert to the units the site uses.
    samples = []
    for row in lines[soe + 1 : eoe]:
        if not row:
            continue
        f = [x.strip() for x in row.split(",")]
        try:
            samples.append(
                Sample(
                    t=datetime.strptime(f[0], "%Y-%b-%d %H:%M").replace(tzinfo=timezone.utc),
                    helio_au=float(f[i["r"]]),
                    helio_rate_kms=float(f[i["rdot"]]),
                    range_km=float(f[i["delta"]]) * AU_KM,
                    range_rate_kms=float(f[i["deldot"]]),
                    owlt_s=float(f[i["1-way_down_LT"]]) * 60,
                )
            )
        except (ValueError, IndexError) as exc:
            raise HorizonsError(f"Unreadable row {row!r}: {exc}") from exc

    if not samples:
        raise HorizonsError("Ephemeris table was empty")
    return samples