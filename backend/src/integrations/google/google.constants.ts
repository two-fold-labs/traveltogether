// One limit for every Google API we call, so a stalled Google response cannot
// hang a request. It has to cover the first call after startup, which spends
// ~3s on connection setup (DNS, TLS) before the request is even sent.
export const GOOGLE_API_TIMEOUT_MS = 10_000;
