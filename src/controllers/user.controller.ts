import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import dotenv from 'dotenv';

dotenv.config();

const registerUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) return res.json(400).json({ message: "All Fields Required" });

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

        return res.status(201).json({ code: res.statusCode, message: "User register sucessfully" });

    } catch (error) {
        return res.status(500).json({ error: 'Error registering user' });

    }
};

const loginUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;
        const [rows]: any = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });

        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });

        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        return res.status(200).json({ message: 'Login successful', token });


    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

// get the user profile
const getUserProfile = async (req: Request, res: Response): Promise<void | Response> => {

    try {

        const id = req.params.id;

        if (!id) return res.json({ message: "Please Provide ID" });


        // Get the user
        const [rows]: any = await pool.execute(`SELECT * FROM USERS WHERE ID = ?`, [parseInt(id)]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid Id 0r User is not found' });
        }

        const profile = rows[0];

        return res.json({ Data: { message: "data retrived successfully", profile } });
    }
    catch (err: any) {
        return res.json({ Data: { message: err.message } });
    }
};

// Update the user profile
const Updateprofile = async (req: Request, res: Response): Promise<Response> => {

    try {

        const id = req.params.id;
        const { name, email } = req.body;

        if (typeof name !== 'string' || typeof email !== 'string' || isNaN(Number(id))) return res.status(400).json({ message: 'Please provide valid properties' });


        // Check if user exists before updating
        const [existingUser]: any = await pool.execute('SELECT * FROM USERS WHERE id = ?', [Number(id)]);

        if (existingUser.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        await pool.execute('UPDATE USERS SET email = ? , name = ? WHERE ID = ?', [name, email, Number(id)]);

        const [updatedUser]: any = await pool.execute('SELECT * FROM USERS WHERE id = ?', [id]);

        if (updatedUser.length > 0) {
            return res.json(updatedUser[0]);
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    }
    catch (err: any) {
        return res.status(500).json({ message: "Database error", error: err.message });
    }
};


// Delete the profile
const deleteProfile = async (req: Request, res: Response): Promise<Response> => {

    try {

        const id = req.params.id;

        if (isNaN(Number(id))) return res.status(400).json({ message: 'id is no valid' });

        const [rows]: any = await pool.execute('DELETE FROM USERS WHERE ID = ?', [Number(id)]);

        if (rows.affectedRows === 0) {
            return res.status(400).json({ message: 'Id Does not exists' });
        }

        return res.status(200).json({ mesasge: 'User delete sucessfully' });
    }
    catch (err: any) {
        return res.status(500).json({ message: 'DB error', error: err.message });
    }

};

export { registerUser, loginUser, getUserProfile, Updateprofile, deleteProfile };
