const express = require('express');
const shop_router = express.Router();
const shopController = require('../Controller/shopController');
const auth_check = require('../middle-ware/isAuth');

shop_router.get('/shpDetails', shopController.getproductDetailst);

shop_router.get('/shopProduct/:proid', shopController.viewProductShop, auth_check);
shop_router.post('/searchProduct', shopController.searchProduct);
shop_router.post('/addToCart', shopController.postAddToCart);
shop_router.get('/cartPage', shopController.getCartPage, auth_check);
shop_router.get('/deletefromcart/:proid', shopController.deleteFormCart);
shop_router.get('/payment_form', shopController.getPaymentDisplay);
shop_router.get('/success_form', shopController.successPay);

module.exports = shop_router;