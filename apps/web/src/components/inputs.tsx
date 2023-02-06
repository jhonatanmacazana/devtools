import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

export const TextInput: React.FC<
  {
    label: string;
    registerReturn?: UseFormRegisterReturn;
  } & InputHTMLAttributes<HTMLInputElement>
> = ({ label, registerReturn, id, ...props }) => {
  return (
    <div className="flex flex-col gap-y-1">
      <label className="text-md inline-block font-medium text-gray-700" htmlFor={id}>
        {label}
      </label>
      <input
        className="m-0 block  w-full
         rounded-md border border-solid
        border-gray-300 bg-white
        bg-clip-padding px-3 py-1.5 text-base
        font-normal 
        text-gray-700
        transition
        ease-in-out
        focus:border-green-600 focus:bg-white focus:text-gray-700 focus:outline-none"
        id={id}
        {...props}
        {...registerReturn}
      />
    </div>
  );
};

export const TextareaInput: React.FC<
  {
    label: string;
    registerReturn?: UseFormRegisterReturn;
  } & InputHTMLAttributes<HTMLTextAreaElement>
> = ({ label, registerReturn, id, ...props }) => {
  return (
    <div className="flex flex-col gap-y-1">
      <label className="text-md inline-block font-medium text-gray-700" htmlFor={id}>
        {label}
      </label>
      <textarea
        className="m-0 block  w-full
         rounded-md border border-solid
        border-gray-300 bg-white
        bg-clip-padding px-3 py-1.5 text-base
        font-normal 
        text-gray-700
        transition
        ease-in-out
        focus:border-green-600 focus:bg-white focus:text-gray-700 focus:outline-none"
        id={id}
        {...props}
        {...registerReturn}
      />
    </div>
  );
};

export const CheckboxInput: React.FC<
  {
    label: string;
    registerReturnName?: UseFormRegisterReturn;
    registerReturnValue?: UseFormRegisterReturn;
  } & InputHTMLAttributes<HTMLInputElement>
> = ({ label, registerReturnName, registerReturnValue, id, ...props }) => {
  return (
    <div className="flex w-full items-center gap-2 px-3 py-2 shadow">
      <input {...registerReturnName} hidden value={label} />
      <input
        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
        id={id}
        type="checkbox"
        {...registerReturnValue}
        {...props}
      />
      <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export const RadioInput: React.FC<
  {
    label: string;
    registerReturn?: UseFormRegisterReturn;
  } & InputHTMLAttributes<HTMLInputElement>
> = ({ label, registerReturn, id, ...props }) => {
  return (
    <div className="flex w-full items-center gap-2 px-3 py-2 shadow">
      <input
        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
        id={id}
        type="radio"
        {...registerReturn}
        {...props}
      />
      <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};
