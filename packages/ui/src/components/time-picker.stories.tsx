import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimePicker } from "./time-picker";

const meta = {
  title: "Time Picker",
  component: TimePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    S => (
      <div className="w-48">
        <S />
      </div>
    ),
  ],
  argTypes: {
    disabled: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isRequired: { control: "boolean" },
  },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    label: "Appointment Time",
  },
};

export const Required: Story = {
  args: {
    label: "Start Time",
    isRequired: true,
  },
};

export const WithValue: Story = {
  args: {
    label: "Appointment Time",
    value: "10:30",
  },
};

export const WithSeconds: Story = {
  args: {
    label: "Duration",
    value: "10:30:00",
    step: 1,
  },
};

export const WithDescription: Story = {
  args: {
    label: "Appointment Time",
    description: "Select the patient's appointment time.",
  },
};

export const Invalid: Story = {
  args: {
    label: "Start Time",
    isRequired: true,
    isInvalid: true,
    errors: [{ message: "Start time is required." }],
  },
};

export const Disabled: Story = {
  args: {
    label: "Discharge Time",
    disabled: true,
    value: "14:00",
  },
};
