# Mini Search Engine for Articles

## Project Overview

The Mini Search Engine is a lightweight, efficient backend solution for managing and searching articles. Designed to provide fast, relevance-based search capabilities, this project demonstrates a simple yet powerful search engine implementation using in-memory indexing and smart search algorithms.

## Features

### Article Management
- Add articles with rich metadata (title, content, tags)
- Unique identifier-based article retrieval
- Optional file system persistence

### Advanced Search Functionality
- Keyword-based search across article titles and content
- Tag-based filtering
- Relevance and date-based result sorting
- Fast in-memory indexing

## Technical Specifications

### Endpoints

1. **Add Article**
   - **Endpoint:** `POST /articles`
   - **Description:** Upload a new article with metadata
   - **Parameters:** 
     - Title
     - Content
     - Tags (optional)

2. **Search Articles**
   - **Endpoint:** `GET /articles/search`
   - **Description:** Search and filter articles
   - **Query Parameters:**
     - Keyword
     - Tag filter
     - Sorting method (relevance/date)

3. **Get Article**
   - **Endpoint:** `GET /articles/:id`
   - **Description:** Retrieve full details of a specific article

## Technical Design

### Core Components
- In-memory article storage using arrays
- Custom indexing mechanism
- Relevance calculation engine
- Optional file system persistence

### Search Algorithm
- Utilizes keyword frequency for relevance scoring
- Supports partial and full-text matching
- Efficient O(n) search complexity

### Performance Optimizations
- Fast O(1) article retrieval by ID
- Lightweight indexing strategy
- Minimal memory overhead

## Key Technical Highlights
- Flexible article management
- Intelligent search capabilities
- Scalable and modular architecture
- Efficient in-memory processing