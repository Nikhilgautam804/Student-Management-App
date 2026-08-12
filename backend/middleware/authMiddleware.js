const jwt = require("jsonwebtoken");

// ================= Verify JWT Token =================

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {

        return res.status(401).json({
            message: "Authorization token missing"
        });

    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or Expired Token"
        });

    }

};

// ================= Role Authorization =================

const authorizeRoles = (...roles) => {

    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                message: "Access Denied"
            });

        }

        next();

    };

};

module.exports = {
    verifyToken,
    authorizeRoles
};