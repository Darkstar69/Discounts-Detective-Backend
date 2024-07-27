import express from 'express';
import {
    couponsAdd,
    deleteCoupon,
    deleteStore,
    getAllCoupons,
    getAllStores,
    storeDetailsAdd,
    updateCoupon,
    updateStore
} from "../controllers/store.controller.js";

const router = express.Router();

router.post('/storeDetailsAdd', storeDetailsAdd);
router.get('/getStores', getAllStores);
router.get('/updateStore', updateStore);
router.get('/deleteStore', deleteStore);
router.get('/getAllCoupons', getAllCoupons);
router.post('/couponsAdd', couponsAdd);
router.get('/deleteCoupon', deleteCoupon);
router.post('/updateCoupon', updateCoupon);

export default router;