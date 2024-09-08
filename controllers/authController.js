const userModel = require('../models/userModel');
const {comparePassword,hashPassword} = require('../utils/authHelper');
const JWT = require('jsonwebtoken');
const orderModel = require('../models/orderModel');
exports.registerController = async (req, res) => {
 
    try{
        const {name, email, password, phone, address, answer} = req.body;
        //validation
        if(!name){
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide a name'
            })
        }
        if(!email){
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide a email'
            })
        }
        if(!password){
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide a password'
            })
        }
        if(!phone){
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide a phone number'
            })
        }
        if(!address){
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide a address'
            })
        }
        if(!answer){
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide an answer'
            })
        }

        //check if the user already exists
        const existingUser = await userModel.findOne({email: email});
        if(existingUser){
            res.status(400).json({
                status: 'fail',
                message: 'User already exists'
            })
        }

        //register user
        const hashedPassword = await hashPassword(password);

        //save user
        const user = await new userModel({name, email, phone, address, password: hashedPassword, answer}).save();

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            user
        })
    }
    catch(error){
        res.status(500).json({
            status: 'fail',
            message: 'Error in registration',
            error
        })
    }
}

//POST LOGIN

exports.loginController = async (req, res) =>{
    try{

        const {email, password} = req.body;
        //validation
        if(!email || !password){
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid email or password'
            })
        }
        //check user
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).json({
                status: 'fail',
                message: 'Email is not registered'
            })
        }
        const match = await comparePassword(password, user.password); //we are using user.password because we are getting the user from the database and in the database the password is hashed
        if(!match){
            return res.status(200).json({
                status: 'fail',
                message: 'Invalid password'
            })
        }
        //generate token
        const token =  JWT.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});

        res.status(200).json({
            status: 'success',
            message: 'User logged in successfully',
            token,
            user:{
                name : user.name,
                email : user.email, 
                phone : user.phone,
                address : user.address,
                role : user.role
            }
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            status: 'fail',
            message: 'Error in login',
            error
        })
    }
}

//test controller
exports.testController = async (req, res)=>{
    console.log("protected route")
}




exports.forgotPasswordController = async (req, res) =>{
    try{

        const {email, newpassword, answer} = req.body;

        //validation
        if(!email){
            res.status(400).json({
                message: "Email is required"
            })
        }
        if(!answer){
            res.status(400).json({
                message: "Answer is required"
            })
        }
        if(!newpassword){
            res.status(400).json({
                message: "New Password is required"
            })
        }

        //check
        const user = await userModel.findOne({email, answer});

        //validation
        if(!user){
            return res.status(404).json({
                status: 'fail',
                message: 'Invalid email or answer'
            });
        }

        const hashed = await hashPassword(newpassword);
        await userModel.findByIdAndUpdate(user._id, {password: hashed});
       return res.status(200).json({
            status: 'success',
            message: 'Password updated successfully'
        })

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status: 'fail',
            message: 'Error in forgot password',
        })
    }
}

exports.profileUpdateController = async (req, res) =>{

    try{

        const {name, email, phone, address, password} = req.body;

        const hashedPassword = await hashPassword(password);
        const user = await userModel.findById(req.user._id); //req.user is coming from the protect middleware which is coming from the authController protect function which is coming from the authHelper
    
        if(password && password.length < 6){
            return res.status(400).json({
                error: 'Password must be atleast 6 characters long'
            })
        }
    
       
    
        const updatedUser = await userModel.findById(req.user._id,{
            name: name || user.name,
            email: email || user.email,
            phone: phone || user.phone,
            address: address || user.address,
    
        },{new: true});
    
        res.status(200).json({
            status: 'success',
            message: 'User updated successfully'})
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: 'fail',
            message: 'Error in updating'
        })
    }
   
}

exports.getOrdersController = async (req, res) =>{
    try{
        const orders = await orderModel
        .find({buyer: req.user._id})
        .populate("products", "-photo")
        .populate("buyer","name");

        res.status(200).json({
            status: 'success',
            orders
        })  
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status: 'fail',
            message: 'Error in getting orders',
            err
        })
    }
}
exports.getAllOrdersController = async (req, res) =>{
    try{
        const orders = await orderModel
        .find()
        .populate("products", "-photo")
        .populate("buyer","name")
        .sort({createdAt: -1});

        res.status(200).json({
            status: 'success',
            orders
        })  
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status: 'fail',
            message: 'Error in getting orders',
            err
        })
    }
}

//updating the status of teh orders
exports.updateOrdersStatusController = async (req, res) =>{
    try{

        const {id} = req.params;
        const {status} = req.body;
        const orders = await orderModel.findByIdAndUpdate({id}, {status: status}, {new:true});
        res.status(200).json({
            orders
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status: 'fail',
            message: 'Error in updating status',
        })
}
}