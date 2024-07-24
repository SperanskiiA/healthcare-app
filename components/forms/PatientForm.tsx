'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Form } from '@/components/ui/form'

import CustomFormField from '../CustomFormField'
import SubmitButton from '../SubmitButton'
import { useState } from 'react'
import { UserFormValidation } from '@/lib/validation'
import { useRouter } from 'next/navigation'
import { createUser } from '@/lib/actions/patient.actions'

export enum FieldType {
    INPUT = 'input',
    CHECKBOX = 'checkbox',
    TEXTAREA = 'textarea',
    PHONE = 'phoneInput',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton',
}

const PatientForm = () => {
    const [isLoading, setLoading] = useState(false)
    const router = useRouter()

    // 1. Define your form.
    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
        },
    })

    // 2. Define a submit handler.
    async function onSubmit({
        name,
        email,
        phone,
    }: z.infer<typeof UserFormValidation>) {
        setLoading(true)

        try {
            const userData = {
                name,
                email,
                phone,
            }

            const user = await createUser(userData)

            if (user) router.push(`/patients/${user.$id}/register`)
        } catch (error) {
            console.warn(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 flex-1"
            >
                <section className="mb-12 space-y-4">
                    <h1 className="header">Hi There! 👋</h1>
                    <p className="text-dark-700">
                        Schedule your first appointment.
                    </p>
                </section>
                <CustomFormField
                    control={form.control}
                    fieldType={FieldType.INPUT}
                    name="name"
                    label="Full Name"
                    placeholder="Jane Doe"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />
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
                <SubmitButton isLoading={isLoading}>Get Started!</SubmitButton>
            </form>
        </Form>
    )
}

export default PatientForm
