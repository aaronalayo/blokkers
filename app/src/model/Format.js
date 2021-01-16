//Model for format table
const { Model } = require('objection');


class Format extends Model {
  static get tableName() {
    return "formats";
  }

  static get idColumn() {
    return "formats.format_uuid";
  }
}

module.exports = Format;
