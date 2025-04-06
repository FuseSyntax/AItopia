import React from 'react';
import { motion } from 'framer-motion';

type NotificationSettings = {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  theme: string;
};

type Props = {
  notificationSettings: NotificationSettings;
  setNotificationSettings: (settings: NotificationSettings) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  passwordError: string;
  setPasswordError: (value: string) => void;
  passwordSuccess: string;
  setPasswordSuccess: (value: string) => void;
  deleteConfirm: boolean;
  setDeleteConfirm: (value: boolean) => void;
  user: any; // Replace with proper user type
  logout: () => void;
};

const SettingsTab: React.FC<Props> = ({
  notificationSettings,
  setNotificationSettings,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  passwordError,
  setPasswordError,
  passwordSuccess,
  setPasswordSuccess,
  deleteConfirm,
  setDeleteConfirm,
  user,
  logout,
}) => {
  const updateSettings = async (updates: Partial<NotificationSettings>) => {
    if (!user) return;
    const newSettings = { ...notificationSettings, ...updates };
    setNotificationSettings(newSettings);
    try {
      const res = await fetch('http://localhost:5000/api/users/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newSettings),
      });
      if (!res.ok) throw new Error('Failed to update settings');
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleToggleNotification = (key: keyof Omit<NotificationSettings, 'theme'>) => {
    updateSettings({ [key]: !notificationSettings[key] });
  };

  const handleThemeChange = (theme: string) => {
    updateSettings({ theme });
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }

      setPasswordSuccess('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordError((error as Error).message || 'Something went wrong');
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/delete-account', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete account');
      }

      logout();
    } catch (error) {
      setPasswordError((error as Error).message || 'Something went wrong');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h2 className="font-loos-wide text-3xl text-orange">System Settings</h2>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-loos-wide text-xl mb-6">Preferences</h3>
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="font-loos-wide">Theme</label>
              <div className="grid grid-cols-3 gap-4">
                {['Light', 'Dark', 'System'].map(theme => (
                  <motion.div
                    key={theme}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleThemeChange(theme)}
                    className={`p-4 rounded-xl cursor-pointer text-center ${
                      notificationSettings.theme === theme ? 'bg-orange text-black' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {theme}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="font-loos-wide">Notifications</label>
              <div className="space-y-3">
                {[
                  { label: 'Email Notifications', key: 'emailNotifications' },
                  { label: 'Push Notifications', key: 'pushNotifications' },
                  { label: 'SMS Alerts', key: 'smsAlerts' },
                ].map(setting => (
                  <div key={setting.key} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span>{setting.label}</span>
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggleNotification(setting.key as any)}
                      className={`w-12 h-6 rounded-full p-1 cursor-pointer ${
                        notificationSettings[setting.key as any] ? 'bg-green-400' : 'bg-white/10'
                      }`}
                    >
                      <motion.div
                        className="w-4 h-4 bg-white rounded-full shadow-lg"
                        animate={{ x: notificationSettings[setting.key as any] ? 24 : 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      />
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-loos-wide text-xl mb-6">Account Security</h3>
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="font-loos-wide">Change Password</label>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-orange"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-orange"
              />
              {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
              {passwordSuccess && <p className="text-green-400 text-sm">{passwordSuccess}</p>}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleChangePassword}
                className="w-full py-3 bg-orange text-black rounded-xl font-loos-wide"
              >
                Update Password
              </motion.button>
            </div>
            <div className="space-y-4">
              <label className="font-loos-wide">Delete Account</label>
              <p className="text-white/60 text-sm">This action is irreversible. All your data will be permanently deleted.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeleteAccount}
                className={`w-full py-3 rounded-xl font-loos-wide ${
                  deleteConfirm ? 'bg-red-500 text-white' : 'bg-white/5 text-red-400 hover:bg-white/10'
                }`}
              >
                {deleteConfirm ? 'Confirm Deletion' : 'Delete Account'}
              </motion.button>
              {deleteConfirm && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDeleteConfirm(false)}
                  className="w-full py-3 bg-white/5 text-white rounded-xl font-loos-wide hover:bg-white/10"
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsTab;