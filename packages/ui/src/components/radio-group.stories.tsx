import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup } from "./radio-group";

const meta = {
  title: "Radio Group",
  component: RadioGroup,
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
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const bloodTypes = [
  { label: "A+", value: "a-pos" },
  { label: "A−", value: "a-neg" },
  { label: "B+", value: "b-pos" },
  { label: "O+", value: "o-pos" },
];

export const Default: Story = {
  args: {
    legend: "Blood type",
    options: bloodTypes,
  },
};

export const WithDescription: Story = {
  args: {
    legend: "Blood type",
    description: "Select the patient's blood type from their records.",
    options: bloodTypes,
  },
};

export const Required: Story = {
  args: {
    legend: "Blood type",
    description: "Select the patient's blood type from their records.",
    isRequired: true,
    options: bloodTypes,
  },
};

export const WithDefaultValue: Story = {
  args: {
    legend: "Blood type",
    defaultValue: "o-pos",
    options: bloodTypes,
  },
};

export const WithOptionDescriptions: Story = {
  args: {
    legend: "Admission type",
    options: [
      {
        label: "Emergency",
        value: "emergency",
        description: "Immediate life-threatening condition requiring urgent care.",
      },
      {
        label: "Elective",
        value: "elective",
        description: "Scheduled admission for planned procedures.",
      },
      {
        label: "Urgent",
        value: "urgent",
        description: "Condition requiring prompt attention within 24–48 hours.",
      },
    ],
  },
};

export const WithDisabledOption: Story = {
  args: {
    legend: "Ward assignment",
    options: [
      { label: "General", value: "general" },
      { label: "ICU", value: "icu" },
      { label: "Isolation", value: "isolation", disabled: true },
      { label: "Paediatric", value: "paediatric", disabled: true },
    ],
    defaultValue: "general",
  },
};

export const AllDisabled: Story = {
  args: {
    legend: "Blood type",
    defaultValue: "o-pos",
    disabled: true,
    options: bloodTypes,
  },
};

export const Invalid: Story = {
  args: {
    legend: "Blood type",
    isRequired: true,
    isInvalid: true,
    errors: [{ message: "Blood type must be selected." }],
    options: bloodTypes,
  },
};
