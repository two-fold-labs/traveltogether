const TRIP_CODE_PATTERN = /^[A-Z0-9-]{1,12}$/;

const normalizeCode = (value: string): string | null => {
  let decoded = value;

  try {
    decoded = decodeURIComponent(value);
  } catch {
    return null;
  }

  const code = decoded.trim().toUpperCase();

  if (!TRIP_CODE_PATTERN.test(code)) {
    return null;
  }

  return code;
};

const codeFromPathname = (pathname: string): string | null => {
  const match = pathname.match(/\/join\/([^/]+)/i);

  if (!match?.[1]) {
    return null;
  }

  return normalizeCode(match[1]);
};

// Accepts a raw trip ID (TT-…) or a pasted /join/… URL. Continue never joins.
const parseJoinInput = (raw: string): string | null => {
  const value = raw.trim();

  if (!value) {
    return null;
  }

  try {
    const fromUrl = codeFromPathname(new URL(value).pathname);

    if (fromUrl) {
      return fromUrl;
    }
  } catch {
    // Not an absolute URL; try a path snippet or a raw code next.
  }

  const fromPath = codeFromPathname(value);

  if (fromPath) {
    return fromPath;
  }

  return normalizeCode(value);
};

export { parseJoinInput };
