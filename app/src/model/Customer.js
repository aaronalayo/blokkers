//Model for customer table
const { Model } = require('objection');


class Customer extends Model {
  static get tableName() {
    return "customers";
  }

  static get relationMappings() {
    return {
      orders: {
        relation: Model.HasManyRelation,
        modelClass: __dirname + "/Order.js",
        join: {
          from: "customers.customer_uuid",
          to: "orders.order_no",
        },
      },
    };
  }

  static get idColumn() {
    return "customers.customer_uuid";
  }
}

module.exports = Customer;
