# WHO DIS?

**Ask smart. Guess early. Regret publicly.**

An update of the existing lime, pink and off-white party game. The original composition, typography, thick borders and hard shadows remain.

## 1. What changed

Added structured source-backed facts, quality-gated selection, weighted worldwide rounds, shared tea clues, larger answer labels, tactile motion, private processed portraits and a stock Next.js/Vercel deployment path. Solo, rooms, Hot Seat, Speed and Daily modes, modifiers and server-authoritative scoring remain.

## 2. The fact engine

`lib/game/catalog-data.json` is a frozen Wikidata/Commons snapshot; `editorial-facts.ts` adds individually reviewed sources. Statements preserve reference URLs, status and relationship date qualifiers. `people.ts` deduplicates source statements and builds the typed gameplay profiles. References indicate source-backed statements, not a guarantee that a source is current or correct.

The server classifies question intent, retrieves only relevant fields, deterministically resolves the answer and validates identity safety. Birth/death comparisons, citizenship, profession, education, family, marriage history and awards have explicit rules. Absence of an award or relationship entry is not treated as proof of absence. Present-day marriage is not inferred from an undated spouse record; the answer explains that limit.

## 3. Curated tea

Each eligible profile has 3–5 safe tea cards drawn from its sourced facts, including unexpected education, instruments, work, affiliations, awards and a smaller set of reviewed public incidents. Facts remain neutral. Tea costs **150 points for every guesser**, is purchased once per card, and progresses through three clue-strength levels. No Hints and Unhinged disable purchases. The server enforces every rule.

## 4. Preventing invented gossip and identity leaks

AI is optional. `ai.ts` receives only the resolved label, confidence, player question, relevant supporting facts and approved answer sentences. Structured output restricts its answer to one of those grounded sentences. It cannot add a model-memory biography or new gossip. Server validation rechecks the label, confidence, approved text, length, subject names/aliases, URLs and handles. Injection requests for names, initials, spelling, encodings, translations and rhymes are rejected. Sensitive facts use neutral phrasing. Missing evidence stays UNKNOWN.

Active API responses omit the profile, catalog index, guest secrets and image credits. The catalog and image data are absent from public browser bundles. A Hot Seat game master is intentionally authorized to see the name. Players' own submitted text is not a trusted factual assertion.

## 5. Reducing UNKNOWN

The catalog grew from 117 shallow entries to 291 sourced profiles. Production eligibility requires birth data, at least 8/11 coverage buckets, 15 distinct facts, six hints and three safe tea cards. 253 pass, with 9,662 distinct facts across the catalog and 1,262 eligible tea cards; `npm run validate-people` writes the exact current counts and exclusions to `work/people-validation.json`.

The validator checks duplicates, statuses, sources, birth/death gaps, relationship/family gaps, unsafe tea, hints, and nine representative questions. Optional gaps are reported even when the overall threshold passes. The source snapshot is broad structured coverage, not a claim of complete celebrity knowledge: childhood, friendships, feuds, dating, wealth and recent incidents remain uneven. UNKNOWN is preferable to fabricating these details.

## 6. Worldwide selection

Mixed rounds use regional weights: USA/Canada 25%, UK/Ireland 15%, India 14%, other Europe 15%, Latin America 8%, East/Southeast Asia 8%, Africa 5%, Middle East 4%, Australia/New Zealand 5%, other 1%. Weights are normalized over available candidates, so small or category-filtered pools vary. Profile counts do not determine region probability.

The last two selections heavily suppress another from the same region and category; used people are excluded while alternatives remain. Recent guest matches seed history. Difficulty filters on popularity, measured from source-language sitelink coverage, with fallback for sparse categories. This is a recognizability proxy, not a scientific ranking.

## 7. Motion

Question cards slam into place; YES flashes/stamps, NO shakes, nuanced answers snap/skew, UNKNOWN shrugs subtly and REPORTEDLY slaps down. Clues open, tea cards land like a tabloid, point deductions float, counters punch, reactions pop, wrong guesses collapse their shadow with **CONFIDENTLY WRONG**, and wins use **GOT ’EM** plus chunky geometric confetti. Buttons physically move into their shadows. Loading copy rotates only while an actual request is pending. Most effects last 150–450ms.

## 8. Mobile and reduced motion

Clue/tea controls share a compact row; answer labels and cards adapt to narrow screens. The feed scrolls only within its container and only when the reader was near the bottom. Input remains separate. The layout was checked at 390px for horizontal overflow. `prefers-reduced-motion: reduce` disables animations, transitions and confetti, while leaving all gameplay information visible. System-level reduced-motion emulation was not available in the browser tool; the rule is statically verified.

## 9. Environment

Copy `.env.example` to `.env.local` for local Next.js:

- `DATABASE_URL`: required, server-only Neon PostgreSQL URL, preferably pooled. No browser access.
- `OPENAI_API_KEY`: optional server-only key. Without it, deterministic answers and authored wording still work.
- `APP_URL`: canonical HTTPS origin for metadata/social previews.

No secret uses `NEXT_PUBLIC_*`. No realtime API key is required. Local Cloudflare preview uses its D1 binding and optional `.dev.vars` instead. Do not commit either secrets file.

## 10. Deployment architecture

Stock Next.js App Router + React on Vercel, Neon PostgreSQL through the serverless HTTP driver, and a parameterized SQL room store. Version-based compare-and-swap prevents concurrent winners and lost room updates. A secure HttpOnly guest cookie reconnects members to their state. All mutations and projections are server-authorized.

Multiplayer uses authenticated polling every 1.2 seconds, including reactions. It requires no persistent WebSocket process and works with serverless requests. This is near-real-time synchronization, not push delivery. Local development data uses Cloudflare D1 only through `dev:sites`; production requires no filesystem persistence.

276 licensed Commons portraits are processed at build-preparation time into metadata-free WebP stages. Originals are never public assets. A membership-checked API returns only the server-permitted stage with a generic filename and no-store headers; requesting a later stage cannot bypass progression. Missing/unsupported portraits use the original graphic. Attribution and the original source appear after the round. Run `npm run portraits:prepare` to regenerate; inspect Commons licensing before redistribution.

## 11. Exact deployment steps

Use Node 24 (22.13+ also supported).

```sh
npm install
cp .env.example .env.local
# Fill DATABASE_URL and APP_URL; OPENAI_API_KEY is optional.
npm run db:migrate:postgres
npm run lint
npm run typecheck
npm test
npm run validate-people
npm run build
npm start
```

Create/import the `who-dis` Vercel project with this directory as its root, Next.js framework, Node 24, `npm ci` install and `npm run build` build. Add the same environment values to the intended Preview/Production environments. Apply `db/postgres/001_rooms.sql` to each environment's database using the migration command. Deploy, then run:

```sh
TEST_URL=https://YOUR-DEPLOYMENT npm run test:http
```

The HTTP suite creates disposable test rooms. With Vercel deployment protection enabled, run against a permitted environment; do not disable protection solely to make tests pass. Verify the landing page, a two-browser room, reconnect, tea and the correct-guess reveal on the live origin. Set APP_URL to the final origin and redeploy for canonical social URLs.

The older Cloudflare preview remains available with `npm run dev:sites`; its local D1 database must have `drizzle/0000_slippery_master_chief.sql` applied.

## 12. Vercel readiness

The stock Next.js production build passes and includes the dynamic `/api/game` route. Metadata, favicon, social preview, custom 404 and error states are present. Database outages return a safe 503 message. This code is Vercel-compatible; a complete operational sign-off additionally requires a connected, migrated database and a successful deployed two-client test. See `DELIVERY.md` for the current verification/deployment status.

## 13. Configuration still needed

Connect Neon/provide the database through the platform's secret environment settings, apply the migration, configure the canonical app origin, and optionally add an AI key. Do not paste credentials into chat. Any hosting or database plan selection and payment remains with the account owner.

## 14. Deliberately deferred limits

No unrestricted AI fact generation, unsourced rumors, automatic web scraping during rounds, facial recognition or original-image browser downloads. The optional AI is a constrained tone selector, not an unconstrained semantic reasoner. Editorial relationship/feud/wealth coverage and time-sensitive fact review need ongoing curation. No push-realtime subscription, cross-device account identity, distributed anti-abuse service or large-scale load certification was added. Room retention cleanup and a public-launch abuse policy should be configured before significant traffic.

## Verification and important files

- `tests/game.test.cjs`, `tests/knowledge.test.cjs`: rules, fact safety, shared tea and AI constraints.
- `tests/http.mjs`: real room creation/join, permissions, questions, guesses, reconnect and concurrent winner checks.
- `tests/security-build.mjs`: catalog names absent from `.next/static`.
- `scripts/curate-people.py`: reproducible source collection; `catalog-data.json` keeps references.
- `db/postgres/001_rooms.sql`: idempotent production schema.
- `db/vercel-runtime.ts`: production adapter; `db/cloudflare-runtime.ts`: preview adapter.

Source snapshot and image attribution: [Wikidata](https://www.wikidata.org/) and [Wikimedia Commons](https://commons.wikimedia.org/). Individual editorial facts link their source directly. [OpenAI Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs) is used only to constrain optional copy selection.
