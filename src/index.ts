import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import { authMiddleware } from './middlewares/auth.middleware';

dotenv.config();

const app = express();
app.use(cors({
    credentials: true
}));
app.use(express.json());


app.use('/api/users', userRoutes);
app.use(authMiddleware);
// app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
