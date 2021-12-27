//Migration file

exports.down = function (knex) {
  return knex.raw(`
  DROP FUNCTION IF EXISTS delete_old_rows() CASCADE;
`);
};
exports.up = async function (knex) {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
  .raw(`
	CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER
	LANGUAGE plpgsql
	AS
	$$
	BEGIN
		NEW.created_at = CURRENT_TIMESTAMP;  
		NEW.updated_at = CURRENT_TIMESTAMP;
		RETURN NEW;
	END;
	$$;
  `);
  return knex.schema
    .createTable("discounts", (table) => {
      table
        .uuid("discount_uuid")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("discount_code").notNullable();
      table.string("discount_rate").notNullable();
      table.integer("discount_amount").unsigned().notNullable();
      table
        .timestamp("expires_at")
        .defaultTo(knex.raw(`? + INTERVAL '? hour'`, [knex.fn.now(), 722]));
      table.timestamp("created_at").notNullable().defaultTo(knex.raw(`? + INTERVAL '? hour'`, [knex.fn.now(), 1]));
      table.timestamp("updated_at").notNullable().defaultTo(knex.raw(`? + INTERVAL '? hour'`, [knex.fn.now(), 1]));
    }).raw(`
	  CREATE TRIGGER update_timestamp
	  BEFORE UPDATE
	  ON discounts
	  FOR EACH ROW
	  EXECUTE PROCEDURE update_timestamp();
	`)
    .createTable("formats", (table) => {
      table
        .uuid("format_uuid")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("format_no").notNullable();
      table.string("size").notNullable();
      table.string("dimension").notNullable();
      table.decimal("price").unsigned().notNullable();
      table.string("ext_no").notNullable();
      table.decimal("print_price").unsigned().notNullable();
      table.timestamp("created_at").notNullable().defaultTo(knex.raw(`? + INTERVAL '? hour'`, [knex.fn.now(), 1]));
      table.timestamp("updated_at").notNullable().defaultTo(knex.raw(`? + INTERVAL '? hour'`, [knex.fn.now(), 1]));
    }).raw(`
	  CREATE TRIGGER update_timestamp
	  BEFORE UPDATE
	  ON formats
	  FOR EACH ROW
	  EXECUTE PROCEDURE update_timestamp();
	`)
    .createTable("customers", (table) => {
      table
        .uuid("customer_uuid")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("shipping_full_name").notNullable();
      table.string("shipping_phone").notNullable();
      table.string("shipping_address").notNullable();
      table.string("shipping_zip_code").notNullable();
      table.string("shipping_city").notNullable();
      table.string("billing_full_name").defaultTo(null);
      table.string("billing_phone").defaultTo(null);
      table.string("billing_address").defaultTo(null);
      table.string("billing_zip_code").defaultTo(null);
      table.string("billing_city").defaultTo(null);
      table.string("email").notNullable();
      table.boolean("enable_newsletter").defaultTo(false);
      table.timestamp("created_at").notNullable().defaultTo(knex.raw(`? + INTERVAL '? hour'`, [knex.fn.now(), 1]));
      table.timestamp("updated_at").notNullable().defaultTo(knex.raw(`? + INTERVAL '? hour'`, [knex.fn.now(), 1]));
    }).raw(`
	  CREATE TRIGGER update_timestamp
	  BEFORE UPDATE
	  ON customers
	  FOR EACH ROW
	  EXECUTE PROCEDURE update_timestamp();
	`)
    .createTable("items", (table) => {
      table
        .uuid("item_uuid")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("poster_id").notNullable();
      table.string("item_no").notNullable();
      table.string("item_format").notNullable();
      table.string("item_name").notNullable();
      table.string("item_paths", 1000).notNullable();
      table.integer("amount").unsigned().notNullable();
      table.decimal("price_per_item").unsigned().notNullable();
      table.decimal("total_price").unsigned().notNullable();
      table.decimal("print_price").unsigned().notNullable();
      table.decimal("total_print_price").unsigned().notNullable();
      table.uuid("customer_uuid").notNullable();
      table.uuid("format_uuid").notNullable();
      table.string("payment_id").defaultTo(null);
      table.foreign("customer_uuid").references("customers.customer_uuid");
      table.foreign("format_uuid").references("formats.format_uuid");
      table.timestamp("created_at").notNullable().defaultTo(knex.raw(`? + INTERVAL '? hour'`, [knex.fn.now(), 1]));
      table.timestamp("updated_at").notNullable().defaultTo(knex.raw(`? + INTERVAL '? hour'`, [knex.fn.now(), 1]));
    }).raw(`
	  CREATE TRIGGER update_timestamp
	  BEFORE UPDATE
	  ON items
	  FOR EACH ROW
	  EXECUTE PROCEDURE update_timestamp();
	`)

    .createTable("orders", (table) => {
      table
        .uuid("order_uuid")
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.increments("order_no").notNullable();
      table.uuid("customer_uuid").notNullable();
      table.string("payment_id").defaultTo(null);
      table.string("xml_sent").defaultTo(false);
      table.string("pdf_sent").defaultTo(false);
      table.string("order_confirmed").defaultTo(false);
      table.foreign("customer_uuid").references("customers.customer_uuid");
      table.timestamp("created_at").notNullable().defaultTo(knex.raw(`? + INTERVAL '? hour'`, [knex.fn.now(), 1]));
      table.timestamp("updated_at").notNullable().defaultTo(knex.raw(`? + INTERVAL '? hour'`, [knex.fn.now(), 1]));
      table.unique(["order_uuid", "order_no"]);
    })
    .raw(`ALTER SEQUENCE orders_order_no_seq RESTART WITH 100`)
    .raw(`
    CREATE OR REPLACE  FUNCTION delete_old_rows() 
    RETURNS TRIGGER
    AS $$
    BEGIN
      DELETE FROM discounts WHERE expires_at < NOW() + INTERVAL '1 hour' - INTERVAL '1 minute';
      RETURN OLD;
    END;
    $$ language 'plpgsql';
`).raw(`
CREATE TRIGGER delete
    AFTER INSERT ON discounts
    EXECUTE PROCEDURE delete_old_rows();
`).raw(`
CREATE TRIGGER update_timestamp
BEFORE UPDATE
ON orders
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();
`);
};

exports.down = function (knex) {
  //rollback
  return knex.schema
    .dropTableIfExists("orders")
    .dropTableIfExists("items")
    .dropTableIfExists("customers")
    .dropTableIfExists("formats")
    .dropTableIfExists("discounts");
};


// .raw(`
// CREATE OR REPLACE FUNCTION update_updated_at_column()
// RETURNS TRIGGER AS $$
// BEGIN
//  NEW."updated_at"=now();
//  RETURN NEW;
// END;
// $$ language 'plpgsql';
// `)
// .raw(`
// CREATE TRIGGER update_order_updated_at BEFORE UPDATE
// ON ?? FOR EACH ROW EXECUTE PROCEDURE
// update_updated_at_column();
// `, ['orders'])
