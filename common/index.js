module.exports.getProducts = function(req, page, query, config) {
    var db = req.app.db;
    var numberProducts = config.productsPerPage ? config.productsPerPage : 6;

    var skip = 0;
    if(page > 1) {
        skip = (page - 1) * numberProducts;
    }

    if(!query) {
        query = {};
    }
    // Run our queries
    return Promise.all([
        db.products.find(query).skip(skip).limit(parseInt(numberProducts)).toArray(),
        db.products.count(query)
    ])
    .then(function(result) {
        var returnData = {data: result[0], totalProducts: result[1]};
        return returnData;
    })
    .catch(function(err) {
        throw new Error('Error retrieving products');
    });
};