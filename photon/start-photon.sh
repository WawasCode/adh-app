#!/bin/bash

# Start the Photon server in the background

# Configuration
PHOTON_JAR_FILE="photon.jar"
DATA_DIR="."
HEAP_SIZE="4G"
LOG_FILE="photon_server.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if Photon server is already running
is_photon_running() {
    pgrep -f "java -Xmx$HEAP_SIZE -jar $PHOTON_JAR_FILE" > /dev/null
}

# Function to start the Photon server
start_photon() {
    echo -e "${BLUE}=== Starting Photon Server ===${NC}"
    echo -e "${YELLOW}Starting Photon server with heap size $HEAP_SIZE...${NC}"
    nohup java -Xmx"$HEAP_SIZE" -jar "$PHOTON_JAR_FILE" -data-dir "$DATA_DIR" > "$LOG_FILE" 2>&1 &
    echo -e "${GREEN}✓ Photon server started in the background. Log file: $LOG_FILE${NC}"
}

# Function to stop the Photon server
stop_photon() {
    echo -e "${BLUE}=== Stopping Photon Server ===${NC}"
    pkill -f "java -Xmx$HEAP_SIZE -jar $PHOTON_JAR_FILE"
    echo -e "${GREEN}✓ Photon server stopped.${NC}"
}

# Check if Photon JAR file exists
if [ ! -f "$PHOTON_JAR_FILE" ]; then
    echo -e "${RED}✗ Error: $PHOTON_JAR_FILE not found. Please ensure the Photon JAR file is present.${NC}"
    exit 1
fi

# Check if Photon server is already running
if is_photon_running; then
    echo -e "${YELLOW}Photon server is already running.${NC}"
    echo -e "${BLUE}Use 'stop' to stop the server or 'restart' to restart it.${NC}"
else
    start_photon
fi

# Display usage information
echo
echo -e "${BLUE}Usage:${NC}"
echo -e "  ${GREEN}./start_photon.sh${NC} - Start the Photon server"
echo -e "  ${GREEN}./start_photon.sh stop${NC} - Stop the Photon server"
echo -e "  ${GREEN}./start_photon.sh restart${NC} - Restart the Photon server"
echo

# Handle command line arguments
case "$1" in
    stop)
        stop_photon
        ;;
    restart)
        stop_photon
        start_photon
        ;;
    *)
        # Default action is to start the server if not already running
        ;;
esac
