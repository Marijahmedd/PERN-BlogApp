# First stage: Build the app with Node.js
FROM node:23-alpine3.20 AS build


# ARG VITE_BASEURL


WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# RUN VITE_BASEURL=$VITE_BASEURL npm run build
RUN npm run build


# Second stage: Serve the app with Nginx
FROM nginx:alpine

# Copy the build output from the previous build stage (build)
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80 to access the application
EXPOSE 80

# Run Nginx (this is the default CMD in the nginx:alpine image)
CMD ["nginx", "-g", "daemon off;"]
