import Database from '../../db';
import stringGen from 'crypto-random-string';

export default class WeaponSource {
    async put(data) {

        const parameters = data.parameters || [];
        // always check against a white list what you save to the database
        const allowedParams = ['color'];

        const item = {
            name: {
                S: data.name.toString(),
            },
            type: {
                S: data.type.toString(),
            },
            damage: {
                N: data.damage ? data.damage.toString() : 0,
            },
            parameters: {
                M: parameters.filter(x => allowedParams.indexOf(x.name) >= 0).reduce((result, item) => {
                    result[item.name] = {
                        S: item.value ? item.value.toString() : '',
                    };
                    return result;
                }, {})
            }
        };

        if (data.id) {
            item.id = {S: data.id.toString()};
        } else {
            item.id = {S: stringGen(12)};
        }

        console.dir(item);

        const db = await this.getDatabase();
        await db.putItem({
            TableName: 'weapon',
            Item: item,
        });
    }

    async giveToCharacter(id, characterId) {
        const result = {};
        const res = await this.get(id);
        if (res && res.Item) {
            const characters = res.Item.characters || {
                L: [],
            };
            characters.L.push({
                S: characterId,
            });

            const db = await this.getDatabase();
            await db.updateItem({
                TableName: 'weapon',
                Key: {
                    id: {
                        S: id.toString(),
                    },
                },
                ExpressionAttributeNames: {
                    "#CHARACTERS": "characters",
                },
                ExpressionAttributeValues: {
                    ":c": characters,
                },
                UpdateExpression: "SET #CHARACTERS = :c"
            });
        } else {
            result.error = 'Item not found';
        }

        return result;
    }

    async get(id) {
        const db = await this.getDatabase();
        return db.getItem({
            TableName: 'weapon',
            Key: {
                id: {
                    S: id.toString(),
                },
            },
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
