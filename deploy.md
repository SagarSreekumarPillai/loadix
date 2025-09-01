# 🚀 Lodix Deployment Guide

This guide covers deploying all components of the Lodix platform to production environments.

## 📋 Prerequisites

- GitHub repository with all code committed
- Vercel account (for frontend)
- Railway account (for backend)
- Docker Hub account (for AI service)
- MongoDB Atlas cluster
- Environment variables configured

## 🌐 Frontend Deployment (Vercel)

### 1. Connect to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Navigate to frontend directory
cd apps/frontend
```

### 2. Configure Environment Variables
Create `.env.production` file:
```env
NEXT_PUBLIC_APP_NAME=Lodix
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_AI_SERVICE_URL=https://your-ai-service.railway.app
```

### 3. Deploy
```bash
# Deploy to Vercel
vercel --prod

# Or use Vercel dashboard
# 1. Go to vercel.com
# 2. Import your GitHub repository
# 3. Set root directory to: apps/frontend
# 4. Configure environment variables
# 5. Deploy
```

## 🔧 Backend Deployment (Railway)

### 1. Connect to Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Navigate to backend directory
cd apps/backend
```

### 2. Configure Environment Variables
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lodix
FRONTEND_URL=https://your-domain.vercel.app
JWT_SECRET=your-super-secret-jwt-key
```

### 3. Deploy
```bash
# Initialize Railway project
railway init

# Deploy
railway up

# Or use Railway dashboard
# 1. Go to railway.app
# 2. Create new project
# 3. Connect GitHub repository
# 4. Set root directory to: apps/backend
# 5. Configure environment variables
# 6. Deploy
```

## 🤖 AI Service Deployment (Railway + Docker)

### 1. Build Docker Image
```bash
# Navigate to AI service directory
cd apps/ai-service

# Build image
docker build -t lodix-ai-service .

# Tag for Docker Hub
docker tag lodix-ai-service your-username/lodix-ai-service:latest

# Push to Docker Hub
docker push your-username/lodix-ai-service:latest
```

### 2. Deploy to Railway
```bash
# Use Railway dashboard
# 1. Create new service in your project
# 2. Choose "Deploy from Docker Hub"
# 3. Enter: your-username/lodix-ai-service:latest
# 4. Set port to 8001
# 5. Configure environment variables
# 6. Deploy
```

### 3. Alternative: Deploy to Railway with Python
```bash
# Navigate to AI service directory
cd apps/ai-service

# Initialize Railway project
railway init

# Deploy
railway up
```

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create Cluster
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create new cluster (M0 Free tier for testing)
3. Choose cloud provider and region (EU preferred)

### 2. Configure Network Access
1. Add IP address: `0.0.0.0/0` (for development)
2. Or add specific IPs for production

### 3. Create Database User
1. Create database user with read/write permissions
2. Note username and password

### 4. Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<password>` with actual password

## 🔐 Environment Variables Summary

### Frontend (.env.production)
```env
NEXT_PUBLIC_APP_NAME=Lodix
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_AI_SERVICE_URL=https://your-ai-service.railway.app
```

### Backend (.env)
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lodix
FRONTEND_URL=https://your-domain.vercel.app
JWT_SECRET=your-super-secret-jwt-key
```

### AI Service (.env)
```env
ENVIRONMENT=production
LOG_LEVEL=info
```

## 🚀 Production Deployment Steps

### 1. Update Environment Variables
- Set all production URLs
- Configure production MongoDB connection
- Set secure JWT secrets

### 2. Deploy Backend First
```bash
cd apps/backend
railway up
```

### 3. Deploy AI Service
```bash
cd apps/ai-service
railway up
```

### 4. Deploy Frontend
```bash
cd apps/frontend
vercel --prod
```

### 5. Test All Services
- Verify backend health endpoint
- Test AI service endpoints
- Check frontend functionality
- Test order creation and tracking

## 🔍 Post-Deployment Checklist

- [ ] All services are running and accessible
- [ ] Environment variables are correctly set
- [ ] Database connection is working
- [ ] Frontend can communicate with backend
- [ ] AI service is responding to requests
- [ ] Order creation flow works end-to-end
- [ ] Shipment tracking is functional
- [ ] Dashboard displays data correctly
- [ ] Error handling is working properly
- [ ] Logs are being generated

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure FRONTEND_URL is set correctly in backend
2. **Database Connection**: Check MongoDB Atlas network access and credentials
3. **Environment Variables**: Verify all variables are set in deployment platforms
4. **Port Conflicts**: Ensure ports are correctly configured in Railway

### Debug Commands

```bash
# Check backend logs
railway logs

# Check AI service logs
railway logs

# Check frontend build
vercel logs

# Test backend health
curl https://your-backend.railway.app/api/health

# Test AI service
curl https://your-ai-service.railway.app/health
```

## 📊 Monitoring & Analytics

### 1. Railway Monitoring
- CPU and memory usage
- Request logs
- Error rates
- Response times

### 2. Vercel Analytics
- Page views
- Performance metrics
- Error tracking
- User behavior

### 3. MongoDB Atlas
- Database performance
- Query optimization
- Storage usage
- Connection monitoring

## 🔄 Continuous Deployment

### GitHub Actions Setup
1. Configure secrets in GitHub repository
2. Set up automatic deployment on push to main
3. Configure environment-specific deployments

### Environment Management
- Development: Local development
- Staging: Railway staging environment
- Production: Vercel + Railway production

## 📞 Support & Maintenance

- Monitor application logs regularly
- Set up alerts for critical errors
- Keep dependencies updated
- Regular security audits
- Performance monitoring and optimization

---

**Deployment Status**: Ready for production deployment  
**Last Updated**: December 2024  
**Next Steps**: Deploy to staging environment for testing
