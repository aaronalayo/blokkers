// populate tables with DML

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('formats').del()
    
};
