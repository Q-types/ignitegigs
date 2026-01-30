import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals: { supabase, session }, getClientAddress }) => {
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	const { contractId, role } = await request.json();

	if (!contractId || !role || !['performer', 'client'].includes(role)) {
		throw error(400, 'Invalid request');
	}

	// Fetch the contract and associated booking
	const { data: contract, error: fetchError } = await supabase
		.from('booking_contracts')
		.select('*, booking:bookings!booking_contracts_booking_id_fkey(performer_id, client_id)')
		.eq('id', contractId)
		.single();

	if (fetchError || !contract) {
		throw error(404, 'Contract not found');
	}

	// Verify the user is the right party
	const booking = contract.booking;
	if (role === 'client' && booking.client_id !== session.user.id) {
		throw error(403, 'Not authorized to sign this contract');
	}

	if (role === 'performer') {
		const { data: profile } = await supabase
			.from('performer_profiles')
			.select('id')
			.eq('user_id', session.user.id)
			.eq('id', booking.performer_id)
			.single();

		if (!profile) {
			throw error(403, 'Not authorized to sign this contract');
		}
	}

	const clientIp = getClientAddress();
	const now = new Date().toISOString();

	const updateData: Record<string, any> = {};

	if (role === 'performer') {
		updateData.performer_signed = true;
		updateData.performer_signed_at = now;
		updateData.performer_ip = clientIp;
	} else {
		updateData.client_signed = true;
		updateData.client_signed_at = now;
		updateData.client_ip = clientIp;
	}

	// Check if both parties will have signed
	const bothSigned =
		(role === 'performer' && contract.client_signed) ||
		(role === 'client' && contract.performer_signed);

	if (bothSigned) {
		updateData.status = 'signed';
	} else {
		updateData.status = 'pending';
	}

	const { error: updateError } = await supabase
		.from('booking_contracts')
		.update(updateData)
		.eq('id', contractId);

	if (updateError) {
		throw error(500, 'Failed to sign contract');
	}

	return json({ success: true, bothSigned });
};
