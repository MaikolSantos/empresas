const urlBase = "http://localhost:6278/";

async function allSectors() {
  try {
    const request = await fetch(urlBase + "sectors");
    const response = await request.json();

    return response;
  } catch (error) {
    return error;
  }
}

async function allUsersUnemployed(token) {
  try {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const request = await fetch(urlBase + "admin/out_of_work", options);
    const response = await request.json();

    return response;
  } catch (error) {
    return error;
  }
}

async function allCompanies() {
  try {
    const request = await fetch(urlBase + "companies");
    const response = await request.json();

    return response;
  } catch (error) {
    return error;
  }
}

async function register(data) {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const request = await fetch(urlBase + "auth/register", options);

    const response = await request.json();

    return response;
  } catch (error) {
    return error;
  }
}

async function login(data) {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const request = await fetch(urlBase + "auth/login", options);

    const response = await request.json();

    return response;
  } catch (error) {
    return error;
  }
}

async function isAdmin(token) {
  try {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const request = await fetch(urlBase + "auth/validate_user", options);
    const response = await request.json();

    return response;
  } catch (error) {
    return error;
  }
}

async function allDepartments(token) {
  try {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const request = await fetch(urlBase + "departments", options);
    const response = await request.json();

    return response;
  } catch (error) {
    return error;
  }
}

async function allUsers(token) {
  try {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const request = await fetch(urlBase + "users", options);
    const response = await request.json();

    return response;
  } catch (error) {
    return error;
  }
}

async function createDepartment(token, data) {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };

    const request = await fetch(urlBase + "departments", options);
    const response = await request.json();

    return response;
  } catch (error) {
    return error;
  }
}

async function editDepartment(token, data, id) {
  try {
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };

    const request = await fetch(`${urlBase}departments/${id}`, options);

    const response = await request.json();

    return response;
  } catch (error) {
    return error;
  }
}

async function editUser(token, data, id) {
  try {
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };

    const request = await fetch(`${urlBase}admin/update_user/${id}`, options);

    const response = await request.json();

    return response;
  } catch (error) {
    return error;
  }
}

async function deleteDepartment(token, id) {
  try {
    const options = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const request = await fetch(`${urlBase}departments/${id}`, options);

    const response = await request.json();

    return response;
  } catch (error) {
    return error;
  }
}

async function deleteUser(token, id) {
  try {
    const options = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const request = await fetch(`${urlBase}admin/delete_user/${id}`, options);

    const response = await request.json();

    return response;
  } catch (error) {
    return error;
  }
}

async function dimissUser(token, id) {
  try {
    const options = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const request = await fetch(`${urlBase}departments/dismiss/${id}`, options);

    const response = await request.json();

    return response;
  } catch (error) {
    return error;
  }
}

async function hireUser(token, data) {
  try {
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };

    const request = await fetch(`${urlBase}departments/hire/`, options);

    const response = await request.json();

    return response;
  } catch (error) {
    return error;
  }
}

async function dataUser(token) {
  try {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const request = await fetch(`${urlBase}users/profile`, options);

    const response = await request.json();

    return response;
  } catch (error) {
    return error;
  }
}

async function updateUser(token, data) {
  try {
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };

    const request = await fetch(`${urlBase}users`, options);
    
    const response = await request.json();

    return response;
  } catch (error) {
    return error;
  }
}

async function coworkers(token) {
  try {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const request = await fetch(`${urlBase}users/departments/coworkers`, options);
    
    const response = await request.json();
    
    return response;
  } catch (error) {
    return error;
  }
}

export {
  allSectors,
  allUsersUnemployed,
  allCompanies,
  register,
  login,
  isAdmin,
  allDepartments,
  allUsers,
  createDepartment,
  editDepartment,
  editUser,
  deleteDepartment,
  deleteUser,
  hireUser,
  dimissUser,
  dataUser,
  updateUser,
  coworkers
};
