
exports.up = function(knex) {
    return knex.schema
    .createTable('roles',(table)=>{
        table.uuid('role_uuid').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('role').unique().notNullable();
  
    })
};

exports.down = function(knex) {
  
};
