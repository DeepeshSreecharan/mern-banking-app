# CBI Bank Frontend

A modern banking application frontend built with React, Vite, TypeScript, and Tailwind CSS.

## Features

- 🏦 Banking dashboard with account management
- 💳 Virtual ATM card generation and management
- 💰 Fixed deposits with interest calculations
- 📊 Transaction history and analytics
- 🎨 Beautiful UI with custom design system
- 🌙 Dark/light mode support
- 📱 Fully responsive design

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **React Router** - Navigation
- **React Hook Form** - Form handling
- **Zod** - Schema validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd cbi-bank-frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   └── Layout/         # Layout components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── assets/             # Static assets
└── index.css           # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Backend Integration

This frontend is designed to work with a MongoDB/Express.js backend. Update the API endpoints in your components to connect to your backend server.

## Customization

The project uses a custom design system defined in:
- `src/index.css` - CSS variables and global styles
- `tailwind.config.ts` - Tailwind configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
