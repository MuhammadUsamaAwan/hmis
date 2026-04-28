import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog } from "./alert-dialog";
import { Button } from "./button";

const meta = {
  title: "Alert Dialog",
  component: AlertDialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Confirm action",
    description: "Are you sure you want to proceed? This action cannot be undone.",
    trigger: <Button variant="outline">Open</Button>,
  },
};

export const Destructive: Story = {
  args: {
    title: "Delete patient record",
    description:
      "This will permanently delete the patient record and all associated data. This action cannot be undone.",
    trigger: <Button variant="destructive">Delete record</Button>,
    okText: "Delete",
    okVariant: "destructive",
    cancelText: "Cancel",
  },
};

export const WithAsyncConfirm: Story = {
  args: {
    title: "Discharge patient",
    description: "Confirm that the patient has been reviewed and is ready for discharge.",
    trigger: <Button>Discharge patient</Button>,
    okText: "Discharge",
    cancelText: "Cancel",
    onConfirm: () => new Promise(resolve => setTimeout(resolve, 2000)),
  },
};

export const WithSyncConfirm: Story = {
  args: {
    title: "Archive visit",
    description: "This visit will be archived and moved out of the active queue.",
    trigger: <Button variant="outline">Archive visit</Button>,
    okText: "Archive",
    cancelText: "Keep active",
    onConfirm: () => {
      console.log("archived");
    },
  },
};

export const CustomLabels: Story = {
  args: {
    title: "Transfer patient",
    description: "Patient will be transferred to the ICU ward. Notify the receiving team before confirming.",
    trigger: <Button>Transfer to ICU</Button>,
    okText: "Confirm transfer",
    cancelText: "Not yet",
  },
};
