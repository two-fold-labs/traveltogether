import { request } from '@/lib/apiClient';

import type { GuestLoginResponse } from './types';

const guestLogin = async () => {
  return request<GuestLoginResponse>('/auth/guest', {
    method: 'POST',
  });
};

export { guestLogin };
