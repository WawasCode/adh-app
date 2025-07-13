#!/bin/bash

# generate-high-detail-tiles.sh - Generate high-detail vector tiles (zoom 0-18)
# Warning: This will create significantly more tiles and take longer to generate

set -e

# Configuration
OSM_DATA_DIR="./osm-data"
BERLIN_PBF_FILE="berlin-latest.osm.pbf"
TILEMAKER_DIR="./tilemaker"
OUTPUT_MBTILES="./python/berlin-high-detail.mbtiles"
HIGH_DETAIL_CONFIG="./tilemaker-high-detail.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== High-Detail Vector Tile Generation ===${NC}"
echo -e "${YELLOW}⚠️  Warning: This will generate tiles up to zoom 18${NC}"
echo -e "${YELLOW}   This creates significantly more tiles and takes longer!${NC}"
echo -e "${YELLOW}   Expected: ~50,000+ tiles vs ~900 tiles at zoom 14${NC}"
echo

# Check if OSM data exists
if [ ! -f "$OSM_DATA_DIR/$BERLIN_PBF_FILE" ]; then
    echo -e "${RED}✗ Berlin PBF file not found. Run ./prepare-data.sh first${NC}"
    exit 1
fi

# Check if Tilemaker is built
if [ ! -f "$TILEMAKER_DIR/tilemaker" ]; then
    echo -e "${RED}✗ Tilemaker not found. Run ./prepare-data.sh first${NC}"
    exit 1
fi

# Check if high-detail config exists
if [ ! -f "$HIGH_DETAIL_CONFIG" ]; then
    echo -e "${RED}✗ High-detail config not found: $HIGH_DETAIL_CONFIG${NC}"
    exit 1
fi

# Estimate disk space needed
echo -e "${YELLOW}Estimating disk space requirements...${NC}"
if [ -f "./python/berlin.mbtiles" ]; then
    current_size=$(du -h "./python/berlin.mbtiles" | cut -f1)
    echo -e "${BLUE}Current tiles (zoom 0-14): $current_size${NC}"
    echo -e "${YELLOW}High-detail tiles (zoom 0-18) will likely be 20-50x larger${NC}"
fi

# Ask for confirmation
echo -e "${YELLOW}Do you want to proceed? This may take 30+ minutes and use several GB of disk space.${NC}"
read -p "Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Cancelled.${NC}"
    exit 0
fi

# Show system resources
if command -v free >/dev/null 2>&1; then
    AVAIL_MEM=$(free -m | awk 'NR==2{printf "%.0f", $7}')
    echo -e "${BLUE}Available memory: ${AVAIL_MEM}MB${NC}"
    if [ "$AVAIL_MEM" -lt 2000 ]; then
        echo -e "${YELLOW}⚠️  Low memory. High-detail generation may be very slow.${NC}"
    fi
fi

# Generate high-detail tiles
echo -e "${BLUE}Generating high-detail vector tiles...${NC}"
echo -e "${YELLOW}Started at: $(date)${NC}"

start_time=$(date +%s)

"$TILEMAKER_DIR/tilemaker" \
    --input "$OSM_DATA_DIR/$BERLIN_PBF_FILE" \
    --output "$OUTPUT_MBTILES" \
    --config "$HIGH_DETAIL_CONFIG" \
    --process "$TILEMAKER_DIR/process.lua" \
    --verbose

end_time=$(date +%s)
duration=$((end_time - start_time))
minutes=$((duration / 60))
seconds=$((duration % 60))

# Verify output
if [ -f "$OUTPUT_MBTILES" ]; then
    file_size=$(du -h "$OUTPUT_MBTILES" | cut -f1)
    echo -e "${GREEN}✓ High-detail vector tiles generated successfully!${NC}"
    echo -e "${BLUE}Output: $OUTPUT_MBTILES ($file_size)${NC}"
    echo -e "${BLUE}Generation time: ${minutes}m ${seconds}s${NC}"
    
    # Run verification
    if command -v python3 >/dev/null 2>&1; then
        echo -e "${YELLOW}Verifying generated tiles...${NC}"
        python3 verify-tiles.py "$OUTPUT_MBTILES"
    fi
    
    echo
    echo -e "${GREEN}=== High-Detail Tiles Ready ===${NC}"
    echo -e "${YELLOW}To use these tiles, update your Django settings to serve:${NC}"
    echo -e "${BLUE}  $OUTPUT_MBTILES${NC}"
    echo -e "${YELLOW}Or rename it to replace the current tiles:${NC}"
    echo -e "${BLUE}  mv $OUTPUT_MBTILES ./python/berlin.mbtiles${NC}"
else
    echo -e "${RED}✗ High-detail tile generation failed${NC}"
    exit 1
fi
