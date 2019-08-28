
exports.up = function(knex) {
    return knex.schema.createTable('clucks', table => {
        table.increments('id').notNull();
        table.text('username').notNull();
        table.string('content').notNull();
        table.string('image_url').nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('last_updated');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('clucks');
};
