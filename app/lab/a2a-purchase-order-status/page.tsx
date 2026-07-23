import type { Metadata } from "next";
import EnterpriseA2APOStatusLab from "../../../components/EnterpriseA2APOStatusLab";

export const metadata: Metadata = {
  title: "Enterprise A2A: Purchase Order Status — Elegance AI",
  description:
    "See how a buyer's procurement agent asks a supplier's fulfillment agent for the latest purchase order status through the A2A protocol, without accessing the supplier's ERP system.",
  openGraph: {
    title: "Enterprise A2A: Purchase Order Status",
    description:
      "A buyer's procurement agent asks a supplier's fulfillment agent for the latest purchase order status through the A2A protocol. Neither company exposes its internal ERP system or agent implementation.",
    type: "article",
  },
};

export default function A2APurchaseOrderStatusPage() {
  return <EnterpriseA2APOStatusLab />;
}
