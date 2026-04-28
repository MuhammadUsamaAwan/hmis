import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Popover } from "./popover";

const meta = {
  title: "Popover",
  component: Popover,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
    align: { control: "select", options: ["start", "center", "end"] },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    trigger: <Button variant="outline">Open</Button>,
    title: "Patient note",
    description: "Last updated by Dr. Hassan on 27 Apr 2026.",
    children: (
      <p className="text-muted-foreground text-sm">
        Patient reports improvement in symptoms. Follow-up scheduled in 2 weeks.
      </p>
    ),
  },
};

export const TitleOnly: Story = {
  args: {
    trigger: <Button variant="outline">Info</Button>,
    title: "Allergy alert",
    children: <p className="text-muted-foreground text-sm">Patient is allergic to Penicillin and NSAIDs.</p>,
  },
};

export const ContentOnly: Story = {
  args: {
    trigger: <Button variant="outline">Details</Button>,
    children: (
      <div className="flex flex-col gap-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Ward</span>
          <span>ICU — Bed 4</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Admitted</span>
          <span>24 Apr 2026</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Consultant</span>
          <span>Dr. Clarke</span>
        </div>
      </div>
    ),
  },
};

export const TopSide: Story = {
  args: {
    trigger: <Button variant="outline">Open (top)</Button>,
    title: "Vital signs",
    description: "Recorded at 08:00 today.",
    side: "top",
  },
};
