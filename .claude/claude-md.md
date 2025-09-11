# TrendlyAI PWA - Project Configuration

## Project Overview
TrendlyAI is a comprehensive PWA (Progressive Web App) providing AI-powered tools and guided learning tracks for content creation and productivity. The application features a freemium business model with Stripe integration, Supabase backend, and OpenAI API integration through "Salina" (custom AI assistant) targeting the Brazilian market.

## Technology Stack
- **Frontend**: Next.js 14+ App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **AI Integration**: Salina (custom OpenAI API)
- **Payments**: Stripe integration for Brazilian market
- **Deployment**: Vercel with automatic deployments

## Project Context Files
All essential project information is documented in `/context/`:
- `project-overview.md` - Business model, user personas, technical architecture
- `supabase-schema.md` - Complete database schema and functions
- `design-system.md` - Colors, typography, components design patterns
- `feature-specs.md` - Detailed specifications for all features
- `migration-strategy.md` - HTML to React conversion plan

## Current Project State
- HTML prototypes complete and organized in `/context/pages/` and `/context/components/`
- Supabase schema 90% implemented with all tables and functions
- 8 specialized agents configured for development workflow
- Repository structure optimized for Claude Code efficiency
- Ready for systematic HTML→React migration starting with authentication

## Visual Development Integration

### Design Principles
- Comprehensive design system in `/context/design-system.md`
- HTML reference files in `/context/pages/` and `/context/components/`
- When making visual changes, always refer to these files for design fidelity

### Quick Visual Check
IMMEDIATELY after implementing any front-end change:
1. **Identify what changed** - Review the modified components/pages
2. **Navigate to affected pages** - Use `mcp__playwright__browser_navigate` to visit each changed view
3. **Verify design compliance** - Compare against `/context/design-system.md` and HTML reference files
4. **Validate feature implementation** - Ensure the change fulfills the user's specific request
5. **Check acceptance criteria** - Review any provided context files or requirements
6. **Capture evidence** - Take full page screenshot at desktop viewport (1440px) of each changed view
7. **Check for errors** - Run `mcp__playwright__browser_console_messages`

### Comprehensive Design Review
Invoke the `@agent design-reviewer` subagent for thorough design validation when:
- Completing significant UI/UX features
- Before finalizing PRs with visual changes
- Needing comprehensive accessibility and responsiveness testing

## Agent Workflow Strategy

### Development Sequence
1. **@agent ux-researcher** - Analyze features and create research reports
2. **@agent ui-designer** - Create detailed visual designs and component specs
3. **@agent frontend-developer** - Implement React components with Tailwind CSS
4. **@agent supabase-integrator** - Handle database operations and real-time features
5. **@agent stripe-integration-specialist** - Implement payment flows and subscription logic
6. **@agent whimsy-injector** - Add micro-interactions and delightful user experience enhancements
7. **@agent design-reviewer** - Validate implementation quality and standards
8. **@agent vercel-deployer** - Optimize and deploy to production

### Session Management
Active development sessions in `/claude/tasks/context_sessions/`:
- `auth_system.md` - Authentication and user management
- `tools_system.md` - AI tools library and usage
- `chat_system.md` - Real-time chat with Salina AI
- `tracks_system.md` - Learning tracks and progress
- `subscription_system.md` - Payment and subscription management

Agent reports automatically saved to `/claude/tasks/docs/[agent_type]/`

### Context Sharing Rules
- Always read current session file before starting work
- Update session file with progress and decisions
- Reference HTML files in `/context/` for design fidelity
- Save detailed reports to appropriate `/claude/tasks/docs/` subfolder

## Development Priorities

### Phase 1: Core Foundation (Week 1)
- Authentication system (login, signup, protected routes)
- Basic dashboard and navigation
- Supabase integration setup

### Phase 2: Content Systems (Week 2-3)
- Tools system with favorites and editing
- Chat system with Salina integration
- Credit tracking and management

### Phase 3: Learning Platform (Week 4-5)
- Tracks system with progress tracking
- Video integration and module completion
- Real-time features implementation

### Phase 4: Monetization (Week 5-6)
- Stripe integration and subscription management
- Paywall enforcement
- Billing and payment history

### Phase 5: Polish & Deploy (Week 6)
- Performance optimization
- Mobile responsiveness
- Production deployment

## Code Quality Requirements

### Component Architecture Guidelines
- Create reusable UI components in `/src/components/ui/` using shadcn/ui foundation
- Implement feature-specific components in organized domain folders
- Use proper state management with React Context and custom hooks
- Follow atomic design principles for component hierarchy
- Ensure proper TypeScript interfaces for all props and data structures

### Development Standards
- Follow React best practices and modern hooks patterns
- Use TypeScript strict mode for comprehensive type safety
- Implement proper error handling and loading states throughout
- Ensure responsive design with mobile-first approach
- Maintain WCAG AA accessibility standards compliance

### File Naming and Organization Standards
- Components: PascalCase with descriptive names (e.g., UserProfileCard.tsx)
- Pages: PascalCase following Next.js conventions (e.g., ChatPage.tsx)
- Utilities: camelCase for function files (e.g., authHelpers.ts)
- Context Files: kebab-case with descriptive prefixes (e.g., auth_system.md)

## TrendlyAI Business Model Integration

### Subscription Tiers
- **Free Tier**: 50 prompts/month, limited tools and tracks access
- **Premium Quarterly**: R$299/month (R$897 charged quarterly)
- **Premium Annual**: R$149/month (R$1,788 charged annually)

### Feature Access Control
Implement proper access control throughout the application:
- **Tools System**: Premium tools with lock indicators and upgrade prompts
- **Tracks System**: Advanced learning content behind premium subscription
- **Chat System**: Credit-based limitations with real-time tracking
- **Profile Features**: Enhanced analytics and progress tracking for premium users

## Supabase Integration Standards

### Database Operations
- Always implement comprehensive error handling for database operations
- Use Row Level Security (RLS) considerations in frontend implementation
- Implement real-time subscriptions for live features (chat, notifications)
- Handle authentication states properly throughout the application
- Use optimistic updates for better user experience

### Primary Integration Tables
- `profiles` - User profile data and subscription status
- `conversations` - Chat conversations with Salina AI
- `messages` - Individual chat messages with real-time updates
- `tools` - AI tools and prompts with categorization
- `tracks` - Learning tracks with step-by-step progression
- `user_module_progress` - Track completion and achievement tracking
- `user_tools` - User's favorite tools and custom prompts
- `subscriptions` - Premium subscription data and billing information

## API Endpoints Structure
- `/api/auth/*` - Authentication and session management
- `/api/chat/*` - Chat functionality with OpenAI integration
- `/api/stripe/*` - Payment processing and webhook handling
- `/api/tools/*` - Tool management and user interactions
- `/api/tracks/*` - Track progression and completion management

## Security and Performance Standards

### Security Implementation
- Implement proper authentication checks on all protected routes and API endpoints
- Use Supabase Row Level Security for database-level protection
- Validate all user inputs and implement rate limiting for API calls
- Handle sensitive data securely, especially payment and personal information
- Implement proper error boundaries that don't expose sensitive information

### Performance Optimization
- Optimize images and assets using Next.js Image component
- Implement proper caching strategies for API responses and static content
- Use code splitting and lazy loading for large components and features
- Monitor and optimize Core Web Vitals for SEO and user experience
- Handle rate limiting appropriately, especially for OpenAI API calls

## Brazilian Market Considerations
- Portuguese language UI with proper localization
- Local payment methods (Stripe supports PIX, boleto)
- Cultural design preferences and user interface expectations
- Timezone and date formatting (BRT)
- Local pricing in BRL with tax considerations

## Migration Strategy from HTML to React

### Migration Phases
1. **Authentication System**: Login, signup, password reset functionality
2. **Tools System**: AI tool cards, favorites, prompt editing capabilities
3. **Chat System**: Real-time Salina AI interface with message persistence
4. **Tracks System**: Learning progression with video content and step tracking
5. **Subscription System**: Stripe integration and payment flow implementation
6. **Profile System**: User management, settings, and progress visualization

### Migration Principles
- Preserve all existing functionality and user experience patterns
- Improve performance and accessibility during conversion process
- Maintain visual design fidelity while implementing responsive enhancements
- Add proper error handling and loading states throughout the application
- Implement comprehensive testing coverage for migrated components

## Development Environment Limitations

### Manual Tasks (Claude Code Cannot Perform)
- Creating or editing Supabase tables and database schema
- Executing SQL commands or database migrations
- Creating storage buckets or configuring file upload policies
- Creating or modifying Supabase Edge Functions
- Stripe dashboard configuration and webhook setup

These tasks must be completed manually in respective dashboards with proper documentation.

## Documentation Requirements
All prompts and documentation for Claude Code must be:
- Extremely detailed and comprehensive with clear acceptance criteria
- Written in English with proper technical terminology
- Heavily contextualized to prevent misinterpretation or scope creep
- Include specific examples and expected outcomes with success metrics
- Reference existing context files and maintain consistency with established patterns

## Quality Standards
- All components must match HTML reference designs
- WCAG AA accessibility compliance required
- Mobile-first responsive design
- Core Web Vitals > 90 scores
- Comprehensive error handling and loading states
- TypeScript strict mode compliance
- Progressive Web App features implementation

This configuration ensures systematic, high-quality development that aligns with TrendlyAI's business objectives while maintaining enterprise-grade code standards and user experience excellence.