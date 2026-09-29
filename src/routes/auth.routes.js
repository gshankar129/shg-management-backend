import { Router } from "express";
import { register ,  login} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register",register);
router.post("/login", login);


// router.get("/me", authenticate, (req, res) => {
//   res.status(200).json({
//     success: true,
//     data: {
//       id: req.user.id,
//       name: req.user.name,
//       email: req.user.email,
//       phone: req.user.phone,
//       role: req.user.role,
//     },
// });
// });

export default router;