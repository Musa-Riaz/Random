const { default: slugify } = require('slugify');
const productModel = require('../models/productModel');
const categoryModel = require('../models/categoryModel');
const orderModel = require('../models/orderModel');
const fs = require('fs');
const braintree = require('braintree');

//payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: 'p8vgsysrzzm2mq79',
    publicKey: 'qwv5tq697bpr75zy',
    privateKey:'dbcd199e8391f02759c1f345fc2b19f4'
  });

exports.createProductController = async (req, res) => {
    try{
    
        const {name, slug ,description, price, category, quantity} = req.fields;
        const {photo} = req.files;
       
        switch(true){
            case !name:
                return res.status(500).json({
                    status:'fail',
                    message:'Please provide a name'    
                })
            case !description:
                return res.status(500).json({
                    status:'fail',
                    message:'Please provide a description'
                })
            case !price:
                return res.status(500).json({
                    status:'fail',
                    message:'Please provide a price'
                })
            case !category:
                return res.status(500).json({
                    status:'fail',
                    message:'Please provide a category'
                })
            case photo && photo.size > 2000000:
                return res.status(500).json({
                    status:'fail',
                    message:'Photo is required and must be less than 2 mb'
                })
            
        }

        const products = new productModel({...req.fields, slug:slugify(name)});
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }

        await products.save();
        res.status(201).json({
            status: 'success',
            message: 'Product created successfully',
            products
    })
} 
    catch(err){
        console.log(err);
        res.status(500).json({
            status: 'fail',
            message: 'Error in create product controller'
    })
 }
}


//get all products

exports.getProductsController = async (req, res) => {
    try{

        const products = await productModel.find({}).populate('category').select('-photo').limit(12).sort({createAt:-1}); //select('-photo') is used to exclude the photo field from the response
        res.status(200).json({
            status: 'success',
            products
        })

    }catch(err){
        consooe.log(err);
        res.status(500).json({
            status: 'fail',
            message: 'Error in get all products controller'
        })
    }
}

//get single product

exports.getSingleProductController = async (req, res) => {
    try{
        const product = await productModel.findOne({slug:req.params.slug}).select('-photo').populate('category');
        res.status(200).json({
            status: 'success',
            product
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status: 'fail',
            message: 'Error in get single product controller'
        })
    }
}

//get product photo
exports.productPhotoController = async (req, res) => {
    try{

        const product = await productModel.findById(req.params.pid).select("photo");
        if(product.photo.data){
            res.set("Content-Type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status: 'fail',
            message: 'Error in product photo controller',
            err
        })
    }
}

//update products
exports.updateProductController = async (req, res) =>{
    try{
    
        const {name, slug ,description, price, category, quantity} = req.fields;
        const {photo} = req.files;
       
        switch(true){
            case !name:
                return res.status(500).json({
                    status:'fail',
                    message:'Please provide a name'    
                })
            case !description:
                return res.status(500).json({
                    status:'fail',
                    message:'Please provide a description'
                })
            case !price:
                return res.status(500).json({
                    status:'fail',
                    message:'Please provide a price'
                })
            case !category:
                return res.status(500).json({
                    status:'fail',
                    message:'Please provide a category'
                })
            case photo && photo.size > 2000000:
                return res.status(500).json({
                    status:'fail',
                    message:'Photo is required and must be less than 2 mb'
                })
            
        }

        const products = await productModel.findByIdAndUpdate(req.params.pid, {...req.fields, slug:slugify(name)}, {new:true});
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }

        await products.save();
        res.status(201).json({
            status: 'success',
            message: 'Product updated successfully',
            products
    })
} 
    catch(err){
        console.log(err);
        res.status(500).json({
            status: 'fail',
            message: 'Error in update product controller'
    })
 }
}


//get all products

exports.getProductsController = async (req, res) => {
    try{

        const products = await productModel.find({}).populate('category').select('-photo').limit(12).sort({createAt:-1}); //select('-photo') is used to exclude the photo field from the response
        res.status(200).json({
            status: 'success',
            products
        })

    }catch(err){
        consooe.log(err);
        res.status(500).json({
            status: 'fail',
            message: 'Error in get all products controller'
        })
    }
}

//delete products

exports.deleteProductController =async (req, res) =>{
    try{
        const {id} = req.params;
        await productModel.findByIdAndDelete(id);
        res.status(200).json({
            status: 'success',
            message: 'Product deleted successfully'
    })
}
    catch(err){
        console.log(err);
        res.status(500).json({
            status: 'fail',
            message: 'Error in delete product controller'
        })
    }
}


//Filter products
exports.productFiltersController = async (req, res) => {
    try{

        const {checked, radio}  = req.body;
        let args = {}; //args is an object that will store the filters
        if(checked.length > 0) args.category = checked; //if checked is not empty, then args.category will be equal to checked
        if(radio.length) args.price = {$gte: radio[0], $lte: radio[1]}; //if radio is not empty, then args.price will be equal to radio
        const products = await productModel.find(args).populate('category').select('-photo').sort({createAt:-1});
        res.status(200).json({
            status: 'success',
            products
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status: 'fail',
            message: 'Error in product filters controller',
            err
        })
    }
}

//product Count

exports.productCountController = async (req, res) => {
    try{

        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).json({
            status:'true',
            total
        })

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status:'fail',
            message:"There was an error in the product count controller",
            err
        })
    }
}


//product page list

exports.productPageController = async (req, res) => {
    try{

        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel.find({}).select('-photo').skip((perPage * page) - perPage).limit(perPage).sort({createAt:-1});
        res.status(200).json({
            status:'success',
            products
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status:'fail',
            message:"There was an error in the product page controller",
            err
        })
    }
}

//search product

exports.productSearchController = async (req, res) =>{
    try{
        const {keyword} = req.params;

        const result = await productModel.find({$or: [
            {name:{$regex: keyword, $options: 'i'}},
            {description:{$regex: keyword, $options: 'i'}}
        ]}).select("-photo");

        res.status(200).json({
            status:'success',
            result
        })
    }
    
    catch(err)
    {
        console.log(err);
        res.status(500).json({
            status:'fail',
            message:"There was an error in the product search controller",
            err
        })
    }
}

//related products

exports.relatedProductController = async (req, res) =>{
    try{

        const {pid, cid} = req.params;
        const products = await productModel.find({_id:{$ne:pid}, category:cid}).limit(4).select('-photo');
        console.log(products);
        res.status(200).json({
            status:'success',
            products
        })

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status:'fail',
            message:"There was an error in the related product controller",
            err
        })
    }

}

//get products by category
exports.productCategoryController = async (req, res) => {
    
    try{

        const category = await categoryModel.findOne({slug: req.params.slug})
        const product = await productModel.find({category: category}).populate('category')
        res.status(200).json({
            status:'success',
            category,
            product
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            status:'fail',
            message:"There was an error in the product category controller",
            err
        })
    }
}


//token

exports.braintreeTokenController =async (req, res) => {
try{
    gateway.clientToken.generate({}, function(err, response){
        if(err){
            res.status(500).send(err)
        }
        else{
            res.send(response)
        }
    })
}
catch(err){
    console.log(err)
}
}


//payment

exports.braintreePaymentController =async (req, res) =>{
try{
    const {cart, nonce} = req.body;
    let total = 0;
    cart.map((i)=>{
        total += i.price;
    });
    let newTransaction = gateway.transaction.sale({
        amount: total,
        paymentMethodNonce: nonce,
        options:{
            submitForSettlement: true
        },

    },

    function (err, result){
        if(result){
            const order = new orderModel({
                products: cart,
                payment: result,
                buyer: req.user._id
            }).save();
            res.json({ok:true})
        }
        else{
            res.status(500).send(err)
        }
    }

)
}
catch(err){

}
}