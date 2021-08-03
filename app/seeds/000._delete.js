// populate tables with DML

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('formats').del()
  .then(function () {
    return knex('discounts').del()
  });
};
