# 🔧 Fix Render Deployment Error

## Error You're Seeing:
```
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, 
open '/opt/render/project/src/package.json'
```

## ❌ Problem:
Render is looking for `package.json` in the root directory, but yours is in the `backend/` folder.

## ✅ Solution:

### Method 1: Use Blueprint (Easiest)
1. I've created a `render.yaml` file in your root directory
2. On Render dashboard:
   - Delete your current service (if exists)
   - Click "New +" → **"Blueprint"** (not "Web Service")
   - Connect your repository
   - Render will auto-detect the `render.yaml` file
   - Click "Apply"
   - Done! ✅

### Method 2: Manual Configuration
1. On Render dashboard, go to your service settings
2. Find **"Root Directory"** setting
3. Change it from empty to: `backend`
4. Click "Save Changes"
5. Trigger a manual deploy

### Method 3: Restructure (Alternative)
Move `package.json` to root and update paths:

```bash
# Move backend files to root
mv backend/package.json .
mv backend/custom-api-advanced.js .
mv backend/node_modules . 
```

Then update Render settings:
- **Root Directory**: (leave empty)
- **Build Command**: `npm install`
- **Start Command**: `npm start`

---

## 🎯 Recommended: Method 1 (Blueprint)

This is the cleanest approach. Here's exactly what to do:

### Step-by-Step:

1. **Push the render.yaml file to GitHub**:
   ```bash
   git add render.yaml
   git commit -m "Add Render blueprint config"
   git push
   ```

2. **On Render.com**:
   - Go to https://dashboard.render.com
   - If you have an existing service, delete it:
     - Click on the service
     - Settings → Delete Service
   
3. **Create New Blueprint**:
   - Click "New +" button (top right)
   - Select **"Blueprint"** (not Web Service!)
   - Click "Connect a repository"
   - Find and select your repository
   - Render will detect `render.yaml`
   - Click "Apply"

4. **Wait for deployment** (~2-3 minutes)
   - Watch the logs
   - Should see: "✅ Ready! Tracking 13552 satellites"

5. **Get your URL**:
   - Click on your service
   - Copy the URL (e.g., `https://orbitx-api.onrender.com`)

6. **Update your frontend**:
   ```javascript
   // In assets/js/config.js
   LOCAL_SERVER_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
       ? 'http://localhost:3001/api'
       : 'https://YOUR-RENDER-URL.onrender.com/api',
   ```

---

## 🧪 Test Your Deployment

Once deployed, test it:

```bash
# Test health endpoint
curl https://YOUR-APP.onrender.com/api/health

# Should return:
# {"status":"ok","name":"OrbitX API","version":"1.0.0",...}
```

---

## 🆘 Still Having Issues?

### Check Render Logs:
1. Go to your service on Render
2. Click "Logs" tab
3. Look for errors

### Common Issues:

**Issue**: "npm install" fails
- **Fix**: Make sure `package.json` is in the `backend/` folder

**Issue**: Port binding error
- **Fix**: Remove `PORT` env var (Render sets it automatically)

**Issue**: Module not found
- **Fix**: Check that `satellite.js` is in `dependencies` (not `devDependencies`)

**Issue**: Service keeps crashing
- **Fix**: Check that your code listens on `process.env.PORT || 3001`

---

## 📝 Your render.yaml File

I've created this file for you:

```yaml
services:
  - type: web
    name: orbitx-api
    env: node
    rootDir: backend          # ← This tells Render where package.json is
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
```

This tells Render:
- Look in the `backend/` directory
- Run `npm install` there
- Start with `npm start`

---

## ✅ Verification Checklist

Before deploying, make sure:
- [ ] `render.yaml` is in the **root** directory
- [ ] `package.json` is in the **backend/** directory
- [ ] `custom-api-advanced.js` is in the **backend/** directory
- [ ] Code is pushed to GitHub
- [ ] Using "Blueprint" option (not "Web Service")

---

## 🎉 After Successful Deployment

Your API will be live at: `https://YOUR-APP-NAME.onrender.com`

Test it:
```bash
curl https://YOUR-APP-NAME.onrender.com/api/health
curl https://YOUR-APP-NAME.onrender.com/api/satellites
```

Then update your frontend config and you're done! 🚀
