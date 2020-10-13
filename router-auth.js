const router = require('express').Router();
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const appUser = require('./db/models/app_user');
const auth = require('./authenticator');
const config = require('./config');

const appUserSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

router.post('/signUp', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        Joi.assert({ username, password }, appUserSchema);
        const hashedPassword = bcrypt.hashSync(password, 12);
        await appUser.insert({ username, password: hashedPassword });

        const token = jwt.sign({ username }, config.jwt);

        res.header({ Authorization: `Bearer ${token}` }).send('Signed up!');
    } catch (error) {
        next(error);
    }
});

router.post('/signIn', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        Joi.assert({ username, password }, appUserSchema);

        const response = await appUser.read(username);
        if (!bcrypt.compareSync(password, response[0].password)) throw 'Invalid credentials!';

        const token = jwt.sign({ username }, config.jwt);
        res.header({ Authorization: `Bearer ${token}` }).send('Signed in!');
    } catch (error) {
        next(error);
    }
});

router.get('/signOut', auth, (req, res) => {
    res.send('Signed out!');
});

module.exports = router;
