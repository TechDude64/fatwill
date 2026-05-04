# Fat Will Game

A fun drag-and-drop game where you feed Fat Will burgers to make him grow, with a worldwide leaderboard powered by Supabase.

## Features

- Drag burgers into Fat Will's mouth
- Timer to track your speed
- Worldwide leaderboard
- Responsive design

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Build for production: `npm run build`

## Deployment

This project is configured for easy deployment on Vercel. Just connect your GitHub repository to Vercel and it will automatically build and deploy.

## Supabase Setup

Create a table called `leaderboard` with the following structure:

```sql
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  time_ms INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Make sure to set up your Supabase URL and anon key in the code.