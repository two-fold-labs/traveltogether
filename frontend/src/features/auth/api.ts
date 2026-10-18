import { request } from '@/lib/apiClient';

import type { GuestLoginResponse } from './types';

const guestLogin = async (signal: AbortSignal) => {
  const response = await request<GuestLoginResponse>('/auth/guest', {
    method: 'POST',
    signal,
  });

  return response.user;
};

export { guestLogin };
