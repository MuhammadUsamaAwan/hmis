import { AlertAction, AlertDescription, Alert as AlertRoot, AlertTitle } from "@/ui/shadcn/components/ui/alert";

export interface AlertProps {
  variant?: "default" | "destructive";
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function Alert({ title, description, icon, action, variant }: AlertProps) {
  return (
    <AlertRoot variant={variant}>
      {icon}
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
      {action && <AlertAction>{action}</AlertAction>}
    </AlertRoot>
  );
}
