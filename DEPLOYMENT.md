# Tavora deployment

The GitHub repository `fiskedxd/backend-tavora` is the backend source code. GitHub itself does not provide the running API URL.

## Backend

Deploy that repository on Render, Railway, Fly.io, or a VPS with:

- Build command: `npm install`
- Start command: `npm start`
- `MONGO_URI`: the connection string for the existing Tavora database
- `CLIENT_URL`: `https://tevora-frontend.vercel.app`; Electron requests with no browser origin are also accepted

For Fly.io, run these commands from the backend repository:

```powershell
fly launch --no-deploy
fly secrets set MONGO_URI="your-existing-mongodb-connection-string" CLIENT_URL="https://your-frontend.example.com"
fly deploy
fly logs
```

The included `fly.toml` maps Fly's health check to `/health` on port `5000` and keeps one machine running.

Keep MongoDB on the same database and do not replace `MONGO_URI`, otherwise existing accounts will not be visible.

## Frontend and desktop build

Copy `frontend/.env.example` to `frontend/.env.production` and replace `VITE_API_URL` with the deployed backend URL. Then run:

```powershell
npm run build
```

The generated Windows installer will use that remote backend for all frontend API calls. The bundled local backend remains available for development and fallback support.