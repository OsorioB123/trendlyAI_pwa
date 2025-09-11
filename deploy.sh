#!/bin/bash

# TrendlyAI Deployment Script
echo "🚀 Starting TrendlyAI deployment preparation..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .next
rm -rf node_modules/.cache

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run build test
echo "🔨 Testing build process..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Commit any final changes
    echo "💾 Committing deployment-ready code..."
    git add .
    git commit -m "Prepare for Vercel deployment - build verified

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>" || echo "No changes to commit"
    
    # Push to GitHub
    echo "📤 Pushing to GitHub..."
    git push origin main
    
    echo ""
    echo "🎉 Deployment preparation complete!"
    echo ""
    echo "Next steps:"
    echo "1. Go to https://vercel.com/dashboard"
    echo "2. Click 'New Project'"
    echo "3. Import your GitHub repository"
    echo "4. Add environment variables from .env.local"
    echo "5. Click Deploy!"
    echo ""
    echo "📚 See DEPLOYMENT.md for detailed instructions"
    
else
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi