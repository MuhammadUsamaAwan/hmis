import type { Meta, StoryObj } from "@storybook/react-vite";
import { PasswordInput } from "./password-input";

const meta = {
  title: "PasswordInput",
  component: PasswordInput,
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
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter password",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Password",
    placeholder: "Enter your password",
  },
};

export const Required: Story = {
  args: {
    label: "Password",
    isRequired: true,
    placeholder: "Enter your password",
  },
};

export const WithDescription: Story = {
  args: {
    label: "Password",
    description: "Must be at least 8 characters.",
    placeholder: "Enter your password",
  },
};

export const Invalid: Story = {
  args: {
    label: "Password",
    isRequired: true,
    isInvalid: true,
    errors: [{ message: "Password is required." }],
    placeholder: "Enter your password",
  },
};

export const InvalidWithValue: Story = {
  args: {
    label: "Password",
    isInvalid: true,
    errors: [{ message: "Password must be at least 8 characters." }],
    defaultValue: "abc",
  },
};

export const Disabled: Story = {
  args: {
    label: "Password",
    placeholder: "Enter your password",
    disabled: true,
  },
};

export const WithPrefillValue: Story = {
  args: {
    label: "Password",
    defaultValue: "supersecret123",
  },
};
