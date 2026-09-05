"use client";

import * as React from "react";
import { CustomerSite } from "@/components/customer/customer-site";
import { OrderQRScreen } from "@/components/customer/order-qr-screen";
import { ImageViewerProvider } from "@/components/customer/image-viewer";
import { useCoffeeStore } from "@/lib/store";

/**
 * Coffee++ client application — the public customer experience.
 * Self-contained: menu from the local menu file, orders created on-device,
 * Order QR tickets kept in the customer's own browser storage.
 */
export default function ClientApp() {
  const activeOrder = useCoffeeStore((s) => s.activeOrder);

  return (
    <ImageViewerProvider>
      {activeOrder ? <OrderQRScreen /> : <CustomerSite />}
    </ImageViewerProvider>
  );
}
