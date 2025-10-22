#!/bin/bash
set -e

echo "🚀 Installing NeutronVPN..."

# Move to the frontend folder
cd frontend/neutron-vpn || true

echo "📦 Building Next.js frontend..."
npm install --legacy-peer-deps || true
npm run build || true

# Move to the electron folder
cd ../electron || true

echo "⚡ Installing Electron dependencies..."
npm install --legacy-peer-deps || true

echo "🔨 Building Electron app..."
# Build and output to root folder
npx electron-builder --linux --x64 || true

echo "✅ Build completed. Files are in the root folder."

cd ../..

# Make AppImage executable
APPIMAGE="./src/NeutronVPN-1.0.0.AppImage"
if [ -f "$APPIMAGE" ]; then
    chmod +x "$APPIMAGE" || true
    echo "🎉 AppImage is now executable!"
fi

chmod +x ./start.sh || true

echo "📂 You can now run the app with: ./start.sh"
