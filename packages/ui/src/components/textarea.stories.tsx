import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./textarea";

const meta = {
  title: "Textarea",
  component: Textarea,
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
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Notes",
    placeholder: "Clinical notes...",
  },
};

export const Required: Story = {
  args: {
    label: "Chief Complaint",
    isRequired: true,
    placeholder: "Describe the patient's chief complaint...",
  },
};

export const WithDescription: Story = {
  args: {
    label: "Allergies",
    description: "List all known drug and environmental allergies.",
    placeholder: "e.g. Penicillin, Sulfa drugs...",
  },
};

export const Invalid: Story = {
  args: {
    label: "Chief Complaint",
    isRequired: true,
    isInvalid: true,
    errors: [{ message: "Chief complaint is required." }],
    placeholder: "Describe the patient's chief complaint...",
  },
};

export const Disabled: Story = {
  args: {
    label: "Discharge Summary",
    disabled: true,
    defaultValue: "Patient was discharged in stable condition.",
  },
};
