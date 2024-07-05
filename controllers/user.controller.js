import asyncHandler from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { User } from "../model/user.model.js";
import bcrypt from 'bcrypt';
import {sendToken} from '../utils/features.js'

const signup = asyncHandler(async(req, res, next) => {
    try {
        const {name, phone, email, password} = req.body;

        if(!(name && phone && email && password))
            return next(new ErrorHandler("Please Provide Field", 400))

        const isUser = await User.findOne({phone});

        if(isUser)
            return next(new ErrorHandler("User Allready Exist", 404));

        const user = await User.create({
            name,
            phone, 
            email,
            password
        })


        if(!user)
            return next(new ErrorHandler("User Not Created", 500));

        return sendToken(res, user, 200, `Welcome ${name}`);

    } catch (error) {
        console.log('User Not Created: ', error);
        return next(new ErrorHandler("User Not Created", 500))
    }
})

const login = asyncHandler(async (req, res, next) => {
    try {
        const {email, password} = req.body;

        if(!(email && password))
            return next(new ErrorHandler("Please Provide Field"));

        const user = await User.findOne({email}).select("+password");

        if(!user)
            return next(new ErrorHandler("User Not Found", 404));

        const isPassMatch = await bcrypt.compare(password, user.password) 

        if(!isPassMatch)
            return next(new ErrorHandler('Invalid Password', 400))

        return sendToken(res, user, 200, `Welcome Back ${user.name}`)

    } catch (error) {
        console.log(`Login Failed: `, error)
        throw new ErrorHandler("Login Failed", 500)
    }
})

export {
    signup,
    login
}