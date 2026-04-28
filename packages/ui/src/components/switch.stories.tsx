import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./switch";

const meta = {
  title: "Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    S => (
      <div className="w-80">
        <S />
      </div>
    ),
  ],
  argTypes: {
    disabled: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isRequired: { control: "boolean" },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "notifications",
    label: "Enable notifications",
  },
};

export const WithDescription: Story = {
  args: {
    name: "notifications",
    label: "Enable notifications",
    description: "Receive alerts for new lab results and appointment reminders.",
  },
};

export const Required: Story = {
  args: {
    name: "consent",
    label: "Treatment consent",
    description: "Patient must consent before proceeding.",
    isRequired: true,
  },
};

export const DefaultChecked: Story = {
  args: {
    name: "auto-discharge",
    label: "Auto-discharge summary",
    description: "Automatically generate discharge summary on patient exit.",
    defaultValue: true,
  },
};

export const SmallSize: Story = {
  args: {
    name: "compact",
    label: "Compact view",
    size: "sm",
  },
};

export const Disabled: Story = {
  args: {
    name: "notifications",
    label: "Enable notifications",
    defaultValue: true,
    disabled: true,
  },
};

export const Invalid: Story = {
  args: {
    name: "consent",
    label: "Treatment consent",
    isRequired: true,
    isInvalid: true,
    errors: [{ message: "Patient consent is required to proceed." }],
  },
};
