const { Model } = require('objection');


class Format extends Model {
  static get tableName() {
    return "formats";
  }

//   static get relationMappings() {
//     return {
//       users: {
//         relation: Model.HasManyRelation,
//         modelClass: __dirname + "/User.js",
//         join: {
//           from: "organizations.organization_uuid",
//           to: "users.user_uuid",
//         },
//       },
//       devices: {
//         relation: Model.HasManyRelation,
//         modelClass: __dirname + "/Device.js",
//         join: {
//           from: "organizations.organization_uuid",
//           to: "devices.organization_uuid",
//         },
//       },
//     };
//   }

  static get idColumn() {
    return "formats.format_uuid";
  }
}

module.exports = Format;
