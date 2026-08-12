const { Pool } = require("pg");

require("dotenv").config();


// ==================================================
// DATABASE CONFIGURATION
// ==================================================

let pool;


// ==================================================
// PRODUCTION - RENDER
// ==================================================

if (process.env.DATABASE_URL) {

    pool = new Pool({

        connectionString:
            process.env.DATABASE_URL,

        ssl: {
            rejectUnauthorized: false
        }

    });

}


// ==================================================
// LOCAL DEVELOPMENT
// ==================================================

else {

    pool = new Pool({

        host:
            process.env.DB_HOST,

        port:
            process.env.DB_PORT,

        user:
            process.env.DB_USER,

        password:
            process.env.DB_PASSWORD,

        database:
            process.env.DB_NAME

    });

}


// ==================================================
// DATABASE ERROR
// ==================================================

pool.on(
    "error",
    (error) => {

        console.error(
            "Unexpected PostgreSQL error:",
            error
        );

    }
);


module.exports = pool;