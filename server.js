const express = require('express');
const appServer = express();
const path = require('path');
const UserModel = require('./Model/authModel');
const auth_check = require('./middle-ware/isAuth');

const session = require('express-session');
//session package used to store info in memory but it has no infinite resource
const mongodb_session = require('connect-mongodb-session')(session);
//used to store data in mongodb in a session

const multer = require('multer');
//Multer is a node.js middleware for handeling multipart/formdata
// which is primarily use for uploading files
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const csurf = require('csurf');

const mongoose = require('mongoose');
const dbDriver = "mongodb+srv://ana1238:Bera8820@cluster0.5srdm.mongodb.net/mongooseproj?retryWrites=true&w=majority";

const admin_router = require('./Router/adminRout');
const shop_router = require('./Router/shopRout');
const auth_router = require('./Router/authRout');
const csrfProtection = csurf();

//const mongoConnect = require('./Database/db').mongoConnect;
//it only imports mongoConnect method

appServer.use(express.urlencoded());
appServer.set('view engine', 'ejs');
appServer.set('views', 'Views');

appServer.use(flash());
appServer.use(cookieParser());

appServer.use(express.static(path.join(__dirname, 'Public')))

//to store data in mongodb session collection
const storeValue = new mongodb_session({
    uri: 'mongodb+srv://ana1238:Bera8820@cluster0.5srdm.mongodb.net/mongooseproj',
    collection: 'my-session'
})

appServer.use(session({ secret: 'secret-key', resave: false, saveUninitialized: false, store: storeValue }))
    //session is function here to stop resaving,resave value false to stop storing uninitialized
    //value, saveuninitializes :false



appServer.use('/Uploaded_image', express.static(path.join(__dirname, 'Uploaded_image')))

//to use the images folder after adding it to database
const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'Uploaded_image')
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
});

//file.mimetype==='image/jpg'

const fileFilter = (req, file, callback) => {
    if (file.mimetype.includes("png") ||
        file.mimetype.includes("jpg") ||
        file.mimetype.includes("jpeg")) {
        callback(null, true)
    } else {
        callback(null, false)

    }
}

appServer.use(multer({ storage: fileStorage, fileFilter: fileFilter, limits: { fieldSize: 1024 * 1024 * 5 } }).single('pimg'));



appServer.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    UserModel.findById(req.session.user._id)
        .then(UserValue => {
            req.user = UserValue;
            console.log('User details: ' + req.user);
            next();
        }).catch(err => console.log("user not found", err));
});


appServer.use(csrfProtection); //use always after cookie and session

appServer.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrf = req.csrfToken()
    next();
})
appServer.use(admin_router);
appServer.use(shop_router);
appServer.use(auth_router);

// appServer.listen(1030, () => {
//     console.log("server is connected at localhost:1030");
// })

// mongoConnect(() => {
//     appServer.listen(1032, () => {
//         console.log("server Connected");

//     })
// })

mongoose.connect(dbDriver, { useNewUrlParser: true, useUnifiedTopology: true }).then(result => {
        appServer.listen(1032, () => {
            console.log("Server is running at localhost:1032");
        });
    })
    .catch(err => {
        console.log(err);
    })