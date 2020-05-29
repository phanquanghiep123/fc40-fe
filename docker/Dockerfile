ARG builder_image_name
FROM $builder_image_name as builder
# Set working directory
WORKDIR /app
# Copy all local files into the image.
COPY . .
# Build for production.
RUN npm run build

# Use nginx image to serve the static files in /build folder
FROM nginx:stable-alpine
# Remove default conf.d of nginx
RUN rm -rf /etc/nginx/conf.d
# Use our own conf (because we use react-router)
COPY conf /etc/nginx
# Copy build's content to HTML serving folder of nginx container
COPY --from=builder /app/build /usr/share/nginx/html
# The nginx is running on port 80, so expose it
EXPOSE 80
# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY ./.env .
# Add bash
RUN apk add --no-cache bash
# Make our shell script executable
RUN chmod +x env.sh
# Start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]