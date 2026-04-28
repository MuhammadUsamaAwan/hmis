import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditIcon, EyeIcon, FileTextIcon, PrinterIcon, TrashIcon, UserIcon, XCircleIcon } from "lucide-react";
import { Button } from "./button";
import { DropdownMenu } from "./dropdown-menu";

const meta = {
  title: "Dropdown Menu",
  component: DropdownMenu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
    align: { control: "select", options: ["start", "center", "end"] },
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    trigger: <Button variant="outline">Actions</Button>,
    groups: [
      {
        items: [
          { label: "View record", icon: <EyeIcon /> },
          { label: "Edit record", icon: <EditIcon /> },
          { label: "Print summary", icon: <PrinterIcon /> },
        ],
      },
    ],
  },
};

export const WithDestructive: Story = {
  args: {
    trigger: <Button variant="outline">Actions</Button>,
    groups: [
      {
        items: [
          { label: "View record", icon: <EyeIcon /> },
          { label: "Edit record", icon: <EditIcon /> },
        ],
      },
      {
        items: [
          { label: "Discharge patient", icon: <XCircleIcon />, variant: "destructive" },
          { label: "Delete record", icon: <TrashIcon />, variant: "destructive" },
        ],
      },
    ],
  },
};

export const WithGroupLabels: Story = {
  args: {
    trigger: <Button variant="outline">Patient</Button>,
    groups: [
      {
        label: "Record",
        items: [
          { label: "View record", icon: <EyeIcon /> },
          { label: "Edit details", icon: <EditIcon /> },
          { label: "Lab orders", icon: <FileTextIcon /> },
        ],
      },
      {
        label: "Account",
        items: [{ label: "View profile", icon: <UserIcon /> }],
      },
      {
        items: [{ label: "Delete record", icon: <TrashIcon />, variant: "destructive" }],
      },
    ],
  },
};

export const WithShortcuts: Story = {
  args: {
    trigger: <Button variant="outline">Actions</Button>,
    groups: [
      {
        items: [
          { label: "View record", icon: <EyeIcon />, shortcut: "⌘V" },
          { label: "Edit record", icon: <EditIcon />, shortcut: "⌘E" },
          { label: "Print summary", icon: <PrinterIcon />, shortcut: "⌘P" },
        ],
      },
      {
        items: [{ label: "Delete record", icon: <TrashIcon />, variant: "destructive", shortcut: "⌘⌫" }],
      },
    ],
  },
};

export const WithDisabled: Story = {
  args: {
    trigger: <Button variant="outline">Actions</Button>,
    groups: [
      {
        items: [
          { label: "View record", icon: <EyeIcon /> },
          { label: "Edit record", icon: <EditIcon />, disabled: true },
          { label: "Transfer patient", icon: <UserIcon />, disabled: true },
          { label: "Delete record", icon: <TrashIcon />, variant: "destructive" },
        ],
      },
    ],
  },
};
