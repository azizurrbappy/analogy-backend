import axios from 'axios';
import config from '../config/config.js';

export async function cloudflareMail(to: string, subject: string, body: string) {
  const apiKey = config.MAIL_API_KEY;
  const cloudflareAccountId = config.CLOUDFLARE_ACCOUNT_ID;
  const from = config.MAIL_FROM;
  const appName = config.APP_NAME;

  if (!from) {
    throw new Error('API credentials are missing');
  }

  const { data } = await axios.post(
    `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/email/sending/send`,
    {
      to,
      from: {
        address: from,
        name: appName,
      },
      subject,
      html: body,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    },
  );

  return data;
}
