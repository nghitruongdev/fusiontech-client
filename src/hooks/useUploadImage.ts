import { FirebaseImage } from 'types'
import { firebaseStorage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export const IMAGE_BASE_PATH = {
  products: `images/products`,
  variants: `images/variants`,
  categories: `images/categories`,
  brands: `images/brands`,
  users: `images/users`,
}

const useUploadImage = ({
  resource,
}: {
  resource: keyof typeof IMAGE_BASE_PATH
}) => {
  const { upload } = uploadUtils
  const uploadImage = async (file: File) => {
    const fullPath = `${IMAGE_BASE_PATH[resource]}/${file.name}-${
      Date.now() * Math.random()
    }`
    const url = await upload(fullPath, file)
    return {
      url: url ?? '',
    }
  }

  const uploadImages = (files: File[]) => {
    return Promise.all(files.filter((file) => !!file).map(uploadImage))
  }

  const removeImages = async (removedImages: FirebaseImage[]) => {
    console.warn(`Have not implement delete image from firebase`)
  }
  return {
    uploadImages,
    removeImages,
  }
}

const uploadFile = async (
  path: string,
  file: Blob | Uint8Array | ArrayBuffer,
) => {
  // Create a root reference
  const storage = firebaseStorage

  const storageRef = ref(storage, path)
  // 'file' comes from the Blob or File API
  try {
    const uploadTask = await uploadBytes(storageRef, file)
    return await getDownloadURL(uploadTask.ref)
  } catch (err) {
    console.error(err)
  }
}

function getPath(url: string) {
  const lastSlashIndex = url.lastIndexOf('/')
  const questionMarkIndex = url.indexOf('?')

  if (lastSlashIndex >= 0 && questionMarkIndex >= 0) {
    const encodedName = url.substring(lastSlashIndex + 1, questionMarkIndex)

    // Decode the URL component to replace %2F with forward slash
    const decodedName = decodeURIComponent(encodedName)

    return decodedName
  }
}

function getName(
  basePath: keyof typeof IMAGE_BASE_PATH,
  url?: string,
  path?: string,
) {
  const filePath = url ? getPath(url) : path
  if (!filePath) {
    console.error('Missing url and path parameters')
    return
  }

  return filePath
    .substring(0, filePath.lastIndexOf('-'))
    .replace(`${IMAGE_BASE_PATH[basePath]}/`, '')
}

export default useUploadImage

export const uploadUtils = {
  upload: uploadFile,
  getPath,
  getName,
}
