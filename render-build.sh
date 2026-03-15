#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
npm install

# Generate Prisma Client (Root schema)
npx prisma generate --schema=backend/prisma/schema.prisma

# Build the backend
cd backend
npm install
npm run build
