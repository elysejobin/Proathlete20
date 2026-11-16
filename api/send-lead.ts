import { VercelRequest, VercelResponse } from '@vercel/node';
import { MailService } from '@sendgrid/mail';

const sendgrid = new MailService();
sendgrid.setApiKey(process.env.SENDGRID_API_KEY || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, role, org, message } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. Send notification email to info@proathlete.ca via SendGrid
    await sendgrid.send({
      to: 'info@proathlete.ca',
      from: 'elyse@proathlete.ca',
      replyTo: email,
      subject: `New Lead - PRO ATHLETE: ${name} (${org || 'No organization'})`,
      html: `
        <h2>New Lead from PRO ATHLETE Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Role:</strong> ${role || 'Not specified'}</p>
        <p><strong>Organization:</strong> ${org || 'Not specified'}</p>
        <p><strong>Message:</strong></p>
        <p>${message || 'No message provided'}</p>
        <hr />
        <p style="color: #888; font-size: 12px;">This lead was submitted from proathlete.ca</p>
      `,
    });

    // 2. Send data to GoHighLevel webhook (uncomment when ready)
    // await fetch('YOUR_GHL_WEBHOOK_URL_HERE', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     fullName: name,
    //     email: email,
    //     role: role,
    //     organization: org,
    //     message: message,
    //     source: 'proathlete.ca'
    //   }),
    // });

    return res.status(200).json({ success: true, message: 'Lead sent successfully' });

  } catch (error: any) {
    console.error('Error sending lead:', error);
    return res.status(500).json({ 
      error: 'Failed to send lead',
      details: error.message 
    });
  }
}
