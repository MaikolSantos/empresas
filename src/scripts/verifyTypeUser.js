import { isAdmin } from "./requests.js";

async function verifyTypeUser() {
  const token = localStorage.getItem("token");
  const page = window.location.pathname;

  if (page.includes("admin")) {
    const token = localStorage.getItem("token");
    const userToken = await isAdmin(token);
    !userToken.is_admin ? window.location.replace("/src/pages/login/") : "";
  } 

  if(page.includes("user")) {
    const userToken = await isAdmin(token);
    token && !userToken.is_admin ? "" : window.location.replace("/src/pages/login/")
  }
}

export { verifyTypeUser };
