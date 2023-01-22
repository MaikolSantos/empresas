import { verifyTypeUser } from "../../scripts/verifyTypeUser.js";
import { createHeaderPages } from "../../scripts/createHeaderPages.js";
import {
  allCompanies,
  allDepartments,
  allUsers,
  createDepartment,
} from "../../scripts/requests.js";
import {
  createCardDepartment,
  createCardUser,
} from "../../scripts/createCard.js";
import { createModal } from "../../scripts/createModal.js";

verifyTypeUser();

const body = document.body;

const token = localStorage.getItem("token");

const departments = await allDepartments(token);
const companies = await allCompanies();

const selectCompanies = document.querySelector("#companies");
const ulDepartments = document.querySelector(".departments");
const ulUsers = document.querySelector(".employees");
const buttonCreateDepartment = document.querySelector(".createDepartment");

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
    localStorage.removeItem("companyFilter");
  });
}
logout();

async function renderCompaniesSelect() {
  const companies = await allCompanies();

  companies.forEach((company) => {
    selectCompanies.insertAdjacentHTML(
      "beforeend",
      `
    <option value="${company.uuid}">${company.name}</option>
    `
    );
  });
}
renderCompaniesSelect();

export async function renderDepartments(list) {
  ulDepartments.innerHTML = "";

  const listItems = list || departments;

  if (listItems.length === 0) {
    ulDepartments.innerHTML = `
    <li>Nenhum departamento cadastrado!</li>
    `;
  } else {
    listItems.forEach((department) => {
      ulDepartments.appendChild(createCardDepartment(department));
    });
  }
}
renderDepartments();

export async function renderUsers(list) {
  const users = await allUsers(token);

  ulUsers.innerHTML = "";

  const listItems = list || users;

  listItems.forEach((user) => {
    if(user.username != 'ADMIN') {
      ulUsers.appendChild(createCardUser(user, departments));
    }
  });
}
renderUsers();

function chooseCompany() {
  selectCompanies.addEventListener("change", async () => {
    const departments = await allDepartments(token);
    if (!selectCompanies.value) {
      localStorage.removeItem("companyFilter");
      renderDepartments(departments);
    } else {
      const companyFilter = departments.filter(
        (department) => department.companies.uuid === selectCompanies.value
      );

      localStorage.setItem("companyFilter", selectCompanies.value);

      renderDepartments(companyFilter);
    }
  });
}
chooseCompany();

buttonCreateDepartment.addEventListener("click", () => {
  const contentModal = document.createElement("div");

  const title = document.createElement("h2");
  title.innerText = "Criar Departamento";

  const form = document.createElement("form");

  const departmentName = document.createElement("input");
  departmentName.classList = "input";
  departmentName.type = "text";
  departmentName.name = "name";
  departmentName.id = "name";
  departmentName.placeholder = "Nome do departamento";
  departmentName.setAttribute("required", "");

  const departmentDescription = document.createElement("input");
  departmentDescription.classList = "input";
  departmentDescription.type = "text";
  departmentDescription.name = "description";
  departmentDescription.id = "description";
  departmentDescription.placeholder = "Descrição";
  departmentDescription.setAttribute("required", "");

  const company = document.createElement("select");
  company.classList = "input";
  company.name = "company_uuid";
  company.id = "company_uuid";
  company.setAttribute("required", "");
  company.insertAdjacentHTML(
    "beforeend",
    `<option value="">Selecionar Empresa</option>`
  );

  companies.forEach((item) => {
    company.insertAdjacentHTML(
      "beforeend",
      `<option value="${item.uuid}">${item.name}</option>`
    );
  });

  const buttonCreate = document.createElement("button");
  buttonCreate.classList = "btn btn-brand";
  buttonCreate.innerText = "Criar Departamento";
  buttonCreate.type = "submit";

  form.append(departmentName, departmentDescription, company, buttonCreate);

  contentModal.append(title, form);

  const modal = createModal(contentModal);

  modal.showModal();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const inputs = [...form.elements];
    const data = {};

    inputs.forEach((input) => {
      if (input.name) {
        data[input.name] = input.value;
      }
    });

    await createDepartment(token, data);

    const departments = await allDepartments(token);

    const companyFilter = localStorage.getItem("companyFilter");

    if (companyFilter) {
      const filter = departments.filter(
        (department) => department.companies.uuid === companyFilter
      );

      renderDepartments(filter);
    } else {
      renderDepartments(departments);
    }

    modal.remove();
  });
});
