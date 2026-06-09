import type { Metadata } from "next";
import { AdminChat } from "@/components/admin/AdminChat";

export const metadata: Metadata = { title: "Admin · AI Assistant" };
export const dynamic = "force-dynamic";

export default function AdminChatPage() {
  return (
    <main className="container-page py-6">
      <AdminChat />
    </main>
  );
}
