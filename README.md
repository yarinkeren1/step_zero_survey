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

3. Set up environment variables:
   Create a `.env` file in the root directory with your Supabase credentials:
   ```bash
   REACT_APP_SUPABASE_URL=your_supabase_project_url_here
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```
   
   You can get these values from your Supabase project dashboard:
   - Go to your Supabase project
   - Navigate to Settings > API
   - Copy the "Project URL" and "anon public" key

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Runs the app in development mode
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

## Database Setup

The application uses Supabase for data storage. You'll need to create the following in your Supabase project:

### Tables
Create a table called `survey_responses` with the following columns:
- `id` (uuid, primary key)
- `challenge_completed` (text)
- `question1_answer` (text)
- `question2_answer` (text)
- `question3_answer` (text)
- `question4a_answer` (text)
- `question4b_answer` (text)
- `question4b_other` (text)
- `question5a_answer` (text)
- `question5a_other` (text)
- `question5b_answer` (text)
- `question5b_email` (text)
- `question5c_answer` (text)
- `question6_answer` (text)
- `question7_age` (integer)
- `question8_gender` (text)
- `terms_consent` (boolean)
- `completion_time` (timestamp)
- `user_agent` (text)
- `ip_address` (text)
- `survey_version` (text)
- `media_file_url` (text)
- `media_file_name` (text)
- `created_at` (timestamp with time zone, default: now())

### Storage
Create a storage bucket called `survey_media` for file uploads:
- Set the bucket to private
- Configure appropriate security policies

## Technologies Used

- React 18
- CSS3 with animations
- HTML5
- JavaScript ES6+
- Supabase (database and file storage)
- EmailJS (email backup system)
