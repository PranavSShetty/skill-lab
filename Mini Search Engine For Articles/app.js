const express = require('express');
const fs = require('fs').promises;
const path = require('path');

class MiniSearchEngine {
  constructor() {
    this.articles = [];
    this.index = {
      keywords: {},
      tags: {}
    };
    this.nextId = 1;
    this.ARTICLES_FILE = path.join(__dirname, 'articles.json');
  }

  // Calculate relevance score based on keyword frequency
  calculateRelevance(article, searchTerms) {
    let score = 0;
    const searchText = (article.title + ' ' + article.content).toLowerCase();
    
    searchTerms.forEach(term => {
      const termCount = (searchText.match(new RegExp(term.toLowerCase(), 'g')) || []).length;
      score += termCount;
    });

    return score;
  }

  // Index article for quick search
  indexArticle(article) {
    // Index keywords from title and content
    const keywords = (article.title + ' ' + article.content).toLowerCase().split(/\s+/);
    keywords.forEach(keyword => {
      if (!this.index.keywords[keyword]) {
        this.index.keywords[keyword] = [];
      }
      this.index.keywords[keyword].push(article.id);
    });

    // Index tags
    article.tags.forEach(tag => {
      const lowercaseTag = tag.toLowerCase();
      if (!this.index.tags[lowercaseTag]) {
        this.index.tags[lowercaseTag] = [];
      }
      this.index.tags[lowercaseTag].push(article.id);
    });
  }

  // Add new article
  addArticle(title, content, tags = []) {
    const article = {
      id: this.nextId++,
      title,
      content,
      tags,
      createdAt: new Date().toISOString()
    };

    this.articles.push(article);
    this.indexArticle(article);
    this.persistArticles();
    return article;
  }

  // Search articles
  searchArticles(query, sortBy = 'relevance') {
    const searchTerms = query.toLowerCase().split(/\s+/);
    
    // Collect potential matching article IDs
    const matchedIds = new Set();
    
    // Search keywords
    searchTerms.forEach(term => {
      const keywordMatches = this.index.keywords[term] || [];
      const tagMatches = this.index.tags[term] || [];
      [...keywordMatches, ...tagMatches].forEach(id => matchedIds.add(id));
    });

    // Filter and map matched articles
    let results = this.articles
      .filter(article => matchedIds.has(article.id))
      .map(article => ({
        ...article,
        relevanceScore: this.calculateRelevance(article, searchTerms)
      }));

    // Sort results
    if (sortBy === 'relevance') {
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } else if (sortBy === 'date') {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return results;
  }

  // Get article by ID
  getArticle(id) {
    return this.articles.find(article => article.id === parseInt(id));
  }

  // Persist articles to file
  async persistArticles() {
    try {
      await fs.writeFile(this.ARTICLES_FILE, JSON.stringify(this.articles, null, 2));
    } catch (error) {
      console.error('Error persisting articles:', error);
    }
  }

  // Load articles from file on startup
  async loadArticles() {
    try {
      const data = await fs.readFile(this.ARTICLES_FILE, 'utf8');
      this.articles = JSON.parse(data);
      this.nextId = Math.max(...this.articles.map(a => a.id)) + 1;
      
      // Rebuild index
      this.index = { keywords: {}, tags: {} };
      this.articles.forEach(article => this.indexArticle(article));
    } catch (error) {
      console.log('No existing articles file found.');
    }
  }
}

// Express App Setup
const app = express();
const searchEngine = new MiniSearchEngine();

// Middleware
app.use(express.json());

// Root Route Handler
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Mini Search Engine API',
    endpoints: [
      {
        method: 'POST',
        path: '/articles',
        description: 'Add a new article'
      },
      {
        method: 'GET',
        path: '/articles/search',
        description: 'Search articles by keyword'
      },
      {
        method: 'GET',
        path: '/articles/:id',
        description: 'Get a specific article by ID'
      }
    ]
  });
});

// Routes
app.post('/articles', (req, res) => {
  const { title, content, tags } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const article = searchEngine.addArticle(title, content, tags);
  res.status(201).json(article);
});

app.get('/articles/search', (req, res) => {
  const { q: query, sort = 'relevance' } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const results = searchEngine.searchArticles(query, sort);
  res.json(results);
});

app.get('/articles/:id', (req, res) => {
  const article = searchEngine.getArticle(parseInt(req.params.id));
  
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }

  res.json(article);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: 'Cannot ' + req.method + ' ' + req.originalUrl
  });
});

// Server Setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await searchEngine.loadArticles();
    console.log('Search Engine running on port ' + PORT);
  } catch (error) {
    console.error('Failed to start server:', error);
  }
});