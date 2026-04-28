import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertTriangleIcon, CheckCircleIcon, InfoIcon, XCircleIcon } from "lucide-react";
import { Alert } from "./alert";
import { Button } from "./button";

const meta = {
  title: "Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    S => (
      <div className="w-[480px]">
        <S />
      </div>
    ),
  ],
  argTypes: {
    variant: { control: "select", options: ["default", "destructive"] },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "System maintenance",
    description: "Scheduled maintenance is planned for tonight between 02:00 and 04:00.",
  },
};

export const WithIcon: Story = {
  args: {
    icon: <InfoIcon />,
    title: "New lab results available",
    description: "Lab results for patient Sarah Johnson have been received and are ready to review.",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    icon: <XCircleIcon />,
    title: "Critical allergy alert",
    description: "This patient has a documented allergy to Penicillin. Do not administer.",
  },
};

export const Warning: Story = {
  args: {
    icon: <AlertTriangleIcon className="text-amber-500" />,
    title: "Incomplete patient record",
    description: "Date of birth and next-of-kin details are missing from this patient's record.",
  },
};

export const Success: Story = {
  args: {
    icon: <CheckCircleIcon className="text-green-600" />,
    title: "Patient discharged",
    description: "Sarah Johnson has been successfully discharged. Discharge summary has been generated.",
  },
};

export const WithAction: Story = {
  args: {
    icon: <InfoIcon />,
    title: "Pending transfer request",
    description: "A transfer request for this patient is awaiting your approval.",
    action: <Button size="sm">Review</Button>,
  },
};

export const TitleOnly: Story = {
  args: {
    icon: <CheckCircleIcon className="text-green-600" />,
    title: "Changes saved successfully.",
  },
};
