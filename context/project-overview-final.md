# TrendlyAI PWA - Project Overview

## Business Model & Market Position
**Target Market**: Brazilian content creators, marketers, and entrepreneurs  
**Business Model**: Freemium SaaS with AI tools and learning tracks  
**Positioning**: AI-powered content creation platform with educational component  

## Core Value Propositions
- **AI Tools Library**: 50+ prompts and tools for content creation
- **Learning Tracks**: Structured courses with video content and practical exercises  
- **Salina AI Integration**: Custom OpenAI-powered assistant for content refinement
- **Progressive Learning**: Step-by-step tracks with practical application

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript 
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: shadcn/ui as foundation
- **PWA Features**: Service workers, offline capability, app-like experience

### Backend & Database
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with Google OAuth integration
- **Storage**: Supabase Storage for avatars, attachments, video content
- **Real-time**: Supabase Realtime for chat functionality

### AI & Integrations
- **AI Assistant**: Salina (custom OpenAI API integration)
- **Payments**: Stripe for subscription management
- **Deployment**: Vercel with automatic deployments

## User Personas

### Primary User: Content Creator "Maria"
- **Age**: 25-35
- **Occupation**: Digital marketer, influencer, entrepreneur
- **Pain Points**: Lack of time, need for quality content, learning new marketing strategies
- **Goals**: Create engaging content faster, learn marketing strategies, grow business

### Secondary User: Small Business Owner "João"
- **Age**: 30-45  
- **Occupation**: Small business owner
- **Pain Points**: Limited marketing knowledge, tight budget, need for automation
- **Goals**: Effective marketing on budget, streamlined processes, competitive advantage

## Subscription Plans

### Free Plan (Freemium)
- **Monthly Credits**: 50 prompts with Salina
- **Tools Access**: Limited to free tools only
- **Tracks Access**: First module of each track only
- **Features**: Basic chat with Salina, tool favorites

### Premium Plan
- **Pricing**: 
  - Quarterly: R$299/month (charged R$897 every 3 months)
  - Annual: R$149/month (charged R$1,788 annually)
- **Credits**: Unlimited Salina interactions
- **Tools Access**: All premium tools unlocked
- **Tracks Access**: Complete access to all learning tracks
- **Features**: Advanced features, priority support

## Core Features Overview

### Tools System
- **Tool Cards**: Category, favorites, premium/free indicators
- **Prompt Editor**: Expandable, editable with save/restore functionality
- **AI Recommendations**: Suggested AI platforms for each tool
- **Quick Guide**: Specific instructions for each tool

### Learning Tracks System
- **Track Cards**: Category, difficulty level, progress tracking
- **Module Structure**:
  - Section 1: "Sua Missão" (video content)
  - Section 2: "Arsenal da Missão" (relevant tools)
  - Section 3: "Execução com Salina" (AI refinement)
  - Section 4: Completion confirmation
- **Progress Tracking**: Step-by-step completion with unlocking system
- **Evaluation**: Star rating system with comments

### Chat System (Salina Integration)
- **Real-time Messaging**: Instant communication with AI
- **Conversation Management**: History, renaming, deletion
- **Credit Integration**: Usage tracking for freemium model
- **Context Awareness**: Understanding of user's tools and tracks

### User Profile System
- **Profile Management**: Avatar upload, personal information
- **Progress Dashboard**: Track completion, tool usage statistics
- **Arsenal Management**: Favorite tools collection
- **Settings**: Preferences, notification controls

## Current Development Status

### Completed Components
- ✅ Supabase database schema (90% complete)
- ✅ HTML prototypes for all major pages
- ✅ Salina AI integration ready
- ✅ Basic authentication structure
- ✅ Repository structure established

### In Progress
- 🔄 HTML to React component migration
- 🔄 Frontend-backend integration
- 🔄 Stripe payment system integration
- 🔄 Vercel deployment optimization

### Pending Implementation
- ❌ Real-time chat functionality
- ❌ Track progress tracking
- ❌ Subscription paywall enforcement
- ❌ Mobile responsiveness optimization
- ❌ Performance optimization

## Success Metrics

### Technical KPIs
- Page load time < 2 seconds
- Mobile responsiveness score > 95
- Core Web Vitals all green
- 99.9% uptime

### Business KPIs  
- User registration conversion > 15%
- Free to premium conversion > 5%
- Monthly active users growth > 20%
- Customer satisfaction > 4.5/5

## Brand Identity
- **Primary Color**: Brand yellow (#efd135)
- **Typography**: Inter for UI, Geist Sans for content
- **Design Language**: Clean, modern, accessible
- **Tone**: Professional yet approachable, Brazilian market-focused