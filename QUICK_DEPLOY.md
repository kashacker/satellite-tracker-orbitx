# 🚀 Quick Deploy to Render - 5 Minutes

## ✅ Pre-Flight Check
Your files are ready! I've verified:
- ✅ `backend/package.json` exists
- ✅ `backend/custom-api-advanced.js` exists
- ✅ `render.yaml` created in root directory

## 📋 Deploy Steps (Copy & Paste)

### 1️⃣ Push to GitHub (if not already)
```bash
git add .
git commit -m "Add Render deployment config"
git push origin main
```

### 2️⃣ Deploy on Render
1. Go to: https://dashboard.render.com/
2. Click **"New +"** (top right)
3. Select **"Blueprint"** ⚠️ (NOT "Web Service")
4. Click "Connect a repository"
5. Select your repository
6. Click **"Apply"**
7. Wait 2-3 minutes ⏳

### 3️⃣ Get Your URL
- After deployment completes
- Click on your service name
- Copy the URL (looks like: `https://orbitx-api-xxxx.onrender.com`)

### 4️⃣ Update Frontend Config
Open `assets/js/config.js` and update:

```javascript
LOCAL_SERVER_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001/api'
    : 'https://YOUR-RENDER-URL.onrender.com/api',  // ← Paste your URL here
```

### 5️⃣ Test It!
```bash
# Replace with your actual URL
curl https://YOUR-RENDER-URL.onrender.com/api/health
```

Should return:
```json
{"status":"ok","name":"OrbitX API","satellites":13552,...}
```

## 🎉 Done!

Your backend is now live and free forever!

---

## ⚠️ Important Notes

### First Request is Slow
- Free tier sleeps after 15 min of inactivity
- First request takes ~30 seconds to wake up
- Subsequent requests are fast

### Keep It Awake (Optional)
Use a free service like:
- **UptimeRobot** (https://uptimerobot.com)
- **Cron-job.org** (https://cron-job.org)

Ping your API every 10 minutes:
```
https://YOUR-RENDER-URL.onrender.com/api/health
```

---

## 🆘 Troubleshooting

### "Could not read package.json" error?
- Make sure you selected **"Blueprint"** (not "Web Service")
- The `render.yaml` file tells Render to look in `backend/` folder

### Deployment failed?
1. Check logs in Render dashboard
2. Make sure `satellite.js` is installed: `npm install satellite.js`
3. Verify `package.json` has correct dependencies

### Can't find my service?
- Go to https://dashboard.render.com
- Look under "Services" or "Blueprints"

---

## 📱 Alternative: One-Click Deploy

Click this button to deploy instantly:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

(You'll need to connect your GitHub repo first)

---

## 🔄 Auto-Deploy

Once set up, every time you push to GitHub:
- Render automatically detects changes
- Rebuilds and redeploys
- Zero downtime! 🎉

---

## 💰 Cost

**$0.00** - Completely free!

Free tier includes:
- ✅ 750 hours/month (enough for 24/7)
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Auto-deploy from GitHub
- ✅ Unlimited bandwidth

---

## 🎯 Next Steps

After backend is deployed:

1. **Deploy Frontend** (also free):
   - GitHub Pages
   - Netlify
   - Vercel
   - Cloudflare Pages

2. **Update config.js** with your Render URL

3. **Test everything** works end-to-end

4. **Share your satellite tracker!** 🛰️

---

Need help? Check `RENDER_FIX.md` for detailed troubleshooting!
