
exports.up = async function(knex) {
    await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    return knex.schemacd

    .createTable('formats',(table)=>{
        table.uuid('format_uuid').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('format_no').notNullable();
        table.string('size').notNullable();r
        table.decimal('price').unsigned().notNullable();
  
    })
    .createTable('items',(table)=>{ 
        table.uuid('item_uuid').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('item_name').notNullable();
        table.uuid('format_uuid').notNullable();
        table.foreign('format_uuid').references('formats.format_uuid');

       })
    .createTable('customers',
    (table)=>{
        table.uuid('customer_uuid').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('full_name').notNullable();
        table.string('phone').notNullable();
        table.string('address').notNullable();
        table.string('zip_code').notNullable();
        table.string('city').notNullable();
        table.string('invoice_full_name').defaultTo(null);
        table.string('invoice_phone').defaultTo(null);
        table.string('invoice_address').defaultTo(null);
        table.string('invoice_zip_code').defaultTo(null);
        table.string('invoice_city').defaultTo(null);
        table.string('email').notNullable();
        table.boolean('enable_newsletter').defaultTo(false);
  
    })
    .createTable('orders',(table)=>{
        table.uuid('order_uuid').notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
        table.increments('order_no').notNullable();
        table.string('order_title').notNullable();''
        table.integer('amount').unsigned().notNullable();
        // table.string('pdf_file_name').notNullable();
        table.decimal('price_per_item').unsigned().notNullable();
        table.decimal('total_price').unsigned().notNullable();
        table.uuid('item_uuid').notNullable();
        table.uuid('customer_uuid').notNullable();
        table.string('xml_sent').defaultTo(false);
        table.string('pdf_sent').defaultTo(false);
        table.foreign('item_uuid').references('items.item_uuid');
        table.foreign('customer_uuid').references('customers.customer_uuid');
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.unique(['order_uuid', 'order_no']);
    })
.raw(`ALTER SEQUENCE orders_order_no_seq RESTART WITH 100`)

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
    .dropTableIfExists('items')
    .dropTableIfExists('formats');
  };
