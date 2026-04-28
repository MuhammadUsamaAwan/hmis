import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Pagination } from "./pagination";

const meta = {
  title: "Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    page: 1,
    totalPages: 10,
    onPageChange: (_page: number) => {
      /* controlled via render */
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled({ totalPages, siblings }: { totalPages: number; siblings?: number }) {
  const [page, setPage] = useState(1);
  if (siblings !== undefined) {
    return <Pagination page={page} totalPages={totalPages} onPageChange={setPage} siblings={siblings} />;
  }
  return <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />;
}

export const Default: Story = {
  render: () => <Controlled totalPages={10} />,
};

export const FewPages: Story = {
  render: () => <Controlled totalPages={3} />,
};

export const ManySiblings: Story = {
  render: () => <Controlled totalPages={20} siblings={2} />,
};

export const LastPage: Story = {
  render: () => {
    const [page, setPage] = useState(10);
    return <Pagination page={page} totalPages={10} onPageChange={setPage} />;
  },
};

export const MiddlePage: Story = {
  render: () => {
    const [page, setPage] = useState(5);
    return <Pagination page={page} totalPages={10} onPageChange={setPage} />;
  },
};
