const Fund = require("./fund");
var sanitize = require('mongo-sanitize');
module.exports = {
    getFundData: function (req, res) {
        let fundId = req.query["fund_id"];
        let fundSource = req.query["fund_source"];
        let promise;
        if (fundSource === "manual") {
            var cleanFundId = sanitize(fundId);
            let condition = { fund_id: cleanFundId };
            if (ObjectId.isValid(cleanFundId)) {
                condition = { _id: cleanFundId };
            }
            promise = Fund.findOne(condition);
        
        }
        return promise;
    }
}