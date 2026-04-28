import type { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import type { VariantProps } from "class-variance-authority";
import {
  TabsContent,
  TabsList,
  Tabs as TabsRoot,
  TabsTrigger,
  type tabsListVariants,
} from "@/ui/shadcn/components/ui/tabs";

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends TabsPrimitive.Root.Props {
  tabs: TabItem[];
  variant?: VariantProps<typeof tabsListVariants>["variant"];
}

export function Tabs({ tabs, variant = "default", defaultValue, ...props }: TabsProps) {
  const initial = defaultValue ?? tabs[0]?.value;

  return (
    <TabsRoot defaultValue={initial} {...props}>
      <TabsList variant={variant}>
        {tabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value} disabled={tab.disabled}>
            {tab.icon}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(tab => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </TabsRoot>
  );
}
