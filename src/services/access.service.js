'use strict';

class AccessService {
  static signUp = async ({ name, email, password }) => {
    return {
      metadata: {
        name,
        email,
        password,
      },
    };
  };
}

module.exports = AccessService;
