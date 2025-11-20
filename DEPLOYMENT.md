# 🚀 Free Backend Deployment Guide

## Option 1: Render (Recommended - Always Free)

### Steps:
1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Render**:
   
   **Option A: Using render.yaml (Recommended)**
   - Go to https://render.com
   - Sign up with GitHub
   - Click "New +" → "Blueprint"
   - Connect your repository
   - Render will auto-detect `render.yaml`
   - Click "Apply"
   
   **Option B: Manual Setup**
   - Go to https://render.com
   - Sign up with GitHub
   - Click "New +" → "Web Service"
   - Connect your repository
   - Configure:
     - **Name**: orbitx-api
     - **Root Directory**: `backend` ⚠️ IMPORTANT!
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Click "Create Web Service"

3. **Update Frontend**:
   - Copy your Render URL (e.g., `https://orbitx-api.onrender.com`)
   - Update `assets/js/config.js`:
     ```javascript
     LOCAL_SERVER_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
         ? 'http://localhost:3001/api'
         : 'https://YOUR-APP-NAME.onrender.com/api',
     ```

**Note**: Free tier sleeps after 15 min of inactivity (first request takes ~30s to wake up)

---

## Option 2: Railway (You Already Have This)

### Fix Your Railway Deployment:

1. **Check if service is running**:
   - Go to https://railway.app
   - Check your project status
   - Look for deployment logs

2. **Redeploy**:
   ```bash
   npm i -g @railway/cli
   railway login
   cd backend
   railway link
   railway up
   ```

3. **Get your Railway URL**:
   - Go to Railway dashboard
   - Click on your service
   - Go to "Settings" → "Domains"
   - Copy the public URL
   - Update `config.js` with this URL

---

## Option 3: Fly.io (Always On)

### Steps:
1. **Install Fly CLI**:
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   
   # Mac/Linux
   curl -L https://fly.io/install.sh | sh
   ```

2. **Deploy**:
   ```bash
   cd backend
   fly auth login
   fly launch
   # Answer prompts:
   # - App name: orbitx-api
   # - Region: Choose closest to you
   # - Database: No
   # - Deploy now: Yes
   ```

3. **Get URL**:
   ```bash
   fly status
   # Copy the hostname (e.g., orbitx-api.fly.dev)
   ```

---

## Option 4: Cyclic.sh (Easy & Free)

### Steps:
1. **Push to GitHub** (if not already)
2. Go to https://cyclic.sh
3. Sign in with GitHub
4. Click "Link Your Own"
5. Select your repository
6. Set:
   - **Root Directory**: backend
   - **Start Command**: npm start
7. Deploy!
8. Copy the URL and update `config.js`

---

## Option 5: Vercel (Serverless - Requires Code Changes)

### Steps:
1. **Create vercel.json** in backend folder:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "custom-api-advanced.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "custom-api-advanced.js"
       }
     ]
   }
   ```

2. **Deploy**:
   ```bash
   npm i -g vercel
   cd backend
   vercel
   ```

---

## 📊 Comparison

| Platform | Free Tier | Always On | Cold Start | Best For |
|----------|-----------|-----------|------------|----------|
| **Render** | ✅ Unlimited | ❌ Sleeps 15min | ~30s | Best overall |
| **Railway** | ⚠️ $5/month | ✅ Yes | None | Small projects |
| **Fly.io** | ✅ 3 VMs | ✅ Yes | None | Production |
| **Cyclic** | ✅ Unlimited | ✅ Yes | ~5s | Easy setup |
| **Vercel** | ✅ Unlimited | ❌ Serverless | ~1s | Serverless |
| **Glitch** | ✅ Unlimited | ❌ Sleeps 5min | ~10s | Quick tests |

---

## 🎯 My Recommendation

**For your satellite tracker, use Render**:
- ✅ Completely free forever
- ✅ Easy GitHub integration
- ✅ Automatic deployments
- ✅ Free SSL certificate
- ✅ Good performance
- ⚠️ Only downside: 15-min sleep (acceptable for most users)

**Alternative**: If you need always-on, use **Fly.io** (3 free VMs)

---

## 🔧 After Deployment

1. Test your API:
   ```bash
   curl https://YOUR-APP-URL.com/api/health
   ```

2. Update frontend config:
   ```javascript
   // assets/js/config.js
   LOCAL_SERVER_URL: 'https://YOUR-APP-URL.com/api'
   ```

3. Deploy frontend to:
   - **GitHub Pages** (free)
   - **Netlify** (free)
   - **Vercel** (free)
   - **Cloudflare Pages** (free)

---

## 🆘 Troubleshooting

### Railway Link Not Working?
- Check if service is running in Railway dashboard
- Verify domain is correctly configured
- Check deployment logs for errors
- Try redeploying

### CORS Issues?
- Already handled in your code with:
  ```javascript
  res.setHeader('Access-Control-Allow-Origin', '*');
  ```

### API Timeout?
- Increase timeout in hosting platform settings
- Optimize satellite catalog loading
- Consider caching TLE data

---

## 📝 Quick Deploy Commands

```bash
# Render (via GitHub)
git push origin main  # Auto-deploys

# Railway
railway up

# Fly.io
fly deploy

# Vercel
vercel --prod

# Cyclic
# Just push to GitHub (auto-deploys)
```

Choose the platform that fits your needs and follow the steps above! 🚀
