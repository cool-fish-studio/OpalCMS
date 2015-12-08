'use strict';

var errorHelper = require('../util/error');

module.exports = {
    not: {
        found: errorHelper.generate(400, 10801, 'Comment is not found in the database.'),
    },
    invalid: {
        id: errorHelper.generate(400, 10802, 'Invalid comment id.'),
        email: errorHelper.generate(400, 10804, 'Invalid comment email.'),
        name: errorHelper.generate(400, 10805, 'Invalid comment name.'),
    },
    parameter: {
        deficiency: errorHelper.generate(400, 10803, 'Parameter deficiency.'),
    },
};