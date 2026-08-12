const multer = require("multer");


// ==========================================
// Store File in Memory
// ==========================================

const storage = multer.memoryStorage();


// ==========================================
// File Filter
// ==========================================

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            ),
            false
        );

    }

};


// ==========================================
// Multer Configuration
// ==========================================

const upload = multer({

    storage,

    limits: {
        fileSize: 2 * 1024 * 1024
    },

    fileFilter

});


module.exports = upload;