import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';
import { PUBLIC_APP_URL } from '$env/static/public';

const resend = new Resend(RESEND_API_KEY);

const FROM_EMAIL = 'IgniteGigs <bookings@ignitegigs.com>';

interface EmailData {
	to: string;
	subject: string;
	html: string;
}

async function sendEmail({ to, subject, html }: EmailData) {
	try {
		const { data, error } = await resend.emails.send({
			from: FROM_EMAIL,
			to,
			subject,
			html
		});

		if (error) {
			console.error('Email send error:', error);
			throw new Error(`Failed to send email: ${error.message}`);
		}

		return data;
	} catch (err) {
		console.error('Email error:', err);
		throw err;
	}
}

// Helper to format price in GBP
function formatPrice(pence: number): string {
	return new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: 'GBP'
	}).format(pence / 100);
}

// Helper to format date
function formatDate(date: string): string {
	return new Date(date).toLocaleDateString('en-GB', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
}

// Helper to format time
function formatTime(time: string): string {
	const [hours, minutes] = time.split(':');
	const date = new Date();
	date.setHours(parseInt(hours), parseInt(minutes));
	return date.toLocaleTimeString('en-GB', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});
}

// Email wrapper template
function emailWrapper(content: string): string {
	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>IgniteGigs</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
	<table role="presentation" style="width: 100%; border-collapse: collapse;">
		<tr>
			<td align="center" style="padding: 40px 0;">
				<table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
					<!-- Header -->
					<tr>
						<td style="padding: 32px 40px; text-align: center; border-bottom: 1px solid #eee;">
							<span style="font-size: 28px;">&#128293;</span>
							<span style="font-size: 24px; font-weight: bold; color: #1E1E2E; margin-left: 8px;">IgniteGigs</span>
						</td>
					</tr>
					<!-- Content -->
					<tr>
						<td style="padding: 40px;">
							${content}
						</td>
					</tr>
					<!-- Footer -->
					<tr>
						<td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #eee; text-align: center;">
							<p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">
								IgniteGigs - Book direct. Keep 92%. Own your reputation.
							</p>
							<p style="margin: 0; color: #9ca3af; font-size: 12px;">
								&copy; ${new Date().getFullYear()} IgniteGigs. All rights reserved.
							</p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>
	`;
}

// Booking request notification (to performer)
interface NewBookingRequestData {
	to: string;
	performerName: string;
	clientName: string;
	eventDate: string;
	eventLocation: string;
	bookingId: string;
	eventTime?: string | null;
	eventType?: string;
	guestCount?: number | null;
	eventDetails?: string | null;
	quotedPrice?: number;
}

export async function sendNewBookingRequestEmail(data: NewBookingRequestData) {
	const content = `
		<h1 style="margin: 0 0 24px; font-size: 24px; color: #1E1E2E;">New Booking Request!</h1>

		<p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
			Hi ${data.performerName},
		</p>

		<p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
			Great news! <strong>${data.clientName}</strong> wants to book you for an event.
		</p>

		<div style="background-color: #FFF0EB; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
			<h2 style="margin: 0 0 16px; font-size: 18px; color: #FF6B35;">Event Details</h2>
			<table style="width: 100%; border-collapse: collapse;">
				<tr>
					<td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">Date</td>
					<td style="padding: 8px 0; color: #1E1E2E; font-size: 14px; font-weight: 500;">${formatDate(data.eventDate)}</td>
				</tr>
				${data.eventTime ? `
				<tr>
					<td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Time</td>
					<td style="padding: 8px 0; color: #1E1E2E; font-size: 14px; font-weight: 500;">${formatTime(data.eventTime)}</td>
				</tr>
				` : ''}
				<tr>
					<td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Event Type</td>
					<td style="padding: 8px 0; color: #1E1E2E; font-size: 14px; font-weight: 500;">${data.eventType}</td>
				</tr>
				<tr>
					<td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Location</td>
					<td style="padding: 8px 0; color: #1E1E2E; font-size: 14px; font-weight: 500;">${data.eventLocation}</td>
				</tr>
				${data.guestCount ? `
				<tr>
					<td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Guests</td>
					<td style="padding: 8px 0; color: #1E1E2E; font-size: 14px; font-weight: 500;">${data.guestCount} people</td>
				</tr>
				` : ''}
				<tr>
					<td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Quoted Price</td>
					<td style="padding: 8px 0; color: #FF6B35; font-size: 16px; font-weight: 600;">${formatPrice(data.quotedPrice)}</td>
				</tr>
			</table>
			${data.eventDetails ? `
			<div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #FFD5C8;">
				<p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Event Details</p>
				<p style="margin: 0; color: #1E1E2E; font-size: 14px; line-height: 1.5;">${data.eventDetails}</p>
			</div>
			` : ''}
		</div>

		<p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
			Please respond to this request within 48 hours. After accepting, you can message the client to discuss details.
		</p>

		<div style="text-align: center;">
			<a href="${PUBLIC_APP_URL}/dashboard/bookings/${data.bookingId}"
			   style="display: inline-block; padding: 14px 32px; background-color: #FF6B35; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
				View Booking Request
			</a>
		</div>
	`;

	return sendEmail({
		to: data.to,
		subject: `New booking request from ${data.clientName}`,
		html: emailWrapper(content)
	});
}

// Booking accepted notification (to client)
interface BookingAcceptedData {
	to: string;
	clientName: string;
	performerName: string;
	eventDate: string;
	bookingId: string;
	eventTime?: string | null;
	eventLocation?: string;
	agreedPrice?: number;
	depositAmount?: number;
}

export async function sendBookingAcceptedEmail(data: BookingAcceptedData) {
	const content = `
		<h1 style="margin: 0 0 24px; font-size: 24px; color: #1E1E2E;">Booking Accepted!</h1>

		<p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
			Hi ${data.clientName},
		</p>

		<p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
			Great news! <strong>${data.performerName}</strong> has accepted your booking request.
		</p>

		<div style="background-color: #D1FAE5; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
			<div style="display: flex; align-items: center; margin-bottom: 16px;">
				<span style="font-size: 24px; margin-right: 12px;">&#9989;</span>
				<h2 style="margin: 0; font-size: 18px; color: #10B981;">Confirmed Details</h2>
			</div>
			<table style="width: 100%; border-collapse: collapse;">
				<tr>
					<td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">Date</td>
					<td style="padding: 8px 0; color: #1E1E2E; font-size: 14px; font-weight: 500;">${formatDate(data.eventDate)}</td>
				</tr>
				${data.eventTime ? `
				<tr>
					<td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Time</td>
					<td style="padding: 8px 0; color: #1E1E2E; font-size: 14px; font-weight: 500;">${formatTime(data.eventTime)}</td>
				</tr>
				` : ''}
				<tr>
					<td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Location</td>
					<td style="padding: 8px 0; color: #1E1E2E; font-size: 14px; font-weight: 500;">${data.eventLocation}</td>
				</tr>
				<tr>
					<td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Total Price</td>
					<td style="padding: 8px 0; color: #1E1E2E; font-size: 16px; font-weight: 600;">${formatPrice(data.agreedPrice)}</td>
				</tr>
			</table>
		</div>

		<div style="background-color: #FEF3C7; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
			<h3 style="margin: 0 0 12px; font-size: 16px; color: #F59E0B;">Next Step: Pay Deposit</h3>
			<p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.5;">
				To confirm your booking, please pay the 50% deposit of <strong>${formatPrice(data.depositAmount)}</strong>.
				The remaining balance will be due after the event.
			</p>
		</div>

		<div style="text-align: center;">
			<a href="${PUBLIC_APP_URL}/bookings/${data.bookingId}"
			   style="display: inline-block; padding: 14px 32px; background-color: #FF6B35; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
				Pay Deposit & Confirm
			</a>
		</div>

		<p style="margin: 24px 0 0; color: #6b7280; font-size: 14px; text-align: center;">
			You can also message ${data.performerName} directly through the booking page.
		</p>
	`;

	return sendEmail({
		to: data.to,
		subject: `${data.performerName} accepted your booking!`,
		html: emailWrapper(content)
	});
}

// Booking declined notification (to client)
interface BookingDeclinedData {
	to: string;
	clientName: string;
	performerName: string;
	eventDate: string;
	reason?: string;
}

export async function sendBookingDeclinedEmail(data: BookingDeclinedData) {
	const content = `
		<h1 style="margin: 0 0 24px; font-size: 24px; color: #1E1E2E;">Booking Update</h1>

		<p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
			Hi ${data.clientName},
		</p>

		<p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
			Unfortunately, <strong>${data.performerName}</strong> is unable to accept your booking request for ${formatDate(data.eventDate)}.
		</p>

		${data.reason ? `
		<div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #6b7280;">
			<p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Message from the performer:</p>
			<p style="margin: 0; color: #1E1E2E; font-size: 14px; font-style: italic;">"${data.reason}"</p>
		</div>
		` : ''}

		<p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
			Don't worry - there are many other talented performers on IgniteGigs who would love to make your event unforgettable!
		</p>

		<div style="text-align: center;">
			<a href="${PUBLIC_APP_URL}/performers"
			   style="display: inline-block; padding: 14px 32px; background-color: #FF6B35; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
				Find Other Performers
			</a>
		</div>
	`;

	return sendEmail({
		to: data.to,
		subject: `Update on your booking request`,
		html: emailWrapper(content)
	});
}

// Booking cancelled notification (to performer)
interface BookingCancelledData {
	to: string;
	performerName: string;
	eventDate: string;
	reason?: string;
}

export async function sendBookingCancelledEmail(data: BookingCancelledData) {
	const content = `
		<h1 style="margin: 0 0 24px; font-size: 24px; color: #1E1E2E;">Booking Cancelled</h1>

		<p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
			Hi ${data.performerName},
		</p>

		<p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
			A booking request for ${formatDate(data.eventDate)} has been cancelled.
		</p>

		${data.reason ? `
		<div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #6b7280;">
			<p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Reason:</p>
			<p style="margin: 0; color: #1E1E2E; font-size: 14px; font-style: italic;">"${data.reason}"</p>
		</div>
		` : ''}

		<p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
			This date is now available again in your calendar.
		</p>

		<div style="text-align: center;">
			<a href="${PUBLIC_APP_URL}/dashboard"
			   style="display: inline-block; padding: 14px 32px; background-color: #FF6B35; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
				Go to Dashboard
			</a>
		</div>
	`;

	return sendEmail({
		to: data.to,
		subject: `Booking cancelled`,
		html: emailWrapper(content)
	});
}

// New message notification
interface NewMessageData {
	recipientName: string;
	recipientEmail: string;
	senderName: string;
	eventDate: string;
	messagePreview: string;
	bookingId: string;
}

export async function sendNewMessageEmail(data: NewMessageData) {
	const content = `
		<h1 style="margin: 0 0 24px; font-size: 24px; color: #1E1E2E;">New Message</h1>

		<p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
			Hi ${data.recipientName},
		</p>

		<p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
			<strong>${data.senderName}</strong> sent you a message about the booking on ${formatDate(data.eventDate)}.
		</p>

		<div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #FF6B35;">
			<p style="margin: 0; color: #1E1E2E; font-size: 14px; line-height: 1.5;">"${data.messagePreview}"</p>
		</div>

		<div style="text-align: center;">
			<a href="${PUBLIC_APP_URL}/bookings/${data.bookingId}"
			   style="display: inline-block; padding: 14px 32px; background-color: #FF6B35; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
				Reply to Message
			</a>
		</div>
	`;

	return sendEmail({
		to: data.recipientEmail,
		subject: `New message from ${data.senderName}`,
		html: emailWrapper(content)
	});
}
