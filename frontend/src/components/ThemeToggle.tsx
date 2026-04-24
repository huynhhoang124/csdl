import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  const opts: Array<{ value: 'light' | 'dark' | 'system'; icon: React.ReactNode; label: string }> = [
    { value: 'light', icon: <Sun className="size-4" />, label: 'Sáng' },
    { value: 'dark', icon: <Moon className="size-4" />, label: 'Tối' },
    { value: 'system', icon: <Monitor className="size-4" />, label: 'Hệ thống' },
  ];

  return (
    <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-0.5">
      {opts.map((o) => (
        <Button
          key={o.value}
          variant="ghost"
          size="sm"
          onClick={() => setTheme(o.value)}
          title={o.label}
          className={cn(
            'h-7 px-2',
            theme === o.value && 'bg-brand-gradient text-white hover:opacity-90'
          )}
        >
          {o.icon}
        </Button>
      ))}
    </div>
  );
}
