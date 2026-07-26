import type { Metadata } from "next";
import { getContent } from "@/lib/store";
import ContactSection from "@/components/ContactSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact — Soul Stack Studio",
  description: "Get in touch with Soul Stack Studio for print enquiries and commissions.",
};

export default async function ContactPage() {
  const content = await getContent();
  return <ContactSection content={content} />;
}
