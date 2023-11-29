const _ = require('lodash')

class Util {

    getSearchQuery(reqFilter) {
        let filter = {};
        let instance = this;
        Object.keys(reqFilter).forEach(function (key) {
            const objValue = reqFilter[key];
            let newValue = undefined;
            if (typeof objValue == 'object') {
                if (_.isArray(reqFilter[key])) {
                    newValue = {
                        $in: reqFilter[key]
                    }
                } else {
                    newValue = instance.tranformOperators(objValue);
                }
            } else {
                newValue = objValue;
            }
            filter[key] = newValue;
        });
        return filter;
    }

    tranformOperators(data) {
        let tfData = {};
        Object.keys(data).forEach(function (key) {
            const objVal = data[key];
            let newKey = undefined;
            let newVal = objVal;
            switch (key) {
                case '!=':
                    newKey = '$ne';
                    break;
                case '>':
                    newKey = '$gt';
                    break;
                case '>=':
                    newKey = '$gte';
                    break;
                case '<':
                    newKey = '$lt';
                    break;
                case '<=':
                    newKey = '$lte';
                    break;
                case 'nin':
                    newKey = '$nin';
                    break;
                case 'exists':
                    newKey = '$exists';
                    break;
                default:
                    newKey = '$eq';
                    break;
            }
            // Check if the value needs to be converted to date?
            if (typeof objVal === 'string' && objVal.match(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/)) {
                newVal = new Date(objVal)
            }
            tfData[newKey] = newVal;
        });
        return tfData;
    }

    handleServerError(err, result, callback) {
        if (err) {
            callback({
                status: 500,
                err: "SERVER_ERROR",
                errmsg: err
            })
        } else {
            if (!result) {
                callback({
                    status: 404,
                    err: "Not Found",
                    errmsg: "Item was not found"
                })
            } else
                callback(null, result);
        }
    }

    /*
     * Method to generate current time timestamp
     */
    generateTimestamp(date) {
        if (!date)
            return Math.round((new Date()).getTime());
        else return Math.round(new Date(date).getTime());
    }

    /*
     * Method to generate a random value from a list of values
     */
    randomizeValues(values) {
        return values[Math.floor(Math.random() * values.length)];
    }

    /*
     * Method to round off given number to two decimal points
     */
    roundOffTwoDecimals(num) {
        return Math.round(num * 100) / 100
    }
}

module.exports = new Util();