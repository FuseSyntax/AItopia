import { Router } from 'express';
import {
  signup, login, getProfile, updateProfile, changePassword, deleteAccount,
  getNotificationSettings, updateNotificationSettings,
  getSubscription, updateSubscription
} from '../controllers/userController.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.post('/change-password', changePassword);
router.delete('/delete-account', deleteAccount);
router.get('/settings', getNotificationSettings);
router.patch('/settings', updateNotificationSettings);
router.get('/subscription', getSubscription);
router.patch('/subscription', updateSubscription);

export default router;
