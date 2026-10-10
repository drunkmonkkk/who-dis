import '../scripts/compile-game.mjs';import {spawnSync} from 'node:child_process';
const r=spawnSync(process.execPath,['--test','tests/game.test.cjs','tests/knowledge.test.cjs','tests/social-history.test.cjs','tests/tea-quality.test.cjs'],{stdio:'inherit'});if(r.status)process.exit(r.status);
