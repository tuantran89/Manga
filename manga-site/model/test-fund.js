const Fund = require("./fund");
module.exports = {
    getFundData: function (req, res) {
        let fundId = req.query["fund_id"];
        let fundSource = req.query["fund_source"];
        let promise;
        if (fundSource === "manual") {
            let condition = { fund_id: fundId };
            if (ObjectId.isValid(fundId)) {
                condition = { _id: fundId };
            }
            promise = Fund.findOne(condition);
        }
        return promise;
    }
}