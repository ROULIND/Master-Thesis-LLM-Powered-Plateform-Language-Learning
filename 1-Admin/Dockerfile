# Use a Node.js base image
FROM node:14.17.6-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the remaining app files to the working directory
COPY . .

# Build the app
RUN npm run build

# Stage 2 - Serve the build files with nginx
FROM nginx:alpine


###################### Was added to run locally without 404 error ######################

# Remove the default nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration file from the host to the container
COPY nginx/default.conf /etc/nginx/conf.d/

########################################################################################


# Copy the build output to replace the default nginx contents
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 3002

# Start nginx in the foreground when the container starts
CMD ["nginx", "-g", "daemon off;"]
