-- ============================================================
-- Migration 011: Concurrent Booking Prevention
-- Prevents double-booking performers on the same date
-- ============================================================

-- Create a partial unique index to prevent double-booking
-- Only applies to active bookings (not cancelled/declined)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_booking
ON bookings (performer_id, event_date)
WHERE status NOT IN ('cancelled', 'declined');

-- Function to check booking availability before insert/update
CREATE OR REPLACE FUNCTION check_booking_availability()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM bookings
    WHERE performer_id = NEW.performer_id
    AND event_date = NEW.event_date
    AND id != NEW.id
    AND status NOT IN ('cancelled', 'declined')
  ) THEN
    RAISE EXCEPTION 'Performer already has a booking on this date';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: check before inserting a new booking
CREATE TRIGGER check_booking_before_insert
BEFORE INSERT ON bookings
FOR EACH ROW EXECUTE FUNCTION check_booking_availability();

-- Trigger: check before updating a booking (only when date or performer changes)
CREATE TRIGGER check_booking_before_update
BEFORE UPDATE ON bookings
FOR EACH ROW
WHEN (OLD.event_date IS DISTINCT FROM NEW.event_date OR OLD.performer_id IS DISTINCT FROM NEW.performer_id)
EXECUTE FUNCTION check_booking_availability();
