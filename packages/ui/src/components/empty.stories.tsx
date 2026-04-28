import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarIcon, ClipboardIcon, SearchIcon, UserIcon } from "lucide-react";
import { Button } from "./button";
import { Empty } from "./empty";

const meta = {
  title: "Empty",
  component: Empty,
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
    iconVariant: { control: "select", options: ["default", "icon"] },
  },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <ClipboardIcon />,
    title: "No records found",
    description: "There are no patient records matching your search.",
  },
};

export const WithAction: Story = {
  args: {
    icon: <UserIcon />,
    title: "No patients registered",
    description: "Get started by registering the first patient.",
    action: <Button>Register patient</Button>,
  },
};

export const SearchEmpty: Story = {
  args: {
    icon: <SearchIcon />,
    title: "No results",
    description: "Try adjusting your search or filters.",
    iconVariant: "icon",
  },
};

export const NoAppointments: Story = {
  args: {
    icon: <CalendarIcon />,
    title: "No appointments today",
    description: "There are no appointments scheduled for the selected date.",
    action: <Button variant="outline">Schedule appointment</Button>,
  },
};

export const NoIcon: Story = {
  args: {
    title: "Nothing here yet",
    description: "Data will appear here once records are added.",
  },
};

export const DefaultIconVariant: Story = {
  args: {
    icon: <ClipboardIcon className="size-10 text-muted-foreground" />,
    iconVariant: "default",
    title: "No lab results",
    description: "Lab results will appear here once orders are processed.",
  },
};
