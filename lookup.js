var codes = require('../bin/codes').results.collection1;
var format = require('util').format;

module.exports.findCode = function (disease, cb) {
    disease = disease ||'';
    if (!disease) {
        return cb(null, 'Sorry, I can\'t find the code.');
    }

    // Cholera

    disease = disease.toLowerCase();

    var isFound = false;
    var found = [];
    var foundCodes = [];
    for (var k = 0, total = codes.length; k < total; k++) {
        var record = codes[k];
        if (String(record.diagnosis).toLowerCase().indexOf(disease) >= 0 ||
            String(record.includes).toLowerCase().indexOf(disease) >= 0) {
            record.code = record['ICD-10_code'];
            isFound = true;
            foundCodes.push(record.diagnosis);
            found.push(record);
        }
    }

    if (!isFound) {
        return cb(null, 'Sorry, I can\'t find the code.');
    }

    // `disease`refers to string.
    return cb(null, format('It could be %s but can also be %s', foundCodes[0], foundCodes.slice(1).join(' or ')));
};
