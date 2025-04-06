import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import {
  BarChart, User, Package, Activity, FileText, LifeBuoy, Settings, LogOut
} from 'lucide-react';
import ProfileTab from './tabs/ProfileTab';
import PackageTab from './tabs/PackageTab';
import AnalysisTab from './tabs/AnalysisTab';
import InvoiceTab from './tabs/InvoiceTab';
import HelpTab from './tabs/HelpTab';
import DashboardTab from './tabs/DashboardTab';
import SettingsTab from './tabs/SettingsTab';

// Define types
type PackageType = {
  id: string;
  title: string;
  price: number;
  features: string[];
  toolsIncluded: number | string;
  gradient: string;
  recommended?: boolean;
};

type UserData = {
  name: string;
  email: string;
  lastLogin: string | null;
};

type NotificationSettings = {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  theme: string;
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { logout, user } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: false,
    smsAlerts: false,
    theme: 'Dark',
  });
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const packages: PackageType[] = [
    {
      id: 'starter',
      title: 'Starter',
      price: 0,
      features: ['5 Tools Access', 'Basic AI Models', 'Community Support', '100 API Calls/Day'],
      toolsIncluded: 3,
      gradient: 'from-blue-500/20 to-purple-500/20',
    },
    {
      id: 'pro',
      title: 'Professional',
      price: 49,
      features: ['15 Tools Access', 'Advanced AI Models', 'Priority Support', 'Unlimited API Calls'],
      toolsIncluded: 8,
      gradient: 'from-orange/20 to-amber-500/20',
      recommended: true,
    },
    {
      id: 'enterprise',
      title: 'Enterprise',
      price: 149,
      features: ['Unlimited Tools', 'Custom AI Models', '24/7 Support', 'Dedicated Infrastructure'],
      toolsIncluded: 'Unlimited',
      gradient: 'from-emerald-500/20 to-cyan-500/20',
    },
  ];

  // Fetch user data and settings on mount
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, settingsRes, subRes] = await Promise.all([
          fetch('http://localhost:5000/api/users/profile', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          fetch('http://localhost:5000/api/users/settings', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          fetch('http://localhost:5000/api/users/subscription', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);

        if (profileRes.ok) setUserData(await profileRes.json());
        if (settingsRes.ok) setNotificationSettings(await settingsRes.json());
        if (subRes.ok) {
          const { plan, selectedTools } = await subRes.json();
          const pkg = packages.find(p => p.id === plan) || packages[1]; // Default to 'pro'
          setSelectedPackage(pkg);
          setSelectedTools(selectedTools);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const tabs = [
    { id: 'dashboard', icon: <BarChart />, label: 'Dashboard' },
    { id: 'profile', icon: <User />, label: 'Profile' },
    { id: 'package', icon: <Package />, label: 'Package' },
    { id: 'analysis', icon: <Activity />, label: 'Analytics' },
    { id: 'invoice', icon: <FileText />, label: 'Invoices' },
    { id: 'help', icon: <LifeBuoy />, label: 'Support' },
    { id: 'settings', icon: <Settings />, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-custom-black mt-10 flex items-center justify-center">
      <main className="px-4 sm:px-0 sm:w-[90vw] md:w-[80vw] xl:w-[70vw] mx-auto py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="relative backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 h-fit group">
            <div className="absolute inset-0 bg-orange/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none" />
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                    activeTab === tab.id ? 'bg-gradient-to-r from-orange to-amber-500 text-black' : 'hover:bg-white/10'
                  }`}
                >
                  {tab.icon}
                  <span className="font-loos-wide">{tab.label}</span>
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 mt-4"
              >
                <LogOut />
                <span className="font-loos-wide">Log Out</span>
              </motion.button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'dashboard' && <DashboardTab />}
                {activeTab === 'profile' && <ProfileTab userData={userData} loading={loading} />}
                {activeTab === 'package' && (
                  <PackageTab
                    packages={packages}
                    selectedPackage={selectedPackage}
                    setSelectedPackage={setSelectedPackage}
                    selectedTools={selectedTools}
                    setSelectedTools={setSelectedTools}
                    showCheckout={showCheckout}
                    setShowCheckout={setShowCheckout}
                    user={user}
                  />
                )}
                {activeTab === 'analysis' && <AnalysisTab />}
                {activeTab === 'invoice' && <InvoiceTab />}
                {activeTab === 'help' && <HelpTab />}
                {activeTab === 'settings' && (
                  <SettingsTab
                    notificationSettings={notificationSettings}
                    setNotificationSettings={setNotificationSettings}
                    newPassword={newPassword}
                    setNewPassword={setNewPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    passwordError={passwordError}
                    setPasswordError={setPasswordError}
                    passwordSuccess={passwordSuccess}
                    setPasswordSuccess={setPasswordSuccess}
                    deleteConfirm={deleteConfirm}
                    setDeleteConfirm={setDeleteConfirm}
                    user={user}
                    logout={logout}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;