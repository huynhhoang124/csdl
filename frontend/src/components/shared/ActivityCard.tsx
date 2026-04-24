import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Field { label: string; value: React.ReactNode }

export function ActivityCard({
  title, badges, fields, joined, onToggle, actionLabel = 'Đăng ký',
}: {
  title: string;
  badges?: string[];
  fields: Field[];
  joined?: boolean;
  onToggle?: () => void;
  actionLabel?: string;
}) {
  return (
    <motion.div whileHover={{ y: -4 }}>
      <Card className="relative hover:shadow-xl transition h-full flex flex-col">
        {joined && (
          <div className="absolute top-3 right-3 z-10">
            <CheckCircle2 className="size-6 text-emerald-500 fill-emerald-100" />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-base line-clamp-2 pr-8">{title}</CardTitle>
          {badges && badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {badges.map((b) => (
                <span key={b} className="px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                  {b}
                </span>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent className="flex-1 flex flex-col space-y-2">
          <div className="space-y-1 flex-1">
            {fields.map((f) => (
              <div key={f.label} className="flex text-sm">
                <span className="text-slate-500 w-28 shrink-0">{f.label}:</span>
                <span className="font-medium truncate">{f.value}</span>
              </div>
            ))}
          </div>
          {onToggle && (
            <Button
              variant={joined ? 'outline' : 'default'}
              className="w-full mt-3"
              onClick={onToggle}
            >
              {joined ? 'Hủy đăng ký' : actionLabel}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
