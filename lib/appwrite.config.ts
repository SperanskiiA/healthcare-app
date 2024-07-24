import * as sdk from 'node-appwrite'

export const {
    APPWRITE_ID,
    APPWRITE_DB_ID,
    APPWRITE_API_KEY,
    NEXT_PUBLIC_APPWRITE_STORAGE_ID: BUCKET_ID,
    PATIENT_COLLECTION_ID,
    DOCTOR_COLLECTION_ID,
    APPOINTMENT_COLLECTION_ID,
    NEXT_PUBLIC_APPWRITE_ENDPOINT: ENDPOINT,
} = process.env

const client = new sdk.Client()

client.setEndpoint(ENDPOINT!).setProject(APPWRITE_ID!).setKey(APPWRITE_API_KEY!)

export const databases = new sdk.Databases(client)

export const storage = new sdk.Storage(client)

export const users = new sdk.Users(client)

export const messaging = new sdk.Messaging(client)
