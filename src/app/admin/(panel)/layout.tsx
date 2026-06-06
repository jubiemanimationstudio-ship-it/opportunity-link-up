import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/auth";
import { isSupabaseConfigured, getStoreStatus } from "@/lib/data/store";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { ToastHost } from "@/components/admin/Toast";
import { ConfirmHost } from "@/components/admin/ConfirmDialog";
import { DbStatusBanner } from "@/components/admin/DbStatusBanner";

export const dynamic = "force-dynamic";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!isAdminSession()) redirect("/admin/login");
  const usingSupabase = isSupabaseConfigured();
  const status = getStoreStatus();
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[rgb(9_17_33)]">
      <AdminTopbar />
      {!usingSupabase && <DbStatusBanner status={status} />}
      {children}
      <ToastHost />
      <ConfirmHost />
    </div>
  );
}
