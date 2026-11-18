# One Light-Day

**A tribute to Voyager 1, the first human-made object to reach one light-day from Earth (November 2026).**

Light, the fastest thing there is, now takes a whole day to reach Voyager 1. This site follows it live, tells its story, and lets you decode the Golden Record it carries.

## What's inside

| Part | What it does | Built with |
| --- | --- | --- |
| **Live tracker** | Voyager 1's distance, speed and light-time, ticking in real time from NASA JPL's ephemeris, plus whether a Deep Space Network dish is talking to it right now | FastAPI, JPL Horizons API, DSN Now feed, Hermite interpolation |
| **Talk to Voyager** | Type a message and see when it would arrive, and when a reply would get back to you. Messages stay in your browser | React, localStorage |
| **Timeline** | 14 moments from launch to today, with NASA images | React, native `<dialog>` |
| **Heliosphere scale** | Where Voyager is, compared with the planets and the edge of the Sun's bubble | SVG |
| **The comic** | *The little probe that kept going*: 13 hand-drawn chapters, read aloud by your browser, printable as a book | SVG components, Web Speech API, print CSS |
| **Golden Record room** | Decode the cover's binary, hear a picture as sound and rebuild it, date the record with real pulsar data, make your own record | SVG, Web Audio, Canvas |
| **The Lab** *(in progress)* | Ask Voyager (RAG over NASA documents), a Data Lab with Voyager's real instrument data, and a fault-recovery AI agent | Vertex AI, pandas, agents |

## Architecture

```
Browser (React + Vite + TypeScript)
   │  /api/**
   ▼
Firebase Hosting ──rewrite──▶ Cloud Run: onelightday-api (FastAPI, europe-west1)
                                 ├── JPL Horizons API   (ephemeris, cached 1 h)
                                 └── DSN Now XML feed   (dish status, cached 5 s)
```

- The API shares one async HTTP client, caches each upstream with a lock (no cache stampede), sends `Cache-Control` headers so the CDN absorbs traffic, and returns `503` if NASA is unreachable.
- The frontend interpolates between hourly JPL samples using range-rate (Hermite), and falls back to a model anchored to JPL data if the API is down.
- Everything private (your messages, your Golden Record) stays in `localStorage`. There are no accounts, cookies or trackers, and fonts are self-hosted.

## Run it locally

```bash
# API (Python 3.11+)
cd services/api
python -m venv .venv && .venv/Scripts/activate   # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Web (Node 20+), in a second terminal
cd apps/web
npm install
npm run dev
```

## Tests

```bash
cd services/api && pytest      # Horizons parsing, DSN parsing, API behaviour with a mocked transport
cd apps/web && npm test        # ephemeris maths, Morse timing, comic content, Golden Record decoding
```

## Deploy

```bash
# API → Cloud Run
cd services/api
gcloud run deploy onelightday-api --source . --region europe-west1 --allow-unauthenticated --max-instances 3

# Web → Firebase Hosting
cd apps/web && npm run build && cd ../..
firebase deploy --only hosting
```

## Data and credits

- Ephemeris: [NASA JPL Horizons](https://ssd.jpl.nasa.gov/horizons/). Dish status: [NASA Deep Space Network Now](https://eyes.nasa.gov/dsn/dsn.html).
- Images: NASA/JPL-Caltech, credited with their PIA numbers where shown.
- Pulsar map identification: W. R. Johnston; slow-down rates from the ATNF Pulsar Catalogue.
- The Golden Record's music and most of its photos are under copyright and are not reproduced here.

This is a personal project and is not affiliated with or endorsed by NASA or JPL.

---

Built by **Pranav Sharma** · [LinkedIn](https://www.linkedin.com/in/pranav-sharma-4320591a7/) · [GitHub](https://github.com/PranavSharma10)
