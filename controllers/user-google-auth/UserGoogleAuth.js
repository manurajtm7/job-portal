const UserModel = require("../../schema/user-registration-schema/UserRegistration");
const {
  hashPssword,
} = require("../../middlewares/hash-script/hashingPassword");

const handleGoogleAuthUser = async (profile) => {
  const user = await UserModel.findOne({ googleId: profile.id });

  if (!user) {
    const hashedPassword = await hashPssword(profile.id);

    try {
      const response = await UserModel.create({
        googleId: profile?.id,
        name: profile?.displayName,
        email: profile?.emails[0]?.value,
        hashedPssword: hashedPassword,
      });

      return response;
    } catch (Err) {
      console.log(Err);
      return null;
    }
  }
  return user;
};

module.exports = handleGoogleAuthUser;
