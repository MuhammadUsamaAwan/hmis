import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarGroup, AvatarGroupCount } from "./avatar";

const meta = {
  title: "Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "default", "lg"] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "Sarah Johnson",
  },
};

export const WithImage: Story = {
  args: {
    src: "https://i.pravatar.cc/150?img=47",
    name: "Sarah Johnson",
  },
};

export const ExplicitFallback: Story = {
  args: {
    fallback: "Dr",
  },
};

export const Small: Story = {
  args: {
    name: "Ali Hassan",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    name: "Ali Hassan",
    size: "lg",
  },
};

export const WithBadge: Story = {
  args: {
    name: "Emma Clarke",
    badge: null,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="Sarah Johnson" size="sm" />
      <Avatar name="Sarah Johnson" size="default" />
      <Avatar name="Sarah Johnson" size="lg" />
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar name="Sarah Johnson" src="https://i.pravatar.cc/150?img=47" />
      <Avatar name="Ali Hassan" src="https://i.pravatar.cc/150?img=12" />
      <Avatar name="Emma Clarke" src="https://i.pravatar.cc/150?img=32" />
      <AvatarGroupCount>+4</AvatarGroupCount>
    </AvatarGroup>
  ),
};

export const GroupSmall: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar name="Sarah Johnson" size="sm" />
      <Avatar name="Ali Hassan" size="sm" />
      <Avatar name="Emma Clarke" size="sm" />
      <AvatarGroupCount>+2</AvatarGroupCount>
    </AvatarGroup>
  ),
};
