# Clean database script for testing

Write-Host "Clearing database..." -ForegroundColor Yellow
docker exec home-library-postgres psql -U postgres -d home_library -c "TRUNCATE TABLE users, artists, albums, tracks, favorites, favorite_artists, favorite_albums, favorite_tracks RESTART IDENTITY CASCADE;"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database cleared successfully" -ForegroundColor Green

    Write-Host "Restarting application..." -ForegroundColor Yellow
    docker-compose restart app

    Write-Host "Waiting for application to start (5 seconds)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5

    Write-Host "Done! Ready to run tests." -ForegroundColor Green
} else {
    Write-Host "Error clearing database" -ForegroundColor Red
    exit 1
}
