import { firebaseStorage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const useUpload = () => {
    const uploadFile = async (
        path: string,
        file: Blob | Uint8Array | ArrayBuffer,
    ) => {
        // Create a root reference
        const storage = firebaseStorage;

        const storageRef = ref(storage, path);
        // 'file' comes from the Blob or File API
        try {
            const uploadTask = await uploadBytes(storageRef, file);
            return await getDownloadURL(uploadTask.ref);
        } catch (err) {
            console.error(err);
        }
    };
    return {
        upload: uploadFile,
    };
};
export default useUpload;
