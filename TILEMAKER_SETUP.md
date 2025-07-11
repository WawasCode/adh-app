# Tilemaker Setup Guide

This document explains how to set up vector tiles using Tilemaker instead of Docker and PostGIS.

## Overview

The new setup uses:
- **Tilemaker**: A fast, standalone tool for generating vector tiles from OSM data
- **MBTiles**: SQLite-based tile storage format
- **Django**: Python backend serving tiles directly from MBTiles files

## Prerequisites

### System Requirements
- Linux (Ubuntu/Debian recommended) or macOS
- Build tools (gcc, make, cmake)
- Git
- Python 3.8+

### Automatic Dependency Installation
The `prepare-data.sh` script will automatically install required dependencies on:
- Ubuntu/Debian (using apt-get)
- RHEL/CentOS (using yum)
- macOS (using Homebrew)

## Quick Start

1. **Run the preparation script:**
   ```bash
   ./prepare-data.sh
   ```

   This script will:
   - Install system dependencies
   - Download Berlin OSM data from Geofabrik
   - Clone and build Tilemaker
   - Generate vector tiles in MBTiles format
   - Verify the generated tiles

2. **Start the Django server:**
   ```bash
   cd python
   python manage.py runserver
   ```

3. **Access tiles:**
   - Tiles are available at: `http://localhost:8000/api/tiles/{z}/{x}/{y}.mvt`
   - Metadata: `http://localhost:8000/api/tiles/metadata.json`
   - Stats: `http://localhost:8000/api/tiles/stats/`

## What's Generated

### Files Created
- `osm-data/berlin-latest.osm.pbf` - Raw OSM data from Geofabrik
- `tilemaker/` - Tilemaker installation directory
- `python/berlin.mbtiles` - Generated vector tiles (SQLite database)

### Tile Layers
The tiles use the OpenMapTiles-compatible schema with these layers:
- `transportation` - Roads and railways
- `transportation_name` - Road names
- `building` - Building footprints
- `water` - Water bodies
- `waterway` - Rivers and streams
- `landuse` - Land use areas
- `landcover` - Natural land cover
- `place` - Place names and labels
- `poi` - Points of interest

## Configuration

### Tilemaker Configuration
The setup uses `tilemaker-config.json` for layer definitions and zoom levels.

### Customization
To generate tiles for a different region:

1. Edit the `BERLIN_PBF_URL` in `prepare-data.sh`
2. Update the `BERLIN_PBF_FILE` and `OUTPUT_MBTILES` variables
3. Run the script again

### Custom Processing
To modify how OSM data is processed:
- Edit the Lua processing script (uses Tilemaker's built-in OpenMapTiles processor)
- Modify `tilemaker-config.json` for different zoom levels or layers

## Verification

Use the verification script to check generated tiles:
```bash
python3 verify-tiles.py python/berlin.mbtiles
```

This will show:
- Metadata information
- Tile counts and zoom levels
- Sample tile information

## Troubleshooting

### Build Issues
If Tilemaker fails to build:
1. Ensure all dependencies are installed
2. Check that you have enough RAM (building requires ~2GB)
3. Update system packages

### Large Datasets
For larger regions:
- Use fast storage (SSD recommended)
- Ensure sufficient RAM (varies by region size)
- Consider using Tilemaker's `--store` option for disk-based processing

### Tile Serving Issues
If tiles don't load:
1. Verify the MBTiles file exists: `ls -la python/berlin.mbtiles`
2. Check Django logs for errors
3. Run the verification script
4. Ensure the Django server is running on port 8000

## Performance Notes

- MBTiles files are compressed and efficient for serving
- Django serves tiles with appropriate caching headers
- No database server required - tiles are served directly from SQLite files
- Suitable for development and small to medium production deployments

## Advantages Over PostGIS Setup

1. **Simpler deployment** - No Docker containers or PostgreSQL required
2. **Better performance** - Pre-generated tiles serve faster than dynamic generation
3. **Lower resource usage** - No database server overhead
4. **Easier backup** - Single MBTiles file contains everything
5. **Offline capability** - Tiles can be used without internet connection

## File Sizes

Typical MBTiles file sizes for Berlin:
- Berlin city (~900 km²): 50-200MB depending on zoom levels
- Zoom levels 0-14: Smaller file, good for most web applications
- Higher zoom levels (15+): Larger files, more detail for building-level mapping
