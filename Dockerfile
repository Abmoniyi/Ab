# Use a lightweight web server image
FROM nginx:alpine

# Set working directory inside container
WORKDIR /usr/share/nginx/html

# Copy your NexusChat HTML file into the container
COPY index.html .

# Expose port 80 for web traffic
EXPOSE 80

# Nginx will automatically serve index.html
