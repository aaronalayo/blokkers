
exports.up = function(knex) {
    return knex.schema
    .createTable('posters',(table)=>{
        table.uuid('poster_uuid').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('format').unique().notNullable();
  
    })
};

exports.down = function(knex) {
  
};
