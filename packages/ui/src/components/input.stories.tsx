import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchIcon } from "lucide-react";
import { Input } from "./input";

const meta = {
  title: "Input",
  component: Input,
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
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Full Name",
    placeholder: "John Doe",
  },
};

export const Required: Story = {
  args: {
    label: "Email",
    isRequired: true,
    placeholder: "patient@example.com",
    type: "email",
  },
};

export const WithDescription: Story = {
  args: {
    label: "National ID",
    description: "Enter the patient's national identification number.",
    placeholder: "1234567890123",
  },
};

export const Invalid: Story = {
  args: {
    label: "Date of Birth",
    isRequired: true,
    isInvalid: true,
    errors: [{ message: "Date of birth is required." }],
    placeholder: "YYYY-MM-DD",
  },
};

export const Disabled: Story = {
  args: {
    label: "MRN",
    disabled: true,
    defaultValue: "MRN-00421",
  },
};

export const WithLeadingAddon: Story = {
  args: {
    label: "Search",
    placeholder: "Search patients...",
    leadingAddon: <SearchIcon className="size-4 text-muted-foreground" />,
  },
};

export const WithTrailingAddon: Story = {
  args: {
    label: "Weight",
    placeholder: "0.0",
    type: "number",
    trailingAddon: <span className="text-muted-foreground text-sm">kg</span>,
  },
};

export const WithBothAddons: Story = {
  args: {
    label: "Amount",
    placeholder: "0.00",
    type: "number",
    leadingAddon: <span className="text-muted-foreground text-sm">$</span>,
    trailingAddon: <span className="text-muted-foreground text-sm">USD</span>,
  },
};
