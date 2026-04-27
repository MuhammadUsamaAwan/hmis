/** biome-ignore-all lint/correctness/useUniqueElementIds: fine for stories */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: fine for stories */
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Dialog } from "./dialog";

const meta = {
  title: "Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean" },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Dialog Title",
    description: "This is a dialog description.",
    trigger: <Button>Open Dialog</Button>,
    confirm: <Button>Save changes</Button>,
    children: <p className="text-muted-foreground text-sm">Dialog body content goes here.</p>,
  },
};

export const NoDescription: Story = {
  args: {
    title: "Confirm Action",
    trigger: <Button>Open Dialog</Button>,
    children: <p className="text-muted-foreground text-sm">Are you sure you want to proceed?</p>,
  },
};

export const CustomCancelText: Story = {
  args: {
    title: "Delete Record",
    description: "This action cannot be undone.",
    trigger: <Button>Open Dialog</Button>,
    cancelText: "Discard",
    children: <p className="text-muted-foreground text-sm">The record will be permanently removed.</p>,
  },
};

export const WithForm: Story = {
  args: {
    title: "Edit Patient",
    description: "Update patient information.",
    trigger: <Button>Edit Patient</Button>,
    confirm: <Button>Save</Button>,
    children: (
      <div className="grid gap-4 py-2">
        <div className="grid gap-1">
          <label className="font-medium text-sm" htmlFor="name">
            Full Name
          </label>
          <input id="name" className="rounded-md border px-3 py-2 text-sm" defaultValue="John Doe" />
        </div>
        <div className="grid gap-1">
          <label className="font-medium text-sm" htmlFor="dob">
            Date of Birth
          </label>
          <input id="dob" type="date" className="rounded-md border px-3 py-2 text-sm" defaultValue="1990-01-01" />
        </div>
      </div>
    ),
  },
};

export const WithScrollableContent: Story = {
  args: {
    title: "Terms & Conditions",
    description: "Please read before proceeding.",
    trigger: <Button>View Terms</Button>,
    cancelText: "Decline",
    confirm: <Button>Accept</Button>,
    children: (
      <div className="space-y-3 py-2">
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i} className="text-muted-foreground text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
          </p>
        ))}
      </div>
    ),
  },
};

export const Destructive: Story = {
  args: {
    title: "Delete Patient",
    description: "This action cannot be undone.",
    trigger: <Button variant="destructive">Delete Patient</Button>,
    cancelText: "Cancel",
    confirm: <Button variant="destructive">Delete</Button>,
    children: <p className="text-muted-foreground text-sm">Patient record will be permanently removed.</p>,
  },
};

export const ConfirmLoading: Story = {
  args: {
    title: "Saving Changes",
    trigger: <Button>Open Dialog</Button>,
    confirm: <Button disabled>Save</Button>,
    children: <p className="text-muted-foreground text-sm">Processing your request.</p>,
  },
};

export const NoConfirmButton: Story = {
  args: {
    title: "Information",
    trigger: <Button variant="outline">View Info</Button>,
    children: <p className="text-muted-foreground text-sm">This dialog has no confirm action.</p>,
  },
};

export const CustomTrigger: Story = {
  render: () => (
    <Dialog
      title="Confirm Action"
      description="Triggered by a custom button."
      confirm={<Button>Confirm</Button>}
      trigger={<Button variant="destructive">Open Danger Dialog</Button>}
    >
      <p className="text-muted-foreground text-sm">Custom trigger passed as a Button component.</p>
    </Dialog>
  ),
};
