# Step Zero Survey

A React-based survey application for Step Zero company.

## Features

- Dark-themed, straightforward design
- Sequential survey flow with branching logic
- Progress tracking
- File upload capabilities
- Social media integration
- Responsive design

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── App.js          # Main application component
├── App.css         # Application styles
├── index.js        # Application entry point
└── index.css       # Global styles

public/
└── index.html      # HTML template
```

## Survey Flow

1. Hero page with "Continue" and "Not Interested" options
2. Challenge introduction
3. Sequential questions with branching logic
4. Thank you pages based on user responses

## Technologies Used

- React 18
- CSS3 with animations
- HTML5
- JavaScript ES6+
