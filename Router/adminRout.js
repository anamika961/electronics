const express = require('express');
const admin_router = express.Router();
const { body } = require('express-validator');

const auth_check = require('../middle-ware/isAuth');
const adminController = require('../Controller/adminController');

admin_router.get('/main_form', adminController.getMainDisplay);
admin_router.get('/home_form', adminController.getFormDisplay, auth_check);
admin_router.post('/postValue', [
    body('ptitle', 'Valid product title here').isLength({ min: 3, max: 12 }),
    body('pprice', 'Valid product price here'),
    body('pdesc', 'Valid product description here').isLength({ min: 3, max: 12 }),
], adminController.postFormValue);
admin_router.get('/edit_form/:eid', adminController.editFormDisplay);
admin_router.post('/editval', adminController.posteditformdata);
admin_router.get('/productDetAdmin', adminController.getAdminProduct);
admin_router.get('/deleteProductAdmin/:eid', adminController.deleteProductAdmin);
//admin_router.post('/deleteProduct',adminController.deleteDetailsAdmin);




module.exports = admin_router;