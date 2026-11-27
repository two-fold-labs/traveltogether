// Trims the value and cuts it to `maxLength`. Use it on third-party labels
// (e.g. Google place names) that have no length limit of their own, before they
// are stored or returned to a client that must send them back.
export const clampText = (value: string, maxLength: number) =>
  value.trim().slice(0, maxLength).trimEnd();
