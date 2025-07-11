import express, { urlencoded } from 'express';
import path from 'path';
import cors from 'cors';
import { router } from './routes/product.routes';
import userRouter from './routes/userRoutes';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });


const app = express();
app.use(cors());
app.use(urlencoded({ extended: true }));


app.use(express.json())

app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/app/product', router)
app.use('/app/user', userRouter);

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})