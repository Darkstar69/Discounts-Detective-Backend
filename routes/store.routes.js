import express from 'express';
import { storeDetailsAdd } from "../controllers/store.controller.js";

const router = express.Router();

router.post('/storeDetailsAdd', storeDetailsAdd);