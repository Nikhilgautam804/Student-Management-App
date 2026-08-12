const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ======================= REGISTER =======================
const register = async (req, res) => {

    try {

        const {
            username,
            password,
            role
        } = req.body;

        // Check Existing User
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (existingUser.rows.length > 0) {

            return res.status(400).json({
                message: "Username already exists"
            });

        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert User
        await pool.query(
            `
            INSERT INTO users
            (
                username,
                password,
                role
            )
            VALUES($1,$2,$3)
            `,
            [
                username,
                hashedPassword,
                role
            ]
        );

        res.status(201).json({

            message: "User Registered Successfully"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};

// ======================= LOGIN =======================
const login = async (req, res) => {

    try {

        const {

            username,
            password

        } = req.body;

        // Find User
        const userResult = await pool.query(

            "SELECT * FROM users WHERE username = $1",

            [username]

        );

        if (userResult.rows.length === 0) {

            return res.status(400).json({

                message: "Invalid Username or Password"

            });

        }

        const user = userResult.rows[0];

        // Check Active
        if (!user.is_active) {

            return res.status(403).json({

                message: "Account is disabled."

            });

        }

        // Compare Password
        const isMatch = await bcrypt.compare(

            password,

            user.password

        );

        if (!isMatch) {

            return res.status(400).json({

                message: "Invalid Username or Password"

            });

        }

        // Generate JWT
        const token = jwt.sign(

    {

        id: user.id,

        username: user.username,

        role: user.role

    },

    process.env.JWT_SECRET,

    {

        expiresIn: "1d"

    }

);

        res.status(200).json({

            message: "Login Successful",

            token,

            user: {

                id: user.id,

                username: user.username,

                role: user.role

            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};

module.exports = {

    register,
    login

};