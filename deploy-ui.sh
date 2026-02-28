#!/bin/bash

# deploy-ui.sh - Rebuild and package the alexbot UI Kit for deployment
set -e

echo "🚀 Starting UI Kit deployment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_DIR="$SCRIPT_DIR/dist"
WEB_DIR="/var/www/uikit.sacha.website"

# Clean dist directory
echo -e "${BLUE}→${NC} Cleaning dist directory..."
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

# Copy core UI kit files
echo -e "${BLUE}→${NC} Copying UI kit files..."
cp -r "$SCRIPT_DIR/components" "$DIST_DIR/"
cp -r "$SCRIPT_DIR/composites" "$DIST_DIR/"
cp -r "$SCRIPT_DIR/hooks" "$DIST_DIR/"
cp -r "$SCRIPT_DIR/themes" "$DIST_DIR/"
cp -r "$SCRIPT_DIR/styles" "$DIST_DIR/"
cp "$SCRIPT_DIR/index.js" "$DIST_DIR/"

# Copy documentation
echo -e "${BLUE}→${NC} Copying documentation..."
cp "$SCRIPT_DIR/README.md" "$DIST_DIR/"
cp "$SCRIPT_DIR/COMPONENTS.md" "$DIST_DIR/"

# Build and deploy playground
BUILD_PLAYGROUND=false
DEPLOY_LIVE=false

if [ "$1" == "--with-playground" ] || [ "$1" == "--deploy" ]; then
  BUILD_PLAYGROUND=true
fi

if [ "$1" == "--deploy" ]; then
  DEPLOY_LIVE=true
fi

if [ "$BUILD_PLAYGROUND" = true ]; then
  echo -e "${BLUE}→${NC} Building playground..."
  cd "$SCRIPT_DIR/playground"
  
  if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠${NC}  Installing playground dependencies..."
    npm install
  fi
  
  npm run build
  
  echo -e "${BLUE}→${NC} Copying playground build..."
  cp -r dist "$DIST_DIR/playground"
  cd "$SCRIPT_DIR"
  
  # Deploy to live website if requested
  if [ "$DEPLOY_LIVE" = true ]; then
    echo -e "${BLUE}→${NC} Deploying to uikit.sacha.website..."
    rm -rf "$WEB_DIR"/*
    cp -r "$SCRIPT_DIR/playground/dist"/* "$WEB_DIR/"
    echo -e "${GREEN}✓${NC} Live deployment complete!"
  fi
fi

# Create package.json for the dist
echo -e "${BLUE}→${NC} Creating package.json..."
cat > "$DIST_DIR/package.json" <<EOF
{
  "name": "@alexbot/ui-kit",
  "version": "1.0.0",
  "description": "A complete, theme-aware React component library for building dark-mode-first dashboards",
  "main": "index.js",
  "type": "module",
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0",
    "@phosphor-icons/react": "^2.0.0",
    "clsx": "^2.0.0",
    "sonner": "^2.0.0"
  },
  "keywords": [
    "react",
    "ui",
    "components",
    "theme",
    "dark-mode",
    "dashboard"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/54CHA/alex-ukkit.git"
  }
}
EOF

# Create .npmignore
echo -e "${BLUE}→${NC} Creating .npmignore..."
cat > "$DIST_DIR/.npmignore" <<EOF
playground/
*.log
.DS_Store
EOF

# Print summary
echo ""
echo -e "${GREEN}✓${NC} UI Kit deployed successfully!"
echo ""
echo "📦 Package contents:"
echo "  • components/     - Base UI primitives"
echo "  • composites/     - Higher-level components"
echo "  • hooks/          - Utility hooks"
echo "  • themes/         - Theme system"
echo "  • styles/         - Global CSS"
echo "  • index.js        - Main entry point"
echo "  • README.md       - Documentation"
echo "  • COMPONENTS.md   - Component API docs"

if [ "$BUILD_PLAYGROUND" = true ]; then
  echo "  • playground/     - Built demo site"
fi

echo ""
echo "📍 Location: $DIST_DIR"

if [ "$DEPLOY_LIVE" = true ]; then
  echo "🌐 Live at: https://uikit.sacha.website"
fi

echo ""
echo "Next steps:"
if [ "$DEPLOY_LIVE" != true ]; then
  echo "  • Deploy to website: ./deploy-ui.sh --deploy"
fi
echo "  • Copy to your project: cp -r dist/ /path/to/your-project/src/ui-kit/"
echo "  • Or publish to npm: cd dist && npm publish"
echo ""
