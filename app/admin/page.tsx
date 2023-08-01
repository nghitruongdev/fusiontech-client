'use client'

import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import useUploadImage, { uploadUtils } from '@/hooks/useUploadImage'

const AdminPage = () => {
    const { user } = useAuthUser()
    // const image = {
    // "url": "https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fproducts%2FScreenshot%202023-04-18%20at%2015.53.17.png-795632898549.6527?alt=media&token=f35fcc08-a87b-4d1c-bc03-7b98c97fef92",
    // "storagePath": "images/products//Screenshot 2023-04-18 at 15.53.17.png-795632898549.6527",
    // "name": "Screenshot 2023-04-18 at 15.53.17.png"
    // }

    return (
        <div>
        </div>
    )
}
export default AdminPage


