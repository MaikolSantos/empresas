import { createHeaderPages } from "../../scripts/createHeaderPages.js";
import { allSectors, allCompanies } from "../../scripts/requests.js";

const body = document.body;
const sectors = await allSectors();
const companies = await allCompanies();
const selectSectors = document.querySelector("#sectors");

function renderHeaderPage() {
  const headerLinks = [
    {
      type: "outline",
      href: "/src/pages/login/",
      text: "Login",
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

function renderSectors(listSectors) {
  listSectors.forEach((sector) => {
    selectSectors.insertAdjacentHTML(
      "beforeend",
      `
        <option value="${sector.uuid}">${sector.description}</option>
      `
    );
  });
}
renderSectors(sectors);

function renderCompanies(listCompanies) {
  const ulCompanies = document.querySelector(".companies");

  ulCompanies.innerHTML = "";

  listCompanies.forEach((company) => {
    ulCompanies.insertAdjacentHTML(
      "beforeend",
      `
        <li>
          <h2>${company.name}</h2>
          <div>
            <small class="hours">${company.opening_hours} horas</small>
            <small class="sector">${company.sectors.description}</small>
          </div>
        </li>
      `
    );
  });
}
renderCompanies(companies);

selectSectors.addEventListener("change", () => {
  const value = selectSectors.value;

  const filterCompanies = companies.filter(
    (company) => value === company.sectors.uuid
  );

  filterCompanies.length === 0 ? renderCompanies(companies): renderCompanies(filterCompanies);
});
