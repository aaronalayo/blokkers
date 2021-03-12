
exports.seed = function(knex) {
    return knex('discounts').insert([
        {discount_code: 'highfive10', amount: 10},
   
    ]);
};

