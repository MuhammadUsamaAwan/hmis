import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Sheet } from "./sheet";

const meta = {
  title: "Sheet",
  component: Sheet,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const patientDetails = (
  <div className="flex flex-col gap-4 text-sm">
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground">Full name</span>
      <span className="font-medium">Sarah Johnson</span>
    </div>
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground">Date of birth</span>
      <span>14 Mar 1985</span>
    </div>
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground">Ward</span>
      <span>General — Bed 7</span>
    </div>
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground">Admitted</span>
      <span>24 Apr 2026</span>
    </div>
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground">Consultant</span>
      <span>Dr. Emma Clarke</span>
    </div>
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground">Diagnosis</span>
      <span>Community-acquired pneumonia</span>
    </div>
  </div>
);

export const Default: Story = {
  args: {
    trigger: <Button variant="outline">Patient details</Button>,
    title: "Patient details",
    description: "View the full record for this patient.",
    children: patientDetails,
  },
};

export const WithFooterAction: Story = {
  args: {
    trigger: <Button>Edit patient</Button>,
    title: "Edit patient record",
    description: "Make changes to the patient's information.",
    children: patientDetails,
    footer: <Button>Save changes</Button>,
    cancelText: "Discard",
  },
};

export const LeftSide: Story = {
  args: {
    trigger: <Button variant="outline">Open left</Button>,
    title: "Navigation",
    side: "left",
    children: (
      <nav className="flex flex-col gap-1 text-sm">
        {["Dashboard", "Patients", "Appointments", "Reports", "Settings"].map(item => (
          <div key={item} className="cursor-pointer rounded-md px-2 py-2 hover:bg-muted">
            {item}
          </div>
        ))}
      </nav>
    ),
  },
};

export const BottomSide: Story = {
  args: {
    trigger: <Button variant="outline">Open bottom</Button>,
    title: "Quick actions",
    side: "bottom",
    children: (
      <div className="grid grid-cols-3 gap-2 py-2">
        {["New patient", "New visit", "Schedule", "Lab order", "Discharge", "Transfer"].map(action => (
          <Button key={action} variant="outline" className="w-full">
            {action}
          </Button>
        ))}
      </div>
    ),
  },
};

export const NoHeader: Story = {
  args: {
    trigger: <Button variant="ghost">Notes</Button>,
    children: (
      <p className="text-muted-foreground text-sm leading-relaxed">
        Patient reports improvement in respiratory symptoms. Oxygen saturation stable at 97%. Continue current
        antibiotic course. Follow-up chest X-ray scheduled for tomorrow morning.
      </p>
    ),
  },
};
