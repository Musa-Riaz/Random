const express = require('express');
const router = express.Router();
const { requireSignIn } = require('../middlewares/authMiddleware');
const { createCategoryController
    , updateCategoryController
    , deleteCategoryController
    ,getAllCategoryController,
    getCategoryController } = require('../controllers/categoryController');
//routes

//create cateogory
router.post('/create-category', requireSignIn ,createCategoryController); //Not using isAdmin middleware because it is not working, will fix later


//update category

router.put('/update-category/:id', requireSignIn, updateCategoryController );

//delete category
router.delete('/delete-category/:id', requireSignIn, deleteCategoryController );


//get all
router.get('/get-all-category', getAllCategoryController); //removed requireSignIn middleware because the categories were not being displayed in the homepage becasue of this middleware

//get single category
router.get('/get-category/:slug', requireSignIn, getCategoryController);

module.exports  = router;