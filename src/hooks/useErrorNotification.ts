import { useNotification } from "@refinedev/core"
import { AxiosError } from "axios"
import { useCallback } from "react"

const useErrorNotification = () => {
    const {open} = useNotification()

    const onError = useCallback((err: TypeError)=>{
        console.error(err)
        if(err.name === 'TypeError'){
               open?.({
            type: 'error',
            description: "Trình duyệt đã xảy ra lỗi. Vui lòng thử lại sau.",
            message: "Trình duyệt không thể tải dữ liệu - 500"
            })
            return
        }
        open?.({
            type: 'error',
            message: err.name,
            description: err.message
        })
    },[open])
    return {
        onError
    }
}
export default useErrorNotification
