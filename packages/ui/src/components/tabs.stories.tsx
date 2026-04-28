import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActivityIcon, ClipboardIcon, FlaskConicalIcon, UserIcon } from "lucide-react";
import { Tabs } from "./tabs";

const meta = {
  title: "Tabs",
  component: Tabs,
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
    variant: { control: "select", options: ["default", "line"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const patientTabs = [
  {
    value: "overview",
    label: "Overview",
    content: (
      <div className="flex flex-col gap-2 p-1 text-muted-foreground text-sm">
        <p>Patient admitted on 24 Apr 2026. Diagnosis: community-acquired pneumonia.</p>
        <p>Consultant: Dr. Emma Clarke. Ward: General — Bed 7.</p>
      </div>
    ),
  },
  {
    value: "vitals",
    label: "Vitals",
    content: (
      <div className="flex flex-col gap-2 p-1 text-sm">
        {[
          ["Blood pressure", "118/76 mmHg"],
          ["Heart rate", "82 bpm"],
          ["Temperature", "37.4°C"],
          ["SpO₂", "97%"],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between border-b pb-1 last:border-0">
            <span className="text-muted-foreground">{label}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    value: "labs",
    label: "Lab results",
    content: <p className="p-1 text-muted-foreground text-sm">No lab results on file.</p>,
  },
  {
    value: "notes",
    label: "Notes",
    content: (
      <p className="p-1 text-muted-foreground text-sm">
        Patient reports improvement in respiratory symptoms. Follow-up chest X-ray scheduled.
      </p>
    ),
  },
];

export const Default: Story = {
  args: { tabs: patientTabs },
};

export const LineVariant: Story = {
  args: { tabs: patientTabs, variant: "line" },
};

export const WithIcons: Story = {
  args: {
    tabs: [
      { value: "overview", label: "Overview", icon: <UserIcon />, content: patientTabs[0]?.content },
      { value: "vitals", label: "Vitals", icon: <ActivityIcon />, content: patientTabs[1]?.content },
      { value: "labs", label: "Labs", icon: <FlaskConicalIcon />, content: patientTabs[2]?.content },
      { value: "notes", label: "Notes", icon: <ClipboardIcon />, content: patientTabs[3]?.content },
    ],
  },
};

export const WithDisabled: Story = {
  args: {
    tabs: [
      { value: "overview", label: "Overview", content: patientTabs[0]?.content },
      { value: "vitals", label: "Vitals", content: patientTabs[1]?.content },
      { value: "labs", label: "Lab results", content: patientTabs[2]?.content, disabled: true },
      { value: "notes", label: "Notes", content: patientTabs[3]?.content, disabled: true },
    ],
  },
};

export const Vertical: Story = {
  args: { tabs: patientTabs, orientation: "vertical" },
};
