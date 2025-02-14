import { Router, Request, Response } from "express";
import {
    addOrder,
    deleteOrder,
    getOrdersByUser,
    updateOrderStatus
} from "../controllers/order.controller";

const router = Router();

router.post('/add-order', async (req: Request, res: Response) => {

    try {
        if (req.method !== 'post') {
            res.status(405).json({ message: 'Method Not Allowed. Use POST.' });
            return;
        }
        await addOrder(req, res);
    }
    catch (err: any) {
        res.status(err.statusCode).json({ message: 'Failed add order', error: err.mesasge });
        return;
    }
});

router.get('/list-order/:user_id', async (req: Request, res: Response) => {

    try {
        await getOrdersByUser(req, res);

    }
    catch (err: any) {
        res.status(err.statusCode).json({ message: 'Failed get orders', error: err.mesasge });
    }

});

router.patch('/update-order-status/:id', async (req: Request, res: Response) => {

    try {
        await updateOrderStatus(req, res);
    }
    catch (err: any) {
        res.status(err.statusCode).json({ message: 'Failed update order status', error: err.mesasge });
    }

});


router.delete('/delete-order/:id', async (req: Request, res: Response) => {

    try {
        await deleteOrder(req, res);
    }
    catch (err: any) {
        res.status(err.statusCode).json({ message: 'Failed delete order', error: err.mesasge });
    }
});

export default router;