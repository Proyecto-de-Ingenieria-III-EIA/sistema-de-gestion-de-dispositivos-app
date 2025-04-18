# Device Management and Loan System

A comprehensive web application for managing devices, loans, and support tickets with role-based access control.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Atomic Design Methodology](#atomic-design-methodology)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
- [Database](#database)
  - [Schema Overview](#schema-overview)
  - [Migrations](#migrations)
- [Authentication](#authentication)
  - [Roles](#roles)
  - [Permissions](#permissions)
- [API Documentation](#api-documentation)
  - [GraphQL API](#graphql-api)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

This application is a device management and loan system that allows organizations to track and manage devices (laptops, PCs, mobiles, tablets), handle device loans to users, and manage support tickets for devices. The system includes role-based access control with different permissions for administrators, clients, technical staff, and coordinators.

## Features

- **User Management**: Create and manage users with different roles
- **Device Management**: Track devices with details like serial number, brand, model, components, and price
- **Loan System**: Process device and peripheral loans with approval workflow
- **Ticketing System**: Create and manage support tickets for devices
- **Role-Based Access Control**: Different permissions for different user roles

## Technology Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) with [TailwindCSS](https://tailwindcss.com/)
- **Component Architecture**: [Atomic Design](https://atomicdesign.bradfrost.com/) methodology
- **State Management**: Context API and hooks
- **Forms**: React Hook Form with Zod validation

### Backend
- **API**: [GraphQL](https://graphql.org/) with Apollo Server
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) / [Auth0](https://auth0.com/)

## Atomic Design Methodology

This project implements the Atomic Design methodology for component organization, which breaks down interfaces into five distinct levels:

1. **Atoms**: Basic building blocks such as buttons, inputs, and labels that cannot be broken down further
2. **Molecules**: Simple groups of UI elements functioning together as a unit (form fields, search bars)
3. **Organisms**: Complex UI components composed of molecules and atoms that form distinct sections of an interface
4. **Templates**: Page-level objects that place components into a layout and articulate the design's underlying content structure
5. **Pages**: Specific instances of templates that represent the final UI with real content

The main benefits of this approach include:
- Consistent design system
- Improved component reusability
- Better separation of concerns
- Scalable and maintainable UI architecture
- Simplified testing and documentation

## Project Structure

```
├── app/                   # Next.js App Router pages and API routes
│   ├── (auth)/            # Authentication-related routes
│   ├── (private)/         # Protected routes requiring authentication
│   ├── (public)/          # Public routes
│   ├── api/               # API routes
│   ├── components/        # App-specific components
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Shared UI components following Atomic Design
│   ├── atomic-design/     # Components organized using Atomic Design principles
│   │   ├── atoms/         # Basic building blocks (buttons, inputs, labels)
│   │   ├── molecules/     # Groups of atoms (form fields, card components)
│   │   └── organisms/     # Complex UI components (headers, forms, toasts)
│   ├── templates/         # Page layout templates
│   ├── providers/         # Context providers
│   └── providers.tsx      # Global providers wrapper
├── graphql/               # GraphQL API
│   ├── entities/          # GraphQL entity definitions
│   └── index.ts           # GraphQL server setup
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and helpers
├── prisma/                # Prisma ORM
│   ├── migrations/        # Database migrations
│   ├── schema.prisma      # Database schema
│   └── index.ts           # Prisma client instance
├── public/                # Static assets
├── styles/                # Global styles
├── types/                 # TypeScript type definitions
├── .env                   # Environment variables (not in repo)
├── .env.template          # Template for environment variables
└── package.json           # Project dependencies and scripts
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Bun](https://bun.sh/) (package manager)
- [PostgreSQL](https://www.postgresql.org/) (v14 or later)

### Environment Setup

1. Copy the `.env.template` file to `.env`
2. Update the environment variables in `.env` with your values:

```
# Authentication
AUTH_SECRET=your-secret-key
AUTH_AUTH0_ID=your-auth0-client-id
AUTH_AUTH0_SECRET=your-auth0-client-secret
AUTH_AUTH0_ISSUER=your-auth0-issuer-base-url
NEXTAUTH_URL=your-nextauth-url

# Public Auth0 Configuration
NEXT_PUBLIC_AUTH0_ISSUER=your-auth0-issuer-base-url
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-auth0-client-id

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
```

### Installation

```bash
# Install dependencies
bun install
```

### Running the Development Server

```bash
# Start the development server
bun dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Running Linting

```bash
# Run ESLint
bun lint
```

## Database

### Schema Overview

The database schema includes the following main entities:

- **User**: Application users with different roles
- **Role**: User roles with different permissions
- **Device**: Hardware devices that can be loaned
- **Component**: Components that can be part of devices
- **Peripheral**: Peripherals that can be loaned
- **Loan**: Records of device and peripheral loans
- **Ticket**: Support tickets for devices

### Migrations

```bash
# Generate migrations from schema changes
bunx prisma migrate dev --name your-migration-name

# Apply migrations
bunx prisma migrate deploy
```

## Authentication

The application uses NextAuth.js with the Auth0 provider for authentication.

### Roles

- **Admin**: Full access to all features
- **Client**: Can request loans and create tickets
- **Technical**: Can handle tickets and manage devices
- **Coordinator**: Can approve loans and manage users
- **Employee**: Limited access to view and use loaned devices

### Permissions

Role-based permissions control access to different parts of the application:

- Device management (create, update, delete)
- Loan approval workflow
- Ticket management
- User management

## API Documentation

### GraphQL API

The application uses GraphQL for its API. The main entities exposed through the API include:

- Users
- Devices
- Loans
- Tickets
- Peripherals

Example query:

```graphql
query GetDevices {
  devices {
    id
    serialNumber
    brand
    model
    price
    category
  }
}
```

Example mutation:

```graphql
mutation CreateDevice($input: DeviceInput!) {
  createDevice(input: $input) {
    id
    serialNumber
    brand
    model
  }
}
```

## Deployment

To deploy the application to production:

1. Set up environment variables for production
2. Build the application:

```bash
bun build
```

3. Start the production server:

```bash
bun start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 