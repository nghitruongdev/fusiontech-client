import useUpload from '@/hooks/useUpload'
import { FirebaseImage } from 'types'

const type = {
  products: `images/products/`,
  variants: `images/variants/`,
  categories: `images/categories`,
  brands: `images/brands`,
  users: `images/users`,
}

const useUploadImage = ({ resource }: { resource: keyof typeof type }) => {
  const { upload } = useUpload()

  const uploadImage = async (file: File) => {
    const fullPath = `${type[resource]}/${file.name}-${
      Date.now() * Math.random()
    }`
    const url = await upload(fullPath, file)
    return {
      url: url ?? '',
      storagePath: fullPath,
      name: file.name,
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

export default useUploadImage
