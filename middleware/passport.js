const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { User } = require("../models/user");
require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

const callbackUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.PRODUCT_GOOGLE_CALLBACK;
  } else {
    return process.env.DEV_GOOGLE_CALLBACK;
  }
};

passport.use(
  new GoogleStrategy(
    {
      // options for google strategy
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: callbackUrl()
    },
    async (accessToken, refreshToken, profile, done) => {
      // check if user already exists in our own db
      try {
        const curUser = await User.findOne({
          email: profile.email
        });

        if (curUser) {
          done(null, curUser);
        } else {
          const newUser = await new User({
            googleId: profile.id,
            fullname: profile.displayName,
            avatar: profile._json.picture,
            email: profile.email
          }).save();
          done(null, newUser);
        }
      } catch (err) {
        done(err, null);
      }
    }
  )
);
