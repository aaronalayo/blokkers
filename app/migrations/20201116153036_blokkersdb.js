
exports.up = function(knex) {
    return knex.schema
    .createTable('formats',(table)=>{
        table.uuid('format_uuid').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('format_no').notNullable();
        table.string('size').notNullable();
        table.decimal('price').unsigned().notNullable();
  
    })
    .createTable('items',(table)=>{ 
        table.uuid('item_uuid').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('item_name').notNullable();
        table.uuid('format_uuid').notNullable();
        table.foreign('format_uuid').references('formats.format_uuid');

       })
    .createTable('customers',(table)=>{
        table.uuid('customer_uuid').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('address').notNullable();
        table.string('zip_code').notNullable();
        table.string('city').notNullable();
        table.string('email').unique().notNullable();
        table.boolean('enable_newsletter').defaultTo(false);
  
    })
    .createTable('orders',(table)=>{
        table.uuid('order_uuid').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
        table.integer('order_no').unique().notNullable();
        table.string('order_title').notNullable();
        table.integer('amount').unsigned().notNullable();
        table.string('pdf_file_name').notNullable();
        table.decimal('price_per_item').unsigned().notNullable();
        table.decimal('total_price').unsigned().notNullable();
        table.uuid('item_uuid').notNullable();
        table.uuid('customer_uuid').notNullable();
        table.foreign('item_uuid').references('items.item_uuid');
        table.foreign('customer_uuid').references('customers.customer_uuid');
        table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  
    })
.raw(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
     NEW."updated_at"=now(); 
     RETURN NEW;
    END;
    $$ language 'plpgsql';
  `)
  .raw(`
    CREATE TRIGGER update_user_updated_at BEFORE UPDATE
    ON ?? FOR EACH ROW EXECUTE PROCEDURE 
    update_updated_at_column();
  `, ['orders']);
  };


  
exports.down = function(knex) {
    //rollback
    return knex.schema
    .dropTableIfExists('orders')
    .dropTableIfExists('customers')
    .dropTableIfExists('items');
  };
