# REVA Campus Services Platform

## Overview

REVA Campus Services Platform is a comprehensive web application designed for REVA University students to connect, collaborate, and engage with their campus community. The platform provides three core modules: Lost & Found for reporting and claiming lost items, Fundraising for supporting student-led causes, and Campus Events for discovering and participating in university activities. Built with a modern social media-inspired interface similar to Instagram and TikTok, the platform emphasizes user engagement through interactive feeds, real-time updates, and community-driven content.

## Recent Completion Status (October 2025)

✓ All three core modules fully implemented and operational
✓ Complete CRUD operations for Lost & Found, Fundraising, and Events
✓ Social media features: likes, comments, sharing across all content types
✓ User Profile page with activity tracking and comprehensive statistics
✓ **MIGRATED**: Authentication system from Replit Auth to local username/password
✓ **MIGRATED**: Database from Neon serverless to local PostgreSQL (pg driver)
✓ **NEW**: Login and Signup pages with modern UI design
✓ **NEW**: Password hashing with bcrypt for secure credential storage
✓ **NEW**: Session management with express-session and PostgreSQL store
✓ **SECURITY**: Server-controlled role assignment (all new signups default to "student")
✓ **SECURITY**: Session regeneration on login/signup to prevent session fixation
✓ Database populated with sample data (default password: password123)
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
The application uses local PostgreSQL as the primary database with Drizzle ORM for type-safe database operations and schema management. The database schema includes tables for users (with username and password fields), lost & found items, fundraising campaigns, campus events, donations, RSVPs, comments, likes, and notifications. Session management is handled through connect-pg-simple for PostgreSQL-backed express-session storage with automatic cleanup and security features.

### Authentication System
Authentication is implemented using local username/password credentials with bcrypt for secure password hashing. The system uses express-session with PostgreSQL storage (connect-pg-simple) for session management. Key security features include:
- **Password Security**: All passwords hashed with bcrypt (10 rounds)
- **Session Security**: Session regeneration on login/signup to prevent session fixation
- **Role-Based Access Control**: Server-controlled role assignment (student/admin)
- **Protected Routes**: Middleware for authentication checks on protected endpoints
- **Secure Defaults**: All new signups automatically assigned "student" role

Default credentials for testing:
- Admin: `admin` / `password123`
- Student: `priya` / `password123`

### Real-time Features
The platform incorporates WebSocket functionality for real-time updates across modules, enabling instant notifications, live feed updates, and synchronized user interactions. The system supports features like real-time commenting, live donation tracking, and instant event RSVP updates.

## External Dependencies

### Database Services
- **PostgreSQL (pg)**: Local PostgreSQL database with standard node-postgres driver
- **Drizzle ORM**: Type-safe database operations with schema migration support
- **connect-pg-simple**: PostgreSQL session store for express-session

### Authentication & User Management
- **bcrypt**: Password hashing library for secure credential storage
- **express-session**: Session management middleware with PostgreSQL storage backend
- **Custom Auth System**: Local username/password authentication with role-based access control

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