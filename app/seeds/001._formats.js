
exports.seed = function(knex) {
    return knex('formats').insert([
        {formatNo: '01', size: 'A1', price: 500.00},
        {formatNo: '02', size: 'A2', price: 400.00},
        {formatNo: '03', size: 'A3', price: 300.00},
    ]);
};