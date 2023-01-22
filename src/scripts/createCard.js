import { renderDepartments, renderUsers } from "../pages/admin/index.js";
import { createModal } from "./createModal.js";
import { iconDelete, iconEdit, iconView } from "./icons.js";
import {
  allDepartments,
  allUsers,
  allUsersUnemployed,
  deleteDepartment,
  deleteUser,
  dimissUser,
  editDepartment,
  editUser,
  hireUser,
} from "./requests.js";

const token = localStorage.getItem("token");

function createCardDepartment(department) {
  const li = document.createElement("li");
  li.classList = "department list__item";
  li.id = department.uuid;
  li.innerHTML = `
    <h3>${department.name}</h3>
    <p>${department.description}</p>
    <p>${department.companies.name}</p>
  `;

  const buttons = document.createElement("div");
  buttons.classList = "buttons";

  const buttonView = document.createElement("button");
  buttonView.innerHTML = iconView;
  buttonView.classList = "view btn btn-icon";
  buttonView.addEventListener("click", async () => {
    const contentModal = document.createElement("div");
    contentModal.classList = 'content-modal-view'

    const title = document.createElement("h2");
    title.innerText = department.name;

    const formWrapper = document.createElement("div");
    formWrapper.classList = "form-wrapper";

    const descriptionWrapper = document.createElement("div");
    descriptionWrapper.classList = "description-wrapper";

    const descriptionDepartment = document.createElement("h3");
    descriptionDepartment.innerText = department.description;

    const departmentCompany = document.createElement("p");
    departmentCompany.innerText = department.companies.name;

    descriptionWrapper.append(descriptionDepartment, departmentCompany);

    const form = document.createElement("form");

    const userSelect = document.createElement("select");
    userSelect.classList = "input";
    userSelect.name = "user_uuid";
    userSelect.id = "user_uuid";
    userSelect.setAttribute("required", "");

    async function renderUserSelect() {
      userSelect.innerHTML = "";
      const userUnemployed = await allUsersUnemployed(token);
      userSelect.insertAdjacentHTML(
        "beforeend",
        `
        <option value="">Selecionar Usuário</option>
      `
      );
      userUnemployed.forEach((user) => {
        userSelect.insertAdjacentHTML(
          "beforeend",
          `
          <option value="${user.uuid}">${user.username}</option>
        `
        );
      });
    }
    renderUserSelect();

    const button = document.createElement("button");
    button.classList = "btn btn-sucess";
    button.innerText = "Contratar";
    button.type = "submit";

    form.append(userSelect, button);

    formWrapper.append(descriptionWrapper, form);

    const ulDepartmentUsers = document.createElement("ul");
    ulDepartmentUsers.classList = "departmentUsers";

    async function renderDepartmentUsers() {
      const users = await allUsers(token);

      const departmentUsers = users.filter(
        (user) => user.department_uuid === department.uuid
      );
      ulDepartmentUsers.innerHTML = "";

      departmentUsers.forEach((user) => {
        ulDepartmentUsers.insertAdjacentHTML(
          "beforeend",
          `
          <li data-user-uuid=${user.uuid}>
            <h3>${user.username}</h3>
            <p>${department.description}</p>
            <p>${department.companies.name}</p>
            <button class="btn btn-alert">Desligar</button>
          </li>
        `
        );
      });
    }
    renderDepartmentUsers();

    ulDepartmentUsers.addEventListener("click", async (e) => {
      if (e.target.tagName === "BUTTON") {
        const id = e.target.closest("li").dataset.userUuid;

        await dimissUser(token, id);
        renderUserSelect();
        renderDepartmentUsers();
        renderDepartments()
        renderUsers();
      }
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = {
        user_uuid: form.elements[0].value,
        department_uuid: department.uuid,
      };

      await hireUser(token, data);

      renderUserSelect();
      renderDepartmentUsers();
      renderUsers();

      form.reset();
    });

    contentModal.append(title, formWrapper, ulDepartmentUsers);

    const modal = createModal(contentModal);

    modal.showModal();
  });

  const buttonEdit = document.createElement("button");
  buttonEdit.innerHTML = iconEdit;
  buttonEdit.classList = "edit btn btn-icon";
  buttonEdit.addEventListener("click", () => {
    const contentModal = document.createElement("div");

    const title = document.createElement("h2");
    title.innerText = "Editar Departamento";

    const form = document.createElement("form");

    const description = document.createElement("textarea");
    description.classList = "input";
    description.name = "description";
    description.id = "description";
    description.placeholder = "Nome do departamento";
    description.value = department.description;
    description.setAttribute("required", "");

    const button = document.createElement("button");
    button.classList = "btn btn-brand";
    button.innerText = "Salvar alterações";
    button.type = "submit";

    form.append(description, button);

    contentModal.append(title, form);

    const modal = createModal(contentModal);

    modal.showModal();

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const inputValue = [...form.elements][0].value;

      const data = { description: inputValue };

      await editDepartment(token, data, department.uuid);

      const departments = await allDepartments(token);

      const companyFilter = localStorage.getItem("companyFilter");

      if(companyFilter) {
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

  const buttonDelete = document.createElement("button");
  buttonDelete.innerHTML = iconDelete;
  buttonDelete.classList = "delete btn btn-icon";
  buttonDelete.addEventListener("click", () => {
    const contentModal = document.createElement("div");
    contentModal.classList = "alert";

    const alert = document.createElement("p");
    alert.innerText = `Realmente deseja deletar o Departamento ${department.name} e demitir seus funcionários?`;

    const button = document.createElement("button");
    button.classList = "btn btn-sucess";
    button.innerText = "Confirmar";

    contentModal.append(alert, button);

    const modal = createModal(contentModal);

    modal.showModal();

    button.addEventListener("click", async () => {
      await deleteDepartment(token, department.uuid);

      const departments = await allDepartments(token);

      const companyFilter = localStorage.getItem("companyFilter");

      if(companyFilter) {
        const filter = departments.filter(
          (department) => department.companies.uuid === companyFilter
        );

        renderDepartments(filter);
      } else {

        renderDepartments(departments);
      }

      renderUsers()

      modal.remove();
    });
  });

  buttons.append(buttonView, buttonEdit, buttonDelete);

  li.append(buttons);

  return li;
}

function createCardUser(user, listDepartments) {
  const level = user.professional_level || "júnior";

  const kind = user.kind_of_work || "-";

  const departmentFound = listDepartments.find(
    (department) => department.uuid === user.department_uuid
  );

  let company;

  if (departmentFound) {
    company = departmentFound.companies.name;
  } else {
    company = "Desempregado";
  }

  const li = document.createElement("li");
  li.classList = "employee list__item";
  li.id = user.uuid;
  li.innerHTML = `
    <h3>${user.username}</h3>
    <p>${level}</p>
    <p>${kind} | ${company}</p>
  `;

  const buttons = document.createElement("div");
  buttons.classList = "buttons";

  const buttonEdit = document.createElement("button");
  buttonEdit.innerHTML = iconEdit;
  buttonEdit.classList = "edit btn btn-icon";
  buttonEdit.addEventListener("click", () => {
    const contentModal = document.createElement("div");

    const title = document.createElement("h2");
    title.innerText = "Editar Usuário";

    const form = document.createElement("form");

    const kind = document.createElement("select");
    kind.classList = "input";
    kind.name = "kind_of_work";
    kind.id = "kind_of_work";
    kind.setAttribute("required", "");
    const optionsKind = [
      "Selecionar modalidade de trabalho",
      "home office",
      "presencial",
      "híbrido",
    ];
    optionsKind.forEach((item, index) => {
      const value = !index ? "" : item;
      kind.insertAdjacentHTML(
        "beforeend",
        `
          <option value="${value}">${item}</option>
        `
      );
    });

    const level = document.createElement("select");
    level.classList = "input";
    level.name = "professional_level";
    level.id = "professional_level";
    level.setAttribute("required", "");
    const optionsLevel = [
      "Selecionar nível profissional",
      "estágio",
      "júnior",
      "pleno",
      "sênior",
    ];
    optionsLevel.forEach((item, index) => {
      const value = !index ? "" : item;
      level.insertAdjacentHTML(
        "beforeend",
        `
          <option value="${value}">${item}</option>
        `
      );
    });

    const button = document.createElement("button");
    button.classList = "btn btn-brand";
    button.innerText = "Editar";
    button.type = "submit";

    form.append(kind, level, button);

    contentModal.append(title, form);

    const modal = createModal(contentModal);

    modal.showModal();

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = {};

      const inputs = [...form.elements];

      inputs.forEach((input) => {
        if (input.name) data[input.name] = input.value;
      });

      await editUser(token, data, user.uuid);

      renderUsers();

      modal.remove();
    });
  });

  const buttonDelete = document.createElement("button");
  buttonDelete.innerHTML = iconDelete;
  buttonDelete.classList = "delete btn btn-icon";
  buttonDelete.addEventListener("click", () => {
    const contentModal = document.createElement("div");
    contentModal.classList = "alert";

    const alert = document.createElement("p");
    alert.innerText = `Realmente deseja remover o usuário ${user.username}?`;

    const button = document.createElement("button");
    button.classList = "btn btn-sucess";
    button.innerText = "Deletar";

    contentModal.append(alert, button);

    const modal = createModal(contentModal);

    modal.showModal();

    button.addEventListener("click", async () => {
      await deleteUser(token, user.uuid);

      renderUsers();

      modal.remove();
    });
  });

  buttons.append(buttonEdit, buttonDelete);

  li.append(buttons);

  return li;
}

export { createCardDepartment, createCardUser };
