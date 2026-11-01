"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function AdminAnalytics() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { api.get<any>("/api/admin/analytics").then((r) => { if (r.success && "data" in r) setData(r.data); }); }, []);
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-black">Analytics</h1><p className="text-sm text-[var(--fg-muted)]">Platform insights</p></div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-5"><h3 className="font-bold mb-4">Users by Role</h3><div className="space-y-2">{data?.usersByRole?.map((u: any) => (<div key={u._id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-soft)]"><span className="capitalize text-sm">{u._id || "member"}</span><Badge>{u.count}</Badge></div>))}</div></Card>
        <Card className="p-5"><h3 className="font-bold mb-4">Articles by Category</h3><div className="space-y-2">{data?.articlesByCategory?.map((c: any) => (<div key={c._id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-soft)]"><span className="text-sm">{c._id}</span><Badge>{c.count}</Badge></div>))}</div></Card>
        <Card className="p-5"><h3 className="font-bold mb-4">Notices by Category</h3><div className="space-y-2">{data?.noticesByCategory?.map((c: any) => (<div key={c._id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-soft)]"><span className="text-sm">{c._id}</span><Badge>{c.count}</Badge></div>))}</div></Card>
      </div>
      <Card className="p-5">
        <h3 className="font-bold mb-4">Recent Activity</h3>
        <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin">
          {data?.recentActivity?.map((log: any) => (
            <div key={log._id} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-soft)]">
              <div className="w-2 h-2 rounded-full bg-brand-500 mt-2" />
              <div className="flex-1 min-w-0"><p className="text-sm font-medium">{log.action}</p><p className="text-xs text-[var(--fg-muted)]">{log.actorName} · {log.entity} · {formatDate(log.createdAt, true)}</p></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}