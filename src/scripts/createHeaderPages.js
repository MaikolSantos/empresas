function createHeaderPages(list) {
  const header = document.createElement("header");
  header.classList = "headerPages";

  const nav = document.createElement("nav");
  nav.classList = "container";

  const menu = document.createElement("div");
  menu.classList = "menu";

  const logo = document.createElement("img");
  logo.classList = "logo";
  logo.src = "/src/assets/img/logo.svg";
  logo.alt = "Kenzie Empresas";

  const btnMenu = document.createElement("button");
  btnMenu.classList = "btn-menu";
  btnMenu.innerHTML = `<div></div><div></div><div></div>`;

  const ul = document.createElement("ul");
  ul.classList = "nav-pages";

  list.forEach((item) => {
    ul.insertAdjacentHTML(
      "beforeend",
      `
        <li>
          <a class="btn btn-${item.type}" href="${item.href}">${item.text}</a>
        </li>
        `
    );
  });

  menu.append(logo, btnMenu);
  nav.append(menu, ul);
  header.append(nav);

  btnMenu.addEventListener('click', () => {
    btnMenu.classList.toggle('open')
    ul.classList.toggle('open')
  })

  return header;
}

export { createHeaderPages };
