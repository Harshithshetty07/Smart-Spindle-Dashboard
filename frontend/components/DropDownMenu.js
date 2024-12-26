import { useState } from 'react';
import { ChevronDown, Sparkles, User, Settings, HelpCircle, Home } from 'lucide-react';

const AnimatedDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', icon: Home, gradient: 'from-pink-500 to-purple-500' },
    { label: 'Profile', icon: User, gradient: 'from-blue-500 to-teal-500' },
    { label: 'Settings', icon: Settings, gradient: 'from-orange-500 to-pink-500' },
    { label: 'Help Center', icon: HelpCircle, gradient: 'from-green-500 to-blue-500' }
  ];

  return (
    <div className="relative inline-block text-left">
      {/* Animated Background Blur */}
      <div className={`absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 blur-xl opacity-20 transition-all duration-500 
        ${isOpen ? 'scale-150' : 'scale-100'}`} />

      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center justify-between w-56 px-6 py-3
                 bg-white bg-opacity-20 backdrop-blur-lg
                 border border-white border-opacity-20
                 rounded-2xl hover:bg-opacity-30
                 shadow-lg hover:shadow-xl
                 transition-all duration-300 ease-out
                 group"
      >
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span className="text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Choose Option
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-purple-500 transition-all duration-300
            ${isOpen ? 'rotate-180 scale-110' : 'rotate-0'}`}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 w-56 mt-4 origin-top-right
                   backdrop-blur-lg bg-white bg-opacity-10
                   border border-white border-opacity-20
                   rounded-2xl shadow-2xl
                   transition-all duration-300 ease-out
                   ${isOpen 
                     ? 'transform opacity-100 translate-y-0 scale-100' 
                     : 'transform opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}
      >
        <div className="py-2 space-y-1">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className="group flex items-center px-4 py-3 mx-2
                       text-sm text-gray-700 rounded-xl
                       hover:bg-white hover:bg-opacity-20
                       transition-all duration-300 ease-out"
            >
              <div className={`p-2 rounded-lg bg-gradient-to-r ${item.gradient} 
                            opacity-80 group-hover:opacity-100
                            transition-opacity duration-300`}>
                <item.icon className="w-4 h-4 text-white" />
              </div>
              <span className="ml-3 font-medium text-gray-700 group-hover:text-white
                             transition-colors duration-300">
                {item.label}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default AnimatedDropdown;