# Mini Search Engine for Articles

## Overview

This project implements a backend search engine designed for efficient article management and searching. The solution provides a robust system for storing, indexing, and retrieving articles using in-memory technologies and smart search mechanisms.

## Key Features

### Article Management
- Add articles with comprehensive metadata
- Store articles with unique identifiers
- Support for article titles, content, and tags
- Optional file system persistence

### Search Capabilities
- Full-text keyword search 
- Search across article titles and content
- Filter articles by tags
- Sort search results by relevance or date
- Quick in-memory indexing

## API Endpoints and Postman Testing

### 1. Add Article Endpoint
- **Method:** POST /articles
- **Postman Configuration:**
  - Set request type to POST
  - Body: raw JSON
  - Add article details in request body

### 2. Search Articles Endpoint
- **Method:** GET /articles/search
- **Postman Configuration:**
  - Set request type to GET
  - Use query parameters for searching
  - Apply filters and sorting options

### 3. Retrieve Article Endpoint
- **Method:** GET /articles/:id
- **Postman Configuration:**
  - Set request type to GET
  - Add article ID in the URL path

## Postman Testing Tips
- Verify response status codes
- Check response body for correct data
- Test various search scenarios
- Validate error handling

## Technical Architecture

### Search Mechanism
- Keyword frequency-based relevance scoring
- Supports partial and full-text matching
- Efficient search complexity (O(n))

### Performance Characteristics
- In-memory article storage
- Fast article retrieval
- Lightweight indexing approach
- Minimal computational overhead

### Design Principles
- Modular architecture
- Scalable search implementation
- Flexible data management
- Optimized for quick searches
