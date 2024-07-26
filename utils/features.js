import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { getBase64 } from '../lib/helper.js';
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";

const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: true,
    httpOnly: true,
    secure: true
}

const connectDB = async (uri) => {
    try {
        const db = await mongoose.connect(uri, {dbName: "DDdatabase"});
        console.log("DataBase Connected")
    } catch (error) {
        console.log("Data Base Connection error in feature js: ", error)
        throw new error()
    }
}

const sendToken = (res, user, code, message) => {
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

    return res.status(code).cookie("DdToken", token, cookieOptions).json({
        success: true,
        message,
        user
    })
}

const uploadFilesToCloudinary = async (files=[]) => {
    const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
           cloudinary.uploader.upload(getBase64(file), {
            resource_type: "auto",
            public_id: uuid()
           },

           (error, result) => {
            if(error) return reject(error);
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
    connectDB,
    sendToken,
    uploadFilesToCloudinary
}