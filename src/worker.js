const ALLOWED_TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '1:00 PM', '2:00 PM', '3:00 PM',
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/booking' && request.method === 'POST') {
      return handleBooking(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleBooking(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: 'Invalid request body' }, 400);
  }

  // Honeypot check — bots fill hidden fields
  if (body.website) {
    return json({ success: true });
  }

  const { name, email, neighborhood, service, date, timeSlot } = body;

  // Server-side validation
  if (!name?.trim() || !email?.trim() || !neighborhood || !date || !timeSlot) {
    return json({ success: false, error: 'All fields are required' }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return json({ success: false, error: 'Invalid email address' }, 400);
  }

  if (!ALLOWED_TIME_SLOTS.includes(timeSlot)) {
    return json({ success: false, error: 'Invalid time slot' }, 400);
  }

  const bookingDate = new Date(date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (isNaN(bookingDate.getTime()) || bookingDate <= today) {
    return json({ success: false, error: 'Date must be in the future' }, 400);
  }

  // Send email via Resend
  try {
    const serviceLabel = service === 'restore' ? 'Full Restore' : 'Standard Clean';

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL,
        to: [env.BUSINESS_EMAIL],
        reply_to: email.trim(),
        subject: `New Booking: ${esc(name.trim())} — ${serviceLabel} on ${esc(date)}`,
        html: `
          <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:0 auto;">
            <h2 style="color:#0A192F;">New Booking Request</h2>
            <table style="border-collapse:collapse;width:100%;margin:16px 0;">
              <tr><td style="padding:10px 12px;font-weight:600;color:#0A192F;border-bottom:1px solid #eee;">Name</td><td style="padding:10px 12px;border-bottom:1px solid #eee;">${esc(name.trim())}</td></tr>
              <tr><td style="padding:10px 12px;font-weight:600;color:#0A192F;border-bottom:1px solid #eee;">Email</td><td style="padding:10px 12px;border-bottom:1px solid #eee;"><a href="mailto:${esc(email.trim())}">${esc(email.trim())}</a></td></tr>
              <tr><td style="padding:10px 12px;font-weight:600;color:#0A192F;border-bottom:1px solid #eee;">Neighborhood</td><td style="padding:10px 12px;border-bottom:1px solid #eee;">${esc(neighborhood)}</td></tr>
              <tr><td style="padding:10px 12px;font-weight:600;color:#0A192F;border-bottom:1px solid #eee;">Service</td><td style="padding:10px 12px;border-bottom:1px solid #eee;">${serviceLabel}</td></tr>
              <tr><td style="padding:10px 12px;font-weight:600;color:#0A192F;border-bottom:1px solid #eee;">Date</td><td style="padding:10px 12px;border-bottom:1px solid #eee;">${esc(date)}</td></tr>
              <tr><td style="padding:10px 12px;font-weight:600;color:#0A192F;">Time Slot</td><td style="padding:10px 12px;">${esc(timeSlot)}</td></tr>
            </table>
            <p style="color:#666;font-size:14px;">Reply to this email to respond directly to the customer.</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      console.error('Resend error:', await res.text());
      return json({ success: false, error: 'Failed to send notification' }, 500);
    }

    return json({ success: true });
  } catch (err) {
    console.error('Booking error:', err);
    return json({ success: false, error: 'Internal server error' }, 500);
  }
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
