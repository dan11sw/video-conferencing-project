import Dexie, {Table} from 'dexie';
import { IContentModel } from 'src/models/IContentModel';

/* Переопределённый класс для корневого узла базы данных IndexedDB */
export class RootDB extends Dexie {
    favourites!: Table<IContentModel, number>;
    constructor(){
        super('RootDB');
        this.version(6).stores({
            favourites: "++id, uuid",
        });
    }

    /* Удаление объекта из локальной БД */
    deleteObject(objectId: number){
        return this.transaction('rw', this.favourites, () => {
            this.favourites.where({objectId}).delete();
        });
    }
}

/* Экземпляр объекта корневого узла */
export const db = new RootDB();

/* Очистка всей базы данных */
export function resetDatabase(){
    return db.transaction('rw', db.favourites, async () => {
        (await db.favourites.toArray()).forEach(async(item) => {
            await db.favourites.delete(item.id as number);
        });

        await Promise.all(db.tables.map(table => table.clear()));
    });
}