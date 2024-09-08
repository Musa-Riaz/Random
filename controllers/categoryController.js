const categoryModel = require('../models/categoryModel');
const slugify = require('slugify');
exports.createCategoryController =async (req, res) =>{
try{

    const {name} = req.body;
    //validate
    if(!name){
        return res.status(401).json({
            message:'Name is required'
        });
    }

    const existingCategory = await categoryModel.findOne({name});
    //validate
    if(existingCategory){
        return res.status(401).json({
            message:'Category already exists'
        });
    }

    const category = await new categoryModel({name,userId:'' , slug: slugify(name)}).save();
    if(category){
        res.status(201).json({
            status:'success',
            message:'Category created successfully',
            category
        }); 
    }
    else{
        res.status(400).json({
            status:'fail',
            message:'Failed to create category'
        });
    
    }
}catch(err){
    console.log(err);
    res.status(500).json({
        status:'fail',
        err,
        message: 'Error in create category controller'
    })
}
}


exports.updateCategoryController = async (req, res) =>{
    try{
        const {name} = req.body;
        const {id} = req.params;
        
        const category = await categoryModel.findByIdAndUpdate(id, {name, slug: slugify(name)}, {new:true});
        if(category){
            res.status(200).json({
                status:'success',
                message:'Category updated successfully',
                category
            }); 
        }
        else{
            res.status(400).json({
                status:'fail',
                message:'Failed to update category'
            });
        
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status:'fail',
            err,
            message: 'Error in update category controller'
        })
    }
}

exports.deleteCategoryController = async (req, res) =>{
    const {id} = req.params;
    
    try{
        const category = await categoryModel.findByIdAndDelete(id);
        if(category){
            res.status(200).json({
                status:'success',
                message:'Category deleted successfully',
                category
            }); 
        }
        else{
            res.status(400).json({
                status:'fail',
                message:'Failed to delete category'
            });
        
        }
    }
catch(err){
    console.log(err);
    res.status(500).json({
        status:'fail',
        err,
        message: 'Error in delete category controller'
    })
}
  
}


exports.getAllCategoryController = async (req, res) =>{
    try{

        const category = await categoryModel.find({});
        const results = category.length;
        if(category){
            res.status(200).json({
                status:'success',
                results,
                message:'Category fetched successfully',
                category
            });
        }

        else{
            res.status(400).json({
                status:'fail',
                message:'Failed to fetch category'
            });
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status:'fail',
            err,
            message: 'Error in get all category controller'
        })
    }
}

exports.getCategoryController = async (req, res) =>{
    try{
        const category = await categoryModel.findOne({slug: req.params.slug});
    
        if(category){
            res.status(200).json({
                status:'success',
                message:'Category fetched successfully',
                category
            });
        }
    
        else{
            res.status(400).json({
                status:'fail',
                message:'Failed to fetch category'
            });
        }
    
    }

    catch(err){
        console.log(err);
        return res.status(500).json({
            status:'fail',
            message:'Error in get category controller'
    })
   
}
}