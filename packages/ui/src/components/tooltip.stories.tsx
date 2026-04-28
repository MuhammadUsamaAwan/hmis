import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Tooltip } from "./tooltip";

const meta = {
  title: "Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
    align: { control: "select", options: ["start", "center", "end"] },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: "View patient record",
    children: <Button variant="outline">Hover me</Button>,
  },
};

export const Top: Story = {
  args: {
    content: "Discharge patient",
    side: "top",
    children: <Button>Discharge</Button>,
  },
};

export const Bottom: Story = {
  args: {
    content: "Schedule follow-up appointment",
    side: "bottom",
    children: <Button variant="outline">Follow-up</Button>,
  },
};

export const Left: Story = {
  args: {
    content: "Edit record",
    side: "left",
    children: <Button variant="ghost">Edit</Button>,
  },
};

export const Right: Story = {
  args: {
    content: "Print discharge summary",
    side: "right",
    children: <Button variant="ghost">Print</Button>,
  },
};

export const LongContent: Story = {
  args: {
    content: "This action will permanently archive the visit and remove it from the active queue.",
    children: <Button variant="destructive">Archive</Button>,
  },
};
