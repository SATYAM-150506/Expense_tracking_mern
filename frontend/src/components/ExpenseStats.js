import React from 'react';

const ExpenseStats = ({ stats }) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Food: '#ff6b6b',
      Transportation: '#4ecdc4',
      Entertainment: '#45b7d1',
      Healthcare: '#f39c12',
      Shopping: '#e74c3c',
      Bills: '#9b59b6',
      Education: '#2ecc71',
      Travel: '#1abc9c',
      Other: '#95a5a6'
    };
    return colors[category] || '#95a5a6';
  };

  return (
    <div className="mb-8">
      {/* Summary Cards - 3 Column Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Amount Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="text-center">
            <div className="bg-white/20 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
              </svg>
            </div>
            <p className="text-blue-100 text-xs font-medium uppercase tracking-wide mb-2">💰 Total Amount</p>
            <p className="text-2xl lg:text-3xl font-bold mb-1">{formatAmount(stats.totalAmount)}</p>
            <p className="text-blue-200 text-xs">Your total spending</p>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="text-center">
            <div className="bg-white/20 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <p className="text-emerald-100 text-xs font-medium uppercase tracking-wide mb-2">📊 Total Expenses</p>
            <p className="text-2xl lg:text-3xl font-bold mb-1">{stats.totalExpenses}</p>
            <p className="text-emerald-200 text-xs">Number of transactions</p>
          </div>
        </div>

        {/* Average per Expense Card */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="text-center">
            <div className="bg-white/20 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <p className="text-purple-100 text-xs font-medium uppercase tracking-wide mb-2">📈 Average per Expense</p>
            <p className="text-2xl lg:text-3xl font-bold mb-1">{formatAmount(stats.totalExpenses > 0 ? stats.totalAmount / stats.totalExpenses : 0)}</p>
            <p className="text-purple-200 text-xs">Average transaction value</p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {stats.categoryStats && stats.categoryStats.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <span className="mr-2">📊</span>
            Spending by Category
          </h3>
          <div className="space-y-4">
            {stats.categoryStats.map((category, index) => {
              const percentage = ((category.totalAmount / stats.totalAmount) * 100).toFixed(1);
              const categoryEmoji = {
                Food: '🍔',
                Transportation: '🚗',
                Entertainment: '🎬',
                Healthcare: '🏥',
                Shopping: '🛍️',
                Bills: '💡',
                Education: '📚',
                Travel: '✈️',
                Other: '📝'
              };
              
              return (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 border border-gray-200 dark:border-gray-600 hover:shadow-md"
                  style={{ borderLeftColor: getCategoryColor(category._id), borderLeftWidth: '4px' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm">
                      <span className="text-xl">{categoryEmoji[category._id] || '📝'}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 dark:text-white text-lg">{category._id}</span>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {category.count} expense{category.count !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {/* Progress Bar */}
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-300 rounded-full"
                          style={{ 
                            width: `${percentage}%`, 
                            backgroundColor: getCategoryColor(category._id)
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300 w-10">{percentage}%</span>
                    </div>
                    
                    {/* Amount */}
                    <div className="text-right">
                      <div 
                        className="font-bold text-lg"
                        style={{ color: getCategoryColor(category._id) }}
                      >
                        {formatAmount(category.totalAmount)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseStats;
