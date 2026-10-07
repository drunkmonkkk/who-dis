import {neon} from '@neondatabase/serverless';import {readFileSync} from 'node:fs';
if(!process.env.DATABASE_URL)throw Error('Set DATABASE_URL to your Neon Postgres connection string before migration.');
const sql=neon(process.env.DATABASE_URL);for(const statement of readFileSync(new URL('../db/postgres/001_rooms.sql',import.meta.url),'utf8').split(';').map(v=>v.trim()).filter(Boolean))await sql.query(statement,[]);console.log('Postgres room schema and indexes are ready.');
