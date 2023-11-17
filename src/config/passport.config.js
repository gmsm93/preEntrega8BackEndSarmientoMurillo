import passport from "passport";
import GitHubStrategy from 'passport-github2'
import { UserModel } from "../models/users.model.js";

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



    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })
}

export default initializePassport
