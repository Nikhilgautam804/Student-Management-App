const express = require("express");

const {
    verifyToken
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const {
    getProfile,
    updateProfile,
    changePassword,
    uploadProfilePhoto
} = require("../controllers/profileController");

const router = express.Router();


// ======================================
// Get Profile
// ======================================

router.get(
    "/",
    verifyToken,
    getProfile
);


// ======================================
// Update Profile
// ======================================

router.put(
    "/",
    verifyToken,
    updateProfile
);


// ======================================
// Change Password
// ======================================

router.put(
    "/password",
    verifyToken,
    changePassword
);


// ======================================
// Upload Profile Photo
// ======================================

router.post(
    "/photo",
    verifyToken,
    upload.single("profile_image"),
    uploadProfilePhoto
);


module.exports = router;