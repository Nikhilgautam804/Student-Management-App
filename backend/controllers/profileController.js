const pool = require("../config/db");
const bcrypt = require("bcrypt");
const cloudinary = require("../config/cloudinary");


// ==========================================
// Get Logged-in User Profile
// ==========================================

const getProfile = async (req, res) => {

    try {

        const userId = req.user.id;
        const role = req.user.role;


        // ======================================
        // ADMIN
        // ======================================

        if (role === "admin") {

            const result = await pool.query(
                `
                SELECT

                    u.id,
                    u.username,
                    u.role,
                    u.email,
                    u.phone,
                    u.address,
                    u.profile_image,
                    u.is_active,
                    u.created_at,
                    u.updated_at

                FROM users u

                WHERE u.id = $1
                `,
                [userId]
            );


            if (result.rows.length === 0) {

                return res.status(404).json({
                    message: "User not found."
                });

            }


            return res.status(200).json(
                result.rows[0]
            );

        }


        // ======================================
        // STUDENT
        // ======================================

        if (role === "student") {

            const result = await pool.query(
    `
    SELECT

        u.id AS user_id,
        u.username,
        u.role,
        u.email AS user_email,
        u.phone AS user_phone,
        u.address AS user_address,
        u.profile_image,

        s.id AS student_id,
        s.roll_no,
        s.full_name,
        s.email,
        s.phone,
        s.gender,

        s.class_id,

        c.class_name,
        c.section,

        s.address

    FROM users u

    JOIN students s
        ON s.user_id = u.id

    LEFT JOIN classes c
        ON s.class_id = c.id

    WHERE u.id = $1
    `,
    [userId]
);

            if (result.rows.length === 0) {

                return res.status(404).json({
                    message: "Student profile not found."
                });

            }


            return res.status(200).json(
                result.rows[0]
            );

        }


        // ======================================
        // TEACHER
        // ======================================

        if (role === "teacher") {

            const result = await pool.query(
                `
                SELECT

                    u.id AS user_id,
                    u.username,
                    u.role,
                    u.email AS user_email,
                    u.phone AS user_phone,
                    u.address AS user_address,
                    u.profile_image,

                    t.id AS teacher_id,
                    t.teacher_code,
                    t.full_name,
                    t.email,
                    t.phone,
                    t.gender,
                    t.qualification,
                    t.address

                FROM users u

                JOIN teachers t
                    ON t.user_id = u.id

                WHERE u.id = $1
                `,
                [userId]
            );


            if (result.rows.length === 0) {

                return res.status(404).json({
                    message: "Teacher profile not found."
                });

            }


            return res.status(200).json(
                result.rows[0]
            );

        }


        return res.status(403).json({
            message: "Invalid user role."
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// ==========================================
// Update Logged-in User Profile
// ==========================================

const updateProfile = async (req, res) => {

    try {

        const userId = req.user.id;
        const role = req.user.role;

        const {
            email,
            phone,
            address
        } = req.body;


        // ======================================
        // Update Common User Information
        // ======================================

        await pool.query(
            `
            UPDATE users

            SET

                email = $1,
                phone = $2,
                address = $3,
                updated_at = CURRENT_TIMESTAMP

            WHERE id = $4
            `,
            [
                email || null,
                phone || null,
                address || null,
                userId
            ]
        );


        // ======================================
        // Student
        // ======================================

        if (role === "student") {

            await pool.query(
                `
                UPDATE students

                SET

                    email = $1,
                    phone = $2,
                    address = $3,
                    updated_at = CURRENT_TIMESTAMP

                WHERE user_id = $4
                `,
                [
                    email || null,
                    phone || null,
                    address || null,
                    userId
                ]
            );

        }


        // ======================================
        // Teacher
        // ======================================

        if (role === "teacher") {

            await pool.query(
                `
                UPDATE teachers

                SET

                    email = $1,
                    phone = $2,
                    address = $3,
                    updated_at = CURRENT_TIMESTAMP

                WHERE user_id = $4
                `,
                [
                    email || null,
                    phone || null,
                    address || null,
                    userId
                ]
            );

        }


        res.status(200).json({

            message: "Profile Updated Successfully"

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};


// ==========================================
// Change Password
// ==========================================

const changePassword = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            currentPassword,
            newPassword
        } = req.body;


        // ======================================
        // Validate
        // ======================================

        if (!currentPassword || !newPassword) {

            return res.status(400).json({

                message:
                    "Current password and new password are required."

            });

        }


        // ======================================
        // Get Current Password
        // ======================================

        const userResult = await pool.query(

            `
            SELECT password

            FROM users

            WHERE id = $1
            `,

            [userId]

        );


        if (userResult.rows.length === 0) {

            return res.status(404).json({

                message: "User not found."

            });

        }


        const user = userResult.rows[0];


        // ======================================
        // Verify Current Password
        // ======================================

        const isMatch = await bcrypt.compare(

            currentPassword,

            user.password

        );


        if (!isMatch) {

            return res.status(400).json({

                message: "Current password is incorrect."

            });

        }


        // ======================================
        // Hash New Password
        // ======================================

        const hashedPassword = await bcrypt.hash(

            newPassword,

            10

        );


        // ======================================
        // Update Password
        // ======================================

        await pool.query(

            `
            UPDATE users

            SET

                password = $1,
                updated_at = CURRENT_TIMESTAMP

            WHERE id = $2
            `,

            [
                hashedPassword,
                userId
            ]

        );


        res.status(200).json({

            message: "Password Changed Successfully."

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};
// ==========================================
// Upload Profile Photo
// ==========================================

const uploadProfilePhoto = async (req, res) => {

    try {

        const userId = req.user.id;

        // Check File

        if (!req.file) {

            return res.status(400).json({

                message: "Profile image is required."

            });

        }


        // ======================================
        // Upload to Cloudinary
        // ======================================

        const result = await new Promise(
            (resolve, reject) => {

                const stream =
                    cloudinary.uploader.upload_stream(

                        {
                            folder: "school-management/profile",
                            resource_type: "image"
                        },

                        (error, result) => {

                            if (error) {

                                reject(error);

                            } else {

                                resolve(result);

                            }

                        }

                    );

                stream.end(req.file.buffer);

            }
        );


        // ======================================
        // Save Cloudinary URL
        // ======================================

        await pool.query(

            `
            UPDATE users

            SET

                profile_image = $1,
                updated_at = CURRENT_TIMESTAMP

            WHERE id = $2
            `,

            [
                result.secure_url,
                userId
            ]

        );


        // ======================================
        // Response
        // ======================================

        res.status(200).json({

            message: "Profile Photo Uploaded Successfully.",

            profile_image: result.secure_url

        });


    } catch (error) {

    console.error("PROFILE PHOTO ERROR:", error);

    res.status(500).json({

        message: "Failed to upload profile photo.",

        error: error.message

    });

}

};


module.exports = {

    getProfile,
    updateProfile,
    changePassword,

    uploadProfilePhoto

};