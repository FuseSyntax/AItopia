import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { loadRazorpayScript } from '../../components/razorpayUtils';
import StripePaymentForm from '../../components/StripePaymentForm';

type PackageType = {
  id: string;
  title: string;
  price: number;
  features: string[];
  toolsIncluded: number | string;
  gradient: string;
  recommended?: boolean;
};

type Props = {
  packages: PackageType[];
  selectedPackage: PackageType | null;
  setSelectedPackage: (pkg: PackageType) => void;
  selectedTools: string[];
  setSelectedTools: (tools: string[]) => void;
  showCheckout: boolean;
  setShowCheckout: (show: boolean) => void;
  user: any; // Replace with proper user type
};

const allTools = [
  'Artisan AI', 'VoiceCraft', 'LingoSync', 'NeuroChat', 'CodeForge',
  'VisionX', 'DataMiner', 'QuantumCore', 'TextGenix', 'ImageSynth'
];

const CheckoutModal: React.FC<{
  selectedPackage: PackageType;
  allTools: string[];
  onConfirm: (selectedTools: string[]) => void;
  onClose: () => void;
  user: any;
}> = ({ selectedPackage, allTools, onConfirm, onClose, user }) => {
  const [step, setStep] = useState<'selectTools' | 'payment'>('selectTools');
  const [localSelectedTools, setLocalSelectedTools] = useState<string[]>([]);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleToolSelect = (tool: string) => {
    const limit = selectedPackage.toolsIncluded;
    if (limit === 'Unlimited' || localSelectedTools.length < (limit as number)) {
      setLocalSelectedTools(prev =>
        prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
      );
    } else if (localSelectedTools.includes(tool)) {
      setLocalSelectedTools(prev => prev.filter(t => t !== tool));
    }
  };

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handleStripeSuccess = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/subscription`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ plan: selectedPackage.id, selectedTools: localSelectedTools }),
      });
      if (res.ok) {
        onConfirm(localSelectedTools);
        onClose();
      } else {
        setPaymentError('Failed to update subscription');
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      setPaymentError('Something went wrong');
    }
  };

  const handleRazorpayPayment = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      setPaymentError('Razorpay SDK failed to load');
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID,
      amount: selectedPackage.price * 100, // Convert to paise (INR)
      currency: 'INR',
      name: 'AItopia',
      description: `${selectedPackage.title} Plan`,
      handler: async (response: any) => {
        try {
          const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/verify-razorpay-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyResponse.json();
          if (verifyData.success) {
            await handleStripeSuccess(); // Reuse the same subscription update logic
          } else {
            setPaymentError('Payment verification failed');
          }
        } catch (error) {
          console.error('Error verifying Razorpay payment:', error);
          setPaymentError('Payment verification failed');
        }
      },
      prefill: {
        name: user?.name || 'User',
        email: user?.email || '',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => setPaymentError('Payment failed'));
    rzp.open();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-custom-black border border-white/10 rounded-2xl p-8 max-w-xl w-full space-y-6"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-loos-wide">
            {step === 'selectTools' ? 'Select Tools' : 'Choose Payment Method'}
          </h3>
          <X className="cursor-pointer hover:text-orange" onClick={onClose} />
        </div>
        {step === 'selectTools' ? (
          <div className="space-y-4">
            <div className="bg-white/5 p-6 rounded-xl space-y-4">
              <h4 className="font-loos-wide text-lg">{selectedPackage.title} Plan</h4>
              <div className="flex justify-between">
                <span>Price:</span>
                <span className="font-loos-wide">${selectedPackage.price}/mo</span>
              </div>
              <div className="space-y-2">
                <span>
                  Select Tools (
                  {selectedPackage.toolsIncluded === 'Unlimited'
                    ? 'Unlimited'
                    : `Up to ${selectedPackage.toolsIncluded}`}
                  )
                </span>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {allTools.map(tool => (
                    <motion.div
                      key={tool}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 rounded-lg cursor-pointer transition-all ${
                        localSelectedTools.includes(tool) ? 'bg-orange text-black' : 'bg-white/5 hover:bg-white/10'
                      } ${
                        selectedPackage.toolsIncluded !== 'Unlimited' &&
                        localSelectedTools.length >= (selectedPackage.toolsIncluded as number) &&
                        !localSelectedTools.includes(tool)
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                      onClick={() => handleToolSelect(tool)}
                    >
                      <div className="flex items-center gap-2">
                        {localSelectedTools.includes(tool) && <CheckCircle2 className="w-4 h-4" />}
                        {tool}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full py-3 rounded-xl font-loos-wide bg-orange text-black"
              onClick={handleProceedToPayment}
            >
              Proceed to Payment
            </motion.button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white/5 p-6 rounded-xl">
              <h4 className="font-loos-wide text-lg mb-2">Payment for {selectedPackage.title} Plan</h4>
              <div className="flex justify-between mb-2">
                <span>Tools Selected:</span>
                <span className="text-orange">{localSelectedTools.length}</span>
              </div>
              <div className="flex justify-between text-xl">
                <span>Total:</span>
                <span className="font-loos-wide">${selectedPackage.price}/mo</span>
              </div>
            </div>
            {paymentError && <p className="text-red-500">{paymentError}</p>}
            <div className="space-y-4">
              <StripePaymentForm
                onSuccess={handleStripeSuccess}
                amount={selectedPackage.price * 100} // Convert to cents
                currency="usd"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="w-full py-3 rounded-xl font-loos-wide bg-green-500 text-white"
                onClick={handleRazorpayPayment}
              >
                Pay with Razorpay
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const PackageTab: React.FC<Props> = ({
  packages,
  selectedPackage,
  setSelectedPackage,
  selectedTools,
  setSelectedTools,
  showCheckout,
  setShowCheckout,
  user,
}) => {
  const handleSelectPlan = (pkg: PackageType) => {
    setSelectedPackage(pkg);
    setSelectedTools([]); // Reset tools when selecting a new package
    setShowCheckout(true);
  };

  const handleConfirmSubscription = (tools: string[]) => {
    setSelectedTools(tools);
    setShowCheckout(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="font-loos-wide text-3xl text-orange">AI Tool Packages</h2>
        <div className="px-4 py-2 bg-white/5 rounded-xl flex items-center gap-2">
          <span className="font-aeroport">Current Plan: {selectedPackage?.title || 'None'} Tier</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {packages.map(pkg => (
          <motion.div
            key={pkg.id}
            whileHover={{ scale: 1.05 }}
            className={`relative backdrop-blur-lg bg-gradient-to-b ${pkg.gradient} border-2 ${
              pkg.id === selectedPackage?.id ? 'border-orange' : 'border-white/10'
            } rounded-2xl p-8 space-y-6`}
          >
            {pkg.recommended && (
              <div className="absolute top-0 right-0 bg-orange text-black px-4 py-1 rounded-bl-xl rounded-tr-xl text-sm">
                Most Popular
              </div>
            )}
            <h3 className="font-loos-wide text-2xl">{pkg.title}</h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl">${pkg.price}</span>
              <span className="text-white/60">/{pkg.price ? 'month' : 'forever'}</span>
            </div>
            <ul className="space-y-2">
              {pkg.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  {f}
                </li>
              ))}
            </ul>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full py-3 rounded-xl font-loos-wide bg-white/5 hover:bg-white/10"
              onClick={() => handleSelectPlan(pkg)}
            >
              {pkg.id === selectedPackage?.id ? 'Manage Plan' : 'Select Plan'}
            </motion.button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showCheckout && selectedPackage && (
          <CheckoutModal
            selectedPackage={selectedPackage}
            allTools={allTools}
            onConfirm={handleConfirmSubscription}
            onClose={() => setShowCheckout(false)}
            user={user}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PackageTab;