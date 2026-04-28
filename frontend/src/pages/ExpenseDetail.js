import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { expenseAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const ExpenseDetail = () => {
  const { isDarkMode } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [expense, setExpense] = useState(location.state?.expense || null);
  const [loading, setLoading] = useState(!location.state?.expense);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!expense) {
      fetchExpense();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, expense]);

  const fetchExpense = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getExpense(id);
      setExpense(response.data.expense);
      setError(null);
    } catch (err) {
      setError('Failed to fetch expense details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate('/dashboard', { 
      state: { 
        editExpense: expense,
        showForm: true 
      } 
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseAPI.deleteExpense(expense._id);
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to delete expense:', err);
        alert('Failed to delete expense');
      }
    }
  };

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
        <div className="container mx-auto px-4">
          <div className="text-center mt-24">
            <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-4`}>Loading expense details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
        <div className="container mx-auto px-4">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 text-center`}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😞</div>
            <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Expense Not Found</h2>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              {error || 'The expense you\'re looking for doesn\'t exist or has been deleted.'}
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8 transition-colors`}>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-col md:flex-row gap-4">
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </button>
          <div className="flex gap-3">
            <button 
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
              onClick={handleEdit}
            >
              ✏️ Edit
            </button>
            <button 
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-red-900/50 text-red-300 hover:bg-red-900' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
              onClick={handleDelete}
            >
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 animate-slideUp`}>
          {/* Expense Header */}
          <div className="flex items-start justify-between mb-8 flex-col md:flex-row gap-6">
            <div className="flex items-center gap-6">
              <div 
                className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full p-6 text-5xl`}
              >
                {getCategoryEmoji(expense.category)}
              </div>
              <div>
                <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                  {expense.title}
                </h1>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
                  {expense.category} • {formatDate(expense.date)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-5xl font-bold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                {formatCurrency(expense.amount)}
              </div>
            </div>
          </div>

          {/* Expense Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Basic Information */}
            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Basic Information</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} block mb-1`}>Title</label>
                  <div className={`${isDarkMode ? 'text-primary-400' : 'text-primary-600'} font-semibold`}>{expense.title}</div>
                </div>
                <div>
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} block mb-1`}>Amount</label>
                  <div className={`${isDarkMode ? 'text-primary-400' : 'text-primary-600'} font-semibold`}>{formatCurrency(expense.amount)}</div>
                </div>
                <div>
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} block mb-1`}>Category</label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCategoryEmoji(expense.category)}</span>
                    <span className={`${isDarkMode ? 'text-primary-400' : 'text-primary-600'} font-semibold`}>{expense.category}</span>
                  </div>
                </div>
                <div>
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} block mb-1`}>Date</label>
                  <div className={`${isDarkMode ? 'text-primary-400' : 'text-primary-600'} font-semibold`}>{formatDate(expense.date)}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Description</h3>
              {expense.description ? (
                <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} style={{ lineHeight: '1.6' }}>
                  {expense.description}
                </div>
              ) : (
                <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
                  No description provided for this expense.
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6 mb-8`}>
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Metadata</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} block mb-1`}>Created</label>
                <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                  {new Date(expense.createdAt).toLocaleString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div>
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} block mb-1`}>Last Updated</label>
                <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                  {new Date(expense.updatedAt).toLocaleString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div>
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} block mb-1`}>Expense ID</label>
                <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-700'} font-mono text-sm`}>
                  {expense._id}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 flex-col md:flex-row">
            <button 
              className="btn btn-primary btn-lg flex-1 md:flex-none"
              onClick={handleEdit}
            >
              ✏️ Edit Expense
            </button>
            <button 
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex-1 md:flex-none ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              onClick={() => navigate('/dashboard')}
            >
              📊 Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetail;