import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    const id = React.useId();
    const checkboxId = props.id || id;

    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            id={checkboxId}
            className="sr-only peer"
            ref={ref}
            {...props}
          />
          <label
            htmlFor={checkboxId}
            className={cn(
              "relative flex h-5 w-5 cursor-pointer items-center justify-center rounded border-2 border-gray-300 bg-white",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2",
              "peer-checked:bg-primary-600 peer-checked:border-primary-600",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              error && "border-red-500",
              className
            )}
          >
            <Check className="h-4 w-4 text-white opacity-0 peer-checked:opacity-100" />
          </label>
        </div>
        {label && (
          <div className="ml-3">
            <label
              htmlFor={checkboxId}
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              {label}
            </label>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
