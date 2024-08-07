import jwt from 'jsonwebtoken';
import { getBase64 } from '../lib/helper.js';
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import mysql from "mysql";
import dotenv from 'dotenv'
import mysql2 from 'mysql2/promise';

dotenv.config();

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: true,
    httpOnly: true,
    secure: true
}

const connectDB = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    keepAliveInitialDelay: 10000,
    enableKeepAlive: true,
})


const sendToken = (res, user, code, message) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    return res.status(code).cookie("DdToken", token, cookieOptions).json({
        success: true,
        message,
        user
    })
}

const uploadFilesToCloudinary = async (files = []) => {
    const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(getBase64(file), {
                resource_type: "auto",
                public_id: uuid()
            },

                (error, result) => {
                    if (error) return reject(error);
                    resolve(result)
                }
            )
        })
    })

    try {
        const results = await Promise.all(uploadPromises);

        const formattedResults = results.map((result) => ({
            public_id: result.public_id,
            url: result.secure_url,
        }))

        return formattedResults
    } catch (error) {
        throw new Error("Error while uploading files on cloudinary: ", error)
    }
}

export {
    pool,
    connectDB,
    sendToken,
    uploadFilesToCloudinary
}