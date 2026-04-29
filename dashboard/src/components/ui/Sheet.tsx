import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function Sheet({ open, onOpenChange, title, description, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      <aside
        className={cn(
          "relative ml-auto h-full w-full max-w-md overflow-y-auto bg-[hsl(var(--surface))] shadow-xl",
          "border-l border-[hsl(var(--border))]"
        )}
      >
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-6 py-5">
          <div>
            {title && <div className="text-base font-semibold tracking-tight">{title}</div>}
            {description && (
              <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{description}</div>
            )}
          </div>
          <button
            type="button"
            className="rounded-md p-1.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--surface-raised))] focus-ring"
            onClick={() => onOpenChange(false)}
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </aside>
    </div>
  );
}
