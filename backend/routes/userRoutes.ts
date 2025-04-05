// backend/routes/userRoutes.ts
import { Router } from 'express';
import { signup, login, getProfile, changePassword, deleteAccount, updateNotificationSettings, getNotificationSettings } from '../controllers/userController.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', getProfile);
router.post('/change-password', changePassword);
router.delete('/delete-account', deleteAccount);
router.get('/settings', getNotificationSettings);
router.patch('/settings', updateNotificationSettings);

export default router;
