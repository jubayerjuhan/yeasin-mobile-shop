"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/button/button";

interface AdminFormProps {
  action: (state: any, formData: FormData) => Promise<any>;
  children: React.ReactNode;
  className?: string;
  submitLabel?: string;
  submitVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onSuccess?: () => void;
}

export function SubmitButton({ label, variant = "default", className }: { label: React.ReactNode, variant?: any, className?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={variant} disabled={pending} className={className}>
      {pending ? "Please wait..." : label}
    </Button>
  );
}

export function AdminForm({ action, children, className, submitLabel = "Save", submitVariant = "default", onSuccess }: AdminFormProps) {
  const [state, formAction] = useActionState(action, undefined);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Operation successful");
      if (onSuccess) onSuccess();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className={className}>
      {children}
      <div className="mt-4">
        <SubmitButton label={submitLabel} variant={submitVariant} />
      </div>
    </form>
  );
}

export function ActionForm({ action, children, className, onSuccess }: Omit<AdminFormProps, "submitLabel" | "submitVariant">) {
  const [state, formAction] = useActionState(action, undefined);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Operation successful");
      if (onSuccess) onSuccess();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className={className}>
      {children}
    </form>
  );
}
