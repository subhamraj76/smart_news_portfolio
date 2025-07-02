import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Plus, Trash2, RefreshCw, Bell, Mail, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const SmartNewsPortfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [newStock, setNewStock] = useState({ symbol: '', quantity: '', price: '' });
  const [generalNews, setGeneralNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState(true);

  // Mock Indian stock market news data
  const mockGeneralNews = [
    {
      id: 1,
      headline: "Nifty 50 hits all-time high as banking stocks surge",
      source: "Economic Times",
      time: "2 hours ago",
      category: "Market Update",
      stocks: ["NIFTY", "HDFC", "ICICI", "SBI"]
    },
    {
      id: 2,
      headline: "Reliance Industries reports strong Q3 earnings, beats estimates",
      source: "Moneycontrol",
      time: "4 hours ago",
      category: "Earnings",
      stocks: ["RELIANCE"]
    },
    {
      id: 3,
      headline: "IT sector outlook positive amid global digital transformation",
      source: "Business Standard",
      time: "6 hours ago",
      category: "Sector News",
      stocks: ["TCS", "INFY", "WIPRO", "HCLTECH"]
    },
    {
      id: 4,
      headline: "RBI maintains repo rate at 6.5%, signals dovish stance",
      source: "LiveMint",
      time: "8 hours ago",
      category: "Policy",
      stocks: ["NIFTY", "BANKNIFTY"]
    },
    {
      id: 5,
      headline: "Adani Group stocks rally after successful bond issuance",
      source: "Economic Times",
      time: "10 hours ago",
      category: "Corporate News",
      stocks: ["ADANIPORTS", "ADANIGREEN", "ADANIPOWER"]
    },
    {
      id: 6,
      headline: "Auto sector shows signs of recovery with festive season demand",
      source: "Moneycontrol",
      time: "12 hours ago",
      category: "Sector News",
      stocks: ["MARUTI", "TATAMOTOR", "M&M", "BAJAJ-AUTO"]
    },
    {
      id: 7,
      headline: "Pharma stocks gain on export opportunities and new drug approvals",
      source: "Business Line",
      time: "1 day ago",
      category: "Sector News",
      stocks: ["SUNPHARMA", "DRREDDY", "CIPLA", "LUPIN"]
    },
    {
      id: 8,
      headline: "FII selling pressure continues, domestic investors provide support",
      source: "Economic Times",
      time: "1 day ago",
      category: "Market Update",
      stocks: ["NIFTY", "SENSEX"]
    }
  ];

  // Mock AI analysis based on news sentiment
  const generateAIAnalysis = (news, portfolioStocks) => {
    const analyses = [];
    const portfolioSymbols = portfolioStocks.map(s => s.symbol.toUpperCase());
    
    news.forEach(item => {
      const relevantStocks = item.stocks.filter(stock => 
        portfolioSymbols.some(ps => ps.includes(stock) || stock.includes(ps))
      );
      
      if (relevantStocks.length > 0) {
        let sentiment = 'neutral';
        let confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
        let reasoning = '';
        
        // Simple sentiment analysis based on keywords
        const headline = item.headline.toLowerCase();
        if (headline.includes('surge') || headline.includes('high') || headline.includes('beats') || headline.includes('positive') || headline.includes('rally') || headline.includes('gain')) {
          sentiment = 'positive';
          reasoning = 'Positive market sentiment and strong performance indicators';
        } else if (headline.includes('falls') || headline.includes('negative') || headline.includes('concern') || headline.includes('pressure') || headline.includes('decline')) {
          sentiment = 'negative';
          reasoning = 'Market headwinds and negative sentiment indicators';
        } else {
          sentiment = 'neutral';
          reasoning = 'Mixed signals with no clear directional bias';
          confidence = Math.floor(Math.random() * 20) + 60; // 60-80% for neutral
        }
        
        analyses.push({
          newsId: item.id,
          headline: item.headline,
          sentiment,
          confidence,
          reasoning,
          affectedStocks: relevantStocks
        });
      }
    });
    
    return analyses;
  };

  // Calculate overall portfolio sentiment
  const calculatePortfolioSentiment = (analyses) => {
    if (analyses.length === 0) return { sentiment: 'neutral', score: 0, confidence: 0 };
    
    let totalScore = 0;
    let totalConfidence = 0;
    
    analyses.forEach(analysis => {
      const scoreMultiplier = analysis.sentiment === 'positive' ? 1 : 
                             analysis.sentiment === 'negative' ? -1 : 0;
      totalScore += scoreMultiplier * (analysis.confidence / 100);
      totalConfidence += analysis.confidence;
    });
    
    const avgScore = totalScore / analyses.length;
    const avgConfidence = totalConfidence / analyses.length;
    
    let overallSentiment;
    if (avgScore > 0.3) overallSentiment = 'positive';
    else if (avgScore < -0.3) overallSentiment = 'negative';
    else overallSentiment = 'neutral';
    
    return {
      sentiment: overallSentiment,
      score: avgScore,
      confidence: Math.round(avgConfidence)
    };
  };

  // Load mock data on component mount
  useEffect(() => {
    setGeneralNews(mockGeneralNews);
  }, []);

  // Filter news based on portfolio
  useEffect(() => {
    if (portfolio.length > 0) {
      const portfolioSymbols = portfolio.map(s => s.symbol.toUpperCase());
      const filtered = generalNews.filter(news => 
        news.stocks.some(stock => 
          portfolioSymbols.some(ps => ps.includes(stock) || stock.includes(ps))
        )
      );
      setFilteredNews(filtered);
      
      // Generate AI analysis
      const analysis = generateAIAnalysis(filtered, portfolio);
      setAiAnalysis(analysis);
    } else {
      setFilteredNews([]);
      setAiAnalysis(null);
    }
  }, [portfolio, generalNews]);

  const addStock = () => {
    if (newStock.symbol && newStock.quantity && newStock.price) {
      const stock = {
        id: Date.now(),
        symbol: newStock.symbol.toUpperCase(),
        quantity: parseInt(newStock.quantity),
        price: parseFloat(newStock.price)
      };
      setPortfolio([...portfolio, stock]);
      setNewStock({ symbol: '', quantity: '', price: '' });
    }
  };

  const removeStock = (id) => {
    setPortfolio(portfolio.filter(stock => stock.id !== id));
  };

  const refreshNews = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Shuffle news for demo purposes
      const shuffled = [...mockGeneralNews].sort(() => Math.random() - 0.5);
      setGeneralNews(shuffled);
      setLoading(false);
    }, 1500);
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp style={{ width: '20px', height: '20px', color: '#10b981' }} />;
      case 'negative':
        return <TrendingDown style={{ width: '20px', height: '20px', color: '#ef4444' }} />;
      default:
        return <Minus style={{ width: '20px', height: '20px', color: '#eab308' }} />;
    }
  };

  const getSentimentStyles = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return {
          color: '#065f46',
          backgroundColor: '#ecfdf5',
          borderColor: '#bbf7d0',
          border: '1px solid'
        };
      case 'negative':
        return {
          color: '#991b1b',
          backgroundColor: '#fef2f2',
          borderColor: '#fecaca',
          border: '1px solid'
        };
      default:
        return {
          color: '#92400e',
          backgroundColor: '#fffbeb',
          borderColor: '#fde68a',
          border: '1px solid'
        };
    }
  };

  const portfolioSentiment = aiAnalysis ? calculatePortfolioSentiment(aiAnalysis) : null;

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb'
    },
    header: {
      backgroundColor: 'white',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid #e5e7eb'
    },
    headerContent: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '64px'
    },
    logo: {
      display: 'flex',
      alignItems: 'center'
    },
    logoIcon: {
      width: '32px',
      height: '32px',
      color: '#2563eb',
      marginRight: '12px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827',
      margin: 0
    },
    headerActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    notificationBtn: {
      padding: '8px',
      borderRadius: '50%',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer'
    },
    refreshBtn: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 16px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    refreshBtnDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    main: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '32px 16px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: '32px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      padding: '24px'
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '16px'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#2563eb',
      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)'
    },
    inputGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px'
    },
    addBtn: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px 16px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      marginTop: '12px'
    },
    stockItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      marginBottom: '12px'
    },
    stockInfo: {
      display: 'flex',
      flexDirection: 'column'
    },
    stockSymbol: {
      fontWeight: '500',
      color: '#111827'
    },
    stockDetails: {
      fontSize: '14px',
      color: '#6b7280'
    },
    deleteBtn: {
      color: '#ef4444',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      padding: '4px'
    },
    emptyState: {
      textAlign: 'center',
      color: '#6b7280',
      padding: '32px 0'
    },
    emptyIcon: {
      width: '32px',
      height: '32px',
      margin: '0 auto 8px',
      color: '#9ca3af'
    },
    tabContainer: {
      display: 'flex',
      backgroundColor: '#f3f4f6',
      padding: '4px',
      borderRadius: '8px',
      marginBottom: '24px'
    },
    tab: {
      flex: 1,
      padding: '8px 16px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      color: '#6b7280'
    },
    activeTab: {
      backgroundColor: 'white',
      color: '#2563eb',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    newsItem: {
      borderBottom: '1px solid #f3f4f6',
      paddingBottom: '16px',
      marginBottom: '16px'
    },
    newsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '8px'
    },
    categoryTag: {
      display: 'inline-block',
      padding: '2px 8px',
      backgroundColor: '#dbeafe',
      color: '#1e40af',
      fontSize: '12px',
      borderRadius: '12px'
    },
    greenCategoryTag: {
      backgroundColor: '#dcfce7',
      color: '#166534'
    },
    newsTime: {
      fontSize: '14px',
      color: '#6b7280'
    },
    newsHeadline: {
      fontWeight: '500',
      color: '#111827',
      marginBottom: '4px'
    },
    newsFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    newsSource: {
      fontSize: '14px',
      color: '#6b7280'
    },
    stockTags: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px'
    },
    stockTag: {
      padding: '2px 8px',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      fontSize: '12px',
      borderRadius: '4px'
    },
    analysisCard: {
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '16px'
    },
    analysisHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '8px'
    },
    analysisTitle: {
      display: 'flex',
      alignItems: 'center'
    },
    analysisConfidence: {
      fontSize: '14px',
      fontWeight: '500'
    },
    analysisText: {
      fontSize: '14px',
      marginBottom: '12px'
    },
    analysisReasoning: {
      fontSize: '12px',
      color: '#6b7280',
      marginBottom: '8px'
    },
    affectedStocks: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px',
      alignItems: 'center'
    },
    affectedStockLabel: {
      fontSize: '12px',
      color: '#6b7280'
    },
    affectedStockTag: {
      padding: '2px 8px',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      color: '#374151',
      fontSize: '12px',
      borderRadius: '4px'
    },
    sentimentCard: {
      padding: '16px',
      borderRadius: '8px',
      marginTop: '24px'
    },
    sentimentHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '8px'
    },
    sentimentText: {
      marginLeft: '8px',
      fontWeight: '500'
    },
    confidenceText: {
      fontSize: '14px'
    },
    notification: {
      position: 'fixed',
      bottom: '16px',
      right: '16px',
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center'
    },
    notificationText: {
      fontSize: '14px',
      marginLeft: '8px'
    },
    spinIcon: {
      animation: 'spin 1s linear infinite'
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 1024px) {
          .grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <TrendingUp style={styles.logoIcon} />
            <h1 style={styles.title}>Smart News Portfolio</h1>
          </div>
          <div style={styles.headerActions}>
            <button
              onClick={() => setNotifications(!notifications)}
              style={{
                ...styles.notificationBtn,
                color: notifications ? '#2563eb' : '#9ca3af'
              }}
            >
              <Bell style={{ width: '20px', height: '20px' }} />
            </button>
            <button
              onClick={refreshNews}
              disabled={loading}
              style={{
                ...styles.refreshBtn,
                ...(loading ? styles.refreshBtnDisabled : {})
              }}
            >
              <RefreshCw style={{
                width: '16px',
                height: '16px',
                marginRight: '8px',
                ...(loading ? { animation: 'spin 1s linear infinite' } : {})
              }} />
              Refresh News
            </button>
          </div>
        </div>
      </header>

      <div style={styles.main}>
        <div style={styles.grid} className="grid">
          {/* Portfolio Section */}
          <div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>My Portfolio</h2>
              
              {/* Add Stock Form */}
              <div style={{ marginBottom: '24px' }}>
                <input
                  type="text"
                  placeholder="Stock Symbol (e.g., RELIANCE)"
                  value={newStock.symbol}
                  onChange={(e) => setNewStock({...newStock, symbol: e.target.value})}
                  style={{ ...styles.input, marginBottom: '12px' }}
                />
                <div style={styles.inputGrid}>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={newStock.quantity}
                    onChange={(e) => setNewStock({...newStock, quantity: e.target.value})}
                    style={styles.input}
                  />
                  <input
                    type="number"
                    placeholder="Price ₹"
                    value={newStock.price}
                    onChange={(e) => setNewStock({...newStock, price: e.target.value})}
                    style={styles.input}
                  />
                </div>
                <button onClick={addStock} style={styles.addBtn}>
                  <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  Add Stock
                </button>
              </div>

              {/* Portfolio List */}
              <div>
                {portfolio.map((stock) => (
                  <div key={stock.id} style={styles.stockItem}>
                    <div style={styles.stockInfo}>
                      <div style={styles.stockSymbol}>{stock.symbol}</div>
                      <div style={styles.stockDetails}>{stock.quantity} shares @ ₹{stock.price}</div>
                    </div>
                    <button
                      onClick={() => removeStock(stock.id)}
                      style={styles.deleteBtn}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                ))}
                {portfolio.length === 0 && (
                  <div style={styles.emptyState}>
                    <AlertCircle style={styles.emptyIcon} />
                    <p>No stocks in portfolio</p>
                    <p style={{ fontSize: '14px' }}>Add stocks to see personalized insights</p>
                  </div>
                )}
              </div>

              {/* Portfolio Sentiment Summary */}
              {portfolioSentiment && (
                <div style={{
                  ...styles.sentimentCard,
                  ...getSentimentStyles(portfolioSentiment.sentiment)
                }}>
                  <div style={styles.sentimentHeader}>
                    {getSentimentIcon(portfolioSentiment.sentiment)}
                    <span style={styles.sentimentText}>
                      Portfolio Outlook: {portfolioSentiment.sentiment.charAt(0).toUpperCase() + portfolioSentiment.sentiment.slice(1)}
                    </span>
                  </div>
                  <div style={styles.confidenceText}>
                    Confidence: {portfolioSentiment.confidence}%
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* News Section */}
          <div>
            {/* Tab Navigation */}
            <div style={styles.tabContainer}>
              <button
                onClick={() => setActiveTab('general')}
                style={{
                  ...styles.tab,
                  ...(activeTab === 'general' ? styles.activeTab : {})
                }}
              >
                General News ({generalNews.length})
              </button>
              <button
                onClick={() => setActiveTab('filtered')}
                style={{
                  ...styles.tab,
                  ...(activeTab === 'filtered' ? styles.activeTab : {})
                }}
              >
                Portfolio News ({filteredNews.length})
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                style={{
                  ...styles.tab,
                  ...(activeTab === 'analysis' ? styles.activeTab : {})
                }}
              >
                AI Analysis {aiAnalysis && `(${aiAnalysis.length})`}
              </button>
            </div>

            {/* News Content */}
            <div style={styles.card}>
              {activeTab === 'general' && (
                <div>
                  <h3 style={{ ...styles.cardTitle, fontSize: '18px', marginBottom: '16px' }}>Latest Market News</h3>
                  <div>
                    {generalNews.map((news) => (
                      <div key={news.id} style={styles.newsItem}>
                        <div style={styles.newsHeader}>
                          <span style={styles.categoryTag}>
                            {news.category}
                          </span>
                          <span style={styles.newsTime}>{news.time}</span>
                        </div>
                        <h4 style={styles.newsHeadline}>{news.headline}</h4>
                        <div style={styles.newsFooter}>
                          <span style={styles.newsSource}>{news.source}</span>
                          <div style={styles.stockTags}>
                            {news.stocks.slice(0, 3).map((stock) => (
                              <span key={stock} style={styles.stockTag}>
                                {stock}
                              </span>
                            ))}
                            {news.stocks.length > 3 && (
                              <span style={styles.stockTag}>
                                +{news.stocks.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'filtered' && (
                <div>
                  <h3 style={{ ...styles.cardTitle, fontSize: '18px', marginBottom: '16px' }}>Portfolio-Relevant News</h3>
                  {filteredNews.length > 0 ? (
                    <div>
                      {filteredNews.map((news) => (
                        <div key={news.id} style={styles.newsItem}>
                          <div style={styles.newsHeader}>
                            <span style={{ ...styles.categoryTag, ...styles.greenCategoryTag }}>
                              {news.category}
                            </span>
                            <span style={styles.newsTime}>{news.time}</span>
                          </div>
                          <h4 style={styles.newsHeadline}>{news.headline}</h4>
                          <div style={styles.newsFooter}>
                            <span style={styles.newsSource}>{news.source}</span>
                            <div style={styles.stockTags}>
                              {news.stocks.slice(0, 3).map((stock) => (
                                <span key={stock} style={styles.stockTag}>
                                  {stock}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={styles.emptyState}>
                      <AlertCircle style={{ ...styles.emptyIcon, width: '48px', height: '48px' }} />
                      <p style={{ fontSize: '18px' }}>No relevant news found</p>
                      <p style={{ fontSize: '14px' }}>Add stocks to your portfolio to see filtered news</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'analysis' && (
                <div>
                  <h3 style={{ ...styles.cardTitle, fontSize: '18px', marginBottom: '16px' }}>AI Impact Analysis</h3>
                  {aiAnalysis && aiAnalysis.length > 0 ? (
                    <div>
                      {aiAnalysis.map((analysis) => (
                        <div key={analysis.newsId} style={{
                          ...styles.analysisCard,
                          ...getSentimentStyles(analysis.sentiment)
                        }}>
                          <div style={styles.analysisHeader}>
                            <div style={styles.analysisTitle}>
                              {getSentimentIcon(analysis.sentiment)}
                              <span style={{ marginLeft: '8px', fontWeight: '500' }}>
                                {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)} Impact
                              </span>
                            </div>
                            <span style={styles.analysisConfidence}>{analysis.confidence}% confidence</span>
                          </div>
                          <p style={styles.analysisText}>{analysis.headline}</p>
                          <p style={styles.analysisReasoning}>{analysis.reasoning}</p>
                          <div style={styles.affectedStocks}>
                            <span style={styles.affectedStockLabel}>Affects:</span>
                            {analysis.affectedStocks.map((stock) => (
                              <span key={stock} style={styles.affectedStockTag}>
                                {stock}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={styles.emptyState}>
                      <AlertCircle style={{ ...styles.emptyIcon, width: '48px', height: '48px' }} />
                      <p style={{ fontSize: '18px' }}>No analysis available</p>
                      <p style={{ fontSize: '14px' }}>Add stocks to your portfolio to see AI-powered insights</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notifications && portfolio.length > 0 && (
        <div style={styles.notification}>
          <Bell style={{ width: '16px', height: '16px' }} />
          <span style={styles.notificationText}>News alerts enabled for your portfolio</span>
        </div>
      )}
    </div>
  );
};

export default SmartNewsPortfolio;