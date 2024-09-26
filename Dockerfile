# Set up build arguments for Node version and port
ARG NODE_VERSION=19.8.1
ARG PORT=3000

# Use the specified Node version as the base image
FROM node:${NODE_VERSION}

# Install Rust, Cargo, and other dependencies
RUN apt-get update && \
    apt-get install -y curl build-essential && \
    curl https://sh.rustup.rs -sSf | sh -s -- -y && \
    curl -fsSL https://bun.sh/install | bash && \
    echo 'export PATH="/root/.cargo/bin:/root/.bun/bin:$PATH"' >> ~/.bashrc

# Source .bashrc to set the new PATH immediately
RUN /bin/bash -c "source ~/.bashrc"

# Make Cargo and Bun available in the PATH for subsequent commands
ENV PATH="/root/.cargo/bin:/root/.bun/bin:${PATH}"

# Set the environment variable for production
COPY ${ENV_FILE} .

# Copy all application files into the container
COPY . .

# Install Node.js dependencies
RUN npm install

# Run the build script
RUN npm run build

# Expose the application port
EXPOSE ${PORT}

# Command to run the application (change to production start if needed)
CMD ["npm", "run", "dev"]
