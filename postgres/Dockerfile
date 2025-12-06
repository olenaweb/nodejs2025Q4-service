# Dockerfile.db
FROM postgres:17.5-alpine3.21

# metadata (optional)
LABEL maintainer="olenaweb olena.nevzorova@gmail.com>"

# Copy initialization scripts (if any)
# Place sql scripts or .sh files in ./db/init
COPY db/init /docker-entrypoint-initdb.d

# Default port - 5432 (exposed through docker-compose)
EXPOSE 5432
ENV PGLOG=/var/lib/postgresql/log
RUN mkdir -p "$PGLOG" && chown -R postgres:postgres "$PGLOG" && chmod 1777 "$PGLOG"
VOLUME /var/lib/postgresql/log


