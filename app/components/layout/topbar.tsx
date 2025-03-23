
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

const Topbar = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Optional animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="w-full bg-indigo-600 text-white py-2 relative">
      <div className="container mx-auto flex items-center justify-center">
        <Bell className="mr-2 h-4 w-4" />
        <p className="text-center font-medium">NOVO V PONUDBI</p>
      </div>
      <button
        onClick={handleClose}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200"
      >
        ×
      </button>
    </div>
  );
};

export default Topbar;