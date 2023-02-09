import { RadioGroup as HUIRadioGroup } from "@headlessui/react";
import { clsx } from "clsx";
import { type SVGProps, useState } from "react";

export const RadioGroup = <T extends string[]>({
  onSelectedChange,
  label,
  options,
}: {
  options: T;
  label?: string;
  onSelectedChange: (value: T[number]) => void;
}) => {
  const [selected, setSelected] = useState(options[0]);

  return (
    <HUIRadioGroup
      value={selected}
      onChange={(val) => {
        setSelected(val);
        onSelectedChange(val);
      }}
    >
      {label && <HUIRadioGroup.Label className="sr-only">{label}</HUIRadioGroup.Label>}

      <div className="flex gap-2">
        {options.map((option) => (
          <HUIRadioGroup.Option
            key={option}
            value={option}
            className={({ active, checked }) =>
              clsx(
                "flex w-32 rounded-lg py-2 shadow-md hover:cursor-pointer focus:outline-none",
                active && "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300",
                checked ? "bg-sky-900 bg-opacity-75 text-white" : "bg-white"
              )
            }
          >
            {({ checked }) => (
              <div className="flex w-full items-center justify-center gap-2">
                <HUIRadioGroup.Label
                  as="p"
                  className={clsx("text-sm font-medium", checked ? "text-white" : "text-gray-900")}
                >
                  {option}
                </HUIRadioGroup.Label>

                {checked && <CheckIcon className="h-6 w-6 text-white" />}
              </div>
            )}
          </HUIRadioGroup.Option>
        ))}
      </div>
    </HUIRadioGroup>
  );
};

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
