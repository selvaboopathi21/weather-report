import { useState } from 'react';
import Weather from './component/weather';
import './App.css';

function App() {
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('home'); // Controls view: 'home' or 'history'
  const [selectedCity, setSelectedCity] = useState('');

  // Function to add new searched cities to history (avoids duplicates)
  const addToHistory = (cityName) => {
    if (!history.includes(cityName)) {
      setHistory((prev) => [cityName, ...prev.slice(0, 9)]); // Stores up to 10 recent searches
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const handleHistoryClick = (city) => {
    setSelectedCity(city);
    setActiveTab('home'); // Switches back to Home tab to view selected city weather
  };

  return (
    <div className="app-container">
      {/* Navbar Navigation */}
      <header className="app-navbar">
        <div className="navbar-logo" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">☀️</span>
          <span className="logo-text">WeatherPulse</span>
        </div>
        <nav className="navbar-links">
          <button 
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} 
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button 
            className={`nav-link ${activeTab === 'history' ? 'active' : ''}`} 
            onClick={() => setActiveTab('history')}
          >
            History {history.length > 0 && <span className="history-badge">{history.length}</span>}
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="app-main">
        {activeTab === 'home' ? (
          <Weather 
            onSearchSuccess={addToHistory} 
            selectedCity={selectedCity} 
          />
        ) : (
          /* Dedicated History Section */
          <section className="history-section">
            <div className="history-header">
              <h2>Search History</h2>
              {history.length > 0 && (
                <button onClick={clearHistory} className="clear-btn">
                  Clear All
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="empty-history">
                <p>No search history yet.</p>
                <button className="primary-btn" onClick={() => setActiveTab('home')}>
                  Search Weather Now
                </button>
              </div>
            ) : (
              <div className="history-grid">
                {history.map((city, index) => (
                  <div 
                    key={index} 
                    className="history-card"
                    onClick={() => handleHistoryClick(city)}
                  >
                    <span className="location-icon">📍</span>
                    <span className="city-name">{city}</span>
                    <span className="action-hint">View Weather →</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Glassmorphic Footer */}
      <footer className="glass-footer">
        <p>&copy; 2026 Weather Report App. Built with React & Axios.</p>
        <p className="footer-subtext">Data provided by OpenWeatherMap API</p>
      </footer>
    </div>
  );
}

export default App;