import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { getDistrict ,getConstin} from '../controllers/district.controller.js';
const router = express.Router()

router.get('/districts',verifyToken,getDistrict);
router.get('/mandals/',verifyToken,getConstin);





export default router;