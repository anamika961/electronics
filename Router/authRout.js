const express = require('express');

const { check, body } = require('express-validator');

const auth_router = express.Router();
const auth_check = require('../middle-ware/isAuth');

const authController = require('../Controller/authController');

auth_router.get('/reg_form', authController.getRegDisplay, auth_check);
auth_router.post('/regValue', [
        body('fname', 'Valid firstname here').isLength({ min: 3, max: 12 }),
        body('lname', 'Valid lastname here').isLength({ min: 3, max: 12 }),
        check('email').isEmail().withMessage("input valid email"),
        body('pswd', 'enter valid password').matches('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{4,12}$')

    ],
    authController.postRegFormValue);
auth_router.get('/login_form', authController.getlogDisplay, auth_check);
auth_router.post('/logValue', [
    check('email').isEmail().withMessage("input valid email"),
    body('pswd', 'enter valid password')
], authController.postLogin);
auth_router.get('/log_out', authController.logout);

auth_router.get('/send_link', authController.getLink);
auth_router.post('/sendMail', authController.postLink);
auth_router.get('/reset-password/:eid', authController.resetpassword);
auth_router.post('/resetPsd', authController.postresetPass);

module.exports = auth_router;