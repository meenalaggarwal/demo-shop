module.exports.getProducts = function(req) {
    var db = req.app.db;
    // Run our queries
    return Promise.all([
        db.execute('Select * from Products')
    ])
    .then(function(result) {
        var returnData = {
            data: [], totalProducts: result[0].rows.length
        }
        for(var i in result[0].rows) {
            var temp = {
                [result[0].metaData[0].name] : result[0].rows[i][0],
                [result[0].metaData[1].name] : result[0].rows[i][1],
                [result[0].metaData[2].name] : result[0].rows[i][2],
                [result[0].metaData[3].name] : result[0].rows[i][3],
                [result[0].metaData[4].name] : result[0].rows[i][4]
            };
            returnData.data.push(temp);
        }
        return returnData;
    })
    .catch(function(err) {
        throw new Error('Error retrieving products');
    });
};