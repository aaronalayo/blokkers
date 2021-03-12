
exports.seed = function(knex) {
    return knex('formats').insert([
        {format_no: 'A1', size: '(2383.94, 3370.39)', dimension:'(594 x 841mm)', price: 639.00, ext_no:'extshop-594x841'},
        {format_no: 'A2', size: '(1190.55, 1683.78)', dimension:'(420 x 594 mm)', price: 459.00, ext_no:'extshop-420x594'},
        {format_no: 'A3', size: '(841.89, 1190.55)', dimension:'(297 x 420 mm)', price: 349.00, ext_no:'extshop-297x420'},
   
    ]);
};

//     A0: (2383.94, 3370.39),
//     A1: [1683.78, 2383.94],
//     A2: [1190.55, 1683.78],
//     A3: [841.89, 1190.55],
//     A4: (595.28, 841.89),
//     A5: (419.53, 595.28),
//     A6: (297.64, 419.53),
//     A7: (209.76, 297.64),
//     A8: (147.4, 209.76),
//     A9: (104.88, 147.4),
//     A10: (73.7, 104.88),