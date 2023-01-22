import { createHeaderPages } from "../../scripts/createHeaderPages.js";
import { iconEdit } from "../../scripts/icons.js";
import {
  allCompanies,
  coworkers,
  dataUser,
  login,
  updateUser,
} from "../../scripts/requests.js";
import { verifyTypeUser } from "../../scripts/verifyTypeUser.js";
import { createModal } from "../../scripts/createModal.js";
import { createToast } from "../../scripts/createToast.js";

verifyTypeUser();

const body = document.body;
const root = document.querySelector(".root");

const token = localStorage.getItem("token");

function renderHeaderPage() {
  const headerLinks = [
    {
      type: "outline",
      href: "/src/pages/home/",
      text: "Logout",
    },
  ];

  const headerPage = createHeaderPages(headerLinks);

  body.insertAdjacentElement("afterbegin", headerPage);
}
renderHeaderPage();

function logout() {
  const buttonLogout = document.querySelector(".nav-pages a");

  buttonLogout.addEventListener("click", () => {
    localStorage.removeItem("token");
  });
}
logout();

async function renderDataUser() {
  const user = await dataUser(token);

  const wrapper = document.createElement("div");
  wrapper.classList = "data-wrapper";

  const top = document.createElement("div");
  top.classList = "data-top";

  const name = document.createElement("h2");
  name.innerText = user.username;

  const buttonEdit = document.createElement("button");
  buttonEdit.classList = "btn btn-icon";
  buttonEdit.innerHTML = iconEdit;
  buttonEdit.addEventListener("click", () => {
    const contentModal = document.createElement("div");

    const title = document.createElement("h2");
    title.innerText = "Editar Perfil";

    const form = document.createElement("form");

    const inputUserName = document.createElement("input");
    inputUserName.type = "text";
    inputUserName.classList = "input";
    inputUserName.name = "username";
    inputUserName.id = "username";
    inputUserName.placeholder = "Seu nome";
    inputUserName.value = user.username;
    inputUserName.setAttribute("required", "");

    const inputEmail = document.createElement("input");
    inputEmail.type = "email";
    inputEmail.classList = "input";
    inputEmail.name = "email";
    inputEmail.id = "email";
    inputEmail.placeholder = "Seu email";
    inputEmail.value = user.email;
    inputEmail.setAttribute("required", "");

    const inputPassword = document.createElement("input");
    inputPassword.type = "password";
    inputPassword.classList = "input";
    inputPassword.name = "password";
    inputPassword.id = "password";
    inputPassword.placeholder = "Seu senha";
    inputPassword.setAttribute("required", "");

    const button = document.createElement("button");
    button.classList = "btn btn-brand";
    button.innerText = "Salvar alterações";
    button.type = "submit";

    form.append(inputUserName, inputEmail, inputPassword, button);

    contentModal.append(title, form);

    const modal = createModal(contentModal);

    modal.showModal();

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = {};

      const inputs = [...form.elements];

      inputs.forEach((input) => {
        if (input.name) {
          data[input.name] = input.value;
        }
      });

      console.log(data);

      const update = await updateUser(token, data);

      if (update.error) {
        const toast = createToast(update.error, "alert");

        body.append(toast);

        setInterval(() => {
          toast.remove();
        }, 5000);
      } else {
        modal.remove();
        window.location.reload();
      }
    });
  });

  top.append(name, buttonEdit);

  const bottom = document.createElement("div");
  bottom.classList = "data-bottom";

  const email = document.createElement("span");
  email.innerText = user.email;

  const level = document.createElement("span");
  level.innerText = user.professional_level || " ";

  const kind = document.createElement("span");
  kind.innerText = user.kind_of_work || " ";

  bottom.append(email, level, kind);

  wrapper.append(top, bottom);

  root.insertAdjacentElement("afterbegin", wrapper);
}
renderDataUser();

async function renderCoworkers() {
  const ulCoworkers = document.querySelector(".coworkers");

  const dataDepartment = await coworkers(token);

  if (dataDepartment.length > 0) {
    const companies = await allCompanies();

    const company = companies.find(
      (item) => dataDepartment[0].company_uuid === item.uuid
    );

    const users = dataDepartment[0].users;

    ulCoworkers.insertAdjacentHTML(
      "beforebegin",
      `
      <div class="departmentDescription">${company.name} - ${dataDepartment[0].name}</div>
    `
    );

    ulCoworkers.innerHTML = "";

    users.forEach((user) => {
      ulCoworkers.insertAdjacentHTML(
        "beforeend",
        `
          <li class="coworker">
          <h3>${user.username}</h3>
          <p>${user.professional_level}</p>
          </li>
        `
      );
    });
  } else {
    ulCoworkers.insertAdjacentHTML(
      "beforeend",
      `
        <li class="not-hired">Você ainda não foi contratado</li>
      `
    );
  }
}
renderCoworkers()
