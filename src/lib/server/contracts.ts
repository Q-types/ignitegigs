import { PUBLIC_APP_URL } from '$env/static/public';

interface ContractData {
	performerName: string;
	clientName: string;
	eventDate: string;
	eventTime: string | null;
	eventEndTime: string | null;
	eventLocation: string;
	eventType: string | null;
	eventDetails: string | null;
	agreedPrice: number; // in pence
	depositAmount: number; // in pence
	cancellationPolicy: 'flexible' | 'standard' | 'strict';
	specialRequirements?: string | null;
	bookingId: string;
}

function formatPrice(pence: number): string {
	return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100);
}

function formatDate(date: string): string {
	return new Date(date).toLocaleDateString('en-GB', {
		weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
	});
}

const cancellationTerms = {
	flexible: `Cancellation Policy (Flexible):
- More than 7 days before event: Full refund of deposit
- 3-7 days before event: 50% refund of deposit
- Less than 3 days before event: No refund
- Performer cancellation: Full refund plus assistance finding replacement`,
	standard: `Cancellation Policy (Standard):
- More than 14 days before event: Full refund of deposit
- 7-14 days before event: 50% refund of deposit
- Less than 7 days before event: No refund
- Performer cancellation: Full refund plus assistance finding replacement`,
	strict: `Cancellation Policy (Strict):
- More than 30 days before event: Full refund of deposit
- 14-30 days before event: 50% refund of deposit
- Less than 14 days before event: No refund
- Performer cancellation: Full refund plus assistance finding replacement`
};

export function generateContract(data: ContractData): string {
	return `PERFORMANCE BOOKING AGREEMENT

This agreement is made between:

PERFORMER: ${data.performerName}
CLIENT: ${data.clientName}

Booking Reference: ${data.bookingId}

---

1. EVENT DETAILS

Date: ${formatDate(data.eventDate)}
${data.eventTime ? `Start Time: ${data.eventTime}` : ''}
${data.eventEndTime ? `End Time: ${data.eventEndTime}` : ''}
Location: ${data.eventLocation}
${data.eventType ? `Event Type: ${data.eventType}` : ''}
${data.eventDetails ? `\nAdditional Details:\n${data.eventDetails}` : ''}
${data.specialRequirements ? `\nSpecial Requirements:\n${data.specialRequirements}` : ''}

---

2. PAYMENT TERMS

Total Agreed Fee: ${formatPrice(data.agreedPrice)}
Deposit (50%): ${formatPrice(data.depositAmount)}
Balance Due: ${formatPrice(data.agreedPrice - data.depositAmount)}

- The deposit is due upon signing this agreement to confirm the booking.
- The remaining balance is due within 7 days of the event completion.
- All payments are processed securely through IgniteGigs via Stripe.
- IgniteGigs charges an 8% platform fee which is included in the total fee.

---

3. ${cancellationTerms[data.cancellationPolicy]}

---

4. PERFORMER OBLIGATIONS

The Performer agrees to:
- Arrive at the venue at least 30 minutes before the scheduled start time
- Provide the performance as described in the booking details
- Maintain valid Public Liability Insurance throughout the engagement
- Conduct themselves professionally at all times
- Notify the Client and IgniteGigs immediately of any issues that may affect the performance

---

5. CLIENT OBLIGATIONS

The Client agrees to:
- Provide a safe and suitable performance space
- Ensure adequate access to the venue for setup
- Provide any agreed-upon facilities (power supply, changing area, etc.)
- Make final payment within 7 days of event completion

---

6. LIABILITY

- The Performer maintains their own Public Liability Insurance.
- IgniteGigs acts as a platform connecting Performers and Clients and is not liable for the performance itself.
- Both parties agree to resolve disputes through IgniteGigs' dispute resolution process before seeking external remediation.

---

7. GENERAL TERMS

- This agreement is governed by the laws of England and Wales.
- Any amendments must be agreed in writing by both parties.
- IgniteGigs' Terms of Service apply to this agreement.

---

By signing below, both parties agree to the terms outlined in this agreement.

Generated via IgniteGigs - ${new Date().toLocaleDateString('en-GB')}
`;
}

export function getCancellationTerms(policy: 'flexible' | 'standard' | 'strict'): string {
	return cancellationTerms[policy];
}

export function calculateRefund(
	policy: 'flexible' | 'standard' | 'strict',
	eventDate: string,
	depositPence: number
): { refundPence: number; refundPercentage: number; reason: string } {
	const now = new Date();
	const event = new Date(eventDate);
	const daysUntilEvent = Math.ceil((event.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

	switch (policy) {
		case 'flexible':
			if (daysUntilEvent > 7) return { refundPence: depositPence, refundPercentage: 100, reason: 'More than 7 days before event' };
			if (daysUntilEvent >= 3) return { refundPence: Math.floor(depositPence * 0.5), refundPercentage: 50, reason: '3-7 days before event' };
			return { refundPence: 0, refundPercentage: 0, reason: 'Less than 3 days before event' };
		case 'standard':
			if (daysUntilEvent > 14) return { refundPence: depositPence, refundPercentage: 100, reason: 'More than 14 days before event' };
			if (daysUntilEvent >= 7) return { refundPence: Math.floor(depositPence * 0.5), refundPercentage: 50, reason: '7-14 days before event' };
			return { refundPence: 0, refundPercentage: 0, reason: 'Less than 7 days before event' };
		case 'strict':
			if (daysUntilEvent > 30) return { refundPence: depositPence, refundPercentage: 100, reason: 'More than 30 days before event' };
			if (daysUntilEvent >= 14) return { refundPence: Math.floor(depositPence * 0.5), refundPercentage: 50, reason: '14-30 days before event' };
			return { refundPence: 0, refundPercentage: 0, reason: 'Less than 14 days before event' };
	}
}
