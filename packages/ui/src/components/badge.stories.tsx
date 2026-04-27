import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleCheckIcon, TriangleAlertIcon } from "lucide-react";
import { Badge } from "./badge";

const meta = {
  title: "Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "ghost", "link"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Badge" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Destructive" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Outline" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Ghost" },
};

export const Link: Story = {
  args: { variant: "link", children: "Link" },
};

export const WithLeadingIcon: Story = {
  args: {
    children: (
      <>
        <CircleCheckIcon />
        Active
      </>
    ),
  },
};

export const WithTrailingIcon: Story = {
  args: {
    variant: "destructive",
    children: (
      <>
        Critical
        <TriangleAlertIcon />
      </>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["default", "secondary", "destructive", "outline", "ghost", "link"] as const).map(variant => (
        <Badge key={variant} variant={variant}>
          {variant.charAt(0).toUpperCase() + variant.slice(1)}
        </Badge>
      ))}
    </div>
  ),
};
