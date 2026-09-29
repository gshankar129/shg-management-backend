import * as userService from '../services/user.service.js';

export async function getMyProfileHandler(req, res) {
  try {

    // 1. Get email from authenticated user middleware OR request query/params
    // const email = req.user?.email || req.query.email;

    // if (!email) {
    //   return res.status(400).json({ success: false, message: 'Email parameter is required' });
    // }

    const userId = req.user.id; // Extracted from verifyToken middleware

    const userData = await userService.getUserProfile(userId);

    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data:userData
      // {

        // id: user.id,
        // name: user.name,
        // role: user.role,
        // shgName: user.Group ? user.Group.name : null
     // }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}