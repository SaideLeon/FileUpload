# Builder Stage: Build the Next.js application
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
# Removing `|| true` to ensure the build fails if there are errors
RUN npm run build

# Runner Stage: Create the production image
FROM node:22-alpine AS runner
WORKDIR /app

# Set the environment to production
ENV NODE_ENV=production

# Copy necessary files from the builder stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts

# Expose the port
EXPOSE 3005

# Start the application
CMD ["npm", "start"]
