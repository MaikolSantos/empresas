import { createHeaderPages } from "../../scripts/createHeaderPages.js";
import { createToast } from "../../scripts/createToast.js";
import { register } from "../../scripts/requests.js";

const body = document.body;
const form = document.querySelector("form");

function renderHeaderPage() {
  const headerLinks = [
    {
      type: "outline",
      href: "/src/pages/home/",
      text: "Home",
    },
    {
      type: "brand",
      href: "/src/pages/login/",
      text: "Login",
    },
  ];

  const headerPage = createHeaderPages(headerLinks);

  body.insertAdjacentElement("afterbegin", headerPage);
}
renderHeaderPage();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const elements = [...form.elements];

  const user = {};

  elements.forEach((element) => {
    if (element.name) {
      user[element.name] = element.value;
    }
  });

  const data = await register(user);

  if (data.error) {
    const toast = createToast(data.error[0], "alert")

    body.append(toast);

    setTimeout(()=> {
      toast.remove()
    }, 5000)

  } else {
    const toast = createToast('Usuário Cadastrado', 'sucess')
    body.append(toast);
    
    form.reset()

    setTimeout(()=> {
      toast.remove()
      window.location.replace('/src/pages/login/')
    }, 5000)
  }
});
