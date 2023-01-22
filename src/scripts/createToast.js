function createToast(text, type = 'sucess') {
  const toast = document.createElement('div')

  type === 'sucess' ? toast.classList = 'toast sucess' : toast.classList = 'toast alert'

  const message = document.createElement('p')
  message.innerText = text

  toast.append(message)
  
  return toast
}

export { createToast }