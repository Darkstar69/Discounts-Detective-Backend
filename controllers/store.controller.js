import asyncHandler from '../utils/asyncHandler.js'
import { ErrorHandler } from '../utils/errorHandler.js';
import { uploadFilesToCloudinary } from '../utils/features.js';
import { Brand } from '../model/brand.model.js';


export const storeDetailsAdd = asyncHandler(async(req, res, next) => {
    try {
        const {name} = req.body;
        const file = req.file;

        if(!name)
            return next(new ErrorHandler("Please Provide Name", 400));

        if(!file)
            return next(new ErrorHandler("Please upload brand icon", 400));

        const result = await uploadFilesToCloudinary([file]);

        const icon = {
            public_id: result[0].public_id,
            url: result[0].url
        }

        const isStore = await Brand.findOne({name});

        if(isStore)
            return next(new ErrorHandler('Store Already Exist', 400))

        const newStore = await Brand.create({
            name, 
            icon
        })

        if(!newStore)
            return next(new ErrorHandler("Store Not Get Added", 500))

        return res.status(200).json({
            success: true,
            newStore
        })


    } catch (error) {
        return new Error(error)
    }
})