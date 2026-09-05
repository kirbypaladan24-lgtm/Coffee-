// Coffee++ client constants

export const PRODUCT_CATEGORIES = ["Drinks", "Pastries", "Extras"] as const;

export const HOW_TO_ORDER_STEPS = [
  {
    title: "Pick your drink or treat",
    text: "Browse the menu and tap ORDER on any available item.",
  },
  {
    title: "Customize your order",
    text: "Choose HOT or COLD where offered, set your quantity, and pick a payment method.",
  },
  {
    title: "Tell us what to call you",
    text: "Add a call-out name — that's what our staff shouts when your order is ready.",
  },
  {
    title: "Apply your order",
    text: "Confirm the summary — you'll instantly get an Order QR.",
  },
  {
    title: "Show your QR at the booth",
    text: "Our staff scans it, verifies payment, and prepares your order on the spot. Want more? Scan the same QR again.",
  },
] as const;
