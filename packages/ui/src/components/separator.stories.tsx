import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./separator";

const meta = {
  title: "Separator",
  component: Separator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  decorators: [
    S => (
      <div className="w-80">
        <S />
      </div>
    ),
  ],
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  decorators: [
    S => (
      <div className="flex h-8 items-center gap-4">
        <span className="text-sm">Left</span>
        <S />
        <span className="text-sm">Right</span>
      </div>
    ),
  ],
};

export const BetweenContent: Story = {
  render: () => (
    <div className="w-80 space-y-3">
      <div>
        <p className="font-medium text-sm">Patient Info</p>
        <p className="text-muted-foreground text-sm">John Doe, 34 years</p>
      </div>
      <Separator />
      <div>
        <p className="font-medium text-sm">Visit Details</p>
        <p className="text-muted-foreground text-sm">Apr 27, 2026 – General Checkup</p>
      </div>
    </div>
  ),
};
