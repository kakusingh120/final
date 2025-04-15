import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { registerUser, loginLawyerOnly,loginUserOnly,logout,forgotPassword,resetPassword} from '../controllers/register.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';
import { registerLawyer } from '../controllers/lawercontroller.js';

const router = Router();


// ========== USER REGISTRATION ==========
router.post(
    "/register/user",
    upload.fields([
      { name: "avatar", maxCount: 1 },
      { name: "coverImage", maxCount: 1 },
    ]),
    registerUser
  );
  
  // ========== LAWYER REGISTRATION ==========
  router.post(
    "/register/lawyer",
    upload.fields([
      { name: "avatar", maxCount: 1 },
      { name: "coverImage", maxCount: 1 },
    ]),
    registerLawyer
  );

  router.post('/login/user', loginUserOnly);
  router.post('/login/lawyer', loginLawyerOnly);
  


router.post('/logout', verifyToken, logout);

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

export default router;
