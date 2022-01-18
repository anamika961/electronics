const ProductModel = require("../Model/product");
const CartModel = require("../Model/cart");

exports.getproductDetailst = (req, res) => {
    ProductModel.find().then(products => {
        console.log("product:", products);
        res.render('Shop/shopDetails', {
            title: "shop details",
            productdata: products,
            path: '/shpDetails'
        })
    })
}

exports.viewProductShop = (req, res) => {
    const product_id = req.params.proid;
    console.log(product_id);
    ProductModel.findById(product_id).then(products => {
        console.log(products);
        res.render('Shop/ShopDet', {
            title: "shop det",
            productdata: products,
            path: '/shopProduct/:proid'
        })

    }).catch(err => {
        console.log(err);

    })

}

exports.searchProduct = (req, res) => {
    const productName = req.body.searchText;
    var mysort = { protitle: 1 };
    //console.log("Searching text: ", prductName);
    ProductModel.find({ protitle: productName }).sort(mysort).then(result => {
        console.log("After searching:", result);
        res.render('Shop/shopDetails', {
            title: "product list",
            productdata: result,
            path: '/searchProduct'
        });
    }).catch(err => {
        console.log(err);

    })


}

exports.postAddToCart = (req, res) => {
    const pId = req.body.productId;
    const quantity = req.body.quantity;
    const userId = req.user._id;
    const cartValue = [];
    console.log("after add to cart: Pid:", pId, "Q:", quantity, "Id: ", userId);
    CartModel.find({ userId: userId, productId: pId })
        .then(cartData => {
            if (cartData == '') {
                ProductModel.findById(pId)
                    .then(productForCart => {
                        cartValue.push(productForCart);
                        const cartProduct = new CartModel({ productId: pId, quantity: quantity, userId: userId, cart: cartValue });
                        cartProduct.save()
                            .then(result => {
                                console.log('product added into cart successfully');
                                res.redirect('/cartpage');

                            }).catch(err => {
                                console.log(err);

                            })
                    }).catch(err => {
                        console.log(err);

                    })
            } else if (cartData[0].productId == pId) {
                console.log("product already added in cart");
                res.redirect('/cartPage');

            } else {

                ProductModel.findById(pId)
                    .then(productForCart => {
                        cartValue.push(productForCart);
                        const cartProduct = new CartModel({ productId: pId, quantity: quantity, userId: userId, cart: cartValue });
                        cartProduct.save()
                            .then(result => {
                                console.log('product added into cart successfully');
                                res.redirect('/cartpage');

                            }).catch(err => {
                                console.log(err);

                            })
                    }).catch(err => {
                        console.log(err);

                    })
            }
        }).catch(err => {

        })




}


exports.getCartPage = (req, res) => {
    const user_id = req.session.user._id;
    CartModel.find({ userId: user_id }).then(viewProductsCart => {
        res.render('Shop/cartPage', {
            title: 'cart',
            path: '/cartPage',
            data: viewProductsCart
        });
    }).catch(err => {
        console.log(err);

    })
}

exports.deleteFormCart = (req, res) => {
    const product_id = req.params.proid;
    CartModel.deleteOne({ _id: product_id }).then(result => {
        console.log(result);
        res.redirect('/cartPage');
    }).catch(err => {
        console.log(err);

    })
}

exports.getPaymentDisplay = (req, res) => {
    res.render('Shop/payment', {
        title_page: "Payment Page",
        path: '/payment_form',


    })
}

exports.successPay = (req, res) => {
    res.render('Shop/successPage', {
        title_page: "Success Page",
        path: '/success_form',
    })
}