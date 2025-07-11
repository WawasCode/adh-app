#!/bin/bash

# prepare-data.sh - Download and prepare OSM data for vector tile generation
# This script downloads Berlin OSM data from Geofabrik and uses Tilemaker to generate vector tiles

set -e  # Exit on any error

# Configuration
OSM_DATA_DIR="./osm-data"
BERLIN_PBF_URL="https://download.geofabrik.de/europe/germany/berlin-latest.osm.pbf"
BERLIN_PBF_FILE="berlin-latest.osm.pbf"
TILEMAKER_DIR="./tilemaker"
TILEMAKER_REPO="https://github.com/systemed/tilemaker.git"
OUTPUT_MBTILES="./python/berlin.mbtiles"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== OSM Vector Tile Preparation Script ===${NC}"
echo -e "${BLUE}Preparing Berlin OSM data for vector tiles using Tilemaker${NC}"
echo

# Make this script executable
chmod +x "$0"

# Check system requirements and install dependencies
echo -e "${YELLOW}Checking system requirements...${NC}"

# Check if we're on Ubuntu/Debian
if command -v apt-get >/dev/null 2>&1; then
    echo -e "${BLUE}Detected Debian/Ubuntu system${NC}"
    
    # Install required packages
    echo -e "${YELLOW}Installing system dependencies...${NC}"
    sudo apt-get update
    sudo apt-get install -y \
        build-essential \
        cmake \
        git \
        libboost-all-dev \
        libsqlite3-dev \
        liblua5.1-0-dev \
        libprotobuf-dev \
        protobuf-compiler \
        libshp-dev \
        rapidjson-dev \
        wget \
        zlib1g-dev
elif command -v yum >/dev/null 2>&1; then
    echo -e "${BLUE}Detected RHEL/CentOS system${NC}"
    sudo yum groupinstall -y "Development Tools"
    sudo yum install -y \
        cmake \
        git \
        boost-devel \
        sqlite-devel \
        lua-devel \
        protobuf-devel \
        shapelib-devel \
        rapidjson-devel \
        wget \
        zlib-devel
elif command -v brew >/dev/null 2>&1; then
    echo -e "${BLUE}Detected macOS with Homebrew${NC}"
    brew install \
        cmake \
        boost \
        sqlite3 \
        lua \
        protobuf \
        shapelib \
        rapidjson \
        wget
else
    echo -e "${YELLOW}Warning: Could not detect package manager. Please install dependencies manually:${NC}"
    echo -e "  - build-essential/gcc"
    echo -e "  - cmake"
    echo -e "  - git"
    echo -e "  - boost libraries"
    echo -e "  - sqlite3 development files"
    echo -e "  - lua development files"
    echo -e "  - protobuf development files"
    echo -e "  - shapelib development files"
    echo -e "  - rapidjson development files"
    echo -e "  - zlib development files"
    echo
fi

# Create data directory
echo -e "${YELLOW}Creating data directory...${NC}"
mkdir -p "$OSM_DATA_DIR"
cd "$OSM_DATA_DIR"

# Download Berlin OSM PBF file
echo -e "${YELLOW}Downloading Berlin OSM data from Geofabrik...${NC}"
if [ ! -f "$BERLIN_PBF_FILE" ]; then
    echo -e "${BLUE}Downloading: $BERLIN_PBF_URL${NC}"
    wget -O "$BERLIN_PBF_FILE" "$BERLIN_PBF_URL"
    
    # Verify download
    if [ -f "$BERLIN_PBF_FILE" ]; then
        file_size=$(du -h "$BERLIN_PBF_FILE" | cut -f1)
        echo -e "${GREEN}✓ Download complete: $BERLIN_PBF_FILE ($file_size)${NC}"
    else
        echo -e "${RED}✗ Download failed${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Berlin PBF file already exists${NC}"
fi

# Return to root directory
cd ..

# Clone and build Tilemaker
echo -e "${YELLOW}Setting up Tilemaker...${NC}"
if [ ! -d "$TILEMAKER_DIR" ]; then
    echo -e "${BLUE}Cloning Tilemaker repository...${NC}"
    git clone "$TILEMAKER_REPO" "$TILEMAKER_DIR"
else
    echo -e "${GREEN}✓ Tilemaker repository already exists${NC}"
fi

cd "$TILEMAKER_DIR"

# Build Tilemaker
echo -e "${YELLOW}Building Tilemaker...${NC}"
if [ ! -f "tilemaker" ]; then
    echo -e "${BLUE}Compiling Tilemaker...${NC}"
    mkdir -p build
    cd build
    cmake ..
    make -j$(nproc)
    cd ..
    
    if [ -f "build/tilemaker" ]; then
        ln -sf build/tilemaker tilemaker
        echo -e "${GREEN}✓ Tilemaker compiled successfully${NC}"
    else
        echo -e "${RED}✗ Tilemaker compilation failed${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Tilemaker already compiled${NC}"
fi

# Return to root directory
cd ..

# Generate vector tiles using Tilemaker
echo -e "${YELLOW}Generating vector tiles with Tilemaker...${NC}"

# Check if Berlin PBF file exists
if [ ! -f "$OSM_DATA_DIR/$BERLIN_PBF_FILE" ]; then
    echo -e "${RED}✗ Berlin PBF file not found: $OSM_DATA_DIR/$BERLIN_PBF_FILE${NC}"
    exit 1
fi

# Run Tilemaker to generate .mbtiles
echo -e "${BLUE}Running Tilemaker to generate Berlin vector tiles...${NC}"
"$TILEMAKER_DIR/tilemaker" \
    --input "$OSM_DATA_DIR/$BERLIN_PBF_FILE" \
    --output "$OUTPUT_MBTILES" \
    --config "tilemaker-config.json" \
    --process "$TILEMAKER_DIR/resources/process-openmaptiles.lua"

# Verify output
if [ -f "$OUTPUT_MBTILES" ]; then
    file_size=$(du -h "$OUTPUT_MBTILES" | cut -f1)
    echo -e "${GREEN}✓ Vector tiles generated successfully: $OUTPUT_MBTILES ($file_size)${NC}"
    
    # Run verification script if Python is available
    if command -v python3 >/dev/null 2>&1; then
        echo -e "${YELLOW}Verifying generated tiles...${NC}"
        chmod +x verify-tiles.py
        python3 verify-tiles.py "$OUTPUT_MBTILES"
    fi
else
    echo -e "${RED}✗ Vector tile generation failed${NC}"
    exit 1
fi

# Display summary
echo
echo -e "${GREEN}=== Vector Tile Generation Complete ===${NC}"
echo -e "${BLUE}Files created:${NC}"
echo -e "  📁 osm-data/berlin-latest.osm.pbf (OSM data)"
echo -e "  � tilemaker/ (Tilemaker installation)"
echo -e "  📄 python/berlin.mbtiles (Vector tiles)"
echo
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Start your Django development server: ${BLUE}cd python && python manage.py runserver${NC}"
echo -e "  2. The tiles will be served automatically from the MBTiles file"
echo -e "  3. Your frontend can now request tiles from: ${BLUE}http://localhost:8000/api/tiles/{z}/{x}/{y}${NC}"
echo
echo -e "${GREEN}✓ Ready to serve vector tiles!${NC}"
