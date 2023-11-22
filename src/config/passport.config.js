import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import GitHubStrategy from 'passport-github2'
import UserModel from "../models/user.model.js";

const initializePassport = () => {

    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.b487c37454bcbed9',
            clientSecret: '5eab5de45753844ab2a915468dc460e78f560d03',
            callbackURL: 'http://localhost:8080/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile)

            try {
                const user = await UserModel.findOne({email: profile._json.email})
                if(user) {
                    console.log('User already exits')
                    return done(null, user)
                }

                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email,
                    password: ''
                }
                const result = await UserModel.create(newUser)

                return done(null, result)
            } catch (error) {
                return done('Error to login with github ' + error)
            }
        }
    ))


    // Estrategia Local para el inicio de sesión
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        async (req, email, password, done) => {
        try {
            const user = await UserModel.findOne({ email });

            if (!user || !user.validPassword(password)) {
            return done(null, false, { message: 'Usuario o contraseña incorrectos' });
            }

            return done(null, {
                _id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role
            });
        } catch (error) {
            return done(error);
        }
        }
    ));

    // Estrategia JWT para la autenticación
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET || '12345678'
    },
        async (payload, done) => {
        try {
            const user = await UserModel.findById(payload.sub);

            if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })
}

export default initializePassport
