import express from "express";
import { isAdmin, isAuthenticated } from '../middlewares/isAuthenticated.js'
import { multipleUpload } from "../middlewares/multer.js";
import { addProduct, deleteProduct, getAllProduct, updateProduct } from "../controllers/productController.js";

const router = express.Router();

router.post('/add', isAuthenticated, isAdmin, multipleUpload, addProduct);
router.get('/getallproducts', getAllProduct);
router.delete('/delete/:productId', isAuthenticated, isAdmin, deleteProduct);
router.put('/update/:productId', isAuthenticated, isAdmin, multipleUpload, updateProduct);

export default router;

