import axios from 'axios';
import config from '../config/config.js';
import { formatBangladeshPhoneNumber } from '../utils/sms.utils.js';

/**
 * Provider: BULK SMS BD
 */
export const sendBulkSms = async (phoneNumber: string, message: string): Promise<void> => {
  const apiKey = config.BULK_API_KEY;
  const senderId = config.BULK_SENDER_ID;

  if (!apiKey || !senderId) {
    throw new Error('BULK SMS BD: API credentials are missing');
  }

  const { data } = await axios.post('https://bulksmsbd.net/api/smsapi', {
    params: {
      api_key: apiKey,
      type: 'text',
      number: phoneNumber,
      senderid: senderId,
      message,
    },
  });

  return data;
};

/**
 * Provider: GATE SMS
 */
export const sendGateSms = async (phoneNumber: string, message: string): Promise<void> => {
  const username = config.GATE_USERNAME;
  const password = config.GATE_PASSWORD;
  const deviceId = config.GATE_DEVICE_ID;
  const sim = config.GATE_SIM;

  if (!username || !password || !deviceId) {
    throw new Error('GATE SMS: API credentials are missing');
  }

  const phone = formatBangladeshPhoneNumber(phoneNumber);
  const auth = Buffer.from(`${username}:${password}`).toString('base64');

  await axios.post(
    'https://api.sms-gate.app/3rdparty/v1/messages',
    {
      textMessage: {
        text: message,
      },
      simNumber: Number(sim),
      phoneNumbers: [phone],
    },
    {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    },
  );
};
