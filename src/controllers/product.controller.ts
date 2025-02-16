// here the all ts file directly link to the database

import { Request, Response } from "express";
import db from '../config/db';


const addProduct = async (req: Request, res: Response): Promise<Response> => {

    try {
        const { name, description, price, stock } = req.body;

        if (!name || !description || !price || !stock) {
            return res.status(400).json({ message: 'Required all fields' });
        }

        if (isNaN(Number(price)) && isNaN(Number(stock)) || typeof name !== 'string' && typeof description !== 'string') {

            return res.status(400).json({ message: 'Please provide valid properties' });
        }


        await db.execute('INSERT INTO PRODUCTS (name, description, price, stock) VALUES(?,?,?,?)', [name, description, price, stock]);

        return res.status(201).json({ message: 'Product added sucessfully' });

    }
    catch (err: any) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

// Get all the products
const getAllProducts = async (req: Request, res: Response): Promise<Response> => {

    try {
        const [products] = await db.execute('SELECT * FROM PRODUCTS');

        return res.status(200).json({ data: products });
    }
    catch (err: any) {
        return res.status(500).json({ message: err.message });
    }

};


// Get the single product
const getProductById = async (req: Request, res: Response): Promise<Response> => {

    try {

        const id = req.params.id;

        if (isNaN(Number(id))) return res.status(200).json({ message: 'Please provide valid properties' });

        if (!id) return res.status(400).json({ message: 'Please provide the ID ' });


        const [rows]: any = await db.execute('SELECT * FROM PRODUCTS WHERE ID = ?', [Number(id)]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid Id 0r Product is not found' });
        }

        const product = rows[0];

        return res.status(200).json({ message: 'data retrived successfully', product });

    }

    catch (err: any) {

        return res.status(500).json({ message: err.message });
    }
};

// update the product by id
const udpateProduct = async (req: Request, res: Response): Promise<Response> => {

    try {

        const id = req.params.id;
        const { name, description, price, stock } = req.body;

        if (typeof description !== 'string' || typeof name !== 'string' || isNaN(Number(stock)) || isNaN(Number(price)) || isNaN(Number(id))) return res.status(400).json({ message: 'Please provide valid properties' });

        if (!id) return res.status(400).json({ message: 'Please provide the ID' });

        const [rows]: any = await db.execute('SELECT * FROM PRODUCTS WHERE ID = ?', [Number(id)]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid Id 0r Product is not found' });
        }

        await db.execute('UPDATE PRODUCTS SET name = ?, description = ?, price = ?, stock = ? WHERE ID = ?', [name, description, price, stock, Number(id)]);

        // Fetch the user from the db
        const [product]: any = await db.execute('SELECT * FROM PRODUCTS WHERE ID = ?', [Number(id)]);

        return res.status(200).json({ message: 'Product updated sucessfully', product });

    }
    catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};


// Delete the product
const deleteProduct = async (req: Request, res: Response): Promise<Response> => {

    try {
        const id = req.params.id;

        if (!id) return res.status(400).json({ messasge: 'Please provide the ID' });
        if (isNaN(Number(id))) return res.status(400).json({ message: 'Please provide valid properites' });

        await db.execute('DELETE FROM PRODUCTS WHERE ID = ?', [Number(id)]);

        return res.status(200).json({ message: 'Product deleted sucessfully' });
    }
    catch (err: any) {
        return res.status(500).json({ message: err.message });
    };
}

export { addProduct, getProductById, getAllProducts, udpateProduct, deleteProduct };
