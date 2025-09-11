# TrendlyAI Feature Specifications

## Authentication System

### User Registration & Login
**Components**: LoginPage, SignUpPage, ForgotPasswordPage
**Features**:
- Google OAuth integration (primary method)
- Email/password authentication (secondary)
- Password reset functionality
- Automatic profile creation on signup
- Session persistence
- Protected routes middleware

**User Flow**:
1. User lands on login page
2. Clicks "Continue with Google" or enters email/password
3. Successful auth redirects to dashboard
4. Profile automatically created in Supabase
5. Session managed with Supabase Auth

**Business Rules**:
- New users start with 50 free credits
- Free plan limitations applied immediately
- Premium features locked until subscription

## Tools System

### Tool Discovery & Access
**Components**: AllToolsPage, ToolCard, ToolModal
**Features**:
- Grid/list view of all available tools
- Category filtering (Marketing, Copywriting, Business, etc.)
- Search functionality
- Free vs Premium differentiation
- Favorites system

### Tool Card Design
**Visual Elements**:
- Category badge (top-left corner)
- Favorite heart icon (top-right corner)  
- Tool title and subtitle
- Premium lock overlay (if premium)
- Hover states with elevation

**Business Logic**:
- Free tools: Accessible to all users
- Premium tools: Locked with upgrade prompt for free users
- Visual indication of premium status (lock icon)

### Tool Usage Interface
**Components**: ToolDetailModal, PromptEditor
**Features**:
- Tool overview with quick guide
- AI platform recommendations (ChatGPT, Claude, Gemini icons)
- Expandable prompt section
- Prompt editing capability
- Save custom prompts
- Restore to original prompt
- Copy prompt functionality

**User Interaction Flow**:
1. User clicks tool card
2. Modal opens with tool details
3. User reads quick guide
4. User views/edits prompt
5. User can save modifications or restore original
6. User copies prompt to use in AI platform

### Favorites System
**Functionality**:
- Toggle favorite status on tool cards
- Persist favorites in Supabase (user_tools table)
- Filter view to show only favorites
- Heart icon visual feedback

## Tracks System (Learning Platform)

### Track Discovery
**Components**: TracksListingPage, TrackCard
**Features**:
- Track grid with category filtering
- Progress indicators on cards
- Difficulty level indicators
- Premium content restrictions

### Track Card Design  
**Visual Elements**:
- Category badge
- Difficulty level indicator (Iniciante, Intermediário, Avançado)
- Progress bar/percentage
- Track title and subtitle
- Background image/thumbnail

### Track Detail Structure
**Components**: TrackDetailPage, ModuleComponent
**Module Structure** (4 sections per module):

#### Section 1: "Sua Missão"
- **Content**: Instructional video
- **Purpose**: Explain module objectives and context
- **Technical**: Video player integration with Supabase Storage

#### Section 2: "Arsenal da Missão"  
- **Content**: Compact tool cards relevant to module
- **Purpose**: Provide specific tools for module tasks
- **Technical**: Query tools table filtered by module requirements

#### Section 3: "Execução com a Salina"
- **Content**: Fixed section with call-to-action
- **Text**: "Agora que você tem as ferramentas, é hora de refinar. Leve seus prompts e ideias para a Salina."
- **Action**: Button "Conversar com Salina" → redirects to chat

#### Section 4: Module Completion
- **Content**: Completion button and progress update
- **Text**: "Marcar etapa como concluída"
- **Function**: Updates progress, unlocks next module
- **Visual**: Check mark indication when completed

### Progress Tracking System
**Features**:
- Module-by-module completion tracking
- Sequential unlocking (must complete previous to access next)
- Overall track progress percentage
- Visual progress indicators
- Completion certificates/badges

**Business Rules**:
- Free users: Access only to first module of each track
- Premium users: Full access to all modules
- Popup notification for free users trying to access locked content

### Track Evaluation System
**Components**: RatingComponent, ReviewForm
**Features**:
- 5-star rating system
- Written review/comment capability
- Display aggregated ratings
- User-specific review management

## Chat System (Salina Integration)

### Chat Interface
**Components**: ChatPage, MessageComponent, InputArea
**Features**:
- Real-time messaging with Salina AI
- Conversation history
- Message persistence
- Typing indicators
- Message status indicators

### Conversation Management
**Features**:
- Create new conversations
- Rename conversations
- Delete conversations
- Conversation list sidebar
- Search conversation history

### Credit System Integration
**Business Logic**:
- Free users: 50 prompts/month limit
- Premium users: Unlimited usage
- Credit deduction per message sent
- Visual credit counter in header
- Monthly reset for free users
- Upgrade prompt when credits exhausted

### AI Integration
**Technical Specs**:
- OpenAI API integration (custom Salina instance)
- Message context preservation
- Response streaming (if supported)
- Error handling for API failures
- Conversation context management

### Message Types
**User Messages**:
- Text input
- File attachments (future)
- Voice messages (future)

**Assistant Messages**:
- Text responses
- Formatted responses
- Code blocks
- Lists and structured content

## Profile & Settings System

### User Profile Management
**Components**: ProfilePage, AvatarUpload, ProfileForm
**Features**:
- Personal information editing
- Avatar upload (Supabase Storage)
- Progress dashboard
- Usage statistics
- Arsenal (favorite tools) overview

### Progress Dashboard
**Metrics Displayed**:
- Active tracks and progress
- Completed tracks
- Tools used this month
- Credits remaining (free users)
- Subscription status

### Arsenal Management
**Features**:
- Grid view of favorite tools
- Quick access to favored tools
- Remove from favorites option
- Usage frequency indicators

### Settings & Preferences
**Components**: SettingsPage, PreferencesForm
**Options**:
- Notification preferences
- Theme settings (if multiple themes)
- Language preferences
- Privacy settings
- Account management

## Subscription & Payment System

### Plan Comparison
**Components**: PricingPage, PlanCard, FeatureComparison
**Plans Available**:

#### Free Plan
- 50 monthly Salina credits
- Access to free tools only
- First module of each track only
- Basic features

#### Premium Plans
- **Quarterly**: R$299/month (charged R$897 every 3 months)
- **Annual**: R$149/month (charged R$1,788 annually)
- Unlimited Salina credits
- All premium tools unlocked
- Complete track access
- Priority support

### Subscription Management
**Components**: SubscriptionPage, BillingHistory, PlanManagement
**Features**:
- Current plan display
- Billing history
- Payment method management
- Plan upgrade/downgrade
- Cancellation options
- Pause subscription (if supported)

### Paywall Implementation
**Triggers**:
- Accessing premium tools
- Attempting to view locked track modules
- Exceeding credit limits
- Accessing premium features

**Paywall Components**:
- Modal overlay with upgrade prompt
- Plan comparison
- Direct checkout integration
- Value proposition messaging

### Stripe Integration
**Features**:
- Secure payment processing
- Brazilian payment methods support
- Automatic subscription management
- Webhook handling for status updates
- Invoice generation
- Tax calculation (if required)

## Header & Navigation System

### Global Header
**Components**: Header, Navigation, UserMenu, CreditCounter
**Elements**:
- Logo/brand
- Main navigation links
- Search bar (optional)
- Notifications icon
- Credit counter (free users)
- User avatar and dropdown

### Credit Counter
**Display Logic**:
- Free users: "X/50 credits remaining"
- Premium users: "Unlimited" or hidden
- Visual warning at 10 credits remaining
- Color coding: Green (>20), Yellow (10-20), Red (<10)

### User Menu Dropdown
**Options**:
- Profile
- Settings  
- Subscription management
- Arsenal (favorites)
- Help center
- Logout

### Notification System
**Features**:
- In-app notifications
- Credit limit warnings
- Course completion celebrations
- System announcements
- Upgrade prompts

## Help & Support System

### Help Center
**Components**: HelpCenterPage, FAQComponent, ContactForm
**Content Structure**:
- Getting started guide
- Feature tutorials
- Billing & subscription help
- Technical troubleshooting
- Contact support

### FAQ System
**Categories**:
- Account management
- Billing & payments
- Using tools
- Learning tracks
- Technical issues

**Interactive Elements**:
- Expandable FAQ items
- Search functionality
- Helpful/not helpful voting
- Contact support escalation

## Mobile & PWA Features

### Progressive Web App
**Features**:
- Offline capability
- App-like experience
- Push notifications
- Home screen installation
- Fast loading with service workers

### Mobile Responsiveness
**Breakpoints**:
- Mobile: 375px - 640px
- Tablet: 641px - 1024px  
- Desktop: 1025px+

**Mobile Adaptations**:
- Touch-friendly interfaces
- Simplified navigation
- Optimized chat interface
- Mobile-specific interactions
- Thumb-friendly button placement

## Performance & Technical Requirements

### Loading Performance
**Targets**:
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Time to Interactive < 3.5s
- Core Web Vitals all green

### Security Requirements
**Implementation**:
- Row Level Security (RLS) on all tables
- API route protection
- Input validation and sanitization
- Secure file upload handling
- Rate limiting on API endpoints

### SEO & Metadata
**Requirements**:
- Dynamic meta tags
- Open Graph tags
- Structured data
- Sitemap generation
- Robot.txt configuration