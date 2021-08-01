
exports.seed = function(knex) {
    return knex('discounts').insert([
        {discount_code: 'highfive10', discount_rate: '10%', discount_amount: 10},
   
    ]);
};

