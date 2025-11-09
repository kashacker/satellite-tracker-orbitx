# 🚀 OrbitX Deployment Guide

## Backend Deployment (Railway)

Your OrbitX API is ready to deploy!

### Quick Deploy Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy OrbitX API"
   git push
   ```

2. **Railway Auto-Deploys**
   - Railway detects changes automatically
   - Installs `satellite.js` dependency
   - Starts `custom-api-advanced.js`
   - Takes ~2 minutes

3. **Verify Deployment**
   ```bash
   curl https://satellite-tracker-production-6750.up.railway.app/api/health
   ```
   
   Should return:
   ```json
   {
     "status": "ok",
     "name": "OrbitX API",
     "version": "1.0.0",
     "satellites": 13414
   }
   ```

### What's Deployed:

✅ **OrbitX API** - Custom satellite tracking API
- 13,414 satellites from Celestrak
- No API key required
- No rate limits
- Free forever

✅ **Endpoints**:
- `/api/satellites` - All satellites
- `/api/satellites/search?q=query` - Search
- `/api/satellites/category/:category` - Filter
- `/api/position/:id/:lat/:lng/:alt` - Real-time position
- `/api/tle/:id` - TLE data
- `/api/health` - Health check

### Configuration Files:

✅ `package.json` - Dependencies (satellite.js)
✅ `Procfile` - Start command for Railway
✅ `render.yaml` - Alternative deployment config
✅ `custom-api-advanced.js` - Main API server

### Frontend Configuration:

The frontend automatically detects the environment:
- **Local**: Uses `http://localhost:3001/api`
- **Production**: Uses Railway URL

No manual configuration needed!

---

## Frontend Deployment

Deploy frontend to any static hosting:

### Option 1: GitHub Pages

1. Go to repository Settings
2. Pages → Source: main branch
3. Save
4. Your site: `https://username.github.io/repo-name`

### Option 2: Netlify

1. Drag `sat-tracker` folder to netlify.com
2. Done!

### Option 3: Vercel

1. Import from GitHub
2. Deploy!

---

## Testing After Deployment

### Test Backend:
```bash
# Health check
curl https://satellite-tracker-production-6750.up.railway.app/api/health

# Get ISS position
curl https://satellite-tracker-production-6750.up.railway.app/api/position/25544/40.7128/-74.0060/0

# Search Starlink
curl "https://satellite-tracker-production-6750.up.railway.app/api/satellites/search?q=starlink"
```

### Test Frontend:
1. Open your deployed URL
2. Search for "ISS"
3. Click to track
4. Should show real-time position

---

## Deployment Checklist

- [x] Backend code ready
- [x] package.json configured
- [x] Procfile created
- [x] Frontend auto-detects environment
- [x] No API keys needed
- [x] No environment variables needed
- [ ] Push to GitHub
- [ ] Wait for Railway deployment
- [ ] Test endpoints
- [ ] Deploy frontend

---

## Railway Dashboard

Monitor your deployment:
- **URL**: https://railway.app/dashboard
- **Logs**: View real-time logs
- **Metrics**: CPU, Memory, Network
- **Deployments**: History and rollback

---

## Success Criteria

✅ Backend responds to `/api/health`
✅ Returns 13,414 satellites
✅ Search works
✅ Category filter works
✅ Frontend connects successfully
✅ No 401 errors
✅ No API key needed

---

## 🎉 You're Ready!

Just push to GitHub and Railway will deploy automatically!

```bash
git add .
git commit -m "Deploy OrbitX - 13,414 satellites, no API key"
git push
```

Wait 2 minutes and your satellite tracker will be live! 🛰️✨
