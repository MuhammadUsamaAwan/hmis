import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollArea } from "./scroll-area";

const meta = {
  title: "Scroll Area",
  component: ScrollArea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const patients = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Patient ${i + 1}`,
  ward: ["General", "ICU", "Paediatric", "Isolation"][i % 4],
}));

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-64 w-72 rounded-md border p-4">
      <div className="flex flex-col gap-2">
        {patients.map(p => (
          <div key={p.id} className="flex justify-between border-b py-1 text-sm last:border-0">
            <span>{p.name}</span>
            <span className="text-muted-foreground">{p.ward}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-72 rounded-md border">
      <div className="flex gap-4 p-4" style={{ width: "max-content" }}>
        {patients.map(p => (
          <div key={p.id} className="flex w-28 shrink-0 flex-col gap-1 rounded-md border p-3 text-sm">
            <span className="font-medium">{p.name}</span>
            <span className="text-muted-foreground">{p.ward}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
