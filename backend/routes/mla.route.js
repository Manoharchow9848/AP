import express from "express";
import { createMla, getmlas,deletemla,updateMla } from "../controllers/mla.controller.js";
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create',verifyToken,createMla)
router.get('/getmla',getmlas)
router.delete('/delete',verifyToken,deletemla)
router.put('/update',verifyToken,updateMla)


export default router;