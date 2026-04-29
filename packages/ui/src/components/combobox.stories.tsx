import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComboboxField, type SingleComboboxProps } from "./combobox";

const COUNTRIES = [
  {
    items: [
      { label: "Pakistan", value: "pk" },
      { label: "United States", value: "us" },
      { label: "United Kingdom", value: "gb" },
      { label: "Canada", value: "ca" },
      { label: "Australia", value: "au" },
    ],
  },
];

const GROUPED_OPTIONS = [
  {
    label: "Vitals",
    items: [
      { label: "Blood Pressure", value: "bp" },
      { label: "Heart Rate", value: "hr" },
      { label: "Temperature", value: "temp" },
    ],
  },
  {
    label: "Labs",
    items: [
      { label: "CBC", value: "cbc" },
      { label: "Metabolic Panel", value: "bmp" },
      { label: "Lipid Panel", value: "lipid" },
    ],
  },
];

const meta = {
  title: "ComboboxField",
  component: ComboboxField,
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
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isRequired: { control: "boolean" },
    showClear: { control: "boolean" },
  },
} satisfies Meta<SingleComboboxProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Select an option",
    items: COUNTRIES,
  },
};

export const WithLabel: Story = {
  args: {
    label: "Country",
    placeholder: "Select a country",
    items: COUNTRIES,
  },
};

export const Required: Story = {
  args: {
    label: "Country",
    isRequired: true,
    placeholder: "Select a country",
    items: COUNTRIES,
  },
};

export const WithDescription: Story = {
  args: {
    label: "Country",
    description: "Patient's country of residence.",
    placeholder: "Select a country",
    items: COUNTRIES,
  },
};

export const WithDefaultValue: Story = {
  args: {
    label: "Country",
    placeholder: "Select a country",
    defaultValue: "pk",
    items: COUNTRIES,
  },
};

export const Invalid: Story = {
  args: {
    label: "Country",
    isRequired: true,
    isInvalid: true,
    errors: [{ message: "Country is required." }],
    placeholder: "Select a country",
    items: COUNTRIES,
  },
};

export const Disabled: Story = {
  args: {
    label: "Country",
    placeholder: "Select a country",
    defaultValue: "us",
    disabled: true,
    items: COUNTRIES,
  },
};

export const Grouped: Story = {
  args: {
    label: "Test / Measurement",
    placeholder: "Select a test",
    items: GROUPED_OPTIONS,
  },
};

export const MultiSelect: Story = {
  render: () => <ComboboxField multiple label="Tests" placeholder="Select tests" items={GROUPED_OPTIONS} />,
};

export const MultiSelectWithDefaults: Story = {
  render: () => (
    <ComboboxField
      multiple
      label="Tests"
      placeholder="Select tests"
      defaultValue={["bp", "cbc"]}
      items={GROUPED_OPTIONS}
    />
  ),
};

// 500 ICD-10-like codes across 5 groups
const ICD_CODES = ["Infectious", "Neoplasms", "Blood Disorders", "Endocrine", "Mental Health"].map(group => ({
  label: group,
  items: Array.from({ length: 100 }, (_, i) => ({
    label: `${group} Condition ${String(i + 1).padStart(3, "0")}`,
    value: `${group.toLowerCase().replace(/\s/g, "-")}-${i + 1}`,
  })),
}));

export const LargeList: Story = {
  render: () => <ComboboxField label="Diagnosis (ICD-10)" placeholder="Search 500 codes..." items={ICD_CODES} />,
};

export const LargeListMulti: Story = {
  render: () => (
    <ComboboxField multiple label="Diagnoses (ICD-10)" placeholder="Search 500 codes..." items={ICD_CODES} />
  ),
};

export const NoClear: Story = {
  args: {
    label: "Country",
    placeholder: "Select a country",
    showClear: false,
    items: COUNTRIES,
  },
};
