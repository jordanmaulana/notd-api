# Base Image
FROM oven/bun

# Specify working dir
WORKDIR /app

# Copy to container /app
COPY ./prisma ./
COPY . .

# Install packages
RUN bun install --ignore-scripts
RUN bunx prisma generate

# Run app
CMD ["bun", "dev"]

# Expose Port
EXPOSE 3000