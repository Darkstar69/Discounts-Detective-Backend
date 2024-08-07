import asyncHandler from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import bcrypt from 'bcrypt';
import { pool, sendToken } from '../utils/features.js';


export const signup = asyncHandler(async (req, res, next) => {
    try {
        const { name, phone, email, password } = req.body;
        const encodedPass = await bcrypt.hash(password, 10);

        if (!(name && phone && email && password)) {
            return next(new ErrorHandler("Please Provide All Fields", 400));
        }

        // Check if the user already exists
        const [isUser] = await pool.query('SELECT * FROM users WHERE phone = ?', [phone]);

        if (isUser.length > 0) {
            return next(new ErrorHandler("User Already Exists", 404));
        }

        // Insert the new user
        const [result] = await pool.query(
            'INSERT INTO users (name, phone, email, password) VALUES (?, ?, ?, ?)',
            [name, phone, email, encodedPass]
        );

        if (result.affectedRows === 0) {
            return next(new ErrorHandler("User Not Created", 500));
        }

        // Fetch the newly created user
        const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);

        return sendToken(res, user[0], 200, `Welcome ${name}`);

    } catch (error) {
        console.log('User Not Created: ', error);
        return next(new ErrorHandler("User Not Created", 500));
    }
});


export const login = asyncHandler(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return next(new ErrorHandler("Please Provide All Fields", 400));
        }

        // Fetch the user by email
        const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (user.length === 0) {
            return next(new ErrorHandler("User Not Found", 404));
        }

        // Compare the password
        const isPassMatch = await bcrypt.compare(password, user[0].password);

        if (!isPassMatch) {
            return next(new ErrorHandler('Invalid Password', 400));
        }

        return sendToken(res, user[0], 200, `Welcome Back ${user[0].name}`);

    } catch (error) {
        console.log('Login Failed: ', error);
        return next(new ErrorHandler("Login Failed", 500));
    }
});
