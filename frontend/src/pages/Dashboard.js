import React, { useState, useEffect } from 'react';
import { expenseAPI } from '../services/api';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseStats from '../components/ExpenseStats';
import ExpensePieChart from '../components/ExpensePieChart';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({
    category: 'All',
    startDate: '',
    endDate: ''
  });

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const filterParams = {};
      
      if (filters.category !== 'All') {
        filterParams.category = filters.category;
      }
      if (filters.startDate) {
        filterParams.startDate = filters.startDate;
      }
      if (filters.endDate) {
        filterParams.endDate = filters.endDate;
      }

      const response = await expenseAPI.getExpenses(filterParams);
      setExpenses(response.data.expenses);
      setError(null);
    } catch (err) {
      setError('Failed to fetch expenses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await expenseAPI.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // Load data on component mount and filter changes
  useEffect(() => {
    fetchExpenses();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Handle navigation state for editing expense
  useEffect(() => {
    if (location.state?.editExpense) {
      setEditingExpense(location.state.editExpense);
      setShowForm(location.state.showForm || true);
      // Clear the navigation state
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Handle expense creation/update
  const handleExpenseSubmit = async (expenseData) => {
    try {
      if (editingExpense) {
        await expenseAPI.updateExpense(editingExpense._id, expenseData);
      } else {
        await expenseAPI.createExpense(expenseData);
      }
      
      setShowForm(false);
      setEditingExpense(null);
      fetchExpenses();
      fetchStats();
    } catch (err) {
      console.error('Failed to save expense:', err);
      throw err;
    }
  };

  // Handle expense deletion
  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseAPI.deleteExpense(id);
        fetchExpenses();
        fetchStats();
      } catch (err) {
        console.error('Failed to delete expense:', err);
        alert('Failed to delete expense');
      }
    }
  };

  // Handle expense editing
  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  // Handle viewing expense details
  const handleViewExpense = (expense) => {
    navigate(`/expense/${expense._id}`, { state: { expense } });
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Get category emoji
  const getCategoryEmoji = (category) => {
    const emojis = {
      'Food': '🍔',
      'Transportation': '🚗',
      'Entertainment': '🎬',
      'Healthcare': '🏥',
      'Shopping': '🛍️',
      'Bills': '💡',
      'Education': '📚',
      'Travel': '✈️',
      'Other': '📝'
    };
    return emojis[category] || '📝';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading && expenses.length === 0) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
        <div className="container mx-auto px-4">
          <div className="text-center mt-24">
            <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-4`}>Loading your expenses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8 transition-colors`}>
      <div className="container mx-auto px-4 max-w-7xl animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-6 md:mb-0">
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'} mb-2`}>
              💰 Expense Tracker Dashboard
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
              Manage your finances with ease - Welcome to your personal expense tracker
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/expenses" className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
              📊 View All Expenses
            </Link>
            <button 
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
              onClick={() => {
                setEditingExpense(null);
                setShowForm(true);
              }}
            >
              ➕ Add New Expense
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`${isDarkMode ? 'bg-red-900/30 border-red-700 text-red-300' : 'bg-danger-50 border-danger-200 text-danger-700'} border px-4 py-3 rounded-lg mb-6`}>
            <span className="flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </span>
          </div>
        )}

        {/* Stats Section */}
        {stats && <ExpenseStats stats={stats} />}

        {/* Pie Chart Section */}
        {stats && (
          <div className="mt-8">
            <ExpensePieChart stats={stats} />
          </div>
        )}

        {/* Filters */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-8 mt-8`}>
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Filter Expenses</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Category</label>
              <select
                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                value={filters.category}
                onChange={(e) => handleFilterChange({ ...filters, category: e.target.value })}
              >
                <option value="All">All Categories</option>
                <option value="Food">🍔 Food</option>
                <option value="Transportation">🚗 Transportation</option>
                <option value="Entertainment">🎬 Entertainment</option>
                <option value="Healthcare">🏥 Healthcare</option>
                <option value="Shopping">🛍️ Shopping</option>
                <option value="Bills">💡 Bills</option>
                <option value="Education">📚 Education</option>
                <option value="Travel">✈️ Travel</option>
                <option value="Other">📝 Other</option>
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Start Date</label>
              <input
                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange({ ...filters, startDate: e.target.value })}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>End Date</label>
              <input
                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange({ ...filters, endDate: e.target.value })}
              />
            </div>
            
            <div className="flex items-end">
              <button 
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                onClick={() => setFilters({ category: 'All', startDate: '', endDate: '' })}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Expense Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp`}>
              <ExpenseForm
                expense={editingExpense}
                onSubmit={handleExpenseSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingExpense(null);
                }}
              />
            </div>
          </div>
        )}

        {/* Expenses Grid */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2 sm:mb-0`}>Recent Expenses</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                {expenses.length > 5 ? 'Showing latest 5 of ' : ''}{expenses.length} expense{expenses.length !== 1 ? 's' : ''}
              </p>
              {expenses.length > 5 && (
                <Link to="/expenses" className={`px-3 py-1 rounded text-sm font-medium ${isDarkMode ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-primary-600 text-white hover:bg-primary-700'}`}>
                  View All →
                </Link>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-4`}>Loading expenses...</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>No expenses found</h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
                {filters.category !== 'All' || filters.startDate || filters.endDate
                  ? 'Try adjusting your filters to see more expenses.'
                  : 'Get started by adding your first expense.'}
              </p>
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
                onClick={() => {
                  setEditingExpense(null);
                  setShowForm(true);
                }}
              >
                Add Your First Expense
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {expenses.slice(0, 5).map((expense) => (
                <div 
                  key={expense._id} 
                  className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:shadow-xl'} rounded-2xl p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 shadow-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-100'}`}
                  onClick={() => handleViewExpense(expense)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'} truncate flex-1`}>{expense.title}</h4>
                    <div className={`text-xl font-bold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'} ml-3`}>
                      {formatCurrency(expense.amount)}
                    </div>
                  </div>
                  
                  <div className={`flex justify-between items-center mb-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className={`flex items-center ${isDarkMode ? 'bg-gray-600' : 'bg-gray-50'} px-3 py-1.5 rounded-full`}>
                      <span className="mr-2 text-base">{getCategoryEmoji(expense.category)}</span>
                      <span className="font-medium">{expense.category}</span>
                    </div>
                    <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>
                      {formatDate(expense.date)}
                    </div>
                  </div>
                  
                  {expense.description && (
                    <div className={`text-sm ${isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-50 text-gray-600'} mb-6 line-clamp-2 p-3 rounded-lg`}>
                      {expense.description}
                    </div>
                  )}
                  
                  <div className={`flex gap-3 mt-auto pt-4 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-100'}`}>
                    <button 
                      className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewExpense(expense);
                      }}
                    >
                      👁️ View
                    </button>
                    <button 
                      className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-primary-100 text-primary-700 hover:bg-primary-200'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditExpense(expense);
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${isDarkMode ? 'bg-red-900/50 text-red-300 hover:bg-red-900' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteExpense(expense._id);
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;