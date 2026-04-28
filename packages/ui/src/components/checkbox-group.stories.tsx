import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxGroup } from "./checkbox-group";

const meta = {
  title: "Checkbox Group",
  component: CheckboxGroup,
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
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const symptoms = [
  { label: "Fever", value: "fever" },
  { label: "Cough", value: "cough" },
  { label: "Shortness of breath", value: "shortness-of-breath" },
  { label: "Fatigue", value: "fatigue" },
];

export const Default: Story = {
  args: {
    legend: "Presenting symptoms",
    options: symptoms,
  },
};

export const WithDescription: Story = {
  args: {
    legend: "Presenting symptoms",
    description: "Select all symptoms the patient is currently experiencing.",
    options: symptoms,
  },
};

export const Required: Story = {
  args: {
    legend: "Presenting symptoms",
    description: "Select all symptoms the patient is currently experiencing.",
    isRequired: true,
    options: symptoms,
  },
};

export const WithDefaultValue: Story = {
  args: {
    legend: "Presenting symptoms",
    defaultValue: ["fever", "cough"],
    options: symptoms,
  },
};

export const WithOptionDescriptions: Story = {
  args: {
    legend: "Consent options",
    options: [
      {
        label: "Treatment consent",
        value: "treatment",
        description: "Patient consents to the proposed treatment plan.",
      },
      {
        label: "Data sharing",
        value: "data-sharing",
        description: "Patient allows sharing anonymised data for research.",
      },
      {
        label: "Photography",
        value: "photography",
        description: "Patient consents to medical photography for records.",
      },
    ],
  },
};

export const WithDisabledOption: Story = {
  args: {
    legend: "Procedures performed",
    options: [
      { label: "Blood draw", value: "blood-draw" },
      { label: "ECG", value: "ecg" },
      { label: "X-ray", value: "xray", disabled: true },
      { label: "MRI", value: "mri", disabled: true },
    ],
    defaultValue: ["blood-draw"],
  },
};

export const AllDisabled: Story = {
  args: {
    legend: "Presenting symptoms",
    defaultValue: ["fever", "fatigue"],
    disabled: true,
    options: symptoms,
  },
};

export const Invalid: Story = {
  args: {
    legend: "Presenting symptoms",
    isRequired: true,
    isInvalid: true,
    errors: [{ message: "At least one symptom must be selected." }],
    options: symptoms,
  },
};
