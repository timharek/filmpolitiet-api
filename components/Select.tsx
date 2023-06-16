export interface SelectOption {
  value: string;
  label: string;
}
interface SelectProps extends Partial<Omit<HTMLSelectElement, "options">> {
  label: string;
  options: SelectOption[];
  defaultValue?: string;
  notFirstEmpty?: true;
}

export function Select(props: SelectProps) {
  return (
    <div class="flex flex-col">
      <label for={props.name}>{props.label}</label>
      <select
        class="p-2 w-max"
        {...props}
      >
        {!props.notFirstEmpty && <option value=""></option>}
        {Array.from(props.options).map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}
