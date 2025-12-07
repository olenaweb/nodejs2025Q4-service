#!/bin/bash
# Script for cleaning the database before running tests

echo "🗑️  Database Cleanup..."
docker exec home-library-postgres psql -U postgres -d home_library -c "TRUNCATE TABLE users, artists, albums, tracks, favorites, favorite_artists, favorite_albums, favorite_tracks RESTART IDENTITY CASCADE;"

echo "🔄 Restarting application..."
docker-compose restart app

echo "🔄 Waiting for application to start (5 seconds)..."
sleep 5

echo "✅ Database cleaned and application restarted!"
