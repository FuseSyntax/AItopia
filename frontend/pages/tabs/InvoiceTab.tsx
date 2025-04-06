import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

const InvoiceTab: React.FC = () => {
  const invoices = [
    { date: '2024-03-15', desc: 'Pro Subscription', amount: '$19.00', status: 'Paid' },
    { date: '2024-02-15', desc: 'Pro Subscription', amount: '$19.00', status: 'Paid' },
    { date: '2024-01-15', desc: 'Pro Subscription', amount: '$19.00', status: 'Paid' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-loos-wide text-3xl text-orange">Billing History</h2>
        <motion.button whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-6 py-3 bg-orange text-black rounded-xl">
          <Download className="w-5 h-5" />
          Export Statements
        </motion.button>
      </div>
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-4 p-4 border-b border-white/10 font-loos-wide">
          <span>Date</span>
          <span>Description</span>
          <span>Amount</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-white/10">
          {invoices.map((invoice, index) => (
            <motion.div
              key={index}
              whileHover={{ background: 'rgba(255,255,255,0.03)' }}
              className="grid grid-cols-4 p-4 cursor-pointer transition-all"
            >
              <span className="font-aeroport">{invoice.date}</span>
              <span className="font-aeroport">{invoice.desc}</span>
              <span className="font-loos-wide text-orange">{invoice.amount}</span>
              <span className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${invoice.status === 'Paid' ? 'bg-green-400' : 'bg-red-400'}`} />
                {invoice.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default InvoiceTab;