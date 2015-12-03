'use strict';

var errorHelper = require('../util/error');

module.exports = {
    not: {
        found: errorHelper.generate(400, 10201, 'User is not found in the database.'),
    },
    invalid: {
        id: errorHelper.generate(400, 10202, 'Invalid user id.'),
        email: errorHelper.generate(400, 10203, 'Invalid user email.'),
        password: errorHelper.generate(400, 10207, 'Invalid password.'),
        username: errorHelper.generate(400, 10210, 'Invalid username.'),
    },
    activate: {
        url: errorHelper.generate(400, 10204, 'Invalid url.'),
        timeout: errorHelper.generate(400, 10205, 'Activate is timeout.'),
    },
    parameter: {
        deficiency: errorHelper.generate(400, 10206, 'Parameter deficiency.'),
    },
    has: {
        email: errorHelper.generate(400, 10208, 'Email is have.'),
        username: errorHelper.generate(400, 10209, 'Username is have.'),
    }
};