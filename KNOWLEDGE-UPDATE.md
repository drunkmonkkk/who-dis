# Tea quality release

SPILL THE TEA now ranks sourced stories by juiciness, preserves evidence labels, and removes generic trivia whenever a 70+ receipt exists. All 16 requested structured fields are present, plus surprisingPersonalFacts for public-life stories that should not be mislabeled as scandal. Imported relationship end dates are not treated as proof of divorce or breakup.

## Production quality gate

20 of 291 catalog profiles pass. The other 271 retain stable IDs for old rooms but are excluded from new normal-pool selection pending review/enrichment. Empty categories are unavailable in setup; homepage decks now link to populated categories.

The score requires public-life coverage or a sourced review explaining its absence (25), an iconic work (25), interesting non-basic Tea (25), relevant band/solo history (10), and an explicit rumor/controversy coverage review (15). Every gate must pass, including a named editorial review; a high numeric score alone cannot admit a profile. Empty fields mean no reviewed receipt, never proof that nothing happened.

Selection scores: famous relationship 100; divorce 99; marriage/engagement 98; public breakup 95; rumored relationship 94; famous ex 92; viral rumor/feud 90; band drama/controversy/scandal 85; public incident 84; collaboration 75; iconic work 70; career fallout/comeback 65; surprising personal story 60; generic facts 30; basic identity 5. Sort strictly descending, deduplicate story IDs across fields, then stop when real receipts run out. Unknown or denied claims are never promoted.

Counterpart names are retained when useful (Harry Styles, Nicole Kidman, Paul McCartney, Bradley Cooper), with reviewed general descriptions for names that make the subject too obvious. The subject’s own names and aliases remain blocked.

## 20-person receipt audit

These are actual first-purchase results from the game engine. Each also has a specific iconic-work answer, source URLs and status on structured records, and a 100/100 quality score.

| Person | Score | First Tea |
|---|---:|---|
| Albert Einstein | 99 | Their divorce settlement promised future Nobel Prize money to their former spouse. |
| Marie Curie | 98 | They married their research partner; together they investigated the radiation that transformed physics. |
| Leonardo DiCaprio | 100 | They dated supermodel Gisele Bündchen from 2000 to 2005. |
| Tom Hanks | 98 | They married a fellow actor after co-starring in Volunteers. The on-screen connection had an off-screen sequel. |
| Tom Cruise | 99 | Their marriage to Nicole Kidman ended in divorce in 2001. |
| Charlie Chaplin | 98 | They married a famous playwright’s daughter in 1943; it was their fourth marriage. |
| Marilyn Monroe | 99 | Their marriage to a baseball legend lasted less than a year. |
| Taylor Swift | 100 | WIDELY REPORTED. They had a public relationship with Harry Styles in 2012; the relationship ended in 2013. |
| Beyonce | 98 | They married a superstar rapper in 2008; ten years later, the pair released a joint album. |
| Freddie Mercury | 75 | A rock frontperson and an opera star made an unlikely recording partnership. |
| John Lennon | 90 | They aimed a 1971 song at former bandmate Paul McCartney. The band split had a musical aftershock. |
| Ed Sheeran | 85 | A jury rejected a claim that their hit copied Marvin Gaye. The copyright fight ended in their favor in 2023. |
| Lady Gaga | 100 | They dated actor Taylor Kinney for five years; the relationship reached an engagement before the split. |
| Steve Jobs | 84 | A leadership power struggle pushed them out of the company they co-founded in 1985. |
| Nelson Mandela | 99 | Their marriage ended in 1996, four years after a public separation. |
| Frida Kahlo | 99 | After divorcing a fellow artist, they cut their hair and made the breakup part of a self-portrait. |
| Salvador Dali | 98 | Their wife had previously been married to poet Paul Éluard. The artistic circles overlapped. |
| Jungkook | 90 | PUBLICLY DENIED. In 2022, their label publicly denied that their group was disbanding. |
| Jin | 90 | PUBLICLY DENIED. In 2022, their label publicly denied that their group was disbanding. |
| Shakira | 100 | They had a public relationship with a star footballer in 2011; the relationship ended in 2022. |

## Verification

- Automated game, knowledge, social-history and Tea-quality suites: 54 tests passed. The Tea suite purchases every available receipt for all 20 people and checks order, privacy, cost/exhaustion behavior, status labels and direct retrieval.
- Catalog audit: zero invalid records.
- Production build and client identity-leak scan passed. ESLint: no errors; three pre-existing unused-variable warnings.
- Chromium UI checks for all 20 people passed using the production build and fixture room responses from the real engine. Each first Tea and iconic-work answer was checked, with no page errors. Mobile/tablet/desktop and reduced-motion checks passed. Fixtures do not verify production database persistence.
- Browser runner: tests/tea-browser.cjs. Run npm test, build/start on port 3001, then provide PLAYWRIGHT_MODULE_PATH if Playwright is installed outside this repo. BASE_URL and CHROMIUM_PATH can override local defaults. The runner always fixtures room responses, so pointing it at production is not a live backend test.

## Release verification

Existing Git deployment: drunkmonkkk/who-dis main → Vercel 6-vector/who-dis → https://who-dis-six.vercel.app/. GET /api/game returns no-store metadata with knowledgeVersion juicy-tea-v2, catalogCount 20, available categories, and the Vercel commit SHA. No database is required for this metadata endpoint or the frontend build.

At pre-release verification the Vercel connection still returns 403 for team 6-vector and the workspace cannot fetch the live hostname. A successful Git deployment must not be described as a visual or functional live-site verification. Reconnect the existing team/project and permit network access to finish that check.
