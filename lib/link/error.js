'use strict';

var errorHelper = require('../util/error');

module.exports = {
    not: {
        found: errorHelper.generate(400, 10401, 'Link is not found in the database.'),
    },
    invalid: {
        id: errorHelper.generate(400, 10402, 'Invalid link id.'),
    },
    parameter: {
        deficiency: errorHelper.generate(400, 10403, 'Parameter deficiency.'),
    },
};