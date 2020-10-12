const router = require('express').Router();
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const appUser = require('./db/models/app_user');
const auth = require('./authtenticator');
const config = require('./config');

const appUserSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

router.post('/signUp', async (req, res ,next) => {
    try {
        const {username, password} = req.body;
        Joi.assert({username, password}, appUserSchema);
        const hashedPassword = bcrypt.hashSync(password, 12);
        const response = await appUser.insert({username, password: hashedPassword});

        const token = jwt.sign({}, config.jwt);

        res.header({Authorization: `Bearer ${token}`}).json({token, response});
    } catch (error) {
        next(error);
    }
});

router.post('/signIn', async (req, res ,next) => {
    try {
        const {username, password} = req.body;
        Joi.assert({username, password}, appUserSchema);
        
        const response = await appUser.read(username);
        if(!bcrypt.compareSync(password, response[0].password)) throw 'Invalid credentials!';

        const token = jwt.sign({username}, config.jwt);
        res.header({Authorization: `Bearer ${token}`}).json({token});
    } catch (error) {
        next(error);
    }
});

router.get('/signOut', auth, (req, res ,next) => {

});

router.get('/auth', auth, (req, res ,next) => {
    res.json(req.body);
});

module.exports = router;
