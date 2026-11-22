import { useSession } from './useSession';

const useCurrentUser = () => {
  const { data } = useSession();

  if (!data) {
    throw new Error(
      'useCurrentUser was called before the session loaded. Render this component inside AuthGate.',
    );
  }

  return data;
};

export { useCurrentUser };
