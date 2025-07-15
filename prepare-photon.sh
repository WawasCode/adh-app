#!/bin/bash

# prepare-photon.sh - Download Photon geocoding data and JAR file into a photon subdirectory
# Running this script is the easy way to do it. You can also build a nominatim instance with your own data and than import it into Photon. It's a big overhead, but you need to do that if you want to use a custom dataset.

set -e  # Exit on any error

# Configuration
PHOTON_DIR="./photon"
PHOTON_JAR_URL="https://github.com/komoot/photon/releases/download/0.7.0/photon-opensearch-0.7.0.jar"
PHOTON_JAR_FILE="photon.jar"
PHOTON_DATA_URL="https://download1.graphhopper.com/public/experimental/extracts/by-country-code/de/photon-db-de-latest.tar.bz2"
PHOTON_DATA_DIR="photon_data"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Photon Geocoding Download Script ===${NC}"
echo -e "${BLUE}Downloading Photon geocoding data and JAR file into the 'photon' directory${NC}"
echo

# Make this script executable
chmod +x "$0"

# Create photon directory if it doesn't exist
echo -e "${YELLOW}Creating photon directory...${NC}"
mkdir -p "$PHOTON_DIR"
cd "$PHOTON_DIR"

# Download Photon JAR file
echo -e "${YELLOW}Downloading Photon JAR file...${NC}"
if [ ! -f "$PHOTON_JAR_FILE" ]; then
    echo -e "${BLUE}Downloading: $PHOTON_JAR_URL${NC}"
    wget -O "$PHOTON_JAR_FILE" "$PHOTON_JAR_URL"

    # Verify download
    if [ -f "$PHOTON_JAR_FILE" ]; then
        file_size=$(du -h "$PHOTON_JAR_FILE" | cut -f1)
        echo -e "${GREEN}✓ Download complete: $PHOTON_JAR_FILE ($file_size)${NC}"
    else
        echo -e "${RED}✗ Download failed${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Photon JAR file already exists${NC}"
fi

# Download and extract Photon data
echo -e "${YELLOW}Downloading and extracting Photon data...${NC}"
if [ ! -d "$PHOTON_DATA_DIR" ]; then
    echo -e "${BLUE}Downloading: $PHOTON_DATA_URL${NC}"
    wget -O - "$PHOTON_DATA_URL" | bzip2 -cd | tar x

    # Verify extraction
    if [ -d "$PHOTON_DATA_DIR" ]; then
        echo -e "${GREEN}✓ Data extraction complete: $PHOTON_DATA_DIR${NC}"
    else
        echo -e "${RED}✗ Data extraction failed${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Photon data directory already exists${NC}"
fi

# Display summary
echo
echo -e "${GREEN}=== Photon Download Complete ===${NC}"
echo -e "${BLUE}Files created:${NC}"
echo -e "  📁 $PHOTON_DIR/$PHOTON_JAR_FILE (Photon JAR)"
echo -e "  📁 $PHOTON_DIR/$PHOTON_DATA_DIR (Photon data)"
echo
echo -e "${GREEN}✓ Photon files are ready for use in the 'photon' directory!${NC}"
