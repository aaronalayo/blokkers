
//Model for orders table
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
          from: "orders.customer_uuid",
          to: "customers.customer_uuid",
        },
      },
      item: {
        relation: Model.HasOneRelation,
        modelClass: __dirname + "/Item.js",
        join: {
          from: "orders.item_uuid",
          to: "items.item_uuid",
        },
      },
    };
  }

  static get idColumn() {
    return "orders.order_no";
  }
}

module.exports = Order;
