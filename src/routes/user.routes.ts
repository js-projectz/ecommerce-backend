import { Router, Request, Response } from 'express';
import {
    deleteProfile,
    getUserProfile,
    loginUser,
    registerUser,
    Updateprofile
} from '../controllers/user.controller';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    try {
        await registerUser(req, res);
    }
    catch (err: any) {
        const statusCode = err.status || 500;
        res.status(statusCode).json({
            message: "Register failed",
            error: err.message || "Something went wrong"
        });
    }
});
router.post('/login', async (req: Request, res: Response) => {

    try {
        await loginUser(req, res)
    }
    catch (err: any) {
        res.status(500).json({ message: "Login failed", error: (err as Error).message });
    }
});
router.get('/profile/:id', async (req: Request, res: Response) => {
    try {
        await getUserProfile(req, res);
    }
    catch (err: any) {

        res.status(500).json({ message: "Fetching profile failed", error: (err as Error).message });
    }
});

router.patch('/update/:id', async (req: Request, res: Response) => {

    try {

        await Updateprofile(req, res);
    }
    catch (err: any) {
        res.status(500).json({ message: 'Update profile failed', error: err.message });
    }
});


router.delete('/delete/:id', async (req: Request, res: Response) => {
    try {

        await deleteProfile(req, res);
    }
    catch (err: any) {
        res.status(res.statusCode || 500).json({ mesasge: 'Error while deleting', error: err.message });
    }

});

export default router;
