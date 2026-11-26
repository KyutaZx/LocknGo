'use client';

import { X, MessageSquare, AlertTriangle, CheckCircle2, Bell } from 'lucide-react';

export interface SimNotification {
  id: string;
  title: string;
  message: string;
  channel: 'WhatsApp' | 'Sistem';
  timeLabel: string;
  tone: 'info' | 'success' | 'warning' | 'danger';
  read: boolean;
  actionLabel?: string;
  actionType?: 'extend';
}

interface NotificationToastProps {
  toast: SimNotification | null;
  onDismiss: () => void;
  onAction?: (notif: SimNotification) => void;
}

export default function NotificationToast({
  toast,
  onDismiss,
  onAction,
}: NotificationToastProps) {
  if (!toast) return null;

  const iconBg =
    toast.tone === 'success'
      ? 'bg-emerald-100 text-emerald-700'
      : toast.tone === 'warning'
      ? 'bg-amber-100 text-amber-700'
      : toast.tone === 'danger'
      ? 'bg-red-100 text-red-700'
      : 'bg-bloodwine-tint text-bloodwine';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl border border-ink-line shadow-xl p-4 flex items-start gap-3 animate-fadeIn"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        {toast.tone === 'success' ? (
          <CheckCircle2 className="w-4 h-4" />
        ) : toast.tone === 'warning' || toast.tone === 'danger' ? (
          <AlertTriangle className="w-4 h-4" />
        ) : toast.channel === 'WhatsApp' ? (
          <MessageSquare className="w-4 h-4" />
        ) : (
          <Bell className="w-4 h-4" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">
            Simulasi {toast.channel} · {toast.timeLabel}
          </span>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Tutup notifikasi"
            className="p-0.5 rounded-lg text-ink-soft hover:text-bloodwine transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="text-xs font-extrabold text-bloodwine mt-0.5">{toast.title}</div>
        <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">{toast.message}</p>
        {toast.actionLabel && onAction && (
          <div className="mt-2.5">
            <button
              type="button"
              onClick={() => {
                onAction(toast);
                onDismiss();
              }}
              className="px-3 py-1.5 rounded-xl bg-sunflare hover:bg-sunflare-hover active:scale-[0.98] text-bloodwine font-extrabold text-xs transition-all"
            >
              {toast.actionLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
