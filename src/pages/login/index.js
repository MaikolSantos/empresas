import { createHeaderPages } from "../../scripts/createHeaderPages.js";
import { isAdmin, login } from "../../scripts/requests.js";
import { createToast } from "../../scripts/createToast.js";

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
      href: "/src/pages/register/",
      text: "Cadastro",
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

  const data = await login(user);

  const token = data.token;

  localStorage.setItem("token", token);

  if (data.error) {
    const toast = createToast(data.error, "alert");

    body.append(toast);

    setTimeout(() => {
      toast.remove();
    }, 5000);
  } else {
    const user = await isAdmin(token);

    form.reset();

    user.is_admin
      ? window.location.replace("/src/pages/admin/")
      : window.location.replace("/src/pages/user/");
  }
});
