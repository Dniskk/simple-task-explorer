#!/bin/bash

# Simple Task Explorer - Publishing Script for OpenVSX
# This script packages and publishes the extension to OpenVSX marketplace

set -e

echo "🚀 Simple Task Explorer Publishing Script"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required tools are installed
check_dependencies() {
    echo -e "${YELLOW}Checking dependencies...${NC}"
    
    if ! command -v vsce &> /dev/null; then
        echo -e "${RED}❌ vsce is not installed. Install it with: npm install -g @vscode/vsce${NC}"
        exit 1
    fi
    
    if ! command -v ovsx &> /dev/null; then
        echo -e "${RED}❌ ovsx is not installed. Install it with: npm install -g ovsx${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All dependencies are installed${NC}"
}

# Validate environment
validate_environment() {
    echo -e "${YELLOW}Validating environment...${NC}"
    
    if [ -z "$OVSX_PAT" ]; then
        echo -e "${RED}❌ OVSX_PAT environment variable is not set${NC}"
        echo -e "${YELLOW}Please set your OpenVSX Personal Access Token:${NC}"
        echo -e "${YELLOW}export OVSX_PAT=your_token_here${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Environment variables are set${NC}"
}

# Pre-publish checks
pre_publish_checks() {
    echo -e "${YELLOW}Running pre-publish checks...${NC}"
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${RED}❌ Not in a git repository${NC}"
        exit 1
    fi
    
    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${RED}❌ There are uncommitted changes. Please commit or stash them first.${NC}"
        git status --short
        exit 1
    fi
    
    # Check if package.json has required fields
    if ! grep -q '"publisher"' package.json; then
        echo -e "${RED}❌ package.json is missing 'publisher' field${NC}"
        exit 1
    fi
    
    if ! grep -q '"repository"' package.json; then
        echo -e "${YELLOW}⚠️  package.json is missing 'repository' field (recommended)${NC}"
    fi
    
    echo -e "${GREEN}✅ Pre-publish checks passed${NC}"
}

# Build and package
build_package() {
    echo -e "${YELLOW}Building and packaging extension...${NC}"
    
    # Clean previous builds
    rm -f *.vsix
    
    # Install dependencies
    npm install
    
    # Compile TypeScript
    npm run compile
    
    # Create package
    npm run package
    
    echo -e "${GREEN}✅ Extension packaged successfully${NC}"
}

# Publish to OpenVSX
publish_openvsx() {
    echo -e "${YELLOW}Publishing to OpenVSX...${NC}"
    
    # Find the .vsix file
    VSIX_FILE=$(ls *.vsix | head -n 1)
    
    if [ -z "$VSIX_FILE" ]; then
        echo -e "${RED}❌ No .vsix file found${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}Publishing $VSIX_FILE to OpenVSX...${NC}"
    
    # Publish using the environment variable
    ovsx publish "$VSIX_FILE" -p "$OVSX_PAT"
    
    echo -e "${GREEN}✅ Successfully published to OpenVSX!${NC}"
}

# Main execution
main() {
    echo -e "${YELLOW}Starting publish process...${NC}"
    
    check_dependencies
    validate_environment
    pre_publish_checks
    build_package
    publish_openvsx
    
    echo ""
    echo -e "${GREEN}🎉 Publishing completed successfully!${NC}"
    echo -e "${YELLOW}Your extension is now available on OpenVSX Registry${NC}"
}

# Help function
show_help() {
    echo "Simple Task Explorer Publishing Script"
    echo ""
    echo "Usage:"
    echo "  ./scripts/publish.sh         - Publish to OpenVSX"
    echo "  ./scripts/publish.sh --help  - Show this help"
    echo ""
    echo "Prerequisites:"
    echo "  1. Install vsce: npm install -g @vscode/vsce"
    echo "  2. Install ovsx: npm install -g ovsx"
    echo "  3. Set OVSX_PAT environment variable with your OpenVSX token"
    echo ""
    echo "Environment Variables:"
    echo "  OVSX_PAT - Your OpenVSX Personal Access Token"
}

# Parse command line arguments
case "${1:-}" in
    --help|-h)
        show_help
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac