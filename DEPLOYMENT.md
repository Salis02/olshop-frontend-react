# Deployment Guide - SANS Store Frontend

This guide covers deployment strategies for the SANS Store frontend application.

## 📋 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] API endpoints verified
- [ ] Build succeeds locally
- [ ] CORS configured on backend
- [ ] SSL/HTTPS certificate ready (for production)
- [ ] Domain name configured (if applicable)

## 🚀 Deployment Options

### 1. Netlify (Recommended for Quick Deployment)

**Pros**: Easy setup, automatic HTTPS, CDN, continuous deployment
**Cons**: Limited to static hosting

#### Steps:

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy
   ```

3. **Or use drag-and-drop**
   - Go to https://app.netlify.com/drop
   - Drag the `build` folder

4. **Configure environment variables**
   - Go to Site Settings → Environment Variables
   - Add `REACT_APP_API_URL` with your production API URL

5. **Set up redirects** (create `public/_redirects`):
   ```
   /*    /index.html   200
   ```

#### Netlify Configuration File (`netlify.toml`)

```toml
[build]
  command = "npm run build"
  publish = "build"
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  
[build.environment]
  REACT_APP_API_URL = "https://api.yourproduction.com/api"
```

---

### 2. Vercel

**Pros**: Excellent for React apps, automatic deployments, edge network
**Cons**: Can be more complex for larger apps

#### Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure environment variables**
   ```bash
   vercel env add REACT_APP_API_URL
   ```

#### Vercel Configuration File (`vercel.json`)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://api.yourproduction.com/api"
  }
}
```

---

### 3. AWS S3 + CloudFront

**Pros**: Scalable, cost-effective for high traffic, full control
**Cons**: More complex setup

#### Steps:

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Create S3 bucket**
   - Go to AWS S3 console
   - Create bucket (e.g., `sans-store-frontend`)
   - Enable static website hosting
   - Set index document to `index.html`
   - Set error document to `index.html` (for client-side routing)

3. **Upload build folder**
   ```bash
   aws s3 sync build/ s3://sans-store-frontend --delete
   ```

4. **Create CloudFront distribution**
   - Origin: S3 bucket
   - Default root object: `index.html`
   - Error pages: 403 → `/index.html` (200), 404 → `/index.html` (200)

5. **Configure custom domain** (optional)
   - Add CNAME record in Route 53 or your DNS provider
   - Add SSL certificate via ACM

---

### 4. Docker + Any Cloud Provider

**Pros**: Portable, consistent across environments
**Cons**: Requires Docker knowledge

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build args for environment variables
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache static assets
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Build and Run

```bash
# Build Docker image
docker build \
  --build-arg REACT_APP_API_URL=https://api.yourproduction.com/api \
  -t sans-store-frontend .

# Run container
docker run -p 80:80 sans-store-frontend
```

#### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      args:
        REACT_APP_API_URL: ${REACT_APP_API_URL}
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

---

## 🔧 Environment-Specific Builds

### Production Build

```bash
# Use production environment
npm run build
```

### Staging Build

```bash
# Create staging build script in package.json
"scripts": {
  "build:staging": "REACT_APP_API_URL=https://api-staging.yourapp.com/api npm run build"
}

# Run staging build
npm run build:staging
```

---

## 🔐 Security Best Practices

1. **Enable HTTPS**
   - Use SSL/TLS certificates (Let's Encrypt is free)
   - Redirect HTTP to HTTPS

2. **Environment Variables**
   - Never commit `.env` files
   - Use platform-specific environment variable management
   - Rotate sensitive credentials regularly

3. **Headers**
   - Set proper security headers (CSP, HSTS, X-Frame-Options)
   - Already configured in nginx.conf above

4. **CORS**
   - Configure backend CORS to only allow your domain
   ```javascript
   // Backend example
   cors({
     origin: 'https://yourfrontend.com',
     credentials: true
   })
   ```

---

## 📊 Performance Optimization

### 1. Build Analysis

```bash
# Analyze bundle size
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

### 2. Caching Strategy

- Static assets: Cache for 1 year
- HTML: No cache or short cache
- API responses: Use appropriate cache headers

### 3. Compression

- Enable Gzip/Brotli compression on server
- Most platforms (Netlify, Vercel) do this automatically

---

## 🧪 Testing Production Build Locally

```bash
# Build the app
npm run build

# Serve the build folder
npx serve -s build

# Or use Docker
docker build -t sans-store-frontend .
docker run -p 3000:80 sans-store-frontend
```

---

## 📝 Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test user authentication flow
- [ ] Check API connectivity
- [ ] Verify HTTPS is working
- [ ] Test on mobile devices
- [ ] Check console for errors
- [ ] Verify meta tags (use https://metatags.io)
- [ ] Test social sharing (Open Graph)
- [ ] Run Lighthouse audit
- [ ] Set up monitoring/analytics

---

## 🔄 Continuous Deployment

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test -- --passWithNoTests
      
    - name: Build
      run: npm run build
      env:
        REACT_APP_API_URL: ${{ secrets.REACT_APP_API_URL }}
        
    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      with:
        args: deploy --prod --dir=build
```

---

## 🆘 Troubleshooting

### Issue: Blank page after deployment

**Solution**: 
- Check browser console for errors
- Verify `REACT_APP_API_URL` is set correctly
- Ensure routing is configured (see redirects above)

### Issue: API calls failing

**Solution**:
- Check CORS settings on backend
- Verify API URL in environment variables
- Check network tab in browser DevTools

### Issue: Assets not loading

**Solution**:
- Check `homepage` in package.json
- Verify base URL configuration
- Check server for correct MIME types

---

## 📞 Support

For deployment issues:
1. Check deployment platform documentation
2. Review build logs
3. Contact DevOps team

---

**Last Updated**: December 2025
