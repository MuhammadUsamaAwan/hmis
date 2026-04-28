import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./skeleton";

const meta = {
  title: "Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "h-4 w-48",
  },
};

export const PatientCard: Story = {
  render: () => (
    <div className="flex w-72 items-center gap-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  ),
};

export const FormField: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-9 w-full rounded-md" />
    </div>
  ),
};

export const Table: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-2">
      <Skeleton className="h-8 w-full rounded-md" />
      {Array.from({ length: 5 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows have no identity
        <Skeleton key={i} className="h-12 w-full rounded-md" />
      ))}
    </div>
  ),
};
