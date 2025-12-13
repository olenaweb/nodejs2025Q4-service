FROM postgres:17.5-alpine3.21

LABEL maintainer="olenaweb <olena.nevzorova@gmail.com>"

# Default PostgreSQL port
EXPOSE 5432
ENV PGLOG=/var/lib/postgresql/log
RUN mkdir -p "$PGLOG" && chown -R postgres:postgres "$PGLOG" && chmod 1777 "$PGLOG"
VOLUME /var/lib/postgresql/log
