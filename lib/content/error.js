'use strict';

var errorHelper = require('../util/error');

module.exports = {
    not: {
        found: errorHelper.generate(400, 10501, 'Content is not found in the database.'),
        type: errorHelper.generate(400, 10504, 'Content is not type.'),
    },
    invalid: {
        id: errorHelper.generate(400, 10502, 'Invalid content id.'),
    },
    parameter: {
        deficiency: errorHelper.generate(400, 10503, 'Parameter deficiency.'),
    },
};