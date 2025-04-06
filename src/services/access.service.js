class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      return {
        metadata: {
          name,
          email,
          password,
        },
      };
    } catch (error) {}
  };
}

module.exports = AccessService;
