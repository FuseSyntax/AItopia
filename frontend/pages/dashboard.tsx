import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Package, Activity, FileText, LifeBuoy, Settings, Bell, Zap,
  Rocket, Crown, Gem, Sparkles, Wallet, BadgeCheck, BarChart, PieChart,
  LogOut, Cloud, Server, Database, Terminal, Shield, Clock, Download, Upload
} from 'lucide-react';
import { LineChart, Line, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPackage, setSelectedPackage] = useState('pro');
  const [notifications] = useState([
    { id: 1, title: 'System Update', text: 'New security patches available', date: '2h ago', unread: true },
    { id: 2, title: 'Payment Success', text: 'Invoice #1234 paid successfully', date: '1d ago', unread: false },
  ]);

  // Animated stats
  const stats = [
    { id: 1, title: 'Total Usage Hours', value: 142, icon: <Clock className="w-6 h-6" />, change: '+12%' },
    { id: 2, title: 'Active Tools', value: 5, icon: <Terminal className="w-6 h-6" />, change: '+2' },
    { id: 3, title: 'Data Processed', value: '3.2TB', icon: <Database className="w-6 h-6" />, change: '+24%' },
    { id: 4, title: 'API Calls', value: '12.4K', icon: <Cloud className="w-6 h-6" />, change: '-3%' },
  ];

  // Enhanced mock data
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

  const tabs = [
    { id: 'dashboard', icon: <BarChart />, label: 'Dashboard' },
    { id: 'profile', icon: <User />, label: 'Profile' },
    { id: 'package', icon: <Package />, label: 'Package' },
    { id: 'analysis', icon: <Activity />, label: 'Analytics' },
    { id: 'invoice', icon: <FileText />, label: 'Invoices' },
    { id: 'help', icon: <LifeBuoy />, label: 'Support' },
    { id: 'settings', icon: <Settings />, label: 'Settings' },
  ];

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
                  <div className="w-32 h-32 rounded-full bg-orange/20 flex items-center justify-center mx-auto">
                    <User className="w-16 h-16 text-orange" />
                  </div>
                  <div className="absolute bottom-0 right-0 p-2 bg-white/10 rounded-full cursor-pointer hover:bg-orange/20 transition-all">
                    <Upload className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="space-y-4 text-center">
                  <h3 className="font-loos-wide text-2xl">John Doe</h3>
                  <p className="font-aeroport text-white/80">Senior AI Engineer</p>
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
                      { label: 'Full Name', value: 'John Doe', icon: <User /> },
                      { label: 'Email', value: 'john@progressors.com', icon: <Cloud /> },
                      { label: '2FA', value: 'Enabled', icon: <Shield /> },
                      { label: 'Last Login', value: '2h ago', icon: <Clock /> },
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
            <h2 className="font-loos-wide text-3xl text-orange">Subscription Plans</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  name: 'Starter', 
                  price: '$9', 
                  features: ['3 Tools', '20h/mo', 'Basic Support'], 
                  color: '#FFD700'
                },
                { 
                  name: 'Pro', 
                  price: '$19', 
                  features: ['5 Tools', '50h/mo', 'Priority Support', 'API Access'],
                  color: '#FFA500',
                  popular: true
                },
                { 
                  name: 'Enterprise', 
                  price: 'Custom', 
                  features: ['Unlimited Tools', '24/7 Support', 'Dedicated Server', 'SLA'],
                  color: '#FF6B35'
                }
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className={`relative backdrop-blur-lg bg-white/5 border rounded-2xl p-6 space-y-4 ${
                    plan.popular ? 'border-orange' : 'border-white/10'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-orange text-black px-4 py-1 rounded-bl-xl rounded-tr-xl text-sm">
                      Most Popular
                    </div>
                  )}
                  <h3 className="font-loos-wide text-2xl" style={{ color: plan.color }}>
                    {plan.name}
                  </h3>
                  <p className="font-aeroport text-3xl">{plan.price}<span className="text-white/60 text-lg">/month</span></p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-orange" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="w-full py-3 rounded-xl font-loos-wide"
                    style={{
                      background: plan.color,
                      color: index === 1 ? 'black' : 'white'
                    }}
                  >
                    {plan.popular ? 'Current Plan' : 'Upgrade Now'}
                  </motion.button>
                </motion.div>
              ))}
            </div>
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
                      <div className={`w-2 h-2 rounded-full ${
                        invoice.status === 'Paid' ? 'bg-green-400' : 'bg-red-400'
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
            <div className="space-y-4">
              <label className="font-loos-wide">Theme</label>
              <div className="grid grid-cols-3 gap-4">
                {['Light', 'Dark', 'System'].map((theme, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className={`p-4 rounded-xl cursor-pointer ${
                      theme === 'Dark' 
                        ? 'bg-orange text-black' 
                        : 'bg-white/5 hover:bg-white/10'
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
                  { label: 'Email Notifications', enabled: true },
                  { label: 'Push Notifications', enabled: false },
                  { label: 'SMS Alerts', enabled: false },
                ].map((setting, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span>{setting.label}</span>
                    <motion.div 
                      whileTap={{ scale: 0.95 }}
                      className={`w-12 h-6 rounded-full p-1 cursor-pointer ${
                        setting.enabled ? 'bg-green-400' : 'bg-white/10'
                      }`}
                    >
                      <motion.div 
                        className="w-4 h-4 bg-white rounded-full shadow-lg"
                        animate={{ x: setting.enabled ? 24 : 0 }}
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
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-orange"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-orange"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="w-full py-3 bg-orange text-black rounded-xl font-loos-wide"
              >
                Update Password
              </motion.button>
            </div>

            <div className="space-y-4">
              <label className="font-loos-wide">Active Sessions</label>
              <div className="space-y-3">
                {[
                  { device: 'MacBook Pro', location: 'New York, US', active: true },
                  { device: 'iPhone 15', location: 'London, UK', active: false },
                ].map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div>
                      <p>{session.device}</p>
                      <p className="text-sm text-white/60">{session.location}</p>
                    </div>
                    {session.active ? (
                      <div className="flex items-center gap-2 text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Active
                      </div>
                    ) : (
                      <button className="text-red-400 hover:text-red-300">
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
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
    <div className="min-h-screen bg-custom-black">
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
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                    activeTab === tab.id
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