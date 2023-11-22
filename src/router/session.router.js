import { Router } from "express";
import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import passport from "passport";
import { createHash } from "../utils.js";

const router = Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const newUser = new UserModel({
      email,
      password: createHash(password),
      role: email === 'adminCoder@coder.com' ? 'admin' : 'usuario'
    });

    await newUser.save();

    res.status(201).json({ message: 'Usuario creado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el registro' });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local-login', (err, user, info) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error en el inicio de sesión' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error en el inicio de sesión' });
      }

      console.log(req.session.user);
      res.redirect('/profile');
    });
  })(req, res, next);
});

router.get('/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al cerrar sesión' });
    } else {
      res.redirect('/login');
    }
  });
});

router.get(
  '/login-github',
  passport.authenticate('github', { scope: ['user:email'] }),
  async (req, res) => {}
);

router.get(
  '/githubcallback',
  passport.authenticate('github', { failureRedirect: '/' }),
  async (req, res) => {
    console.log('Callback: ', req.user);
    req.session.user = req.user;

    console.log(req.session);
    res.redirect('/');
  }
);

export default router;