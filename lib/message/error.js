'use strict';

var errorHelper = require('../util/error');

module.exports = {
    not: {
        found: errorHelper.generate(400, 10601, 'Message is not found in the database.'),
    },
    invalid: {
        id: errorHelper.generate(400, 10602, 'Invalid message id.'),
    },
    parameter: {
        deficiency: errorHelper.generate(400, 10603, 'Parameter deficiency.'),
    },
};