import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker } from "./date-picker";

const meta = {
  title: "Date Picker",
  component: DatePicker,
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
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    label: "Date of Birth",
  },
};

export const Required: Story = {
  args: {
    label: "Date of Birth",
    isRequired: true,
  },
};

export const WithDescription: Story = {
  args: {
    label: "Admission Date",
    description: "Enter the patient's hospital admission date.",
  },
};

export const WithValue: Story = {
  args: {
    label: "Date of Birth",
    value: "1990-06-15",
  },
};

export const Invalid: Story = {
  args: {
    label: "Date of Birth",
    isRequired: true,
    isInvalid: true,
    errors: [{ message: "Date of birth is required." }],
  },
};

export const Disabled: Story = {
  args: {
    label: "Discharge Date",
    disabled: true,
    value: "2024-03-22",
  },
};

export const WithYearConstraints: Story = {
  args: {
    label: "Date of Birth",
    minDate: new Date(1900, 0, 1),
    maxDate: new Date(),
  },
};

export const WithDateConstraints: Story = {
  args: {
    label: "Appointment Date",
    description: "Must be a future date.",
    minDate: new Date(),
  },
};
