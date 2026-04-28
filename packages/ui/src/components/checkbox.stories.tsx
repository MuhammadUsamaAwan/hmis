import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox";

const meta = {
  title: "Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isRequired: { control: "boolean" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    label: "Accept terms and conditions",
  },
};

export const Required: Story = {
  args: {
    label: "I confirm the information is accurate",
    isRequired: true,
  },
};

export const WithDescription: Story = {
  args: {
    label: "Consent to treatment",
    description: "Patient has given verbal consent to the proposed treatment plan.",
  },
};

export const Invalid: Story = {
  args: {
    label: "Consent to treatment",
    isRequired: true,
    isInvalid: true,
    errors: [{ message: "Consent is required to proceed." }],
  },
};

export const Disabled: Story = {
  args: {
    label: "Notify via SMS",
    disabled: true,
  },
};

export const Checked: Story = {
  args: {
    label: "Active patient",
    defaultValue: true,
  },
};

export const CheckedDisabled: Story = {
  args: {
    label: "Verified identity",
    defaultValue: true,
    disabled: true,
  },
};
