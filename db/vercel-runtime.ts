import {neon} from '@neondatabase/serverless';
import type {RoomStore} from './store';
import type {Room} from '../lib/game/engine';
function sql(){if(!process.env.DATABASE_URL)throw Error('DB_UNAVAILABLE');return neon(process.env.DATABASE_URL)}
export const getAIKey=()=>process.env.OPENAI_API_KEY;
export const store:RoomStore={
async read(code){const rows=await sql().query('SELECT state,version FROM rooms WHERE code=$1',[code]);const row=rows[0];return row?{room:row.state as Room,version:Number(row.version)}:null},
async create(room){await sql().query('INSERT INTO rooms(code,state,version,updated) VALUES($1,$2::jsonb,0,$3)',[room.code,JSON.stringify(room),Date.now()])},
async save(room,version){const rows=await sql().query('UPDATE rooms SET state=$1::jsonb,version=version+1,updated=$2 WHERE code=$3 AND version=$4 RETURNING version',[JSON.stringify(room),Date.now(),room.code,version]);return rows.length===1},
async finished(){const rows=await sql().query("SELECT state FROM rooms WHERE state->>'phase'='ended' ORDER BY updated DESC LIMIT 100",[]);return rows.map(r=>r.state as Room)},
async recent(secret){const rows=await sql().query("SELECT state FROM rooms WHERE EXISTS (SELECT 1 FROM jsonb_array_elements(state->'players') p WHERE p->>'secret'=$1) ORDER BY updated DESC LIMIT 3",[secret]);return rows.map(r=>r.state as Room)}
};
