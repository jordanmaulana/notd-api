# Base Image
FROM oven/bun

# Specify working dir
WORKDIR /app

# Copy to container /app
COPY ./prisma ./
COPY . .

# Install packages
RUN bunx prisma generate
RUN bun install --ignore-scripts

# Run app
CMD ["bun", "dev"]

# Expose Port
EXPOSE 3000