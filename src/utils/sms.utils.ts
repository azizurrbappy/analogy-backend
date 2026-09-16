export const formatBangladeshPhoneNumber = (phoneNumber: string): string => {
  // Remove spaces, dashes, parentheses
  const phone: string = phoneNumber.replace(/\D/g, '');

  // 01805116310 → +8801805116310
  if (phone.startsWith('01')) {
    return `+880${phone.slice(1)}`;
  }

  // 8801805116310 → +8801805116310
  if (phone.startsWith('880')) {
    return `+${phone}`;
  }

  // Already international format
  if (phoneNumber.startsWith('+')) {
    return phoneNumber;
  }

  throw new Error('Invalid Bangladesh phone number');
};
