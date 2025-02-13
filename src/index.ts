import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import { authMiddleware } from './middlewares/auth.middleware';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';

dotenv.config();

const app = express();
app.use(cors({
    credentials: true,
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
}));
app.use(express.json());


app.use('/api/users', userRoutes);

// After login we are using auth for all
app.use(authMiddleware);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
