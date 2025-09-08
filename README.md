# TS AI SpaceTraders

This monorepo uses Nx to manage a Next.js app, a NestJS service, and shared libraries.

## Table of Contents

<<<<<<< HEAD
- Architecture: docs/ARCHITECTURE.md
- Patterns & Conventions: docs/PATTERNS.md
- Quickstart: docs/QUICKSTART.md
- Testing Guide: docs/TESTING.md
- Contributing: docs/CONTRIBUTING.md
- Environment: docs/ENVIRONMENT.md
=======
This project implements an intelligent agent that can play the Space Traders game using the official API. The agent is designed to make strategic decisions about trading, ship management, and resource optimization.

## Features

- 🚀 Space Traders API integration
- 🤖 AI-driven decision making
- 📊 Market analysis and trading strategies
- 🛸 Ship fleet management
- 📈 Performance tracking and optimization

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Space Traders API token

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ts-ai-spactraders
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Space Traders API token
```

4. Build the project:
```bash
npm run build
```

5. Run the AI agent:
```bash
npm start
```

### Development

For development with hot reload:
```bash
npm run dev
```

## Project Structure

```
src/
├── api/           # Space Traders API client
├── ai/            # AI decision making logic
├── models/        # TypeScript interfaces and types
├── strategies/    # Trading and game strategies
├── utils/         # Utility functions
└── index.ts       # Main entry point
```

## Configuration

The agent can be configured through environment variables and configuration files. See the configuration section for more details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Docker

See docs/docker.md for containerized dev setup.
>>>>>>> 45db796 (chore(docker): add dev Dockerfile + .dockerignore; docs: add docs/docker.md and link from README; keep repo green)
