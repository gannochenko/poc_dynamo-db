import Database from '../../db';
import stringGen from 'crypto-random-string';

export default class WeaponSource {
    async put(data) {

        const parameters = data.parameters || [];
        const allowedParams = ['color'];

        const item = {
            name: {
                S: data.name.toString(),
            },
            type: {
                S: data.type.toString(),
            },
            damage: {
                N: data.damage ? data.damage.toString() : '0',
            },
            parameters: {
                // always check what you save to the database, against a white list
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
            // as we mentioned before, we need to specify a new key explicitly
            item.id = {S: stringGen(12)};
        }

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
                    '#CHARACTERS': 'characters',
                },
                ExpressionAttributeValues: {
                    ':c': characters,
                },
                UpdateExpression: 'SET #CHARACTERS = :c'
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

    async getForCharacter(id) {
        const db = await this.getDatabase();
        const result = await db.scan({
            TableName: 'weapon',
            ExpressionAttributeValues: {
                ':cId': {
                    S: id,
                },
            },
            FilterExpression: 'contains(characters, :cId)',
        });

        if (result && result.Items) {
            // need to "decode" the items, i know this is annoying
            return result.Items.map((item) => {

                const p = item.parameters ? item.parameters.M : {};
                const parameters = [];
                Object.keys(p).forEach((k) => {
                    parameters.push({
                        name: k,
                        value: p[k].S,
                    });
                });

                return {
                    name: item.name.S,
                    damage: item.damage.N,
                    id: item.id.S,
                    type: item.type.S,
                    parameters,
                };
            });
        }

        return [];
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
