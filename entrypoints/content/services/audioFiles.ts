import axios from '$/utils/httpclient'

export type AudioFile = {
    id: number
    fileName: string
}

/**
 * 
 * @description Uploads an audio file (ogg format with opus codec) to the server and returns the S3 64-character random file name.
 * @param blob The audio file as a Blob object, which is the result of the recording process.
 * @returns A Promise that resolves to the file name of the uploaded audio file.
 * @throws An error if the upload fails.
 */
const uploadAudioBlob = async (blob: Blob) => {
    const { fileName, url } = (await axios.get('/audiofiles/uploadrequest')).data

    const uploadResponse = (await axios.put(url, blob, { transformRequest: (data, headers) => {
        // Including the authorization header here will result in an error, so we remove it for this request
        // since the interceptor will add it automatically
        delete headers.Authorization;
        return data;
    } }))

    if (uploadResponse.status !== 200)
        throw new Error('Failed to upload audio file')

    return fileName
}

/**
 * @description Creates a new AudioFile entry in the database with the provided file name.
 * @param fileName The 64-character random file name of the audio file from S3.
 * @returns A Promise that resolves to the created AudioFile object.
 */
const create = async (fileName: string) => {
    // This should happen AFTER the binary upload of an audio file so the DB won't have any orphaned entries
    return (await axios.post('/audiofiles', { fileName })).data
}

export default {
    uploadAudioBlob,
    create
}