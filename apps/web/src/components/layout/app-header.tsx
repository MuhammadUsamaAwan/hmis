import { Button } from "@app/ui/button";
import { Select } from "@app/ui/select";
import { SidebarTrigger } from "@app/ui/sidebar";
import { useTheme } from "@app/ui/theme-provider";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

type Theme = "light" | "dark" | "system";

const themeOrder: Theme[] = ["light", "dark", "system"];
const themeIcons: Record<Theme, typeof Sun> = { light: Sun, dark: Moon, system: SunMoon };

const languageItems = [
  {
    items: [{ label: "English", value: "en" }],
  },
];

export function AppHeader() {
  const { theme, setTheme } = useTheme();
  const { i18n } = useTranslation();

  const cycleTheme = useCallback(() => {
    const idx = themeOrder.indexOf(theme as Theme);
    const next = themeOrder[(idx + 1) % themeOrder.length] ?? "system";
    setTheme(next);
  }, [theme, setTheme]);

  const handleLanguageChange = useCallback(
    (value: string) => {
      i18n.changeLanguage(value);
    },
    [i18n]
  );

  const ThemeIcon = themeIcons[theme as Theme] ?? SunMoon;

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ms-2" />
      <div className="h-4 w-px bg-border" />
      <h1 className="hidden font-medium text-sm sm:block">Hospital Management Information System</h1>

      <div className="ms-auto flex items-center gap-1">
        <Select
          value={i18n.language.split("-")[0] ?? "en"}
          onValueChange={handleLanguageChange}
          items={languageItems}
          size="sm"
        />

        <Button variant="ghost" size="icon-sm" onClick={cycleTheme} aria-label={`Theme: ${theme}`}>
          <ThemeIcon className="size-4" />
        </Button>
      </div>
    </header>
  );
}
