import asyncHandler from '../utils/asyncHandler.js'
import { ErrorHandler } from '../utils/errorHandler.js';
import { pool } from '../utils/features.js';

export const storeDetailsAdd = asyncHandler(async (req, res, next) => {
    try {
        const { name, url } = req.body;

        if (!name)
            return next(new ErrorHandler("Please Provide Name", 400));

        if (!url)
            return next(new ErrorHandler("Please Provide Brand Logo", 400));

        const [rows] = await pool.query('SELECT * FROM brands WHERE name = ?', [name]);
        console.log(rows)

        if (rows.length > 0)
            return next(new ErrorHandler('Store Already Exist', 400));

        let query = `INSERT INTO brands (name, url) VALUES ('${name}', '${url}')`;

        const [result] = await pool.query(query);

        if (result.affectedRows === 0)
            return next(new ErrorHandler("Store Not Get Added", 500));

        return res.status(200).json({
            success: true,
            newStore: { id: result.insertId, name, url }
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getAllStores = asyncHandler(async (req, res, next) => {
    try {
        const [allStores] = await pool.query('SELECT * FROM brands');

        if (!allStores.length) {
            return next(new ErrorHandler("No Stores Found", 500));
        }

        return res.status(200).json({
            success: true,
            allStores
        });
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message, 500));
    }
});


export const updateStore = asyncHandler(async (req, res, next) => {
    try {
        const _id = req.query._id;
        const { name, url } = req.body;

        // Update the store in the database
        const [result] = await pool.query(
            'UPDATE brands SET name = ?, url = ? WHERE id = ?',
            [name, url, _id]
        );

        if (result.affectedRows === 0) {
            return next(new ErrorHandler("Store Not Updated", 500));
        }

        // Fetch the updated store details
        const [updatedStore] = await pool.query(
            'SELECT * FROM brands WHERE id = ?',
            [_id]
        );

        return res.status(200).json({
            success: true,
            updatedStore: updatedStore[0]
        });

    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message, 500));
    }
});


export const deleteStore = asyncHandler(async (req, res, next) => {
    try {
        const _id = req.query._id;

        // Delete the store from the database
        const [result] = await pool.query('DELETE FROM brands WHERE id = ?', [_id]);

        if (result.affectedRows === 0) {
            return next(new ErrorHandler("Store Not Deleted", 500));
        }

        return res.status(200).json({
            success: true,
            message: "Store Deleted Successfully"
        });

    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message, 500));
    }
});




export const couponsAdd = asyncHandler(async (req, res, next) => {
    try {
        const { title, thumbnail, discount, platform, platformIcon, description, price, prevPrice, offerLink } = req.body;
        console.log(req.body)

        // Check if the coupon already exists
        const [isCoupon] = await pool.query('SELECT * FROM products WHERE offerLink = ?', [offerLink]);

        if (isCoupon.length > 0) {
            return next(new ErrorHandler("Coupon Already Exists", 400));
        }

        // Insert the new coupon
        const [result] = await pool.query(
            'INSERT INTO products (title, thumbnail, discount, platform, platformIcon, description, price, prevPrice, offerLink) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, thumbnail, discount, platform, platformIcon, description, price, prevPrice, offerLink]
        );

        if (result.affectedRows === 0) {
            return next(new ErrorHandler("Coupon Not Added", 500));
        }

        // Fetch the newly added coupon
        const [newCoupon] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);

        return res.status(200).json({
            success: true,
            newCoupon: newCoupon[0]
        });

    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message, 500));
    }
});


export const getAllCoupons = asyncHandler(async (req, res, next) => {
    try {
        const [allCoupons] = await pool.query('SELECT * FROM products');

        return res.status(200).json({
            success: true,
            allCoupons
        });
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message, 500));
    }
});


export const deleteCoupon = asyncHandler(async (req, res, next) => {
    try {
        const _id = req.query._id;

        const [result] = await pool.query('DELETE FROM products WHERE id = ?', [_id]);

        if (result.affectedRows === 0) {
            return next(new ErrorHandler("Coupon Not Deleted", 500));
        }

        return res.status(200).json({
            success: true,
            message: "Coupon Deleted Successfully"
        });
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message, 500));
    }
});


export const updateCoupon = asyncHandler(async (req, res, next) => {
    try {
        const _id = req.query._id;
        const { title, thumbnail, discount, platform, platformIcon, description, price, prevPrice, offerLink } = req.body;

        const [result] = await pool.query(
            'UPDATE products SET title = ?, thumbnail = ?, discount = ?, platform = ?, platformIcon = ?, description = ?, price = ?, prevPrice = ?, offerLink = ? WHERE id = ?',
            [title, thumbnail, discount, platform, platformIcon, description, price, prevPrice, offerLink, _id]
        );

        if (result.affectedRows === 0) {
            return next(new ErrorHandler("Coupon Not Updated", 500));
        }

        const [updatedData] = await pool.query('SELECT * FROM products WHERE id = ?', [_id]);

        return res.status(200).json({
            success: true,
            updatedData: updatedData[0]
        });
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message, 500));
    }
});

