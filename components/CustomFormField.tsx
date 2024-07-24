'use client'
import React from 'react'
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { Control } from 'react-hook-form'
import { FieldType } from './forms/PatientForm'
import Image from 'next/image'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { E164Number } from 'libphonenumber-js/core'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'

interface CustomFormFieldProps {
    control: Control<any>
    name: string
    fieldType: FieldType
    label?: string
    iconSrc?: string
    iconAlt?: string
    placeholder?: string
    disabled?: boolean
    dateFormat?: string
    showTimeSelect?: boolean
    children?: React.ReactNode
    renderSkeleton?: (field: any) => React.ReactNode
}

const RenderField = ({
    field,
    props,
}: {
    field: any
    props: CustomFormFieldProps
}) => {
    const {
        control,
        name,
        fieldType,
        label,
        iconSrc,
        iconAlt,
        placeholder,
        disabled,
        children,
        dateFormat,
        renderSkeleton,
        showTimeSelect,
    } = props

    switch (fieldType) {
        case FieldType.INPUT:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    {iconSrc && iconAlt && (
                        <Image
                            src={iconSrc}
                            alt={iconAlt}
                            height={24}
                            width={24}
                            className="ml-2"
                        />
                    )}
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            {...field}
                            className="shad-input border-0"
                        />
                    </FormControl>
                </div>
            )
        case FieldType.TEXTAREA:
            return (
                <FormControl>
                    <Textarea
                        placeholder={placeholder}
                        {...field}
                        className="shad-textArea"
                        disabled={disabled}
                    />
                </FormControl>
            )
        case FieldType.CHECKBOX:
            return (
                <FormControl>
                    <div className="flex items-center gap-4">
                        <Checkbox
                            id={name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        <Label htmlFor={name} className="checkbox-label">
                            {label}
                        </Label>
                    </div>
                </FormControl>
            )

        case FieldType.PHONE:
            return (
                <FormControl>
                    <PhoneInput
                        international
                        withCountryCallingCode
                        defaultCountry="IL"
                        placeholder={placeholder}
                        value={field.value as E164Number | undefined}
                        onChange={field.onChange}
                        className="input-phone"
                    />
                </FormControl>
            )
        case FieldType.DATE_PICKER:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    <Image
                        src={'/assets/icons/calendar.svg'}
                        height={24}
                        width={24}
                        alt="calendar"
                        className="ml-2"
                    />
                    <FormControl>
                        <DatePicker
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            showTimeSelect={showTimeSelect ?? false}
                            dateFormat={dateFormat ?? 'MM/dd/yyyy'}
                            timeInputLabel="Time:"
                            wrapperClassName="date-picker"
                        />
                    </FormControl>
                </div>
            )
        case FieldType.SKELETON:
            return renderSkeleton ? renderSkeleton(field) : null
        case FieldType.SELECT:
            return (
                <FormControl>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                    >
                        <FormControl className="shad-select-trigger">
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="shad-select-content">
                            {children}
                        </SelectContent>
                    </Select>
                </FormControl>
            )

        default:
            break
    }
}

const CustomFormField = (props: CustomFormFieldProps) => {
    const {
        control,
        name,
        fieldType,
        label,
        iconSrc,
        iconAlt,
        placeholder,
        disabled,
        children,
        dateFormat,
        renderSkeleton,
        showTimeSelect,
    } = props

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex-1">
                    {fieldType !== FieldType.CHECKBOX && label && (
                        <FormLabel>{label}</FormLabel>
                    )}
                    <RenderField field={field} props={props} />
                    <FormMessage className="shad-error" />
                </FormItem>
            )}
        />
    )
}

export default CustomFormField
