import axios from '$/utils/httpclient'

export type AudioFile = {
    id: number
    fileName: string
}

const uploadAudioBlob = async (blob: Blob) => {
    const { fileName, url } = (await axios.get('/audiofiles/uploadrequest')).data

    const uploadResponse = (await axios.put(url, blob, { transformRequest: (data, headers) => {
        // Including the authorization header here will result in an error
        delete headers.Authorization;
        return data;
    } }))

    if (uploadResponse.status !== 200)
        throw new Error('Failed to upload audio file')

    return fileName
}

const create = async (fileName: string) => {
    return (await axios.post('/audiofiles', { fileName })).data
}

export default {
    uploadAudioBlob,
    create
}