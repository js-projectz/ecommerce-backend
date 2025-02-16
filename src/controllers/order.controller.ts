import { Request, Response } from "express";
import db from "../config/db";
import { ResultSetHeader } from "mysql2";


const addOrder = async (req: Request, res: Response): Promise<Response> => {
    const connection = await db.getConnection();
    try {
        const { user_id, items } = req.body; // items: [{ product_id, quantity, price }]

        if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Please provide user_id and items" });
        }

        const total_amount = items.reduce((sum: number, item: any) => {
            if (!item.product_id || !item.quantity || !item.price) {
                throw new Error("Invalid item structure. Each item needs product_id, quantity, and price.");
            }
            return sum + item.quantity * item.price;
        }, 0);

   
        await connection.beginTransaction();


        const [orderResult]: [ResultSetHeader, any] = await connection.execute(
            "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)",
            [user_id, total_amount]
        );

        const orderId = orderResult.insertId;

    
        const orderItemsPromises = items.map((item: any) => {
            return connection.execute(
                "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
                [orderId, item.product_id, item.quantity, item.price]
            );
        });

        await Promise.all(orderItemsPromises);

   
        await connection.commit();

        return res.status(201).json({ message: "Order created successfully", orderId, total_amount });
    } catch (error: any) {
        await connection.rollback();
        return res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// Get orders by user
const getOrdersByUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { user_id } = req.params;

        if (!user_id || isNaN(Number(user_id))) {
            return res.status(400).json({ message: "Please provide a valid user ID" });
        }

        const [orders] = await db.execute(
            `SELECT o.id AS order_id, o.total_amount, o.status, o.created_at,
                oi.product_id, oi.quantity, oi.price
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            WHERE o.user_id = ?`,
            [Number(user_id)]
        );

        return res.status(200).json({ message: "Orders retrieved successfully", orders });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

// Update order status
const updateOrderStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id || isNaN(Number(id)) || !status) {
            return res.status(400).json({ message: "Please provide a valid order ID and status" });
        }

        const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        await db.execute("UPDATE orders SET status = ? WHERE id = ?", [status, Number(id)]);

        return res.status(200).json({ message: "Order status updated successfully" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

// Delete order (cascades to order_items if foreign key constraint is set)
const deleteOrder = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ message: "Please provide a valid order ID" });
        }

        await db.execute("DELETE FROM orders WHERE id = ?", [Number(id)]);

        return res.status(200).json({ message: "Order deleted successfully" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export { addOrder, getOrdersByUser, updateOrderStatus, deleteOrder };
