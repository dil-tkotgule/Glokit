import express, { urlencoded } from 'express';
import path from 'path';
import cors from 'cors';
import { router } from './routes/product.routes';

const app = express();
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/app/product', router)

app.listen(3000, ()=>{
    console.log('server is started')
})