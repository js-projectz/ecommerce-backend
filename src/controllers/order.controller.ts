import { Request, Response } from "express";
import db from '../config/db';
import { ResultSetHeader } from "mysql2";

// add a new order 
const addOrder = async (req: Request, res: Response): Promise<Response> => {

    try {
        const { user_id, total_amount } = req.body;

        if (!user_id || !total_amount) return res.status(400).json({ message: 'Please provide all fields' });

        if (isNaN(Number(user_id) || Number(total_amount))) return res.status(401).json({ message: 'Please provide valid properites' });

        const [result] = await db.execute<ResultSetHeader>(
            'INSERT INTO ORDERS (user_id, total_amount) VALUES (?, ?)', [Number(user_id), Number(total_amount)]
        );

        return res.status(201).json({ message: 'Order created sucessfully', orderId: result.insertId });
    }
    catch (err: any) {
        return res.status(500).json({ error: err.message });
    }

};

// Get orders by user
const getOrdersByUser = async (req: Request, res: Response): Promise<Response> => {

    try {
        const { user_id } = req.params;


        if (!user_id) return res.status(400).json({ message: 'Please provide the UserID' });
        if (isNaN(Number(user_id))) return res.status(400).json({ message: 'please provide the valid properites' });


        const [orders] = await db.execute(
            'SELECT * FROM ORDERS WHERE ID = ?', [Number(user_id)]
        )

        return res.status(200).json({ message: "Data retrived sucessfully", orders });
    }

    catch (err: any) {
        return res.status(500).json({ error: err.message });

    }

};

// update the order
const updateOrderStatus = async (req: Request, res: Response): Promise<Response> => {

    try {

        const { id } = req.params;
        const { status } = req.body;

        if (!status || !id) return res.status(400).json({ message: 'please provide all Fields' });
        if (isNaN(Number(id)) || typeof status !== 'string') return res.status(400).json({ message: 'Please provide the valid properites' });

        await db.execute('UPDATE ORDERS SET status = ? WHERE ID = ?', [status, Number(id)]);

        return res.status(200).json({ message: 'Order status updated' });
    }
    catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};


// Delete the order
const deleteOrder = async (req: Request, res: Response): Promise<Response> => {

    try {
        const { id } = req.params;

        if (!id) return res.status(400).json({ message: 'Please provide the ID' });
        if (isNaN(Number(id))) return res.status(400).json({ message: 'Please provide the valid details' });

        await db.execute('DELETE FROM ORDERS WHERE ID = ?', [Number(id)]);

        return res.status(200).json({ message: 'Order deleted sucessfully' });
    }
    catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};

export { addOrder, updateOrderStatus, deleteOrder, getOrdersByUser };


