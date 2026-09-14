# Quick Note Application

A single-page full-stack Note-taking Web Application built for the internship task.

## Features

- Create notes
- Display/read all notes
- Delete notes
- RESTful API endpoints
- Asynchronous frontend requests using `fetch()`
- Local JSON data storage
- Responsive mobile-friendly UI
- Express backend
- Health-check endpoint for deployment

## Tech Stack

- Node.js
- Express.js
- HTML5
- CSS3
- Vanilla JavaScript
- REST API
- JSON file storage

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/notes` | Get all notes |
| POST | `/api/notes` | Create a note |
| DELETE | `/api/notes/:id` | Delete a note |
| GET | `/health` | Server health check |

### POST body

```json
{
  "title": "My first note",
  "content": "This is my note."
}
```

## Run Locally

1. Install Node.js.
2. Open a terminal inside this project folder.
3. Run:

```bash
npm install
npm start
```

4. Open:

`http://localhost:3000`

## GitHub Upload

Create a GitHub repository, then upload all project files and folders.

Do NOT upload `node_modules`.

## Render Deployment

This project is suitable for Render.

- Runtime: Node
- Build Command: `npm install`
- Start Command: `npm start`

After deployment, Render gives you a public URL.

## Vercel Note

Vercel can host this application, but the JSON-file storage approach is not suitable for persistent production storage on serverless deployments. For a simple internship demonstration, Render is the easier choice. If required, replace JSON storage with MongoDB/PostgreSQL for persistent cloud deployment.

## Project Structure

```text
quick-note-application/
├── data/
│   └── notes.json
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Internship Submission

Submit:

1. GitHub Repository URL
2. Deployed Live App URL

Example:

```text
GitHub: https://github.com/YOUR-USERNAME/quick-note-application
Live App: https://YOUR-APP.onrender.com
```
