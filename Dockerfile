# Use official Nginx image
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default Nginx static files
RUN rm -rf ./*

# Copy your project files into the container
COPY index.html .
COPY style.css .
COPY app.js .

# Expose port 80
EXPOSE 80

# Nginx will automatically serve index.html
