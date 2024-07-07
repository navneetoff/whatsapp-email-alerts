# Use the official Node.js image based on Alpine Linux
FROM node:14-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 8001 (or any other port your app listens to)
EXPOSE 8001

# Command to run the application
CMD ["node", "app.js"]
