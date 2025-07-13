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
CLEANUP_SWAP=0

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

# Check available memory
if command -v free >/dev/null 2>&1; then
    TOTAL_MEM=$(free -m | awk 'NR==2{printf "%.0f", $2}')
    AVAIL_MEM=$(free -m | awk 'NR==2{printf "%.0f", $7}')
    echo -e "${BLUE}System memory: ${TOTAL_MEM}MB total, ${AVAIL_MEM}MB available${NC}"
    
    if [ "$AVAIL_MEM" -lt 1500 ]; then
        echo -e "${YELLOW}Warning: Low available memory (${AVAIL_MEM}MB). Compilation may be slow or fail.${NC}"
        echo -e "${YELLOW}Consider closing other applications or using swap space.${NC}"
        
        # Offer to create temporary swap space
        if [ "$AVAIL_MEM" -lt 1000 ] && [ ! -f /tmp/tilemaker_swap ]; then
            echo -e "${YELLOW}Very low memory detected. Creating temporary swap file...${NC}"
            if command -v fallocate >/dev/null 2>&1; then
                fallocate -l 2G /tmp/tilemaker_swap 2>/dev/null || dd if=/dev/zero of=/tmp/tilemaker_swap bs=1M count=2048 2>/dev/null
                chmod 600 /tmp/tilemaker_swap
                mkswap /tmp/tilemaker_swap >/dev/null 2>&1
                swapon /tmp/tilemaker_swap >/dev/null 2>&1
                if [ $? -eq 0 ]; then
                    echo -e "${GREEN}✓ Temporary 2GB swap file created${NC}"
                    echo -e "${YELLOW}Note: Swap will be removed when compilation completes${NC}"
                    CLEANUP_SWAP=1
                else
                    echo -e "${YELLOW}Could not create swap (insufficient permissions or space)${NC}"
                fi
            fi
        fi
    fi
fi

# Check if we're on Ubuntu/Debian
if command -v apt-get >/dev/null 2>&1; then
    echo -e "${BLUE}Detected Debian/Ubuntu system${NC}"
    
    # Install required packages
    echo -e "${YELLOW}Installing system dependencies...${NC}"
    apt-get update
    apt-get install -y \
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
    yum groupinstall -y "Development Tools"
    yum install -y \
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
    
    # Configure with flags to reduce memory usage during compilation
    echo -e "${YELLOW}Configuring build with memory-optimized flags...${NC}"
    cmake .. \
        -DCMAKE_BUILD_TYPE=Release \
        -DCMAKE_CXX_FLAGS="-O2 -DNDEBUG -pipe" \
        -DCMAKE_C_FLAGS="-O2 -DNDEBUG -pipe"
    
    # Limit parallel jobs to avoid OOM on systems with limited RAM
    # Use max 2 jobs or half the available cores, whichever is smaller
    NPROC=$(nproc)
    MAX_JOBS=$((NPROC > 4 ? NPROC / 2 : 2))
    echo -e "${YELLOW}Using $MAX_JOBS parallel jobs (detected $NPROC cores)${NC}"
    
    if ! make -j$MAX_JOBS; then
        echo -e "${YELLOW}Parallel build failed, trying single-core build...${NC}"
        make clean
        if ! make -j1; then
            echo -e "${RED}✗ Single-core build also failed${NC}"
            exit 1
        fi
    fi
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
echo -e "${YELLOW}Using high-detail configuration (zoom 0-18)...${NC}"
"$TILEMAKER_DIR/tilemaker" \
    --input "$OSM_DATA_DIR/$BERLIN_PBF_FILE" \
    --output "$OUTPUT_MBTILES" \
    --config "./tilemaker-high-detail.json" \
    --process "$TILEMAKER_DIR/process.lua"
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

# Cleanup temporary swap if created
if [ "$CLEANUP_SWAP" = "1" ]; then
    echo -e "${YELLOW}Cleaning up temporary swap file...${NC}"
    swapoff /tmp/tilemaker_swap >/dev/null 2>&1
    rm -f /tmp/tilemaker_swap
    echo -e "${GREEN}✓ Temporary swap removed${NC}"
fi
