-- 012_geolocation.sql
-- Add PostGIS-based geolocation search for performer discovery

-- Ensure PostGIS is enabled (already is but safe to re-run)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add geography column for efficient radius queries
ALTER TABLE performer_profiles ADD COLUMN IF NOT EXISTS location_point geography(Point, 4326);

-- Create index for spatial queries
CREATE INDEX IF NOT EXISTS idx_performer_location_point ON performer_profiles USING GIST (location_point);

-- Function to update location_point when lat/lng changes
CREATE OR REPLACE FUNCTION update_location_point()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.location_lat IS NOT NULL AND NEW.location_lng IS NOT NULL THEN
    NEW.location_point = ST_SetSRID(ST_MakePoint(NEW.location_lng, NEW.location_lat), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists so migration is re-runnable
DROP TRIGGER IF EXISTS update_performer_location_point ON performer_profiles;

CREATE TRIGGER update_performer_location_point
BEFORE INSERT OR UPDATE OF location_lat, location_lng ON performer_profiles
FOR EACH ROW EXECUTE FUNCTION update_location_point();

-- Backfill existing records that have lat/lng but no location_point
UPDATE performer_profiles
SET location_point = ST_SetSRID(ST_MakePoint(location_lng, location_lat), 4326)::geography
WHERE location_lat IS NOT NULL AND location_lng IS NOT NULL
  AND location_point IS NULL;

-- Function for radius search (returns distance in miles)
CREATE OR REPLACE FUNCTION nearby_performers(lat DOUBLE PRECISION, lng DOUBLE PRECISION, radius_miles INTEGER DEFAULT 25)
RETURNS TABLE (
  performer_id UUID,
  distance_miles DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pp.id,
    ST_Distance(
      pp.location_point,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) / 1609.344 AS dist_miles
  FROM performer_profiles pp
  WHERE pp.location_point IS NOT NULL
    AND pp.is_active = true
    AND ST_DWithin(
      pp.location_point,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius_miles * 1609.344
    )
  ORDER BY dist_miles;
END;
$$ LANGUAGE plpgsql;
