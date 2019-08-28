
exports.up = function(knex) {
    return knex.schema.createTable('clucks', table => {
        table.increments('id');
        table.text('username');
        table.string('');
        table.string('image_url');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('last_updated');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('clucks');
};
