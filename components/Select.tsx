import { JSX } from "preact";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  name: string;
  label: string;
  options: SelectOption[];
} & JSX.HTMLAttributes<HTMLSelectElement>;

export function Select(props: SelectProps) {
  const { id: _id, name, label, options, ...rest } = props;
  return (
    <div class="flex flex-col">
      <label class="font-semibold" for={name}>{label}</label>
      <select
        id={name}
        name={name}
        class="p-2 w-max rounded dark:text-black"
        {...rest}
      >
        <option selected value="">All</option>
        {options.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}
