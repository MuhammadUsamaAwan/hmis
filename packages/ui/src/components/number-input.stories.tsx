import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberInput } from "./number-input";

const meta = {
  title: "Number Input",
  component: NumberInput,
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
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "0",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Age",
    placeholder: "0",
    min: 0,
    max: 150,
  },
};

export const Required: Story = {
  args: {
    label: "Age",
    isRequired: true,
    placeholder: "0",
    min: 0,
    max: 150,
  },
};

export const WithDescription: Story = {
  args: {
    label: "Weight",
    description: "Enter the patient's weight in kilograms.",
    placeholder: "0.0",
    step: 0.1,
    min: 0,
  },
};

export const Invalid: Story = {
  args: {
    label: "Systolic BP",
    isRequired: true,
    isInvalid: true,
    errors: [{ message: "Systolic blood pressure is required." }],
    placeholder: "120",
  },
};

export const Disabled: Story = {
  args: {
    label: "Bed Number",
    disabled: true,
    defaultValue: 42,
  },
};

export const WithTrailingAddon: Story = {
  args: {
    label: "Weight",
    placeholder: "0.0",
    step: 0.1,
    min: 0,
    trailingAddon: <span className="text-muted-foreground text-sm">kg</span>,
  },
};

export const WithLeadingAddon: Story = {
  args: {
    label: "Temperature",
    placeholder: "36.6",
    step: 0.1,
    leadingAddon: <span className="text-muted-foreground text-sm">°C</span>,
  },
};

export const WithBothAddons: Story = {
  args: {
    label: "Dosage",
    placeholder: "0",
    min: 0,
    leadingAddon: <span className="text-muted-foreground text-sm">×</span>,
    trailingAddon: <span className="text-muted-foreground text-sm">mg</span>,
  },
};
