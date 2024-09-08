const express = require("express");
const {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  profileUpdateController,
  getOrdersController,
  getAllOrdersController,
  updateOrdersStatusController
} = require("../controllers/authController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
//router object

const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || METHOD POST
router.post("/login", loginController);

//fogot password || method post
router.post("/forgot-password", forgotPasswordController);

//test routes
router.get("/test", requireSignIn, testController); //removed the isAdmin middleware for now because its not working

//protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).json({ ok: true });
});

//protected Admin route
router.get('/admin-auth', requireSignIn, (req, res) =>{
  res.status(200).json({ok:true})
})

//update profile route
router.put('/profile' ,profileUpdateController);

//orders
router.get('/orders',requireSignIn ,getOrdersController)

//all orders
router.get('/all-orders',requireSignIn ,getAllOrdersController)

router.put('/order-status/:id', requireSignIn, updateOrdersStatusController)

module.exports = router;
