import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { handleLoginService } from "../services/auth.service.js";
import User from "../models/users.model.js";

const configPassportLocal = () => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async function verify(email, password, callback) {
        try {
          await handleLoginService(email, password, callback);
        } catch (error) {
          return callback(error, false);
        }
      }
    )
  );
};

const configPassportJWT = () => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, callback) {
      try {
        const userFromDB = await User.findById(jwt_payload.id).select(
          "-password -verificationCode"
        );
        if (!userFromDB) {
          return callback(null, false);
        }

        const user = {
          _id: userFromDB._id,
          email: userFromDB.email,
          fullName: userFromDB.fullName,
          avatar: userFromDB.avatar,
          roleName: userFromDB.role.name,
          isVerified: userFromDB.isVerified,
        };

        // req.user
        return callback(null, user);
      } catch (error) {
        return callback(error, false);
      }
    })
  );
};

export { configPassportLocal, configPassportJWT };
