module.exports = {

    development: {
        client: 'pg',
        connection: {
            database: 'cluckr',
        },
        migrations: {
            tableName: 'migrations',
            directory: 'db',
        },
    },
};
