import { fail } from '@sveltejs/kit';
import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';
import { PUBLIC_APP_URL } from '$env/static/public';
import { checkFormRateLimit } from '$lib/server/rateLimit';
import type { Actions } from './$types';

const resend = new Resend(RESEND_API_KEY);

const CONTACT_TO = 'hello@ignitegigs.com';
const FROM_EMAIL = 'IgniteGigs <bookings@ignitegigs.com>';

function buildContactEmailHtml(name: string, email: string, subject: string, message: string): string {
	const escapedName = escapeHtml(name);
	const escapedEmail = escapeHtml(email);
	const escapedSubject = escapeHtml(subject);
	const escapedMessage = escapeHtml(message).replace(/\n/g, '<br>');

	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>New Contact Form Submission</title>
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
							<h1 style="margin: 0 0 24px; font-size: 24px; color: #1E1E2E;">New Contact Form Submission</h1>

							<div style="background-color: #FFF0EB; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
								<h2 style="margin: 0 0 16px; font-size: 18px; color: #FF6B35;">Details</h2>
								<table style="width: 100%; border-collapse: collapse;">
									<tr>
										<td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 100px; vertical-align: top;">Name</td>
										<td style="padding: 8px 0; color: #1E1E2E; font-size: 14px; font-weight: 500;">${escapedName}</td>
									</tr>
									<tr>
										<td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;">Email</td>
										<td style="padding: 8px 0; color: #1E1E2E; font-size: 14px; font-weight: 500;">
											<a href="mailto:${escapedEmail}" style="color: #FF6B35; text-decoration: underline;">${escapedEmail}</a>
										</td>
									</tr>
									<tr>
										<td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;">Subject</td>
										<td style="padding: 8px 0; color: #1E1E2E; font-size: 14px; font-weight: 500;">${escapedSubject}</td>
									</tr>
								</table>
							</div>

							<div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #FF6B35;">
								<p style="margin: 0 0 8px; color: #6b7280; font-size: 14px; font-weight: 600;">Message</p>
								<p style="margin: 0; color: #1E1E2E; font-size: 14px; line-height: 1.6;">${escapedMessage}</p>
							</div>

							<div style="text-align: center;">
								<a href="mailto:${escapedEmail}?subject=Re: ${encodeURIComponent(subject)}"
								   style="display: inline-block; padding: 14px 32px; background-color: #FF6B35; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
									Reply to ${escapedName}
								</a>
							</div>
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

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

export const actions: Actions = {
	default: async ({ request }) => {
		// Rate limit: 3 contact submissions per 5 minutes per IP
		const blocked = checkFormRateLimit(request, 'contact');
		if (blocked) return blocked;

		const formData = await request.formData();
		const name = (formData.get('name') as string ?? '').trim();
		const email = (formData.get('email') as string ?? '').trim();
		const subject = (formData.get('subject') as string ?? 'General').trim();
		const message = (formData.get('message') as string ?? '').trim();

		// Validation
		if (name.length < 2) {
			return fail(400, {
				error: 'Name must be at least 2 characters.',
				name,
				email,
				subject,
				message
			});
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, {
				error: 'Please enter a valid email address.',
				name,
				email,
				subject,
				message
			});
		}

		if (message.length < 10) {
			return fail(400, {
				error: 'Message must be at least 10 characters.',
				name,
				email,
				subject,
				message
			});
		}

		// Send email via Resend
		try {
			const { error: sendError } = await resend.emails.send({
				from: FROM_EMAIL,
				to: CONTACT_TO,
				replyTo: email,
				subject: `[Contact Form] ${subject} - from ${name}`,
				html: buildContactEmailHtml(name, email, subject, message)
			});

			if (sendError) {
				console.error('Contact form email error:', sendError);
				return fail(500, {
					error: 'Failed to send your message. Please try again later.',
					name,
					email,
					subject,
					message
				});
			}
		} catch (err) {
			console.error('Contact form send error:', err);
			return fail(500, {
				error: 'Failed to send your message. Please try again later.',
				name,
				email,
				subject,
				message
			});
		}

		return { success: true };
	}
};
