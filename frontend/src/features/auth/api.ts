import { request } from '@/lib/apiClient';

import type { GuestLoginResponse } from './types';

const guestLogin = async () => {
  const response = await request<GuestLoginResponse>('/auth/guest', {
    method: 'POST',
  });

  return response.user;
};

export { guestLogin };
