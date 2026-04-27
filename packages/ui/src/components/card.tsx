import {
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Card as ShadcnCard,
} from "../shadcn/components/ui/card";

export type CardProps = React.ComponentProps<"div"> & {
  size?: "default" | "sm";
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
};

export function Card({ title, description, action, footer, children, ...props }: CardProps) {
  const hasHeader = title || description || action;

  return (
    <ShadcnCard {...props}>
      {hasHeader && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
          {action && <CardAction>{action}</CardAction>}
        </CardHeader>
      )}
      {children && <CardContent>{children}</CardContent>}
      {footer && <CardFooter>{footer}</CardFooter>}
    </ShadcnCard>
  );
}

export { CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
