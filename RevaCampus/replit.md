# REVA Campus Services Platform

## Overview

REVA Campus Services Platform is a comprehensive web application designed for REVA University students to connect, collaborate, and engage with their campus community. The platform provides three core modules: Lost & Found for reporting and claiming lost items, Fundraising for supporting student-led causes, and Campus Events for discovering and participating in university activities. Built with a modern social media-inspired interface similar to Instagram and TikTok, the platform emphasizes user engagement through interactive feeds, real-time updates, and community-driven content.

## Recent Completion Status (August 2025)

✓ All three core modules fully implemented and operational
✓ Complete CRUD operations for Lost & Found, Fundraising, and Events
✓ Social media features: likes, comments, sharing across all content types
✓ User Profile page with activity tracking and comprehensive statistics
✓ Authentication system with Replit Auth fully integrated
✓ Database populated with sample data across all tables
✓ Mobile-responsive design with glassmorphism UI optimized for Gen Z users
✓ All API endpoints tested and verified working correctly
✓ Navigation system updated to include all pages and user menu
✓ SelectItem empty value errors resolved for stable app performance
✓ Complete Admin Dashboard system implemented for platform management
✓ Admin authentication and role-based access control operational
✓ Content moderation and user management features fully functional
✓ Campaign and event creation forms with proper validation working
✓ Fix for object reference errors in API calls resolved

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built using React with TypeScript, featuring a component-based architecture that supports responsive design and real-time interactions. The UI framework leverages Radix UI components styled with Tailwind CSS for consistent design patterns and accessibility. The application uses Wouter for client-side routing and React Query (TanStack Query) for efficient state management and API data fetching with caching capabilities.

### Backend Architecture
The server is built on Node.js using Express.js with TypeScript for type safety. The application follows a RESTful API pattern with clear separation of concerns through dedicated route handlers, storage layer abstraction, and middleware for authentication and request processing. The backend implements comprehensive CRUD operations for all major entities and includes real-time features through WebSocket integration.

### Database Design
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations and schema management. The database schema includes tables for users, lost & found items, fundraising campaigns, campus events, donations, RSVPs, comments, likes, and notifications. Session management is handled through a dedicated sessions table for secure authentication persistence.

### Authentication System
Authentication is implemented using Replit's OpenID Connect (OIDC) authentication system with Passport.js for session management. The system includes middleware for protecting routes, user session management, and role-based access control supporting both student and admin user types. Session storage is managed through PostgreSQL with automatic cleanup and security features.

### Real-time Features
The platform incorporates WebSocket functionality for real-time updates across modules, enabling instant notifications, live feed updates, and synchronized user interactions. The system supports features like real-time commenting, live donation tracking, and instant event RSVP updates.

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database hosting with automatic scaling and connection pooling
- **Drizzle ORM**: Type-safe database operations with schema migration support

### Authentication & User Management
- **Replit Authentication**: OpenID Connect provider for user authentication and profile management
- **Passport.js**: Authentication middleware for Node.js applications
- **Express Session**: Session management with PostgreSQL storage backend

### Frontend Libraries
- **React Query**: Server state management and caching for API interactions
- **Radix UI**: Accessible component primitives for building the user interface
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **React Hook Form**: Form state management with validation support
- **Wouter**: Lightweight client-side routing solution

### Development & Build Tools
- **Vite**: Fast build tool and development server with hot module replacement
- **TypeScript**: Type safety across the entire application stack
- **ESBuild**: Fast JavaScript bundler for production builds
- **Zod**: Runtime type validation for API requests and responses

### Utility Libraries
- **date-fns**: Date manipulation and formatting utilities
- **class-variance-authority**: Utility for creating variant-based component APIs
- **Lucide React**: Icon library for consistent iconography throughout the application