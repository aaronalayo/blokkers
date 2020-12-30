const { Model } = require('objection');


class Order extends Model {
  static get tableName() {
    return "orders";
  }

  static get relationMappings() {
    return {
      customer: {
        relation: Model.HasOneRelation,
        modelClass: __dirname + "/Customer.js",
        join: {
          from: "orders.order_uuid",
          to: "customers.customer_uuid",
        },
      },
      item: {
        relation: Model.HasManyRelation,
        modelClass: __dirname + "/Item.js",
        join: {
          from: "orders.order_uuid",
          to: "items.items_uuid",
        },
      },
    };
  }

  static get idColumn() {
    return "orders.order_uuid";
  }
}

module.exports = Order;
