import AWS from 'aws-sdk';

import tables from './tables';

export default class Database {
    async connect() {
        if (!this._connection) {
            let params = {};
            if (__DEV__) {
                params = {
                    endpoint: process.env.DB_URL,
                    region: 'local',
                    accessKeyId: 'local',
                    secretAccessKey: 'local',
                };
            } else {
                params = {
                    region: 'eu-north-1',
                    apiVersion: '2012-08-10',
                };
            }

            this._connection = new AWS.DynamoDB(params);

            if (__DEV__) {
                // will create tables through lambda only in development
                await this.createTables(tables);
            }
        }

        return this._connection;
    }

    async putItem(params) {
        return new Promise((resolve, reject) => {
            this._connection.putItem(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    async updateItem(params) {
        return new Promise((resolve, reject) => {
            this._connection.updateItem(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    async scan(tableName, params = {}) {
        return this.wrapAsync('scan', {
            TableName: tableName,
            ...params,
        });
    }

    async deleteItem(params) {
        return new Promise((resolve, reject) => {
            this._connection.deleteItem(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    async createTables(tables) {
        for (let k = 0; k < tables.length; k++) {
            const table = tables[k];

            await new Promise((resolve, reject) => {
                this._connection.createTable(table, (err) => {
                    if (err) {
                        if (err.code !== 'ResourceInUseException') {
                            console.dir(err);
                            reject(err);
                        } else {
                            console.dir(`Table "${table.TableName}" exists`);
                            resolve();
                        }
                    } else {
                        console.dir(`Created table "${table.TableName}"`);
                        resolve();
                    }
                });
            });
        }
    }
}
