import dotenv from 'dotenv'
import express from 'express'
import userRoute from './routes/user.routes.js'
import adminRoute from './routes/store.routes.js'
import cookieParser from 'cookie-parser'
import errorMiddleware from './middlewares/error.middleware.js'
import { connectDB } from './utils/features.js'
import cors from "cors"

dotenv.config({
    path: './.env'
})

const PORT = process.env.PORT || 5000

const app = express();

connectDB(process.env.MONGODB_URI);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

app.use(errorMiddleware)

app.use('/api/v1/user', userRoute);
app.use('/api/v2/admin', adminRoute);

app.listen(PORT, () => console.log(`Server is running at PORT ${PORT}`));