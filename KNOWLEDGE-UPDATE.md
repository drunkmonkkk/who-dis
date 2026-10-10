# Social knowledge and Tea update

The existing editorial redesign is retained. Structured, source-backed group memberships, public relationships, rumors and public events now drive social questions and progressive Tea cards. Reported, denied, disputed, false and later-confirmed records retain their status; missing evidence returns UNKNOWN. Historical records do not certify current relationships. AI cannot upgrade sensitive social answers.

Nine music profiles have manually reviewed social histories. The catalog audit finds 291 profiles, 175 eligible, 116 excluded, 9,630 facts and 1,712 eligible Tea cards. The production gate requires at least 15 facts, six hints and four safe Tea cards, plus relevant career/public-life coverage; music profiles need reviewed group/solo and collaboration coverage. Existing IDs remain stable. Coverage is curated and incomplete, not an exhaustive celebrity knowledge service.

## Validation

- All three automated test suites pass, including seven dedicated social-history tests.
- Catalog validation reports zero invalid records; detailed local output is `work/people-validation.json`.
- Production build passes. All 291 catalog names are absent from the public JavaScript/build artifacts.
- ESLint has zero errors and three existing unused-variable warnings.
- Chromium against the production build, with room API fixtures using the real game engine, verifies Beyonce, Lady Gaga, Taylor Swift, Jin and Shakira questions and Tea purchases with no browser errors. Gaga's rumor remains PUBLICLY DENIED; Taylor's dating history remains WIDELY REPORTED.
- Layout checks pass at 390, 900 and 1440 pixels without horizontal overflow. Reduced-motion disables the gremlin SVG animation. These local fixtures do not validate database persistence or production behavior.

## Deployment and verification

Existing Git integration: `drunkmonkkk/who-dis`, branch `main`, Vercel team `6-vector`, project `who-dis`, production URL https://who-dis-six.vercel.app/.

`GET /api/game` is no-store and exposes `knowledgeVersion: social-history-v1` and the Vercel commit SHA without requiring a database. The app has no service worker. A new production deployment uses new hashed static assets.

At verification time, the connected Vercel account returns 403 for team `6-vector`, and the workspace network proxy blocks the production hostname. Production visual verification requires authorized access to that existing team/project and network access to the hostname. No database credentials are needed to build or publish the visual changes; room persistence and leaderboards still require the existing production database configuration.
