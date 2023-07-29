import useUpload from "@/hooks/useUpload";
import { FirebaseImage } from "types";

const path = {
    products: `images/products/`,
    variants: `images/variants/`,
};

const useUploadImage = ({ type }: { type: keyof typeof path }) => {
    const { upload } = useUpload();

    const uploadImage = async (file: File) => {
        const fullPath = `${path[type]}/${file.name}-${
            Date.now() * Math.random()
        }`;
        const url = await upload(fullPath, file);
        return {
            url: url ?? "",
            storagePath: fullPath,
            name: file.name,
        };
    };

    const uploadImages = (files: File[]) => {
        return Promise.all(files.filter((file) => !!file).map(uploadImage));
    };

    const removeImages = async (removedImages: FirebaseImage[]) => {
        console.warn(`Have not implement delete image from firebase`);
    };
    return {
        uploadImages,
        removeImages,
    };
};

export default useUploadImage;
