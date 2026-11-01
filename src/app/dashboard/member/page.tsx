"use client";
import { useAuth } from "@/hooks/use-session";
import { Card } from "@/components/ui/card";
import { User, Mail, MapPin } from "lucide-react";

export default function MemberDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">Welcome, {user?.name}</h1>
      <Card className="p-8 max-w-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full gradient-brand grid place-items-center text-white text-2xl font-bold">
            {user?.name?.[0]}
          </div>
          <div>
            <p className="text-xl font-bold">{user?.name}</p>
            <p className="text-sm text-[var(--fg-muted)] capitalize">{user?.role}</p>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <p className="flex items-center gap-3"><Mail className="h-4 w-4 text-[var(--primary)]"/> {user?.email}</p>
          <p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-[var(--primary)]"/> {user?.address || "No address set"}</p>
          <p className="flex items-center gap-3"><User className="h-4 w-4 text-[var(--primary)]"/> Phone: {user?.phone || "Not provided"}</p>
        </div>
      </Card>
    </div>
  );
}