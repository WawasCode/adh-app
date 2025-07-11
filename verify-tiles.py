#!/usr/bin/env python3
"""
Simple script to verify that the generated MBTiles file is valid and contains data
"""

import sqlite3
import sys
import os

def verify_mbtiles(mbtiles_path):
    """Verify that the MBTiles file is valid and contains tiles"""
    
    if not os.path.exists(mbtiles_path):
        print(f"❌ MBTiles file not found: {mbtiles_path}")
        return False
    
    try:
        with sqlite3.connect(mbtiles_path) as conn:
            cursor = conn.cursor()
            
            # Check if required tables exist
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('metadata', 'tiles')")
            tables = [row[0] for row in cursor.fetchall()]
            
            if 'metadata' not in tables:
                print("❌ Missing 'metadata' table")
                return False
            
            if 'tiles' not in tables:
                print("❌ Missing 'tiles' table")
                return False
            
            print("✅ Required tables exist")
            
            # Check metadata
            cursor.execute("SELECT name, value FROM metadata")
            metadata = dict(cursor.fetchall())
            
            print("\n📊 Metadata:")
            for key, value in metadata.items():
                print(f"  {key}: {value}")
            
            # Check tile count
            cursor.execute("SELECT COUNT(*) FROM tiles")
            tile_count = cursor.fetchone()[0]
            print(f"\n🗂️  Total tiles: {tile_count}")
            
            if tile_count == 0:
                print("❌ No tiles found in the database")
                return False
            
            # Check zoom levels
            cursor.execute("SELECT DISTINCT zoom_level FROM tiles ORDER BY zoom_level")
            zoom_levels = [row[0] for row in cursor.fetchall()]
            print(f"🔍 Zoom levels: {zoom_levels}")
            
            # Show sample tile info
            cursor.execute("SELECT zoom_level, tile_column, tile_row, LENGTH(tile_data) as size FROM tiles LIMIT 5")
            print("\n🎯 Sample tiles:")
            for row in cursor.fetchall():
                z, x, y, size = row
                print(f"  Tile {z}/{x}/{y}: {size} bytes")
            
            print("\n✅ MBTiles file appears to be valid!")
            return True
            
    except Exception as e:
        print(f"❌ Error reading MBTiles file: {e}")
        return False

def main():
    mbtiles_path = "./python/berlin.mbtiles"
    
    if len(sys.argv) > 1:
        mbtiles_path = sys.argv[1]
    
    print(f"🔍 Verifying MBTiles file: {mbtiles_path}")
    print("=" * 50)
    
    success = verify_mbtiles(mbtiles_path)
    
    if success:
        print("\n🎉 Verification completed successfully!")
        sys.exit(0)
    else:
        print("\n💥 Verification failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
