import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { analyticsAPI, budgetAPI } from '../services/api';
import TrendChart from '../components/TrendChart';
import BudgetTrendChart from '../components/BudgetTrendChart';
import CategoryChart from '../components/CategoryChart';
import BudgetChart from '../components/BudgetChart';

const Analytics = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Data states
  const [monthlyData, setMonthlyData] = useState(null);
  const [trendsData, setTrendsData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [budgets, setBudgets] = useState([]);

  // Fetch all analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch monthly data
      const monthlyRes = await analyticsAPI.getMonthly(selectedMonth);
      setMonthlyData(monthlyRes.data);

      // Fetch trends (only once, not dependent on month)
      if (!trendsData) {
        const trendsRes = await analyticsAPI.getTrends();
        setTrendsData(trendsRes.data.trends);
      }

      // Fetch category breakdown
      const categoryRes = await analyticsAPI.getCategories(selectedMonth);
      setCategoryData(categoryRes.data);

      // Fetch comparison
      const comparisonRes = await analyticsAPI.getComparison();
      setComparisonData(comparisonRes.data.comparison);

      // Fetch forecast
      const forecastRes = await analyticsAPI.getForecast(selectedMonth);
      setForecastData(forecastRes.data.forecast);

      // Fetch budgets
      const budgetsRes = await budgetAPI.getBudgets({ month: selectedMonth });
      setBudgets(budgetsRes.data.budgets);
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const StatCard = ({ icon, title, value, subtitle, color = 'primary' }) => (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 transition-colors`}>
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
            {title}
          </div>
          <div className={`text-3xl font-bold ${
            color === 'primary'
              ? isDarkMode ? 'text-primary-400' : 'text-primary-600'
              : isDarkMode ? 'text-green-400' : 'text-green-600'
          }`}>
            {value}
          </div>
          {subtitle && (
            <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
              {subtitle}
            </div>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
        <div className="container mx-auto px-4">
          <div className="text-center mt-24">
            <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-4`}>Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8 transition-colors`}>
      <div className="container mx-auto px-4 max-w-7xl animate-fadeIn">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'} mb-2`}>
            📊 Advanced Analytics
          </h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
            Deep insights into your spending patterns and budgets
          </p>
        </div>

        {/* Month Selector */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-8 transition-colors`}>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            📅 Select Month
          </label>
          <input
            type="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className={`w-full md:w-48 px-4 py-2 rounded-lg border ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-800'
            } focus:outline-none focus:ring-2 focus:ring-primary-500`}
          />
        </div>

        {error && (
          <div className={`${isDarkMode ? 'bg-red-900/30 border-red-700 text-red-300' : 'bg-red-50 border-red-200 text-red-700'} border px-4 py-3 rounded-lg mb-6`}>
            ⚠️ {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md mb-6 overflow-hidden transition-colors`}>
          <div className="flex flex-wrap">
            {['overview', 'trends', 'budget', 'forecast'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 font-medium transition-colors text-center ${
                  activeTab === tab
                    ? isDarkMode
                      ? 'bg-primary-600 text-white'
                      : 'bg-primary-600 text-white'
                    : isDarkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab === 'overview' && '📋 Overview'}
                {tab === 'trends' && '📈 Trends'}
                {tab === 'budget' && '💰 Budget'}
                {tab === 'forecast' && '🔮 Forecast'}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && monthlyData && (
          <div className="space-y-6 animate-fadeIn">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon="💵"
                title="Total Spent"
                value={`$${monthlyData.summary.totalSpent.toFixed(2)}`}
                subtitle={`${monthlyData.summary.totalExpenses} transactions`}
              />
              <StatCard
                icon="📊"
                title="Daily Average"
                value={`$${monthlyData.summary.averagePerDay.toFixed(2)}`}
                subtitle={`${monthlyData.summary.daysElapsed} days elapsed`}
              />
              <StatCard
                icon="📈"
                title="Budget Limit"
                value={`$${monthlyData.summary.totalBudget.toFixed(2)}`}
                subtitle={`${Math.round((monthlyData.summary.totalSpent / monthlyData.summary.totalBudget) * 100)}% used`}
              />
              <StatCard
                icon="🎯"
                title="Projected Total"
                value={`$${monthlyData.summary.projectForMonth.toFixed(2)}`}
                subtitle="If trend continues"
              />
            </div>

            {/* Month Comparison */}
            {comparisonData && (
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 transition-colors`}>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
                  📊 Month-over-Month Comparison
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                      This Month
                    </div>
                    <div className={`text-3xl font-bold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                      $0.00
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                      0 expenses
                    </div>
                  </div>
                  <div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                      Change
                    </div>
                    <div className={`text-3xl font-bold ${
                      comparisonData.trend === 'increased'
                        ? 'text-red-500'
                        : comparisonData.trend === 'decreased'
                        ? 'text-green-500'
                        : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {comparisonData.trend === 'increased' && '↑'}
                      {comparisonData.trend === 'decreased' && '↓'}
                      {comparisonData.trend === 'same' && '→'}
                      {Math.abs(comparisonData.percentageChange).toFixed(1)}%
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                      ${Math.abs(comparisonData.difference).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Top Categories */}
            {monthlyData.topCategories && monthlyData.topCategories.length > 0 && (
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 transition-colors`}>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
                  🏆 Top Spending Categories
                </h3>
                <div className="space-y-3">
                  {monthlyData.topCategories.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {idx + 1}. {cat.category}
                      </div>
                      <div className={`text-lg font-bold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                        ${cat.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category Breakdown */}
            {categoryData && (
              <CategoryChart 
                data={categoryData.categoryData} 
                totalSpent={categoryData.totalSpent}
              />
            )}
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && trendsData && (
          <div className="space-y-6 animate-fadeIn">
            {/* Spending Trend */}
            <TrendChart data={trendsData} />

            {/* Budget Trend */}
            {budgets.length > 0 && (
              <BudgetTrendChart data={trendsData} budgets={budgets} />
            )}
          </div>
        )}

        {/* Budget Tab */}
        {activeTab === 'budget' && (
          <div className="animate-fadeIn">
            {monthlyData && (
              <BudgetChart budgets={monthlyData.budgetComparison} />
            )}
          </div>
        )}

        {/* Forecast Tab */}
        {activeTab === 'forecast' && forecastData && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard
                icon="📊"
                title="Current Spending"
                value={`$${forecastData.current.spent.toFixed(2)}`}
                subtitle={`Avg: $${forecastData.current.avgPerDay.toFixed(2)}/day`}
              />
              <StatCard
                icon="🎯"
                title="Projected Total"
                value={`$${forecastData.forecast.projectedTotal.toFixed(2)}`}
                subtitle={`${forecastData.forecast.remainingDays} days remaining`}
              />
            </div>

            {/* Category Forecast */}
            {forecastData.categoryProjection && forecastData.categoryProjection.length > 0 && (
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 transition-colors`}>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
                  🔮 Category Forecast
                </h3>
                <div className="space-y-4">
                  {forecastData.categoryProjection.map((cat) => (
                    <div key={cat.category} className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                      <div className="flex justify-between items-center mb-2">
                        <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                          {cat.category}
                        </div>
                        <div className={`${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                          ${cat.currentSpent.toFixed(2)} → ${cat.projectedTotal.toFixed(2)}
                        </div>
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Projected increase: ${(cat.projectedTotal - cat.currentSpent).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
