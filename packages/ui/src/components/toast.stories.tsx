/** biome-ignore-all lint/nursery/noJsxPropsBind: fine for stories */
/** biome-ignore-all lint/suspicious/noShadowRestrictedNames: fine for stories */
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Toaster, toast } from "./toast";

const meta = {
  title: "Toast",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    S => (
      <>
        <Toaster />
        <S />
      </>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Button onClick={() => toast("Patient record saved.")}>Show Toast</Button>,
};

export const Success: Story = {
  render: () => <Button onClick={() => toast.success("Patient registered successfully.")}>Success</Button>,
};

export const Error: Story = {
  render: () => (
    <Button variant="destructive" onClick={() => toast.error("Failed to save record. Try again.")}>
      Error
    </Button>
  ),
};

export const Warning: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast.warning("Duplicate MRN detected.")}>
      Warning
    </Button>
  ),
};

export const Info: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast.info("Appointment reminder sent to patient.")}>
      Info
    </Button>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast("Visit created", {
          description: "Dr. Smith – Apr 28, 2026 at 10:00 AM",
        })
      }
    >
      With Description
    </Button>
  ),
};

export const Loading: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => {
        const id = toast.loading("Saving changes...");
        setTimeout(() => toast.success("Saved successfully.", { id }), 2000);
      }}
    >
      Loading → Success
    </Button>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast("Patient discharged", {
          action: {
            label: "Undo",
            onClick: () => toast.info("Discharge cancelled."),
          },
        })
      }
    >
      With Action
    </Button>
  ),
};
