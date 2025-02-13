// Here the code all product route will be there
import { Router, Request, Response } from "express";
import {
    addProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    udpateProduct
} from "../controllers/product.controller";

const router = Router();

router.post('/add-product', async (req: Request, res: Response) => {

    try {
        await addProduct(req, res);
    }
    catch (err: any) {
        // console.error(err.message);
        const statusCode = err.status;
        res.status(statusCode).json({
            message: 'Product add failed',
            error: err.message
        })
    };
});

router.get('/product-list', async (req: Request, res: Response) => {

    try {
        await getAllProducts(req, res);
    }
    catch (err: any) {
        const statusCode = err.status;
        res.status(statusCode).json({
            message: 'Retrive Product failed',
            error: err.message
        })
    };
});


router.patch('/update/:id', async (req: Request, res: Response) => {

    try {
        await udpateProduct(req, res);
    }
    catch (err: any) {
        res.status(err.statusCode).json({ message: 'Failed update product', error: err.mesasge });
    };
});


router.get('/product/:id', async (req: Request, res: Response) => {

    try {
        await getProductById(req, res);
    }
    catch (err: any) {
        res.status(err.statusCode).json({ message: 'Failed Get product', error: err.mesasge });
    }

});

router.delete('/delete/:id', async (req: Request, res: Response) => {

    try {
        await deleteProduct(req, res);

    }
    catch (err: any) {
        res.status(err.statusCode).json({ message: 'Failed delete product', error: err.mesasge });
    }

});

export default router;