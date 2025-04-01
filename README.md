# Smart Product Assistant

## Overview
A brief introduction to your Smart Product Assistant, explaining its purpose, core features, and target users.

## Features
- Natural language product search
- AI-powered product recommendations
- User authentication
- Search history tracking
- Sorting and Filtering
- Handling Inappropriate Queries
- Responsive design for mobile and desktop

## Technology Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **LLM Integration**: OpenAI API
- **Deployment**: Vercel

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB
- OpenAI API key

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/shivamgit0302/smart-product-assistant.git
   cd smart-product-assistant
   ```

2. Install dependencies
   ```bash
   # Install frontend dependencies
   cd client
   npm install
   
   # Install backend dependencies
   cd ../server
   npm install
   ```

3. Set up environment variables
   ```bash
   # Copy the example env file and adjust values
   cp .env.example .env
   ```

4. Start the application
   ```bash
   # Start the backend (from the server directory)
   cd server
   node server.js
   
   # In a new terminal, start the frontend (from the client directory)
   cd client
   npm start
   ```
   
   The frontend will be available at http://localhost:3000
   The backend API will be available at http://localhost:5000

## API Structure

The application uses RESTful APIs with the following structure:

- Authentication: Handles user registration, login, and session management
- Search: Processes natural language queries and returns product recommendations
- Products: Manages the product catalog

For security reasons, detailed API specifications are available upon request and not published in this public repository.

## LLM Integration Approach

### Prompt Engineering
Our Smart Product Assistant employs carefully crafted prompts to the OpenAI API to ensure accurate and relevant product recommendations:

- **Structured Instructions**: We provide explicit instructions for the LLM to return product recommendations in a consistent format that facilitates parsing.

- **Context Enhancement**: The prompt includes the full product catalog with detailed metadata (names, descriptions, prices, categories) to help the LLM make informed matching decisions.

- **Evaluation Criteria**: We instruct the model to evaluate products based on relevance to the query, assigning a numerical relevance score (0-100) to each product.

- **Zero-shot Reasoning**: The prompt asks the LLM to explain its recommendation logic, which improves transparency and helps debug unexpected results.

- **Format Specification**: We include a template in the prompt that defines the exact JSON structure expected in the response, reducing parsing errors.

Example prompt structure:

You are a smart product search assistant. Based on the user's query, recommend relevant products from our catalog.
For each product, assign a relevance score from 0-100 based on how well it matches the query.
Explain your reasoning for the top recommendations.
Return your response in the following JSON format:
{
"explanation": "Brief explanation of how you interpreted the search",
"recommendations": [
{"id": "product_id", "relevanceScore": 95, "reasoning": "Why this product matches"}
]
}

### API Rate Limiting and Caching

To optimize API usage and reduce costs, we implemented an efficient caching system:

- **User-specific Cache**: Each user has a dedicated search cache stored in MongoDB reducing API calls for recent conversations.

- **TTL-based Invalidation**: Cached results expire after a configurable time period (default: 1 hour) to ensure data freshness while maximizing cache hits.

- **Database Integration**: The cache is stored in the user document, allowing persistent caching across sessions and server restarts.

- **Intelligent Cache Lookup**: Before making OpenAI API calls, the system checks if a cached result exists for the exact query.

- **Fresh Product Data**: When serving cached results, we fetch the latest product details from the database while maintaining the AI-generated relevance scores and explanations.

- **Cache Metrics**: The system logs cache hits and misses to help monitor performance and optimize the caching strategy.

### Response Processing

Extracting structured data from LLM responses involves several techniques:

- **JSON Parsing**: The system expects and parses structured JSON responses from the OpenAI API.

- **Error Resilience**: We implement robust error handling to manage situations where the LLM response doesn't match the expected format.

- **Normalization Pipeline**: Raw LLM responses go through a normalization process that:
  1. Extracts the AI's explanation for display to the user
  2. Maps product IDs to our database records
  3. Sorts recommendations by relevance score
  4. Filters out irrelevant products (score < threshold)

- **Score Normalization**: Relevance scores from the LLM are normalized to ensure consistency across different queries.

- **Response Enrichment**: The AI's textual explanation is highlighted in the UI to provide transparency about why certain products were recommended.

This integrated approach ensures that our Smart Product Assistant delivers accurate, relevant recommendations while optimizing for performance and cost-efficiency.

## Trade-offs and Future Improvements

### Current Limitations
- Limited product catalog
- No advanced filtering options
- Caching implementation
- Simple UI/UX

### Future Enhancements
- Expanded product database with real-time updates
- Advanced filtering and sorting capabilities
- Improved AI personalization based on user preferences
- Mobile app development
- Integration with actual e-commerce platforms

## Live Demo
[Link to deployed application](https://frontend-smart-product-assistant.vercel.app/)

## Running Locally
Follow the setup instructions above to run the application locally.