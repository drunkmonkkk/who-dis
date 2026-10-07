import {readdirSync,readFileSync} from 'node:fs';import {join} from 'node:path';import {createRequire} from 'node:module';import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);const {people}=require('../work/test-build/people.js');
function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)])}
const files=walk(process.argv[2]||'.next/static');for(const file of files){const data=readFileSync(file,'utf8');for(const p of people)assert.ok(!data.includes(p.name),`Catalog identity leaked into client artifact ${file}: ${p.name}`)}console.log(`Client secrecy scan passed: ${people.length} catalog names absent from ${files.length} public build artifacts.`);
