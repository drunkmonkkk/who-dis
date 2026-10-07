import {env} from 'cloudflare:workers';
import type {RoomStore} from './store';
import type {Room} from '../lib/game/engine';
function db(){if(!env.DB)throw Error('DB_UNAVAILABLE');return env.DB}
export const getAIKey=()=>env.OPENAI_API_KEY;
export const store:RoomStore={
async read(code){const row=await db().prepare('SELECT state,version FROM rooms WHERE code=?').bind(code).first<{state:string;version:number}>();return row?{room:JSON.parse(row.state) as Room,version:row.version}:null},
async create(room){await db().prepare('INSERT INTO rooms(code,state,version,updated) VALUES(?,?,0,?)').bind(room.code,JSON.stringify(room),Date.now()).run()},
async save(room,version){const result=await db().prepare('UPDATE rooms SET state=?,version=version+1,updated=? WHERE code=? AND version=?').bind(JSON.stringify(room),Date.now(),room.code,version).run();return !!result.meta.changes},
async finished(){const result=await db().prepare("SELECT state FROM rooms WHERE json_extract(state,'$.phase')='ended' ORDER BY updated DESC LIMIT 100").all<{state:string}>();return result.results.map(r=>JSON.parse(r.state) as Room)},
async recent(secret){const result=await db().prepare("SELECT state FROM rooms WHERE EXISTS (SELECT 1 FROM json_each(json_extract(state,'$.players')) p WHERE json_extract(p.value,'$.secret')=?) ORDER BY updated DESC LIMIT 3").bind(secret).all<{state:string}>();return result.results.map(r=>JSON.parse(r.state) as Room)}
};
