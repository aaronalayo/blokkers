// populate tables with DML

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('shops').del()
    .then(() => {
      return knex('items').del();
    });
};
