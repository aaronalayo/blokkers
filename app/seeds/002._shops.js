
exports.seed = function(knex) {
    return knex('shops').insert([
        {shopNo: 'PinkOrange'}
   ]);
};