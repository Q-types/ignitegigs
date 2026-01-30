-- Migration: 013_notifications.sql
-- Creates the notifications table for the in-app notification system

CREATE TABLE IF NOT EXISTS notifications (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
	type TEXT NOT NULL CHECK (type IN ('booking_request', 'booking_update', 'message', 'review', 'dispute', 'system', 'payment')),
	title TEXT NOT NULL,
	body TEXT NOT NULL,
	link TEXT,
	read BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_unread ON notifications (user_id, read) WHERE read = false;
CREATE INDEX idx_notifications_user_created ON notifications (user_id, created_at DESC);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
