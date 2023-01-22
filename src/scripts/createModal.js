import { iconClose } from "./icons.js"

function createModal(element) {
  const body = document.body
  const modal = document.createElement('dialog')
  const buttonClose = document.createElement("button")
  buttonClose.classList = 'btn btn-icon'
  buttonClose.innerHTML = iconClose
  buttonClose.addEventListener("click", () => {
    modal.remove()
  })
  
  modal.append(buttonClose, element)
  body.append(modal)

  return modal
}

export { createModal }