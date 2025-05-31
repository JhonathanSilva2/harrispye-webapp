import {
    Controller,
    ControllerRenderProps,
    FieldError,
    FieldValues,
    Path,
    useFormContext,
} from "react-hook-form";
import { GenericInputProps } from "../../app/types";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Combobox } from "./combobox-generic";
import { DatePicker } from "./date-picker-generic";
import { NumericFormat } from "react-number-format";

const GenericInput = <T extends FieldValues>({
    name,
    label,
    type = "text",
    options = [],
    placeholder,
    className,
    labelClassName,
    disabled,
    accept,
    ...rest
}: GenericInputProps<T>) => {
    const {
        control,
        formState: { errors },
    } = useFormContext<T>();

    const error = errors[name] as FieldError | undefined;

    const renderInput = (field: ControllerRenderProps<T, Path<T>>) => {
        switch (type) {
            case "textarea":
                return (
                    <Textarea
                        {...field}
                        className={className}
                        placeholder={placeholder}
                        disabled={disabled}
                        {...rest}
                    />
                );
            case "file":
                return (
                    <Input
                        type="file"
                        disabled={disabled}
                        className={className}
                        placeholder={placeholder}
                        onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            field.onChange(file);
                        }}
                        {...rest}
                    />
                );

            case "select":
                return (
                    <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        disabled={disabled}
                    >
                        <SelectTrigger className={className}>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {options.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                );

            case "radio":
                return (
                    <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className={className}
                        disabled={disabled}
                    >
                        <div className="mb-5 flex items-center gap-4">
                            {options.map((option, index) => (
                                <div
                                    key={option.value}
                                    className="flex items-center gap-1"
                                >
                                    <RadioGroupItem
                                        value={option.value}
                                        id={`${index}-${option.value}`}
                                    />
                                    <Label htmlFor={`${index}-${option.value}`}>
                                        {option.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </RadioGroup>
                );

            case "combobox":
                return (
                    <Combobox
                        options={options}
                        placeholder={placeholder}
                        onChange={field.onChange}
                        className={className}
                        value={field.value}
                        {...rest}
                    />
                );
            case "date":
                return (
                    <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={placeholder}
                        className={className}
                        {...rest}
                    />
                );
            case "currency":
                return (
                    <NumericFormat
                        {...field}
                        getInputRef={field.ref}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        customInput={Input}
                        decimalScale={2}
                        fixedDecimalScale
                        allowNegative={false}
                        onValueChange={(values) => field.onChange(values)}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={className}
                        {...rest}
                    />
                );

            default:
                return (
                    <Input
                        disabled={disabled}
                        type={type}
                        {...field}
                        className={className}
                        placeholder={placeholder}
                        {...rest}
                    />
                );
        }
    };

    return (
        <FormField
            name={name}
            control={control}
            render={({ field }) => (
                <FormItem>
                    <FormLabel
                        className={labelClassName}
                        htmlFor={name.toString()}
                    >
                        {label}
                    </FormLabel>
                    <FormControl>{renderInput(field)}</FormControl>
                    {error && (
                        <span className="mt-1 text-sm text-red-500">
                            {error.message}
                        </span>
                    )}
                </FormItem>
            )}
        />
    );
};

export default GenericInput;
