const { Model } = require('objection');


class Discount extends Model {
  static get tableName() {
    return "discounts";
  }

  static get idColumn() {
    return "discounts.discount_uuid";
  }
}

module.exports = Discount;
