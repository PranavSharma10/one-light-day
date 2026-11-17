"""A small async cache: each value is kept for `ttl_s` seconds."""

from __future__ import annotations

import asyncio
import time
from typing import Awaitable, Callable, TypeVar

T = TypeVar("T")


class TTLCache:
    def __init__(self) -> None:
        self._store: dict[str, tuple[float, object]] = {}
        self._locks: dict[str, asyncio.Lock] = {}

    def _fresh(self, key: str, ttl_s: float) -> bool:
        hit = self._store.get(key)
        return hit is not None and time.monotonic() - hit[0] < ttl_s

    async def get(self, key: str, ttl_s: float, load: Callable[[], Awaitable[T]]) -> T:
        if self._fresh(key, ttl_s):
            return self._store[key][1]  # type: ignore[return-value]
        lock = self._locks.setdefault(key, asyncio.Lock())
        async with lock:
            # Another request may have refreshed it while we waited for the lock.
            if self._fresh(key, ttl_s):
                return self._store[key][1]  # type: ignore[return-value]
            value = await load()
            self._store[key] = (time.monotonic(), value)
            return value

    def clear(self) -> None:
        self._store.clear()
        self._locks.clear()