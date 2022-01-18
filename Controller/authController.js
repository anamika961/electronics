const path = require('path');
const UserModel = require("../Model/authModel");

const bcrypt = require('bcryptjs');

const nodemailer = require('nodemailer');
const sendGridMailer = require('nodemailer-sendgrid-transport');

const { validationResult } = require('express-validator');

const createTranspoter = nodemailer.createTransport(sendGridMailer({
    auth: {
        api_key: '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'
    }
}))


exports.getRegDisplay = (req, res) => {
    let message = req.flash('error');
    console.log(message);
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;

    }
    res.render('Auth/registration', {
        Title_Page: "Reg form",
        path: '/reg_form',
        errorMsg: message,
        error: []
    })
}

exports.postRegFormValue = (req, res) => {
    console.log("collected value form form: ", req.body);
    const user_fname = req.body.fname;
    const user_lname = req.body.lname;
    const user_email = req.body.email;
    const user_pwd = req.body.pswd;

    // //const User = new UserModel({ Fname: user_fname, Lname: user_lname, Email: user_email, Paswd: user_pwd });
    // User.save().then(results => {
    //     console.log('Created product', results);

    // }).catch(err => {
    //     console.log(err);

    // });
    // //res.redirect('/productDetAdmin');
    let error = validationResult(req)
    if (!error.isEmpty()) {
        errorResponse = validationResult(req).array();
        console.log("errorResponse :", errorResponse);
        res.render('Auth/registration', {
            Title_Page: "Reg form",
            path: '/reg_form',
            errorMsg: '',
            error: errorResponse
        })
    } else {
        UserModel.findOne({ Email: user_email }).then(userValue => {
            if (userValue) {
                console.log(userValue, "Email already exist");
                req.flash('error', 'Email already exist,try new email')
                return res.redirect('/reg_form');
            }
            return bcrypt.hash(user_pwd, 12)
                .then(hashPassword => {
                    const userData = new UserModel({ Fname: user_fname, Lname: user_lname, Email: user_email, Paswd: hashPassword })
                    return userData.save()
                }).then(results => {
                    console.log("Registration Done");

                    createTranspoter.sendMail({
                        to: user_email,
                        from: "bera.anamika961@gmail.com",
                        subject: "Registration Procedure",
                        html: "<h1>you have succefully registered</h1>"
                    })


                    return res.redirect('/login_form')
                }).catch(err => {
                    console.log(err);

                })
        }).catch(err => {
            console.log(err);

        })

    }


}

exports.getlogDisplay = (req, res) => {
    let message = req.flash('error');
    console.log(message);
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;

    }
    res.render('Auth/login', {
        Title_Page: "Login form",
        path: '/login_form',
        errorMsg: message,
        cookie_data: req.cookies,
        error: []
    })
}

exports.postLogin = (req, res, next) => {
    const user_email = req.body.email;
    const user_pwd = req.body.pswd;
    const checked = req.body.checked;
    let error = validationResult(req)
    if (!error.isEmpty()) {
        errorResponse = validationResult(req).array();
        console.log("errorResponse :", errorResponse);
        res.render('Auth/login', {
            Title_Page: "Login form",
            path: '/login_form',
            errorMsg: '',
            cookie_data: req.cookies,
            error: errorResponse
        })
    } else {
        UserModel.findOne({ Email: user_email })
            .then(UserValue => {
                if (!UserValue) {
                    console.log('Invalid email');
                    req.flash('error', 'Invalid Email,try again')
                    return res.redirect('/login_form')
                }
                bcrypt.compare(user_pwd, UserValue.Paswd)
                    .then(result => {
                        console.log(result);
                        if (!result) {
                            console.log("Invalid password");

                        } else {
                            console.log('logged in' + result);
                            req.session.isLoggedIn = true;
                            req.session.user = UserValue;
                            return req.session.save(err => {
                                if (err) {
                                    console.log(err);

                                } else {
                                    if (checked) {
                                        const cookiedata = { emailCookie: UserValue.Email, password: user_pwd };
                                        res.cookie("cookiedata", cookiedata, {
                                            expires: new Date(Date.now() + 120000),
                                            httpOnly: true
                                        })
                                    }
                                }
                                console.log('logged in')
                                createTranspoter.sendMail({
                                    to: user_email,
                                    from: "bera.anamika961@gmail.com",
                                    subject: "Login Procedure",
                                    html: "<h1>you have succefully Logged In</h1>"
                                })


                                return res.redirect('/shpDetails');
                            })
                        }
                        res.redirect('/login_form')
                    }).catch(err => {
                        console.log(err);
                        res.redirect('/login_form')
                    })
            }).catch(err => {
                console.log("error to find email:", err);

            })

    }

}

exports.logout = (req, res) => {
    req.session.destroy(err => {

        res.redirect('/reg_form');
    });

}


exports.getLink = (req, res) => {
    res.render('Auth/sendmail', {
        Title_Page: "LINK PAGE",
        path: '/send_link',
    })
}

exports.postLink = (req, res) => {
    const user_email = req.body.email;
    UserModel.findOne({ Email: user_email })
        .then(UserValue => {
            if (!UserValue) {
                console.log('Invalid email');
                //req.flash('error', 'Invalid Email,try again')
                return res.redirect('/login_form')
            } else {
                const user_id = UserValue._id;
                console.log("User Id:", user_id);
                const url = "http://localhost:1032/reset-password/" + user_id;
                console.log(url);
                const text = "Click here ->"
                createTranspoter.sendMail({
                    to: user_email,
                    from: "bera.anamika961@gmail.com",
                    subject: "Password Rest",
                    html: text.concat(url)
                })
            }
        })

}

exports.resetpassword = (req, res) => {
    const user_id = req.params.eid;
    console.log(user_id);
    UserModel.findById(user_id).then(results => {
        res.render('Auth/reset', {
            Title_Page: "Reset Page",
            data: results,
            path: '/reset-password/:eid'
        })
    }).catch(err => {
        console.log(err);

    })


}

// exports.postresetPass = (req, res) => {
//     const user_id = req.body.usid;
//     const user_fnmae = req.body.fname;
//     const user_lname = req.body.lname;
//     const user_email = req.body.email;
//     const user_paswd = req.body.psd;
//     const hashPassword = bcrypt.hash(user_paswd, 12)
//     UserModel.findById(user_id).then(userData => {
//         userData.Fname = user_fnmae;
//         userData.Lname = user_lname;
//         userData.Email = user_email;
//         userData.Paswd = hashPassword;
//         return userData.save().then(results => {
//             console.log("Password updated", results);
//             res.redirect('/login_form')
//         })
//     }).catch(err => {
//         console.log(err);

//     })

// }

exports.postresetPass = (req, res) => {
    const user_id = req.body.usid;
    const user_fnmae = req.body.fname;
    const user_lname = req.body.lname;
    const user_email = req.body.email;
    const user_paswd = req.body.psd;
    UserModel.findById(user_id).then(userData => {
        return bcrypt.hash(user_paswd, 12)
            .then(hashPassword => {
                userData.Fname = user_fnmae;
                userData.Lname = user_lname;
                userData.Email = user_email;
                userData.Paswd = hashPassword;
                return userData.save()
            })
            .then(results => {
                console.log("Password updated", results);
                res.redirect('/login_form')
            })
    }).catch(err => {
        console.log(err);

    })

}