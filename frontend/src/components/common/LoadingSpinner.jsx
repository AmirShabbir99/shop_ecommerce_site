import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner = ({ size = 'md', color = 'brand' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        className={`${sizes[size]} border-2 border-gray-200 border-t-brand rounded-full`}
      />
    </div>
  );
};

export const ProductSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-44 bg-gray-100" />
    <div className="p-4 space-y-2">
      <div className="h-2 bg-gray-100 rounded w-1/4" />
      <div className="h-3 bg-gray-100 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-4 bg-gray-100 rounded w-1/3" />
      <div className="h-8 bg-gray-100 rounded-lg mt-3" />
    </div>
  </div>
);

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-3 text-gray-500 text-sm">Loading...</p>
    </div>
  </div>
);

export default LoadingSpinner;
