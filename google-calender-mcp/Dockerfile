# Use official Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json
COPY package.json .

# Install dependencies
RUN npm install

# Copy credentials file
COPY gcp-oauth.keys.json ./gcp-oauth.keys.json

# Set environment variable for Google credentials
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/gcp-oauth.keys.json

# Expose MCP port
EXPOSE 3000

# Start MCP server
CMD ["npx", "@cocal/google-calendar-mcp"]