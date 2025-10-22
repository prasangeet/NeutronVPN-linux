#!/bin/bash

echo "🚀 Starting Next.js Server..."

# Go to frontend folder and start the server
cd frontend/neutron-vpn || { echo "Failed to go to frontend folder"; exit 1; }
npm run start &  # Run server in background
NEXT_SERVER_PID=$!

echo "✅ Next.js server started with PID $NEXT_SERVER_PID."

# Wait a few seconds for server to initialize
sleep 5

echo "⚡ Starting Electron App..."

cd ../../src
# Run AppImage from src folder
APP_IMAGE="./NeutronVPN-1.0.0.AppImage"
if [ -f "$APP_IMAGE" ]; then
    chmod +x "$APP_IMAGE" || true
    "$APP_IMAGE" &
    ELECTRON_PID=$!
    echo "✅ Electron App started with PID $ELECTRON_PID."
else
    echo "❌ AppImage not found at $APP_IMAGE!"
fi

# Optionally wait for both processes
wait $NEXT_SERVER_PID $ELECTRON_PID
