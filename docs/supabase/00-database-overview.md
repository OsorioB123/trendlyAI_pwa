# 📊 TrendlyAI Supabase Database - Complete Schema Documentation

> **Last Updated:** December 2024  
> **Version:** 2.0 (includes user_referrals table)  
> **Status:** Production Ready

## 🎯 Overview

This document provides a comprehensive mapping of the TrendlyAI Supabase database schema, including all tables, relationships, functions, RLS policies, and storage buckets. This serves as the definitive reference for all database operations.

## 🏗️ Database Architecture

### Core Business Logic
- **User Management**: Profiles, authentication, preferences
- **Content System**: AI tools, learning tracks, modules
- **Progress Tracking**: User progress, completions, favorites
- **Chat System**: Conversations with Salina AI
- **Subscription System**: Stripe integration, payments
- **Referral System**: User referrals, credits, affiliate program

### Key Design Principles
1. **Row Level Security (RLS)**: All tables protected with user-based access policies
2. **Real-time Features**: Live chat and progress updates using Supabase Realtime
3. **Scalable Architecture**: Designed for growth with proper indexing and relationships
4. **Data Integrity**: Foreign key constraints and validation functions
5. **Performance Optimization**: Strategic indexes and efficient query patterns

## 📚 Documentation Structure

| File | Description |
|------|-------------|
| `01-core-tables.md` | User profiles, conversations, messages |
| `02-content-tables.md` | Tools, tracks, modules, reviews |
| `03-progress-tables.md` | User progress, completions, favorites |
| `04-subscription-tables.md` | Stripe integration, payments, plans |
| `05-referral-system.md` | User referrals, credits, affiliate program |
| `06-functions-triggers.md` | Database functions and triggers |
| `07-rls-policies.md` | Row Level Security policies |
| `08-storage-buckets.md` | File storage configuration |
| `09-api-reference.md` | Service layer API documentation |
| `10-migration-scripts.md` | Database setup and migration scripts |

## 🚀 Quick Start

### Essential Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://gugfvihfkimixnetcayg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Database Connection Test
```typescript
import { getSupabase } from '@/lib/supabase'

const supabase = getSupabase()
const { data, error } = await supabase.from('profiles').select('id').limit(1)
```

## 📊 Table Relationship Diagram

```
profiles (users)
├── conversations (1:many)
│   └── messages (1:many)
├── user_tools (1:many)
├── user_tracks (1:many)
├── user_module_progress (1:many)
├── subscriptions (1:many)
├── payment_history (1:many)
└── user_referrals (1:1)

tools (AI tools library)
├── user_tools (1:many)

tracks (learning paths)
├── track_modules (1:many)
├── user_tracks (1:many)
├── track_reviews (1:many)

track_modules
├── user_module_progress (1:many)
```

## 📈 Usage Statistics

### Current Implementation Status
- ✅ **User Management**: Fully implemented
- ✅ **Chat System**: Real-time messaging active
- ✅ **Content System**: Tools and tracks operational
- ✅ **Progress Tracking**: Module completion tracking
- ✅ **Subscription System**: Stripe integration active  
- 🆕 **Referral System**: Newly added with user_referrals table

### Performance Metrics
- **Tables**: 15 core tables
- **Functions**: 12+ custom functions
- **RLS Policies**: 30+ security policies
- **Storage Buckets**: 3 configured buckets
- **Real-time Channels**: Chat and progress tracking

## 🔧 Development Guidelines

### Adding New Tables
1. Create table with proper UUID primary keys
2. Add foreign key relationships with CASCADE deletes
3. Implement RLS policies for user data protection
4. Create appropriate indexes for performance
5. Add to this documentation

### Querying Best Practices
1. Always use RLS-compliant queries
2. Select only needed columns
3. Use proper joins instead of multiple queries
4. Implement pagination for large datasets
5. Handle errors gracefully

### Real-time Subscriptions
1. Always clean up subscriptions on unmount
2. Use specific filters to reduce bandwidth
3. Handle connection status changes
4. Implement reconnection logic

## 📞 Support & Maintenance

For questions about the database schema or to report issues:
- Check this documentation first
- Review the specific table documentation
- Test queries in Supabase dashboard
- Update documentation when making changes

---

*This documentation is maintained as part of the TrendlyAI project. Keep it updated when making database changes.*