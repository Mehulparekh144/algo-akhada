# Dockerfile for Redis

FROM redis:latest

# No need to expose the port here, Render will handle it.
# Port 6379 is the default Redis port, so Render knows it.

# Copy any custom Redis configuration if you have it.
COPY redis.conf /usr/local/etc/redis/redis.conf

# If you copied a custom config, use it:
CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]

# Otherwise, Redis will start with its default configuration.
CMD ["redis-server"]