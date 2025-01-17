'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Form, FormControl } from '@/components/ui/form'

import CustomFormField from '../CustomFormField'
import SubmitButton from '../SubmitButton'
import { useEffect, useState } from 'react'
import { PatientFormValidation } from '@/lib/validation'
import { useRouter } from 'next/navigation'
import { createUser, registerPatient } from '@/lib/actions/patient.actions'
import { FieldType } from './PatientForm'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import {
    Doctors,
    GenderOptions,
    IdentificationTypes,
    PatientFormDefaultValues,
} from '@/constants'
import { Label } from '../ui/label'
import { SelectItem } from '../ui/select'
import Image from 'next/image'
import FileUploader from '../FileUploader'

const RegisterForm = ({ user }: { user: User }) => {
    const [isLoading, setLoading] = useState(false)
    const router = useRouter()

    // 1. Define your form.
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: '',
            email: '',
            phone: '',
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
        setLoading(true)

        let formData

        if (
            values.identificationDocument &&
            values.identificationDocument.length > 0
        ) {
            const blobFile = new Blob([values.identificationDocument[0]], {
                type: values.identificationDocument[0].type,
            })

            formData = new FormData()
            formData.append('blobFile', blobFile)
            formData.append('fileName', values.identificationDocument[0].name)
        }

        try {
            const patientData = {
                ...values,
                userId: user.$id,
                birthDate: new Date(values.birthDate),
                identificationDocument: formData,
            }

            const patient = await registerPatient(patientData)

            if (patient) router.push(`/patients/${user.$id}/new-appointment`)
        } catch (error) {
            console.warn(error)
        }
        setLoading(false)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-12 flex-1"
            >
                <section className=" space-y-4">
                    <h1 className="header">Welcome 👋</h1>
                    <p className="text-dark-700">
                        Let us know more about yourself.
                    </p>
                </section>
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Personal Information</h2>
                    </div>

                    <CustomFormField
                        control={form.control}
                        fieldType={FieldType.INPUT}
                        name="name"
                        label="Full Name"
                        placeholder="Jane Doe"
                        iconSrc="/assets/icons/user.svg"
                        iconAlt="user"
                    />

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            control={form.control}
                            fieldType={FieldType.INPUT}
                            name="email"
                            label="Email"
                            placeholder="example@example.com"
                            iconSrc="/assets/icons/email.svg"
                            iconAlt="email"
                        />
                        <CustomFormField
                            control={form.control}
                            fieldType={FieldType.PHONE}
                            name="phone"
                            label="Phone Number"
                            placeholder="(000) 123-0000"
                        />
                    </div>

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            control={form.control}
                            fieldType={FieldType.DATE_PICKER}
                            name="birthDate"
                            label="Date of Birth"
                        />
                        <CustomFormField
                            control={form.control}
                            fieldType={FieldType.SKELETON}
                            name="gender"
                            label="Gender"
                            renderSkeleton={(field) => (
                                <FormControl>
                                    <RadioGroup
                                        className="flex gap-6 h-11 xl:justify-between"
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        {GenderOptions.map((gender) => (
                                            <div
                                                key={gender}
                                                className="radio-group"
                                            >
                                                <RadioGroupItem
                                                    value={gender}
                                                    id={gender}
                                                />
                                                <Label
                                                    className="cursor-pointer"
                                                    htmlFor={gender}
                                                >
                                                    {gender}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            control={form.control}
                            fieldType={FieldType.INPUT}
                            name="address"
                            label="Address"
                            placeholder="66th street, Mars"
                        />
                        <CustomFormField
                            control={form.control}
                            fieldType={FieldType.INPUT}
                            name="occupation"
                            label="Occupation"
                            placeholder="Software Engineer"
                        />
                    </div>

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            control={form.control}
                            fieldType={FieldType.INPUT}
                            name="emergencyContactName"
                            label="Emergency Contact Name"
                            placeholder="Harry Potter"
                        />
                        <CustomFormField
                            control={form.control}
                            fieldType={FieldType.PHONE}
                            name="emergencyContactNumber"
                            label="Emergency Contact Number "
                            placeholder="(000) 123-0000"
                        />
                    </div>
                </section>
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Medical Information</h2>
                    </div>

                    <CustomFormField
                        control={form.control}
                        fieldType={FieldType.SELECT}
                        name="primaryPhysician"
                        label="Primary Physician"
                        placeholder="Select primary physician"
                    >
                        {Doctors.map((doctor) => (
                            <SelectItem key={doctor.name} value={doctor.name}>
                                <div className="cursor-pointer flex items-center gap-2">
                                    <Image
                                        src={doctor.image}
                                        alt={doctor.name + ' photo'}
                                        width={33}
                                        height={33}
                                        className="rounded-fullborder border-dark-500"
                                    />
                                    <div className="text-dark-800">
                                        {doctor.name}
                                    </div>
                                </div>
                            </SelectItem>
                        ))}
                    </CustomFormField>

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            control={form.control}
                            fieldType={FieldType.INPUT}
                            name="insuranceProvider"
                            label="Insurance Provider"
                            placeholder="Phenix Smart"
                        />
                        <CustomFormField
                            control={form.control}
                            fieldType={FieldType.INPUT}
                            name="insurancePolicyNumber"
                            label="Insurance Policy Number"
                            placeholder="ABC123111000"
                        />
                    </div>

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            control={form.control}
                            fieldType={FieldType.TEXTAREA}
                            name="allergies"
                            label="Allergies (if any)"
                            placeholder="Peanuts, penicillin, pollen"
                        />
                        <CustomFormField
                            control={form.control}
                            fieldType={FieldType.TEXTAREA}
                            name="currentMedication"
                            label="Current Medication (if any)"
                            placeholder="Paracetamole 500mg"
                        />
                    </div>

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            control={form.control}
                            fieldType={FieldType.TEXTAREA}
                            name="familyMedicalHistory"
                            label="Family Medical History"
                            placeholder="Mother had ..."
                        />
                        <CustomFormField
                            control={form.control}
                            fieldType={FieldType.TEXTAREA}
                            name="pastMedicalHistory"
                            label="Past Medical History"
                            placeholder="I used to take the heroin ... "
                        />
                    </div>
                </section>
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">
                            Identification and Verification{' '}
                        </h2>
                    </div>

                    <CustomFormField
                        control={form.control}
                        fieldType={FieldType.SELECT}
                        name="identificationType"
                        label="Identification Type"
                        placeholder="Select an identification type"
                    >
                        {IdentificationTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                                <span className="cursor-pointer"> {type}</span>
                            </SelectItem>
                        ))}
                    </CustomFormField>

                    <CustomFormField
                        control={form.control}
                        fieldType={FieldType.INPUT}
                        name="identificationNumber"
                        label="Identification Number"
                        placeholder="123111000"
                    />

                    <CustomFormField
                        control={form.control}
                        fieldType={FieldType.SKELETON}
                        name="identificationDocument"
                        label="Scanned copy of  Identification Document"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <FileUploader
                                    files={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                        )}
                    />
                </section>
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Consent and Privacy</h2>
                    </div>

                    <CustomFormField
                        control={form.control}
                        fieldType={FieldType.CHECKBOX}
                        name="treatmentConsent"
                        label="I consent to treatment"
                    />
                    <CustomFormField
                        control={form.control}
                        fieldType={FieldType.CHECKBOX}
                        name="disclosureConsent"
                        label="I consent to disclosure of information"
                    />
                    <CustomFormField
                        control={form.control}
                        fieldType={FieldType.CHECKBOX}
                        name="privacyConsent"
                        label="I consent to privacy policy"
                    />
                </section>

                <SubmitButton isLoading={isLoading}>
                    Submit and Continue
                </SubmitButton>
            </form>
        </Form>
    )
}

export default RegisterForm
