import type {Room} from '../lib/game/engine';
export interface RoomStore{read(code:string):Promise<{room:Room;version:number}|null>;create(room:Room):Promise<void>;save(room:Room,version:number):Promise<boolean>;finished():Promise<Room[]>;recent(secret:string):Promise<Room[]>}
