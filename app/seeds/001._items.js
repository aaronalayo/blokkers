
exports.seed = function(knex) {
    return knex('items').insert([
        {itemNo: '01', dimensions: 'A1', price: 499.00},
        {itemNo: '02', dimensions: 'A2', price: 699.00},
        {itemNo: '03', dimensions: 'A3', price: 899.00},
    ]);
};