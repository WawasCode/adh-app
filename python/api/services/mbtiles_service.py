import sqlite3
import logging
import os

logger = logging.getLogger(__name__)


class MBTilesService:
    """Service for serving vector tiles from MBTiles files"""
    
    def __init__(self, mbtiles_path):
        self.mbtiles_path = mbtiles_path
        if not os.path.exists(mbtiles_path):
            raise FileNotFoundError(f"MBTiles file not found: {mbtiles_path}")
    
    def get_tile(self, z, x, y):
        """
        Get a vector tile from the MBTiles file
        Returns: bytes of the tile data or None if not found
        """
        try:
            # Convert XYZ coordinates to TMS coordinates
            # MBTiles uses TMS (y=0 at bottom), web maps use XYZ (y=0 at top)
            y_tms = (2 ** z) - 1 - y
            
            with sqlite3.connect(self.mbtiles_path) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT tile_data FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?",
                    (z, x, y_tms)
                )
                result = cursor.fetchone()
                if result:
                    logger.debug(f"Found tile {z}/{x}/{y} (TMS: {z}/{x}/{y_tms})")
                    return result[0]
                else:
                    logger.debug(f"Tile not found: {z}/{x}/{y} (TMS: {z}/{x}/{y_tms})")
                    return None
        except Exception as e:
            logger.error(f"Error reading tile {z}/{x}/{y} from MBTiles: {str(e)}")
            return None
    
    def get_metadata(self):
        """
        Get metadata from the MBTiles file
        Returns: dict of metadata
        """
        try:
            with sqlite3.connect(self.mbtiles_path) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT name, value FROM metadata")
                metadata = dict(cursor.fetchall())
                return metadata
        except Exception as e:
            logger.error(f"Error reading metadata from MBTiles: {str(e)}")
            return {}
    
    def get_bounds(self):
        """
        Get the bounds from metadata
        Returns: list [minlon, minlat, maxlon, maxlat] or None
        """
        metadata = self.get_metadata()
        bounds_str = metadata.get('bounds')
        if bounds_str:
            try:
                return [float(x) for x in bounds_str.split(',')]
            except:
                pass
        return None
    
    def get_center(self):
        """
        Get the center from metadata
        Returns: list [lon, lat, zoom] or None
        """
        metadata = self.get_metadata()
        center_str = metadata.get('center')
        if center_str:
            try:
                return [float(x) for x in center_str.split(',')]
            except:
                pass
        return None
    
    def get_zoom_range(self):
        """
        Get min/max zoom from metadata
        Returns: tuple (minzoom, maxzoom)
        """
        metadata = self.get_metadata()
        try:
            minzoom = int(metadata.get('minzoom', 0))
            maxzoom = int(metadata.get('maxzoom', 14))
            return minzoom, maxzoom
        except:
            return 0, 14
