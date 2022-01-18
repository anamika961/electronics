//const dataArray = [];
const path = require('path');
const ProductModel = require("../Model/product");

const { validationResult } = require('express-validator');

exports.getMainDisplay = (req, res) => {
    res.render('Admin/mainPage', {
        title_page: "Main Page",
        path: '/main_form',


    })
}

exports.getFormDisplay = (req, res) => {
    res.render('Admin/addProduct', {
        title_page: "My form",
        path: '/home_form',
        error: []

    })
}

exports.postFormValue = (req, res) => {
    console.log("collected value form form: ", req.body);
    const prodTitle = req.body.ptitle;
    //const prodImage = req.body.pimg;
    const product_img = req.file;
    console.log(product_img);
    const pImage_url = product_img.path;
    const prodPrice = req.body.pprice;
    const prodDesc = req.body.pdesc
    let error = validationResult(req)
    if (!error.isEmpty()) {
        errorResponse = validationResult(req).array();
        console.log("errorResponse :", errorResponse);
        res.render('Admin/addProduct', {
            title_page: "My form",
            path: '/home_form',
            error: errorResponse
        })
    }

    // dataArray.push({ ProductID: productId, ProductName: productname, ProductPrice: productprice });
    // console.log(dataArray);
    else {
        const Product = new ProductModel({ protitle: prodTitle, proimg: pImage_url, proprice: prodPrice, prodesc: prodDesc });
        Product.save().then(results => {
            console.log('Created product', results);

        }).catch(err => {
            console.log(err);

        });
        res.redirect('/productDetAdmin');

    }

}

exports.getAdminProduct = (req, res) => {
    ProductModel.find().then(products => {
        console.log("product:", products);
        res.render('Admin/productDet', {
            title: "product",
            productdata: products,
            path: '/productDetAdmin'
        });

    }).catch(err => {
        console.log("Data fetching error", err);

    })
}

exports.editFormDisplay = (req, res) => {
    const product_id = req.params.eid;
    console.log(product_id);
    ProductModel.findById(product_id).then(products => {
        console.log(products);
        res.render('Admin/editPage', {
            title_page: "Edit Form",
            Editdata: products,
            path: '/edit_form/:eid'
        })

    }).catch(err => {
        console.log(err);

    })

}

// exports.getDetails = (req, res) => {
//     res.render('Admin/productDet', {
//         title: "Details page",
//         data: dataArray
//     })
// }
exports.posteditformdata = (req, res) => {
    const product_id = req.body.mdbid;
    const updatedTitle = req.body.ptitle;
    const updated_img = req.file;
    console.log("Updated Image",
        updated_img);
    const UpproImg_url = updated_img.path;
    //const updatedImage = req.body.pimg;
    const updatedPrice = req.body.pprice;
    const updatedDesc = req.body.pdesc
    ProductModel.findById(product_id).then(productData => {
        productData.protitle = updatedTitle;
        productData.proimg = UpproImg_url;
        // productData.proimg = updatedImage;
        productData.proprice = updatedPrice;
        productData.prodesc = updatedDesc;
        return productData.save().then(results => {
            console.log("data updated", results);
            res.redirect('/productDetAdmin');

        })
    }).catch(err => {
        console.log(err);

    })

}




exports.deleteProductAdmin = (req, res) => {
    const product_id = req.params.eid;
    ProductModel.deleteOne({ _id: product_id }).then(result => {
        //console.log(result);
        res.redirect('/productDetAdmin');
    }).catch(err => {
        console.log(err);

    })
}

// exports.deleteDetailsAdmin=(req,res)=>{
//     const product_id=req.body.product_id;
//     ProductModel.delete(product_id).then(result=>{
//         console.log(result);
//         res.redirect('/productDetAdmin');
//     }).catch(err=>{
//         console.log(err);

//     })
// }