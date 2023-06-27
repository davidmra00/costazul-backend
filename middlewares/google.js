import passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';
import dotenv from 'dotenv';

dotenv.config();

passport.use('auth-google',new OAuth2Strategy(
  {
    clientID:process.env.AUTH0_CLIENT_ID,
    clientSecret:process.env.AUTH0_CLIENT_SECRET,
    callbackURL:`${process.env.API_URL}/auth/google`
  },
  function(accessToken,refreshToken,profile,done){
      done(null,profile);
    }
  
));