import React, { useState, useEffect } from 'react';
import { FaHome, FaList } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import SvgComponent from '../become-a-host/SvgComponent';

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setActiveComponent: (component: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, toggleSidebar, setActiveComponent }) => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleItemClick = (component: string) => {
    setActiveItem(component);
    setActiveComponent(component);
    if (isSmallScreen) {
      toggleSidebar();
    }
  };

  const getItemClass = (item: string) => {
    const baseClass = "flex items-center px-4 py-3 text-gray-700 transition-colors duration-200";
    return activeItem === item
      ? `${baseClass} bg-pink-500 text-white`
      : `${baseClass} hover:bg-gray-200 hover:bg-opacity-30`;
  };

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-0 -ml-64'} md:ml-0 md:w-64 fixed h-full z-30`}>
      <div className="flex items-center justify-between p-3 bg-zinc-100">
        <div><SvgComponent /></div>
        {isSmallScreen && (
          <button onClick={toggleSidebar} className="text-gray-700">
            <IoIosArrowBack size={24} />
          </button>
        )}
      </div>
      <nav className="mt-6">
        <a href="#" onClick={() => handleItemClick('dashboard')} className={getItemClass('dashboard')}>
          <FaHome className="mr-3" />
          Dashboards
        </a>
        <a href="#" onClick={() => handleItemClick('myListings')} className={getItemClass('myListings')}>
          <FaList className="mr-3" />
          My listings
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;