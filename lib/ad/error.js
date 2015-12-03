'use strict';

var errorHelper = require('../util/error');

module.exports = {
    not: {
        found: errorHelper.generate(400, 10301, 'Ad is not found in the database.'),
    },
    invalid: {
        id: errorHelper.generate(400, 10302, 'Invalid ad id.'),
    },
    parameter: {
        deficiency: errorHelper.generate(400, 10303, 'Parameter deficiency.'),
    },
};