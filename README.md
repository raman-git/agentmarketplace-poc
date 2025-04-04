# GenAI Agents Marketplace

A modern, responsive React application for discovering and managing GenAI (Generative AI) agents with file-based data persistence.

## Features

- **Browse Agents**: View all available GenAI agents in a responsive tile-based UI
- **Filter & Search**: Find agents by name, category, or status
- **Register New Agents**: Add your own GenAI agents to the marketplace
- **Enable/Disable Agents**: Toggle agent availability with a simple switch
- **Persistent Storage**: Data is saved to a JSON file on disk via a backend API

## Technologies Used

- **Frontend**:
  - React 18
  - React Router v6
  - Material UI v5
  - Modern JavaScript (ES6+)

- **Backend**:
  - Node.js
  - Express
  - File-based JSON storage

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start both the backend server and React frontend:

```bash
npm run dev
```

This will start:
- The backend server on port 3001
- The React frontend on port 3000

4. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Project Structure

```
genai-marketplace/
├── public/                # Static files
│   ├── index.html
│   └── manifest.json
├── src/                   # React frontend
│   ├── components/        # Reusable UI components
│   │   ├── AgentCard.js
│   │   ├── Header.js
│   │   └── Footer.js
│   ├── context/           # React context for state management
│   │   └── AgentContext.js
│   ├── data/              # Mock data (used for initial setup)
│   │   └── mockData.js
│   ├── pages/             # Page components
│   │   ├── HomePage.js
│   │   └── RegisterAgentPage.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── data/                  # Persistent data storage
│   └── agents.json        # Auto-generated from mockData on first run
├── server.js              # Express backend server
└── package.json
```

## How Data Persistence Works

1. The application uses a Node.js/Express backend server to handle data operations
2. Agent data is stored in a JSON file located at `data/agents.json`
3. The React frontend communicates with the backend via REST API endpoints:
   - GET `/api/agents` - Retrieve all agents
   - POST `/api/agents` - Add a new agent
   - PUT `/api/agents/:id` - Update an agent
   - DELETE `/api/agents/:id` - Delete an agent

## Running in Development Mode

```bash
# Run both frontend and backend concurrently
npm run dev

# Run only the backend server
npm run server

# Run only the frontend
npm run start
```

## Future Enhancements

- User authentication and profiles
- Agent usage analytics
- Integration with popular AI platforms
- Agent reviews and ratings
- Payment integration for premium agents
- Database storage (MongoDB, PostgreSQL)
