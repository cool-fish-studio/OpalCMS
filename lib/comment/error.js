'use strict';

var errorHelper = require('../util/error');

module.exports = {
    not: {
        found: errorHelper.generate(400, 10601, 'Comment is not found in the database.'),
    },
    invalid: {
        id: errorHelper.generate(400, 10602, 'Invalid comment id.'),
        email: errorHelper.generate(400, 10604, 'Invalid comment email.'),
        name: errorHelper.generate(400, 10605, 'Invalid comment name.'),
    },
    parameter: {
        deficiency: errorHelper.generate(400, 10603, 'Parameter deficiency.'),
    },
};