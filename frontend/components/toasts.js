import { toast } from 'react-toastify'

export function toastServerError() {
  toast.error('A server error has occured!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
}

export default {
  toastServerError,
}