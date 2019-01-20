import Database from '../../db';
import stringGen from 'crypto-random-string';

export default class WeaponSource {
    async put(data) {

        const item = {
            name: {
                S: data.name.toString(),
            },
            parameters: {
                M: {
                    type: {
                        S: data.parameters.type.toString(),
                    },
                    damage: {
                        N: data.parameters.damage.toString(),
                    },
                }
            }
        };

        if (data.id) {
            item.id = {S: data.id.toString()};
        } else {
            item.id = {S: stringGen(12)};
        }

        const db = await this.getDatabase();
        await db.putItem({
            TableName: 'weapon',
            Item: item,
        });
    }

    async delete(id) {
        const db = await this.getDatabase();
        await db.deleteItem({
            TableName: 'weapon',
            Key: {
                id: {
                    S: id.toString(),
                },
            },
        });
    }

    async getDatabase() {
        if (!this._db) {
            this._db = new Database();
            await this._db.connect();
        }

        return this._db;
    }
}