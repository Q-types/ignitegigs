// Generated types from Supabase - run `npm run db:generate` to update
// This is a placeholder until you connect to your Supabase project

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			// Alias for performer_profiles (common query pattern)
			performers: {
				Row: {
					id: string;
					user_id: string;
					stage_name: string | null;
					bio: string | null;
					tagline: string | null;
					location_name: string;
					location_lat: number | null;
					location_lng: number | null;
					travel_radius_miles: number;
					performer_category: string[];
					act_types: string[];
					min_rate_pence: number | null;
					hourly_rate_pence: number | null;
					event_rate_pence: number | null;
					stripe_account_id: string | null;
					stripe_onboarding_complete: boolean;
					is_verified: boolean;
					verification_badges: string[];
					avg_rating: number;
					total_reviews: number;
					total_bookings: number;
					response_rate: number;
					response_time_hours: number | null;
					is_active: boolean;
					is_featured: boolean;
					profile_complete: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					stage_name?: string | null;
					bio?: string | null;
					tagline?: string | null;
					location_name: string;
					location_lat?: number | null;
					location_lng?: number | null;
					travel_radius_miles?: number;
					performer_category: string[];
					act_types: string[];
					min_rate_pence?: number | null;
					hourly_rate_pence?: number | null;
					event_rate_pence?: number | null;
					stripe_account_id?: string | null;
					stripe_onboarding_complete?: boolean;
					is_verified?: boolean;
					verification_badges?: string[];
					avg_rating?: number;
					total_reviews?: number;
					total_bookings?: number;
					response_rate?: number;
					response_time_hours?: number | null;
					is_active?: boolean;
					is_featured?: boolean;
					profile_complete?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					stage_name?: string | null;
					bio?: string | null;
					tagline?: string | null;
					location_name?: string;
					location_lat?: number | null;
					location_lng?: number | null;
					travel_radius_miles?: number;
					performer_category?: string[];
					act_types?: string[];
					min_rate_pence?: number | null;
					hourly_rate_pence?: number | null;
					event_rate_pence?: number | null;
					stripe_account_id?: string | null;
					stripe_onboarding_complete?: boolean;
					is_verified?: boolean;
					verification_badges?: string[];
					avg_rating?: number;
					total_reviews?: number;
					total_bookings?: number;
					response_rate?: number;
					response_time_hours?: number | null;
					is_active?: boolean;
					is_featured?: boolean;
					profile_complete?: boolean;
					created_at?: string;
					updated_at?: string;
				};
			};
			users: {
				Row: {
					id: string;
					email: string;
					full_name: string;
					avatar_url: string | null;
					phone: string | null;
					user_type: 'performer' | 'client' | 'both';
					email_verified: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					email: string;
					full_name: string;
					avatar_url?: string | null;
					phone?: string | null;
					user_type?: 'performer' | 'client' | 'both';
					email_verified?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					email?: string;
					full_name?: string;
					avatar_url?: string | null;
					phone?: string | null;
					user_type?: 'performer' | 'client' | 'both';
					email_verified?: boolean;
					created_at?: string;
					updated_at?: string;
				};
			};
			performer_profiles: {
				Row: {
					id: string;
					user_id: string;
					stage_name: string | null;
					bio: string | null;
					tagline: string | null;
					location_name: string;
					location_lat: number | null;
					location_lng: number | null;
					travel_radius_miles: number;
					performer_category: string[];
					act_types: string[];
					min_rate_pence: number | null;
					hourly_rate_pence: number | null;
					event_rate_pence: number | null;
					stripe_account_id: string | null;
					stripe_onboarding_complete: boolean;
					is_verified: boolean;
					verification_badges: string[];
					avg_rating: number;
					total_reviews: number;
					total_bookings: number;
					response_rate: number;
					response_time_hours: number | null;
					is_active: boolean;
					is_featured: boolean;
					profile_complete: boolean;
					vouch_count: number;
					community_trusted: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					stage_name?: string | null;
					bio?: string | null;
					tagline?: string | null;
					location_name: string;
					location_lat?: number | null;
					location_lng?: number | null;
					travel_radius_miles?: number;
					performer_category: string[];
					act_types: string[];
					min_rate_pence?: number | null;
					hourly_rate_pence?: number | null;
					event_rate_pence?: number | null;
					stripe_account_id?: string | null;
					stripe_onboarding_complete?: boolean;
					is_verified?: boolean;
					verification_badges?: string[];
					avg_rating?: number;
					total_reviews?: number;
					total_bookings?: number;
					response_rate?: number;
					response_time_hours?: number | null;
					is_active?: boolean;
					is_featured?: boolean;
					profile_complete?: boolean;
					vouch_count?: number;
					community_trusted?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					stage_name?: string | null;
					bio?: string | null;
					tagline?: string | null;
					location_name?: string;
					location_lat?: number | null;
					location_lng?: number | null;
					travel_radius_miles?: number;
					performer_category?: string[];
					act_types?: string[];
					min_rate_pence?: number | null;
					hourly_rate_pence?: number | null;
					event_rate_pence?: number | null;
					stripe_account_id?: string | null;
					stripe_onboarding_complete?: boolean;
					is_verified?: boolean;
					verification_badges?: string[];
					avg_rating?: number;
					total_reviews?: number;
					total_bookings?: number;
					response_rate?: number;
					response_time_hours?: number | null;
					is_active?: boolean;
					is_featured?: boolean;
					profile_complete?: boolean;
					vouch_count?: number;
					community_trusted?: boolean;
					created_at?: string;
					updated_at?: string;
				};
			};
			performer_media: {
				Row: {
					id: string;
					performer_id: string;
					media_type: 'video' | 'photo';
					url: string;
					thumbnail_url: string | null;
					cloudinary_public_id: string | null;
					title: string | null;
					description: string | null;
					is_primary: boolean;
					sort_order: number;
					duration_seconds: number | null;
					created_at: string;
				};
				Insert: {
					id?: string;
					performer_id: string;
					media_type: 'video' | 'photo';
					url: string;
					thumbnail_url?: string | null;
					cloudinary_public_id?: string | null;
					title?: string | null;
					description?: string | null;
					is_primary?: boolean;
					sort_order?: number;
					duration_seconds?: number | null;
					created_at?: string;
				};
				Update: {
					id?: string;
					performer_id?: string;
					media_type?: 'video' | 'photo';
					url?: string;
					thumbnail_url?: string | null;
					cloudinary_public_id?: string | null;
					title?: string | null;
					description?: string | null;
					is_primary?: boolean;
					sort_order?: number;
					duration_seconds?: number | null;
					created_at?: string;
				};
			};
			bookings: {
				Row: {
					id: string;
					performer_id: string;
					client_id: string;
					status: 'inquiry' | 'pending' | 'accepted' | 'confirmed' | 'completed' | 'cancelled' | 'declined' | 'disputed';
					event_date: string;
					event_time: string | null;
					event_end_time: string | null;
					event_duration_hours: number | null;
					event_location: string;
					event_location_lat: number | null;
					event_location_lng: number | null;
					event_type: string | null;
					event_details: string | null;
					guest_count: number | null;
					quoted_price_pence: number;
					agreed_price_pence: number | null;
					deposit_pence: number | null;
					platform_fee_pence: number | null;
					performer_payout_pence: number | null;
					deposit_paid: boolean;
					deposit_paid_at: string | null;
					final_paid: boolean;
					final_paid_at: string | null;
					stripe_payment_intent_id: string | null;
					stripe_transfer_id: string | null;
					created_at: string;
					updated_at: string;
					responded_at: string | null;
					completed_at: string | null;
				};
				Insert: {
					id?: string;
					performer_id: string;
					client_id: string;
					status?: 'inquiry' | 'pending' | 'accepted' | 'confirmed' | 'completed' | 'cancelled' | 'declined' | 'disputed';
					event_date: string;
					event_time?: string | null;
					event_end_time?: string | null;
					event_duration_hours?: number | null;
					event_location: string;
					event_location_lat?: number | null;
					event_location_lng?: number | null;
					event_type?: string | null;
					event_details?: string | null;
					guest_count?: number | null;
					quoted_price_pence: number;
					agreed_price_pence?: number | null;
					deposit_pence?: number | null;
					platform_fee_pence?: number | null;
					performer_payout_pence?: number | null;
					deposit_paid?: boolean;
					deposit_paid_at?: string | null;
					final_paid?: boolean;
					final_paid_at?: string | null;
					stripe_payment_intent_id?: string | null;
					stripe_transfer_id?: string | null;
					created_at?: string;
					updated_at?: string;
					responded_at?: string | null;
					completed_at?: string | null;
				};
				Update: {
					id?: string;
					performer_id?: string;
					client_id?: string;
					status?: 'inquiry' | 'pending' | 'accepted' | 'confirmed' | 'completed' | 'cancelled' | 'declined' | 'disputed';
					event_date?: string;
					event_time?: string | null;
					event_end_time?: string | null;
					event_duration_hours?: number | null;
					event_location?: string;
					event_location_lat?: number | null;
					event_location_lng?: number | null;
					event_type?: string | null;
					event_details?: string | null;
					guest_count?: number | null;
					quoted_price_pence?: number;
					agreed_price_pence?: number | null;
					deposit_pence?: number | null;
					platform_fee_pence?: number | null;
					performer_payout_pence?: number | null;
					deposit_paid?: boolean;
					deposit_paid_at?: string | null;
					final_paid?: boolean;
					final_paid_at?: string | null;
					stripe_payment_intent_id?: string | null;
					stripe_transfer_id?: string | null;
					created_at?: string;
					updated_at?: string;
					responded_at?: string | null;
					completed_at?: string | null;
				};
			};
			reviews: {
				Row: {
					id: string;
					booking_id: string;
					reviewer_id: string;
					reviewee_id: string;
					reviewer_type: 'client' | 'performer';
					rating: number;
					content: string | null;
					professionalism_rating: number | null;
					communication_rating: number | null;
					value_rating: number | null;
					is_public: boolean;
					created_at: string;
				};
				Insert: {
					id?: string;
					booking_id: string;
					reviewer_id: string;
					reviewee_id: string;
					reviewer_type: 'client' | 'performer';
					rating: number;
					content?: string | null;
					professionalism_rating?: number | null;
					communication_rating?: number | null;
					value_rating?: number | null;
					is_public?: boolean;
					created_at?: string;
				};
				Update: {
					id?: string;
					booking_id?: string;
					reviewer_id?: string;
					reviewee_id?: string;
					reviewer_type?: 'client' | 'performer';
					rating?: number;
					content?: string | null;
					professionalism_rating?: number | null;
					communication_rating?: number | null;
					value_rating?: number | null;
					is_public?: boolean;
					created_at?: string;
				};
			};
			messages: {
				Row: {
					id: string;
					booking_id: string;
					sender_id: string;
					content: string;
					read_at: string | null;
					created_at: string;
				};
				Insert: {
					id?: string;
					booking_id: string;
					sender_id: string;
					content: string;
					read_at?: string | null;
					created_at?: string;
				};
				Update: {
					id?: string;
					booking_id?: string;
					sender_id?: string;
					content?: string;
					read_at?: string | null;
					created_at?: string;
				};
			};
			availability: {
				Row: {
					id: string;
					performer_id: string;
					date: string;
					is_available: boolean;
					is_booked: boolean;
					notes: string | null;
				};
				Insert: {
					id?: string;
					performer_id: string;
					date: string;
					is_available?: boolean;
					is_booked?: boolean;
					notes?: string | null;
				};
				Update: {
					id?: string;
					performer_id?: string;
					date?: string;
					is_available?: boolean;
					is_booked?: boolean;
					notes?: string | null;
				};
			};
			performer_vouches: {
				Row: {
					id: string;
					voucher_id: string;
					vouchee_id: string;
					message: string | null;
					vouch_type: 'skill' | 'professionalism' | 'safety' | 'reliability';
					created_at: string;
				};
				Insert: {
					id?: string;
					voucher_id: string;
					vouchee_id: string;
					message?: string | null;
					vouch_type?: 'skill' | 'professionalism' | 'safety' | 'reliability';
					created_at?: string;
				};
				Update: {
					id?: string;
					voucher_id?: string;
					vouchee_id?: string;
					message?: string | null;
					vouch_type?: 'skill' | 'professionalism' | 'safety' | 'reliability';
					created_at?: string;
				};
			};
		};
		Views: {};
		Functions: {};
		Enums: {};
	};
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Convenience types
export type User = Tables<'users'>;
export type Performer = Tables<'performers'>;
export type PerformerProfile = Tables<'performer_profiles'>;
export type PerformerMedia = Tables<'performer_media'>;
export type Booking = Tables<'bookings'>;
export type Review = Tables<'reviews'>;
export type Message = Tables<'messages'>;
export type Availability = Tables<'availability'>;
export type PerformerVouch = Tables<'performer_vouches'>;

// Vouch type with voucher details (from get_performer_vouches function)
export interface VouchWithVoucher {
	id: string;
	voucher_id: string;
	voucher_stage_name: string | null;
	voucher_avatar_url: string | null;
	voucher_user_id: string;
	message: string | null;
	vouch_type: 'skill' | 'professionalism' | 'safety' | 'reliability';
	created_at: string;
}
