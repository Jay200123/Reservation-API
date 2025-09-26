# Stage 1
# Building docker image
FROM node:24-alpine3.21 AS builder

# Set the working directory for the build process inside the container.
# All source code and build steps will run from here.
WORKDIR /app

# Copy the package.json file to retrieve npm libraries used in the express node application.
COPY package*.json ./

# Run npm install command to install all of the libraries inside the package.json file
RUN npm install

# Copy all of the contents inside the project
COPY . . 

# Compiles Typescript into Javascript, since node can only understand Javascript. (to /dist) directory.
RUN npm run build

# Stage 2 for running node application inside docker container.
FROM node:24-alpine3.21 AS runner

# Create a non-root user and group for running the Node.js app.
# This improves security by avoiding running processes as root.
# Containers share the host's kernel, so running as root can increase risks
# if an attacker escapes the container or exploits a vulnerability.
RUN addgroup -S nodeGroup && adduser -S nodeUser -G nodeGroup 
USER nodeUser

# Set the working directory for the runtime container.
# All application files will be placed here, and commands will run from this directory.
WORKDIR /app

# Copy necessary files from the builder stage directory. (WORKDIR in Stage 1)

# Copy package.json file from builder stage
COPY --from=builder /app/package*.json ./

# Copy node modules
COPY --from=builder /app/node_modules ./node_modules

# Copy the compiled JavaScript output (from TypeScript) into the runtime container.
# The /dist folder contains code that Node.js can execute.
COPY --from=builder /app/dist ./dist

# Specify the port the application listens on inside the container
EXPOSE 4000

CMD [ "node", "dist/index.js" ]