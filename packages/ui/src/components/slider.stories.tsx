import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "./slider";

const meta = {
  title: "Slider",
  component: Slider,
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
    showValue: { control: "boolean" },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Pain level",
    defaultValue: [5],
    min: 0,
    max: 10,
  },
};

export const WithDescription: Story = {
  args: {
    label: "Pain level",
    description: "Rate the patient's pain from 0 (none) to 10 (severe).",
    defaultValue: [3],
    min: 0,
    max: 10,
  },
};

export const Required: Story = {
  args: {
    label: "Dosage (mg)",
    description: "Select the prescribed dosage.",
    isRequired: true,
    defaultValue: [250],
    min: 0,
    max: 1000,
    step: 50,
  },
};

export const Range: Story = {
  args: {
    label: "Reference range",
    description: "Set the normal reference range for this lab value.",
    defaultValue: [60, 100],
    min: 0,
    max: 200,
    formatValue: v => `${v[0]} – ${v[1]}`,
  },
};

export const CustomFormat: Story = {
  args: {
    label: "Dosage (mg)",
    defaultValue: [500],
    min: 0,
    max: 2000,
    step: 100,
    formatValue: v => `${v[0]} mg`,
  },
};

export const Disabled: Story = {
  args: {
    label: "Pain level",
    defaultValue: [7],
    min: 0,
    max: 10,
    disabled: true,
  },
};

export const Invalid: Story = {
  args: {
    label: "Pain level",
    isRequired: true,
    isInvalid: true,
    errors: [{ message: "Pain level is required." }],
    min: 0,
    max: 10,
  },
};
