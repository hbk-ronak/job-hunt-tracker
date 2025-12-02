# Job Hunt Tracker - Build Commands

# Install dependencies
install:
    npm install

# Run development server
dev:
    npm run dev

# Run development server (alias)
run: dev

# Build for production
build:
    npm run build

# Preview production build
preview:
    npm run preview

# Run all tests
test:
    npm run test

# Type check
check:
    npm run check

# Lint code
lint:
    npm run lint

# Format code
format:
    npm run format

# Clean build artifacts and dependencies
clean:
    rm -rf dist node_modules .svelte-kit

# Show available commands
help:
    @just --list