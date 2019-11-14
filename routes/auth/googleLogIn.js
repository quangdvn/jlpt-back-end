const express = require("express");
const router = express.Router();
const passport = require("passport");
require("dotenv").config();

const redirectUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.PRODUCT_GOOGLE_CALLBACK;
  } else {
    return process.env.DEV_GOOGLE_CALLBACK;
  }
};

/* GET Google Authentication API. */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false
  }),
  (req, res) => {
    const token = req.user.generateAuthToken();
    res.redirect(`${redirectUrl()}?token=${token}`);
  }
);

module.exports = router;
