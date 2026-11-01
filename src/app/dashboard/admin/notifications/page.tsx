"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Check, CheckCheck } from "lucide-react";

export default function AdminNotifications() {
  const [items, setItems] = useState<any[]>([]);
  async function load() { const r = await api.get<any>("/api/notifications?limit=100"); if (r.success && "data" in r) setItems(r.data.data || []); }
  useEffect(() => { load(); }, []);
  async function markRead(id: string) { await api.patch(`/api/notifications/${id}/read`); load(); }
  async function markAll() { await api.post(`/api/notifications/read-all`); toast.success("All marked as read"); load(); }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-black">Notifications</h1><p className="text-sm text-[var(--fg-muted)]">Stay up to date</p></div>
        <Button variant="outline" onClick={markAll}><CheckCheck className="h-4 w-4" /> Mark All Read</Button>
      </div>
      <div className="grid gap-3">
        {items.map((n) => (
          <Card key={n._id} className={`p-4 ${!n.read ? "border-brand-500/40 bg-brand-500/5" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1"><p className="font-bold truncate">{n.title}</p><Badge variant={n.type}>{n.type}</Badge>{!n.read && <Badge variant="brand">New</Badge>}</div>
                <p className="text-sm text-[var(--fg-muted)]">{n.message}</p>
                <p className="text-xs text-[var(--fg-muted)] mt-2">{formatDate(n.createdAt, true)}</p>
              </div>
              {!n.read && <Button size="icon" variant="ghost" onClick={() => markRead(n._id)}><Check className="h-4 w-4" /></Button>}
            </div>
          </Card>
        ))}
        {items.length === 0 && <Card className="p-12 text-center text-[var(--fg-muted)]">No notifications.</Card>}
      </div>
    </div>
  );
}