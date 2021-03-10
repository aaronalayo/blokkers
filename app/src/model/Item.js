//Model for items table
const { Model } = require('objection');


class Item extends Model {
  static get tableName() {
    return "items";
  }
  static get relationMappings() {
    return {
      formats: {
        relation: Model.HasOneRelation,
        modelClass: __dirname + "/Customer.js",
        join: {
          from: "items.item_uuid",
          to: "customers.customer_uuid",
        },
      },
    }
};

  static get relationMappings() {
    return {
      formats: {
        relation: Model.HasOneRelation,
        modelClass: __dirname + "/Format.js",
        join: {
          from: "items.item_uuid",
          to: "formats.format_uuid",
        },
      },
    }
};


  static get idColumn() {
    return "items.item_uuid";
  }
}

module.exports = Item;
