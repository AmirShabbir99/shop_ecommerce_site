import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiGlobe, FiBell, FiShield, FiCreditCard } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SettingSection = ({ icon: Icon, title, children }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
      <Icon size={16} className="text-gray-500" />
      <h2 className="font-semibold text-sm">{title}</h2>
    </div>
    {children}
  </div>
);

const AdminSettings = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    toast.success('Settings saved!');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-7">
        <h1 className="font-display text-2xl">Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Configure your store</p>
      </div>

      <SettingSection icon={FiGlobe} title="Store Information">
        <div className="space-y-4">
          <div><label className="label">Store Name</label><input defaultValue="Luxora" className="input-field" /></div>
          <div><label className="label">Store Email</label><input type="email" defaultValue="admin@luxora.com" className="input-field" /></div>
          <div><label className="label">Store URL</label><input defaultValue="https://luxora.com" className="input-field" /></div>
          <div><label className="label">Currency</label>
            <select className="input-field">
              <option>USD - US Dollar</option><option>PKR - Pakistani Rupee</option><option>GBP - British Pound</option><option>AED - UAE Dirham</option>
            </select>
          </div>
        </div>
      </SettingSection>

      <SettingSection icon={FiCreditCard} title="Payment Methods">
        {['Cash on Delivery (COD)', 'JazzCash', 'EasyPaisa', 'Credit / Debit Card'].map(pm => (
          <label key={pm} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0 cursor-pointer">
            <span className="text-sm text-gray-700">{pm}</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand" />
          </label>
        ))}
      </SettingSection>

      <SettingSection icon={FiBell} title="Notifications">
        {[
          { label: 'New order placed',       desc: 'Get notified for every new order' },
          { label: 'Low stock alert',        desc: 'Alert when stock falls below 5' },
          { label: 'New user registration',  desc: 'Notify on new signups' },
          { label: 'Order status updates',   desc: 'Updates on shipping changes' },
        ].map(({ label, desc }) => (
          <label key={label} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0 cursor-pointer gap-3">
            <div>
              <p className="text-sm font-medium text-gray-700">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 mt-0.5 accent-brand flex-shrink-0" />
          </label>
        ))}
      </SettingSection>

      <SettingSection icon={FiShield} title="Security">
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-700">Two-factor Authentication</p>
              <p className="text-xs text-gray-400">Extra security for admin accounts</p>
            </div>
            <input type="checkbox" className="w-4 h-4 accent-brand" />
          </label>
          <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-700">Session timeout</p>
              <p className="text-xs text-gray-400">Auto-logout after 30 days</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand" />
          </label>
        </div>
      </SettingSection>

      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${saved ? 'bg-green-600 text-white' : 'bg-brand text-white hover:bg-gray-800'}`}
      >
        <FiSave size={14} /> {saved ? 'Saved!' : 'Save Settings'}
      </motion.button>
    </div>
  );
};

export default AdminSettings;
