# Render Deployment Fix Guide

## Errors You're Seeing:

1. **MongoServerSelectionError: SSL/TLS error**
2. **currUser is not defined**

## Root Cause:

MongoDB Atlas is blocking Render's IP addresses. This causes:
- Session store to fail
- Passport authentication to fail
- `req.user` to be undefined
- `currUser` to be undefined in views

## Solution: Whitelist Render IPs in MongoDB Atlas

### Step 1: Allow All IPs (Recommended for Render)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select your cluster
3. Click **"Network Access"** in left sidebar
4. Click **"Add IP Address"**
5. Click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` to whitelist
6. Click **"Confirm"**
7. **Wait 2-3 minutes** for changes to propagate

### Step 2: Verify Connection String

Your connection string should look like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database?retryWrites=true&w=majority
```

Make sure:
- ✅ Password is URL-encoded (@ = %40, # = %23, etc.)
- ✅ Database name is included
- ✅ No extra spaces

### Step 3: Set Environment Variables on Render

1. Go to your Render dashboard
2. Select your web service
3. Go to **"Environment"** tab
4. Add these variables:

```
ATLASDB_URL=mongodb+srv://pratikkumarbehera30_db_user:Pratik%403046@cluster0.cvxmaed.mongodb.net/wanderlust?retryWrites=true&w=majority&appName=Cluster0

CLOUD_NAME=djbtzp5o1
CLOUD_API_KEY=287311169499634
CLOUD_API_SECRET=LmsShqNc8HQ337abOGnBTSobP7w
```

4. Click **"Save Changes"**
5. Render will automatically redeploy

## Alternative: Use Render's Outbound IPs

If you don't want to allow all IPs:

1. Get Render's outbound IPs from your service settings
2. Add each IP to MongoDB Atlas Network Access
3. Format: `xxx.xxx.xxx.xxx/32`

## Verify It's Working:

After deployment, check Render logs for:
```
connected to the DB
listening to port 8080
```

If you see these, it's working! ✅

## Common Issues:

### Issue 1: Still getting SSL error
**Solution:** Wait 5 minutes after whitelisting IPs, then redeploy

### Issue 2: currUser still undefined
**Solution:** Clear browser cookies and try again

### Issue 3: Connection timeout
**Solution:** Check if cluster is paused in MongoDB Atlas

## Testing Locally First:

Before deploying, test locally:

```bash
# Set environment variable
$env:ATLASDB_URL="your-connection-string"

# Run app
node app.js
```

Should see:
```
connected to the DB
listening to port 8080
```

## MongoDB Atlas Cluster Status:

Make sure your cluster is:
- ✅ Active (not paused)
- ✅ Has network access configured
- ✅ Has database user created
- ✅ Connection string is correct

## Final Checklist:

- [ ] MongoDB Atlas IP whitelist includes 0.0.0.0/0
- [ ] Waited 2-3 minutes after whitelisting
- [ ] Environment variables set on Render
- [ ] Connection string has database name
- [ ] Password is URL-encoded
- [ ] Cluster is active (not paused)
- [ ] Redeployed on Render

## If Still Not Working:

1. Check Render logs for exact error
2. Test connection string locally first
3. Verify MongoDB Atlas credentials
4. Try creating a new database user with simple password (no special characters)
5. Get fresh connection string from MongoDB Atlas

## Support:

- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
- Render: https://render.com/docs
