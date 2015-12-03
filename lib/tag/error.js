'use strict';

var errorHelper = require('../util/error');

module.exports = {
    not: {
        found: errorHelper.generate(400, 10101, 'Tag is not found in the database.'),
    },
    invalid: {
        id: errorHelper.generate(400, 10102, 'Invalid tag id.'),
    },
    parameter: {
        deficiency: errorHelper.generate(400, 10203, 'Parameter deficiency.'),
    },
};