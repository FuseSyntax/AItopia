import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Package, Activity, FileText, LifeBuoy, Settings, Bell, Zap,
  Rocket, Crown, Gem, Sparkles, Wallet, BadgeCheck, BarChart, PieChart,
  LogOut, Cloud, Server, Database, Terminal, Shield, Clock, Download, Upload,
  Globe, CreditCard, CheckCircle2, X, Check
} from 'lucide-react';
import { LineChart, Line, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';


// Define a type for package data
type PackageType = {
  id: string;
  title: string;
  price: number;
  features: string[];
  toolsIncluded: number | string;
  gradient: string;
  recommended?: boolean;
};

// Define a type for user data from the database
type UserData = {
  name: string;
  email: string;
  lastLogin: string | null;
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { logout, user } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null); // State for user data
  const [loading, setLoading] = useState(true); // Loading state
  // New state for password change and account deletion
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<{
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsAlerts: boolean;
    theme: string;
  }>({
    emailNotifications: true,
    pushNotifications: false,
    smsAlerts: false,
    theme: 'Dark',
  });
  
  // Fetch current settings on mount
  useEffect(() => {
    if (!user) return;
    (async () => {
      const res = await fetch('http://localhost:5000/api/users/settings', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotificationSettings(data);
      }
    })();
  }, [user]);
  
  // Helper to update settings via PATCH
  const updateSettings = async (updates: Partial<typeof notificationSettings>) => {
    if (!user) return;
    const newSettings = { ...notificationSettings, ...updates };
    setNotificationSettings(newSettings);
  
    const res = await fetch('http://localhost:5000/api/users/settings', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(newSettings),
    });
    if (res.ok) {
      const data = await res.json();
      setNotificationSettings(data);
    }
  };
  
  // Toggle a notification setting
  const handleToggleNotification = (key: keyof Omit<typeof notificationSettings, 'theme'>) => {
    updateSettings({ [key]: !notificationSettings[key] });
  };
  
  // Change theme
  const handleThemeChange = (theme: string) => {
    updateSettings({ theme });
  };
  
  // Handler for changing password
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
      setPasswordError(error.message || 'Something went wrong');
    }
  };

  // Handler for deleting account
  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/delete-account', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete account');
      }

      logout(); // Log out the user after deletion
      router.push('/login'); // Redirect to login page
    } catch (error) {
      setPasswordError(error.message || 'Something went wrong');
    }
  };

  // Sample notifications and stats remain unchanged
  const [notifications] = useState([
    { id: 1, title: 'System Update', text: 'New security patches available', date: '2h ago', unread: true },
    { id: 2, title: 'Payment Success', text: 'Invoice #1234 paid successfully', date: '1d ago', unread: false },
  ]);

  const stats = [
    { id: 1, title: 'Total Usage Hours', value: 142, icon: <Clock className="w-6 h-6" />, change: '+12%' },
    { id: 2, title: 'Active Tools', value: 5, icon: <Terminal className="w-6 h-6" />, change: '+2' },
    { id: 3, title: 'Data Processed', value: '3.2TB', icon: <Database className="w-6 h-6" />, change: '+24%' },
    { id: 4, title: 'API Calls', value: '12.4K', icon: <Cloud className="w-6 h-6" />, change: '-3%' },
  ];

  const usageData = [
    { name: 'Mon', usage: 4, sessions: 12 },
    { name: 'Tue', usage: 6, sessions: 18 },
    { name: 'Wed', usage: 8, sessions: 24 },
    { name: 'Thu', usage: 5, sessions: 15 },
    { name: 'Fri', usage: 7, sessions: 21 },
    { name: 'Sat', usage: 9, sessions: 27 },
    { name: 'Sun', usage: 4, sessions: 12 },
  ];

  const toolUsageData = [
    { name: 'Artisan AI', value: 40, color: '#FF6B35' },
    { name: 'VoiceCraft', value: 30, color: '#FFA500' },
    { name: 'LingoSync', value: 20, color: '#FFD700' },
    { name: 'NeuroChat', value: 10, color: '#FFE4B5' },
  ];

  const recentActivity = [
    { id: 1, title: 'New Project Created', time: '15m ago', icon: <Rocket className="w-5 h-5" /> },
    { id: 2, title: 'Data Export Completed', time: '2h ago', icon: <Download className="w-5 h-5" /> },
    { id: 3, title: 'API Integration Added', time: '4h ago', icon: <Terminal className="w-5 h-5" /> },
    { id: 4, title: 'Security Audit Passed', time: '1d ago', icon: <Shield className="w-5 h-5" /> },
  ];

  // Define state for packages and selected package/tools/checkout visibility
  const [packages] = useState<PackageType[]>([
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
  ]);

  // Initialize selectedPackage to the "pro" package (if available)
  const [selectedPackage, setSelectedPackage] = useState<PackageType>(packages[1]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);

  // Handler to toggle selected tools
  const handleToolSelect = (tool: string, maxTools: number | string) => {
    if (typeof maxTools === 'number' && selectedTools.length >= maxTools && !selectedTools.includes(tool)) return;
    setSelectedTools(prev =>
      prev.includes(tool)
        ? prev.filter(t => t !== tool)
        : [...prev, tool]
    );
  };

  // Handler for package selection
  const handlePackageSelect = (pkgId: string) => {
    const pkg = packages.find(p => p.id === pkgId);
    if (pkg) {
      setSelectedPackage(pkg);
      setShowCheckout(true);
    }
  };

  // Dummy payment handlers (replace with your integrations)
  const handleStripePayment = async () => {
    alert('Stripe payment triggered');
  };

  const handleRazorpayPayment = () => {
    alert('Razorpay payment triggered');
  };

  const tabs = [
    { id: 'dashboard', icon: <BarChart />, label: 'Dashboard' },
    { id: 'profile', icon: <User />, label: 'Profile' },
    { id: 'package', icon: <Package />, label: 'Package' },
    { id: 'analysis', icon: <Activity />, label: 'Analytics' },
    { id: 'invoice', icon: <FileText />, label: 'Invoices' },
    { id: 'help', icon: <LifeBuoy />, label: 'Support' },
    { id: 'settings', icon: <Settings />, label: 'Settings' },
  ];

  // Fetch user data from the API
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${user.token}`, // Pass the token from AuthContext
          },
        });
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, router]);

  const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };
  
  const getColorFromHash = (hash: number): string => {
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 50%)`;
  };
  
  const generateAvatarSVG = (email: string): string => {
    const hash = hashString(email);
    const size = 128;
    const cells = 5;
    const cellSize = size / cells;
  
    const pattern: number[] = [];
    for (let i = 0; i < cells * cells; i++) {
      pattern.push((hash + i) % 2);
    }
  
    const color = getColorFromHash(hash);
    const svgCells = pattern.map((value, index) => {
      if (value === 0) return null;
      const x = (index % cells) * cellSize;
      const y = Math.floor(index / cells) * cellSize;
      return `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${color}" />`;
    }).filter(Boolean).join('');
  
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="#2D2D2D" />
        ${svgCells}
      </svg>
    `;
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();
      setUserData(data);
  
      const settingsResponse = await fetch('http://localhost:5000/api/users/settings', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const settingsData = await settingsResponse.json();
      setNotificationSettings(settingsData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-loos-wide text-3xl text-orange">Profile Settings</h2>
              <div className="flex items-center gap-3 text-green-400">
                <Shield className="w-5 h-5" />
                <span>Security Status: Excellent</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 lg:col-span-1">
                <div className="relative group">
                <div
              className="w-32 h-32 rounded-full bg-orange/20 flex items-center justify-center mx-auto overflow-hidden"
              dangerouslySetInnerHTML={{
                __html: userData?.email ? generateAvatarSVG(userData.email) : '<svg width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" fill="#2D2D2D"/></svg>',
              }}
            />
                  <div className="absolute bottom-0 right-0 p-2 bg-white/10 rounded-full cursor-pointer hover:bg-orange/20 transition-all">
                    <Upload className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-4 text-center">
                  <h3 className="font-loos-wide text-2xl">
                    {loading ? 'Loading...' : userData?.name || 'Unknown'}
                  </h3>
                  <p className="font-aeroport text-white/80">
                    {loading ? 'Loading...' : userData?.email || 'No email'}
                  </p>
                  <div className="flex justify-center gap-2">
                    <BadgeCheck className="w-6 h-6 text-blue-400" />
                    <Gem className="w-6 h-6 text-purple-400" />
                    <Sparkles className="w-6 h-6 text-pink-400" />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-8">
                <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                  <h3 className="font-loos-wide text-xl">Account Details</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { label: 'Full Name', value: loading ? 'Loading...' : userData?.name || 'Unknown', icon: <User /> },
                      { label: 'Email', value: loading ? 'Loading...' : userData?.email || 'No email', icon: <Cloud /> },
                      { label: '2FA', value: 'Enabled', icon: <Shield /> }, // Static for now
                      { label: 'Last Login', value: loading ? 'Loading...' : userData?.lastLogin ? new Date(userData.lastLogin).toLocaleString() : 'Never', icon: <Clock /> },
                    ].map((field, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-white/5 rounded-xl border border-white/10"
                      >
                        <div className="flex items-center gap-3 text-orange">
                          {field.icon}
                          <span className="font-aeroport text-white/80">{field.label}</span>
                        </div>
                        <p className="font-loos-wide mt-2">{field.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="font-loos-wide text-xl mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-400" />
                        <span>Two-Factor Authentication</span>
                      </div>
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-6 bg-white/10 rounded-full p-1 cursor-pointer"
                      >
                        <motion.div
                          className="w-4 h-4 bg-green-400 rounded-full shadow-lg"
                          animate={{ x: 24 }}
                        />
                      </motion.div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={logout}
                      className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-orange to-amber-500 text-black font-loos-wide text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Log Out</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'package':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-loos-wide text-3xl text-orange">AI Tool Packages</h2>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="font-aeroport">Current Plan: {selectedPackage.title} Tier</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  whileHover={{ scale: 1.05 }}
                  className={`relative backdrop-blur-lg bg-gradient-to-b ${pkg.gradient} border-2 ${pkg.recommended ? 'border-orange' : 'border-white/10'
                    } rounded-2xl p-8 space-y-6`}
                >
                  {pkg.recommended && (
                    <div className="absolute top-0 right-0 bg-orange text-black px-4 py-1 rounded-bl-xl rounded-tr-xl text-sm font-loos-wide">
                      Most Popular
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className="font-loos-wide text-2xl">{pkg.title}</h3>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl">${pkg.price}</span>
                      <span className="text-white/60">/{pkg.price ? 'month' : 'forever'}</span>
                    </div>

                    <ul className="space-y-3">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-loos-wide">Select Tools ({pkg.toolsIncluded})</span>
                      <span className="text-sm text-white/60">
                        {typeof pkg.toolsIncluded === 'number'
                          ? `${selectedTools.length}/${pkg.toolsIncluded}`
                          : 'Unlimited selections'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        'Artisan AI', 'VoiceCraft', 'LingoSync', 'NeuroChat',
                        'CodeForge', 'VisionX', 'DataMiner', 'QuantumCore'
                      ].map((tool) => (
                        <motion.div
                          key={tool}
                          whileTap={{ scale: 0.95 }}
                          className={`p-3 rounded-xl cursor-pointer transition-all ${selectedTools.includes(tool)
                            ? 'bg-orange text-black'
                            : 'bg-white/5 hover:bg-white/10'
                            } ${typeof pkg.toolsIncluded === 'number' &&
                              selectedTools.length >= pkg.toolsIncluded &&
                              !selectedTools.includes(tool)
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                            }`}
                          onClick={() => handleToolSelect(tool, pkg.toolsIncluded)}
                        >
                          <div className="flex items-center gap-3">
                            {selectedTools.includes(tool) && <Check className="w-4 h-4" />}
                            {tool}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className={`w-full py-3 rounded-xl font-loos-wide ${pkg.recommended
                      ? 'bg-orange text-black'
                      : 'bg-white/5 hover:bg-white/10'
                      }`}
                    onClick={() => handlePackageSelect(pkg.id)}
                  >
                    {pkg.price ? 'Upgrade Now' : 'Get Started'}
                  </motion.button>
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {showCheckout && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="bg-custom-black border-2 border-white/10 rounded-2xl p-8 max-w-xl w-full"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-2xl font-loos-wide">Checkout Summary</h3>
                      <X
                        className="cursor-pointer hover:text-orange transition-colors"
                        onClick={() => setShowCheckout(false)}
                      />
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white/5 p-6 rounded-xl">
                        <h4 className="font-loos-wide text-lg mb-4">{selectedPackage.title} Plan</h4>
                        <div className="flex items-center justify-between mb-4">
                          <span>Selected Tools:</span>
                          <span className="text-orange">{selectedTools.join(', ')}</span>
                        </div>
                        <div className="flex items-center justify-between text-xl">
                          <span>Total:</span>
                          <span className="font-loos-wide">${selectedPackage.price}/mo</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <input
                          type="email"
                          placeholder="billing@email.com"
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-orange"
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="py-3 bg-white/5 rounded-xl flex items-center justify-center gap-2"
                            onClick={handleStripePayment}
                          >
                            <CreditCard className="w-5 h-5" />
                            Credit Card
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="py-3 bg-blue-500/20 border border-blue-500/50 rounded-xl flex items-center justify-center gap-2"
                            onClick={handleRazorpayPayment}
                          >
                            <Globe className="w-5 h-5" />
                            Razorpay
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );



      case 'analysis':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <h2 className="font-loos-wide text-3xl text-orange">Advanced Analytics</h2>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-loos-wide text-xl mb-4">Performance Overview</h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={usageData}>
                      <Line
                        type="monotone"
                        dataKey="usage"
                        stroke="#FF6B35"
                        strokeWidth={2}
                        dot={{ fill: '#FF6B35', strokeWidth: 2 }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#2A2A2A',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-loos-wide text-xl mb-4">Resource Allocation</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={toolUsageData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {toolUsageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    {toolUsageData.map((tool, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ background: tool.color }}
                        />
                        <span className="font-aeroport">{tool.name}</span>
                        <span className="ml-auto font-loos-wide">{tool.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'invoice':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-loos-wide text-3xl text-orange">Billing History</h2>
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-6 py-3 bg-orange text-black rounded-xl"
                >
                  <Download className="w-5 h-5" />
                  Export Statements
                </motion.button>
              </div>
            </div>

            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-4 p-4 border-b border-white/10 font-loos-wide">
                <span>Date</span>
                <span>Description</span>
                <span>Amount</span>
                <span>Status</span>
              </div>
              <div className="divide-y divide-white/10">
                {[
                  { date: '2024-03-15', desc: 'Pro Subscription', amount: '$19.00', status: 'Paid' },
                  { date: '2024-02-15', desc: 'Pro Subscription', amount: '$19.00', status: 'Paid' },
                  { date: '2024-01-15', desc: 'Pro Subscription', amount: '$19.00', status: 'Paid' },
                ].map((invoice, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ background: 'rgba(255,255,255,0.03)' }}
                    className="grid grid-cols-4 p-4 cursor-pointer transition-all"
                  >
                    <span className="font-aeroport">{invoice.date}</span>
                    <span className="font-aeroport">{invoice.desc}</span>
                    <span className="font-loos-wide text-orange">{invoice.amount}</span>
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${invoice.status === 'Paid' ? 'bg-green-400' : 'bg-red-400'
                        }`} />
                      {invoice.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'help':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <h2 className="font-loos-wide text-3xl text-orange">Support Center</h2>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-loos-wide text-xl mb-6">Quick Assistance</h3>
                <div className="space-y-6">
                  <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="font-loos-wide text-lg mb-4">Common Solutions</h4>
                    <div className="space-y-3">
                      {['Password Reset', 'Billing Issues', 'API Documentation', 'Service Status'].map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer">
                          <LifeBuoy className="w-5 h-5 text-orange" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="font-loos-wide text-lg mb-4">Live Support</h4>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-green-400/20 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-green-400" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-loos-wide">Support Team Available</p>
                        <p className="font-aeroport text-white/60">Average response time: 2 minutes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-loos-wide text-xl mb-6">Contact Form</h3>
                <div className="space-y-6">
                  <input
                    type="text"
                    placeholder="Subject"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-orange"
                  />
                  <textarea
                    placeholder="Describe your issue..."
                    className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-orange"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="w-full py-4 bg-orange text-black rounded-xl font-loos-wide"
                  >
                    Send Message
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'dashboard':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-loos-wide text-3xl text-orange">Project Dashboard</h2>
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-6 py-3 bg-orange/20 text-orange rounded-xl"
                >
                  <Rocket className="w-5 h-5" />
                  New Project
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Active Projects', value: 8, icon: <Server />, color: '#FF6B35' },
                { title: 'Team Members', value: 24, icon: <User />, color: '#FFA500' },
                { title: 'Storage Used', value: '82%', icon: <Database />, color: '#FFD700' },
                { title: 'API Health', value: '98.9%', icon: <Terminal />, color: '#4CAF50' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-aeroport text-white/60">{stat.title}</p>
                      <h3 className="font-loos-wide text-3xl mt-2" style={{ color: stat.color }}>
                        {stat.value}
                      </h3>
                    </div>
                    <div className="p-3 rounded-xl bg-white/10" style={{ color: stat.color }}>
                      {stat.icon}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-loos-wide text-xl mb-4">Performance Metrics</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={usageData}>
                      <Line
                        type="monotone"
                        dataKey="usage"
                        stroke="#FF6B35"
                        strokeWidth={2}
                        dot={{ fill: '#FF6B35', strokeWidth: 2 }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#2A2A2A',
                          border: 'none',
                          borderRadius: '12px'
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-loos-wide text-xl mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    {
                      title: 'New Deployment',
                      time: '15m ago',
                      user: 'Sarah Chen',
                      icon: <Rocket className="w-5 h-5 text-green-400" />
                    },
                    {
                      title: 'API Update',
                      time: '2h ago',
                      user: 'Alex Turner',
                      icon: <Terminal className="w-5 h-5 text-blue-400" />
                    },
                    {
                      title: 'Security Audit',
                      time: '4h ago',
                      user: 'Security Team',
                      icon: <Shield className="w-5 h-5 text-purple-400" />
                    },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-xl"
                    >
                      <div className="p-3 rounded-lg bg-white/10">
                        {activity.icon}
                      </div>
                      <div>
                        <p className="font-loos-wide">{activity.title}</p>
                        <p className="font-aeroport text-sm text-white/60">
                          {activity.user} • {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

        case 'settings':
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <h2 className="font-loos-wide text-3xl text-orange">System Settings</h2>
              <div className="grid lg:grid-cols-2 gap-8">
               
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="font-loos-wide text-xl mb-6">Preferences</h3>
        <div className="space-y-6">

          {/* Theme Selector */}
          <div className="space-y-4">
            <label className="font-loos-wide">Theme</label>
            <div className="grid grid-cols-3 gap-4">
              {['Light', 'Dark', 'System'].map((th) => (
                <motion.div
                  key={th}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleThemeChange(th)}
                  className={`p-4 rounded-xl cursor-pointer text-center ${
                    notificationSettings.theme === th
                      ? 'bg-orange text-black'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {th}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Notification Toggles */}
          <div className="space-y-4">
            <label className="font-loos-wide">Notifications</label>
            <div className="space-y-3">
              {[
                { label: 'Email Notifications', key: 'emailNotifications' },
                { label: 'Push Notifications', key: 'pushNotifications' },
                { label: 'SMS Alerts', key: 'smsAlerts' },
              ].map((setting) => (
                <div
                  key={setting.key}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                >
                  <span>{setting.label}</span>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleToggleNotification(setting.key as any)}
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer ${
                      notificationSettings[setting.key as any]
                        ? 'bg-green-400'
                        : 'bg-white/10'
                    }`}
                  >
                    <motion.div
                      className="w-4 h-4 bg-white rounded-full shadow-lg"
                      animate={{
                        x: notificationSettings[setting.key as any] ? 24 : 0,
                      }}
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
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-orange"
                      />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-orange"
                      />
                      {passwordError && (
                        <p className="text-red-400 text-sm">{passwordError}</p>
                      )}
                      {passwordSuccess && (
                        <p className="text-green-400 text-sm">{passwordSuccess}</p>
                      )}
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
                      <p className="text-white/60 text-sm">
                        This action is irreversible. All your data will be permanently deleted.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDeleteAccount}
                        className={`w-full py-3 rounded-xl font-loos-wide ${deleteConfirm
                          ? 'bg-red-500 text-white'
                          : 'bg-white/5 text-red-400 hover:bg-white/10'
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

      default:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-96 flex items-center justify-center text-2xl text-white/40"
          >
            Select a tab to view content
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-custom-black mt-10">
      <main className="px-4 sm:px-0 sm:w-[90vw] md:w-[80vw] xl:w-[70vw] mx-auto py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Glowing Sidebar */}
          <div className="relative backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 h-fit group">
            <div className="absolute inset-0 bg-orange/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none" />
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange to-amber-500 text-black'
                    : 'hover:bg-white/10'
                    }`}
                >
                  {tab.icon}
                  <span className="font-loos-wide">{tab.label}</span>
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3 space-y-8">
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
