// Coffee++ client types — the customer-side slice of the data model.
// (The Booth Console keeps its own full type set; the Order QR payload is the
// bridge between the two apps.)

export type PaymentMethod = "GCASH" | "BOOTH";
export type Temperature = "HOT" | "COLD";
export type OrderStatus = "PENDING" | "WAITING" | "SERVED" | "ABORTED";
export type PaymentStatus = "UNPAID" | "PAID";
export type BoothState = "BEFORE" | "OPEN" | "CLOSED";

/** Product as the customer sees it. */
export interface PublicProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  hasTemperature: boolean;
  /** Fixed serving temp when hasTemperature is false — tells the customer
   *  what they're getting (null for non-drinks like pastries). */
  defaultTemperature?: "HOT" | "COLD" | null;
  /** True = pick a size; each size carries its own price. */
  hasSizes: boolean;
  /** Size options (honored only when hasSizes is true). */
  sizes: ProductSize[];
  /** True = fill the product's custom inputs at order time. */
  hasFields: boolean;
  /** Custom inputs (honored only when hasFields is true). */
  fields: ProductField[];
  category: string;
}

/** One size option: display name + its own peso price. */
export interface ProductSize {
  name: string;
  price: number;
}

/** One custom input: what to ask + whether an answer is required. */
export interface ProductField {
  label: string;
  required: boolean;
}

/** One customer answer to a custom input. */
export interface OrderAnswer {
  label: string;
  value: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  temperature: Temperature | null;
  size: string | null; // size name (hasSizes products) — null otherwise
  answers: OrderAnswer[]; // custom-field answers — [] when none
  quantity: number;
  price: number;
  subtotal: number;
}

/** An order created on the customer's device and carried inside the Order QR. */
export interface Order {
  orderId: string;
  customerName: string;
  customerAlias: string; // call-out name — what the staff shouts ("" → name)
  customerEmail: string; // "" when not provided
  items: OrderItem[];
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  abortReason: string | null;
  createdAt: string; // ISO
  scannedAt: string | null;
  completedAt: string | null;
}

/** Booth info shown on the customer site (from the local menu file). */
export interface BoothSettings {
  boothName: string;
  startDate: string; // ISO
  endDate: string; // ISO
  gcashNumber: string;
  gcashPayment?: boolean; // absent (v2 files) = enabled; false hides GCash
  orderingEnabled?: boolean; // absent (pre-v6 files) = enabled; false = menu only
  specsNumber: string;
  contactEmail: string; // "" hides the email row
}
