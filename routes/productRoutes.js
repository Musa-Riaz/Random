const express = require("express");
const router = express.Router();
const { requireSignIn } = require("../middlewares/authMiddleware");
const {
  createProductController,
  getProductsController,
  getSingleProductController,
  updateProductController,
  productPhotoController,
  deleteProductController,
   productFiltersController,
   productCountController,
   productPageController,
   productSearchController,
   relatedProductController,
   productCategoryController,
   braintreeTokenController,
   braintreePaymentController
} = require("../controllers/productController");
const formidable = require("express-formidable");




router.post('/create-product', requireSignIn, formidable() ,createProductController);

router.get('/get-product', getProductsController);

router.get('/get-product/:slug', getSingleProductController);

router.get('/product-photo/:pid', productPhotoController);

router.put('/update-product/:pid', requireSignIn, formidable(), updateProductController);

router.delete('/delete-product/:id',  deleteProductController);

router.post('/product-filters', productFiltersController);

router.get('/product-count', productCountController);

router.get('/product-list/:page', productPageController);

router.get('/search/:keyword', productSearchController);

router.get('/related-product/:pid/:cid', relatedProductController)

router.get('/product-category/:slug', productCategoryController);

router.get('/brain-tree/token', braintreeTokenController);

router.post('/brain-tree/payment', requireSignIn, braintreePaymentController);
module.exports = router;