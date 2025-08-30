# Use a Node.js base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present) to leverage Docker's build cache
COPY package.json ./
COPY package-lock.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .
RUN npm run build

# Expose the port your application listens on (e.g., 3000 for a web server)
EXPOSE 3000

# Define the command to run when the container starts
CMD ["npm", "start"]