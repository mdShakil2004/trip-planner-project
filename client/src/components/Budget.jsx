import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const Budget = () => {
  const { budgetHistory, setBudgetHistory } = useContext(AppContext);

  useEffect(() => {
    // localStorage.setItem('budgetHistory', '');
  }, [budgetHistory]);

  const handleRemove = (index) => {
    setBudgetHistory((prevHistory) => {
      const newBudgetHistory = [...prevHistory];
      newBudgetHistory.splice(index, 1);
      return newBudgetHistory;
    });
  };

  const totalPrice = budgetHistory.reduce((sum, item) => sum + (item.price || 0), 0);

  const handlePay = () => {
    alert(`   you need to pay total: $${totalPrice}`);
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <div className="relative z-40 mx-2 sm:mx-4 md:mx-8 lg:mx-32 p-4 sm:p-6 border border-blue-400 rounded-lg shadow-lg mt-4 sm:mt-8">
      <div className="absolute inset-0 bg-gray-500 backdrop-blur-[70px] blur-sm z-0"></div>
      <div className="relative z-[1]">
        <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6 text-center">Budget History</h2>
        
        {/* Scrollable table container for small screens */}
        <div className="overflow-x-auto">
          <table className="w-full shadow-sm border border-gray-800 backdrop-blur-[200px] bg-slate-600 min-w-[600px]">
            <thead>
              <tr className="text-gray-800 border border-gray-800">
                <th className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-left">Type</th>
                <th className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-left">Venue</th>
                <th className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-left">Price</th>
                <th className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-left">Date</th>
                <th className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-left">Location</th>
                <th className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-left">Remove</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {budgetHistory.map((item, index) => (
                  <motion.tr
                    key={`${item.type}-${item.venue}-${item.date}-${item.price}-${index}`}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="border-b border-gray-200"
                  >
                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-800 text-xs sm:text-sm">{item.type}</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-800 text-xs sm:text-sm">{item.venue}</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-800 text-xs sm:text-sm">${item.price}</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-800 text-xs sm:text-sm">{item.date}</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-800 text-xs sm:text-sm">{item.location}</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3">
                      <motion.button
                        variants={buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 sm:py-2 sm:px-4 rounded-lg shadow-md text-xs sm:text-sm whitespace-nowrap"
                        onClick={() => handleRemove(index)}
                      >
                        Remove
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="mt-4 sm:mt-6 flex flex-col items-center gap-3 sm:gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-base sm:text-lg font-semibold text-gray-300"
          >
            Total: ${totalPrice.toFixed(2)}
          </motion.p>
          <motion.button
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-md text-sm sm:text-base"
            onClick={handlePay}
          >
            Pay Now
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Budget;