import { Spinner as ShadcnSpinner } from "@/ui/shadcn/components/ui/spinner";

export type SpinnerProps = React.ComponentProps<"svg">;

export function Spinner(props: SpinnerProps) {
  return <ShadcnSpinner {...props} />;
}
