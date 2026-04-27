import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

const meta = {
  title: "Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    S => (
      <div className="w-96">
        <S />
      </div>
    ),
  ],
  argTypes: {
    size: { control: "select", options: ["default", "sm"] },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Card Title",
    description: "A short description of the card content.",
    children: <p className="text-muted-foreground text-sm">Card body content goes here.</p>,
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    title: "Compact Card",
    description: "Smaller padding and text.",
    children: <p className="text-muted-foreground text-sm">Card body content.</p>,
  },
};

export const WithAction: Story = {
  args: {
    title: "Patient Overview",
    description: "Last updated 2 hours ago.",
    action: <Button size="sm">Edit</Button>,
    children: <p className="text-muted-foreground text-sm">Patient details shown here.</p>,
  },
};

export const WithFooter: Story = {
  args: {
    title: "Appointment",
    description: "Scheduled for tomorrow at 10:00 AM.",
    children: <p className="text-muted-foreground text-sm">Dr. Smith – General Checkup</p>,
    footer: (
      <div className="flex w-full justify-end gap-2">
        <Button variant="outline" size="sm">
          Reschedule
        </Button>
        <Button size="sm">Confirm</Button>
      </div>
    ),
  },
};

export const WithActionAndFooter: Story = {
  args: {
    title: "Lab Results",
    description: "CBC panel – Apr 25, 2026",
    action: <Badge variant="destructive">Critical</Badge>,
    children: (
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Hemoglobin</span>
          <span>7.2 g/dL</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">WBC</span>
          <span>11.4 K/µL</span>
        </div>
      </div>
    ),
    footer: <Button size="sm">View Full Report</Button>,
  },
};

export const NoHeader: Story = {
  args: {
    children: <p className="text-muted-foreground text-sm">Card with no header — just content.</p>,
  },
};

export const Composable: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Custom Layout</CardTitle>
        <CardDescription>Using sub-components directly for full control.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">Anything can go here.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Action</Button>
      </CardFooter>
    </Card>
  ),
};
