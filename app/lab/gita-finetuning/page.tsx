import type { Metadata } from "next";
import GitaFinetuneLab from "../../../components/GitaFinetuneLab";

export const metadata: Metadata = {
  title: "Fine-tuning a Language Model: A Working Demo — Elegance AI",
  description:
    "Side-by-side comparison of base GPT-2 and a Bhagavad Gita fine-tuned model. " +
    "Learn what fine-tuning changes, when RAG is the better choice, and the architecture that combines both.",
  openGraph: {
    title: "Fine-tuning a Language Model: A Working Demo",
    description:
      "GPT-2 fine-tuned on the Bhagavad Gita — live demo and decision framework for enterprise AI teams.",
    type: "article",
  },
};

export default function GitaFinetuningPage() {
  return <GitaFinetuneLab />;
}
