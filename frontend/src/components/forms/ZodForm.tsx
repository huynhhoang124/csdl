import { useForm, type DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, type ZodObject, type ZodTypeAny } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export interface ZodFormProps<T extends ZodObject<Record<string, ZodTypeAny>>> {
  schema: T;
  defaultValues?: Partial<z.infer<T>>;
  onSubmit: (data: z.infer<T>) => void | Promise<void>;
  submitLabel?: string;
  disabledFields?: string[];
}

interface FieldInfo {
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'unknown';
  options?: string[];
  optional: boolean;
}

function inspect(zod: ZodTypeAny): FieldInfo {
  let info: FieldInfo = { type: 'unknown', optional: false };
  let cur: ZodTypeAny = zod;
  // unwrap optional/nullable
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  while ((cur as any)._def?.innerType || (cur as any)._def?.schema) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const def = (cur as any)._def;
    if (def.typeName === 'ZodOptional' || def.typeName === 'ZodNullable' || def.typeName === 'ZodDefault') {
      info.optional = true;
    }
    cur = def.innerType ?? def.schema;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typeName = (cur as any)._def?.typeName as string | undefined;
  if (typeName === 'ZodString') info.type = 'string';
  else if (typeName === 'ZodNumber') info.type = 'number';
  else if (typeName === 'ZodBoolean') info.type = 'boolean';
  else if (typeName === 'ZodDate') info.type = 'date';
  else if (typeName === 'ZodEnum') {
    info.type = 'enum';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info.options = (cur as any)._def.values as string[];
  } else if (typeName === 'ZodUnion') {
    // string | date union treated as string
    info.type = 'string';
  }
  return info;
}

export function ZodForm<T extends ZodObject<Record<string, ZodTypeAny>>>({
  schema, defaultValues, onSubmit, submitLabel = 'Lưu', disabledFields = [],
}: ZodFormProps<T>) {
  const shape = schema.shape;
  type V = z.infer<T>;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<V>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<V>,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(shape).map(([key, def]) => {
          const info = inspect(def as ZodTypeAny);
          const disabled = disabledFields.includes(key);
          return (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={key}>
                {key}
                {!info.optional && <span className="text-rose-500 ml-0.5">*</span>}
                <span className="ml-2 text-xs text-slate-400">({info.type})</span>
              </Label>
              {info.type === 'boolean' ? (
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...register(key as never)} disabled={disabled} className="size-4 rounded" />
                  <span className="text-sm text-slate-500">true/false</span>
                </label>
              ) : info.type === 'enum' && info.options ? (
                <select
                  id={key}
                  disabled={disabled}
                  {...register(key as never)}
                  className="flex h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">— Chọn —</option>
                  {info.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <Input
                  id={key}
                  type={info.type === 'number' ? 'number' : info.type === 'date' ? 'date' : 'text'}
                  step={info.type === 'number' ? 'any' : undefined}
                  disabled={disabled}
                  {...register(key as never, info.type === 'number' ? { valueAsNumber: true } : {})}
                />
              )}
              {(errors as Record<string, { message?: string } | undefined>)[key]?.message && (
                <p className="text-xs text-rose-600">{(errors as Record<string, { message?: string }>)[key]!.message}</p>
              )}
            </div>
          );
        })}
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? 'Đang lưu...' : submitLabel}
      </Button>
    </form>
  );
}
