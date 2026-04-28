import {
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  Empty as EmptyRoot,
  EmptyTitle,
} from "@/ui/shadcn/components/ui/empty";

export interface EmptyProps {
  icon?: React.ReactNode;
  iconVariant?: "default" | "icon";
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function Empty({ icon, iconVariant = "icon", title, description, action }: EmptyProps) {
  return (
    <EmptyRoot>
      <EmptyHeader>
        {icon && <EmptyMedia variant={iconVariant}>{icon}</EmptyMedia>}
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </EmptyRoot>
  );
}
