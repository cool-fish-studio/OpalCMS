'use strict';

var errorHelper = require('../util/error');

module.exports = {
    not: {
        found: errorHelper.generate(400, 10701, 'Category is not found in the database.'),
    },
    invalid: {
        id: errorHelper.generate(400, 10702, 'Invalid category id.'),
    },
    parameter: {
        deficiency: errorHelper.generate(400, 10703, 'Parameter deficiency.'),
    },
};