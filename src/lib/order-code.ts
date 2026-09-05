// Coffee++ client-side order code generator.
//
// The customer app creates orders entirely on the customer's device, so order
// IDs must be unique without any central sequence. We use 6 characters from an
// unambiguous alphabet (no 0/O/1/I) — short enough to read aloud, unique enough
// for a booth event. The Booth Console accepts these as-is and dedupes by ID.

const ORDER_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ORDER_CODE_LENGTH = 6;

/** Generate a fresh order ID like "ORD-K7F2Q9". */
export function generateOrderCode(): string {
  const bytes = new Uint8Array(ORDER_CODE_LENGTH);
  globalThis.crypto.getRandomValues(bytes);
  let suffix = "";
  for (let i = 0; i < bytes.length; i++) {
    suffix += ORDER_CODE_ALPHABET[bytes[i] % ORDER_CODE_ALPHABET.length];
  }
  return `ORD-${suffix}`;
}
