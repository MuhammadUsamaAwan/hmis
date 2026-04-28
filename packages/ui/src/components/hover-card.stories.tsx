import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./avatar";
import { HoverCard } from "./hover-card";

const meta = {
  title: "Hover Card",
  component: HoverCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
    align: { control: "select", options: ["start", "center", "end"] },
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const patientCard = (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <Avatar name="Sarah Johnson" size="lg" />
      <div className="flex flex-col">
        <span className="font-medium">Sarah Johnson</span>
        <span className="text-muted-foreground text-xs">MRN: 00124891</span>
      </div>
    </div>
    <div className="flex flex-col gap-1 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">DOB</span>
        <span>14 Mar 1985</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Ward</span>
        <span>General — Bed 7</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Consultant</span>
        <span>Dr. Clarke</span>
      </div>
    </div>
  </div>
);

export const Default: Story = {
  args: {
    trigger: (
      <span className="cursor-pointer text-sm underline decoration-dotted underline-offset-4">Sarah Johnson</span>
    ),
    children: patientCard,
  },
};

export const AvatarTrigger: Story = {
  args: {
    trigger: <Avatar name="Ali Hassan" />,
    children: (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Avatar name="Ali Hassan" size="lg" />
          <div className="flex flex-col">
            <span className="font-medium">Ali Hassan</span>
            <span className="text-muted-foreground text-xs">Consultant Physician</span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">On call until 18:00. Ext: 4421.</p>
      </div>
    ),
  },
};

export const TopSide: Story = {
  args: {
    trigger: <span className="cursor-pointer text-sm underline decoration-dotted underline-offset-4">Emma Clarke</span>,
    side: "top",
    children: patientCard,
  },
};
