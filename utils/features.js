import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'

const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: true,
    httpOnly: true,
    secure: true
}

const connectDB = async (uri) => {
    try {
        const db = await mongoose.connect(uri, {dbName: discount});
        console.log("DataBase Connected")
    } catch (error) {
        console.log("Data Base Connection error in feature js: ", error)
        throw new error()
    }
}

const sendToken = (res, user, code, message) => {
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

    return res.status(code).cokkie("discountToken", token, cookieOptions).json({
        success: true,
        message,
        user
    })
}

export {
    connectDB,
    sendToken
}