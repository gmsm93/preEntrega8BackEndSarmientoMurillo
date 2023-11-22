import { Router } from 'express'
import passport from 'passport'

const router = Router()

router.get('/', (req, res) => {
    res.render('index', {})
})

router.get('/login', (req, res) => {
    if(req.session?.user) {
        return res.redirect('/profile')
    }
    res.render('login', {})
})

router.get('/signup', (req, res) => {
    if(req.session?.user) {
        return res.redirect('/profile')
    }

    res.render('signup', {})
})

function authAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user) {

        if (req.user.role === 'admin') {
            return next();  
        } else {
            res.status(403).send('No tienes permisos de administrador');
        }
    } else {
        res.redirect('/login');
    }
}

router.get('/profile', authAdmin, (req, res) => {
    if (req.isAuthenticated() && req.user) {
        const user = req.user;
        res.render('profile', user);
    } else {
        res.redirect('/login');
    }
});

router.get('/logins', (req, res) => {
    res.render('logins', {})
})

router.get('/login-github',
    passport.authenticate('github', {scope: ['user:email']}),
    async (req, res) => {}
)

router.get('/githubcallback',
    passport.authenticate('github', {failureRedirect: '/'}),
    async(req, res) => {
        console.log('Callback: ', req.user)
        req.session.user = req.user

        console.log(req.session)
        res.redirect('/')
    }
)

function auth(req, res, next) {
    if(req.session?.user) next()

    return res.status(401).send('Auth error')
}

// function authAmdmin(req, res, next) {
//     if(req.session?.user && req.session.user.role === 'admin') next()

//     return res.status(401).send('Auth error')
// }

router.get('/private', auth, (req, res) => {
    res.json(req.session.user)
})

export default router