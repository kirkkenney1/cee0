// DEV ENVIRONMENT //
// const apiUrl =
//   "https://convedodev.appiancloud.com/suite/webapi/create-customer";
// const apiKey =
//   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiMzJkZjQwMS0wNWI3LTQ4NTYtODRiZi02NWJiYTUyYjY4MTgifQ.ABRVQhw9yk2NzoWENrwbMSfCzxme_agDNzofeJ-Nw0A";

// TEST ENVIRONMENT
const apiUrl =
  "https://convedotest.appiancloud.com/suite/webapi/create-customer";
const apiKey =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhYmM0MzI2MC1hOWE5LTRkYWQtYmU4Zi0zYTY3MGUwMGU4ODAifQ.2RKWdPF8jt9w9YmY8NdJtKDc8M1W18g-CpeztwuqG3U";

const form = document.getElementById("form");
const inputs = document.querySelectorAll("input");
const errorMessageContainer = document.querySelector("#messages p");

for (let i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener("focus", () => {
    errorMessageContainer.style.display = "none";
    errorMessageContainer.textContent = "";
  });
}

const sendData = (data) => {
  return new Promise((resolve, reject) => {
    let http = new XMLHttpRequest();
    http.open("POST", apiUrl, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.setRequestHeader("Authorization", `Bearer ${apiKey}`);
    http.send(JSON.stringify(data));
    http.onload = () => {
      const responseData = JSON.parse(http.responseText);
      const status = http.status;
      resolve({
        status,
        responseData,
      });
    };
    http.onerror = () => {
      resolve(false);
    };
  });
};

const constructData = () => {
  const firstName = document.querySelector("#firstName").value;
  const lastName = document.querySelector("#lastName").value;
  const email = document.querySelector("#email").value;
  const companyName = document.querySelector("#companyName").value;
  const data = {
    firstName,
    lastName,
    email,
    companyName,
  };
  sendData(data).then((response) => {
    if (response.status != 201) {
      errorMessageContainer.className = "error";
      errorMessageContainer.style.display = "block";
      errorMessageContainer.textContent = response.responseData.message;
    } else {
      errorMessageContainer.className = "success";
      errorMessageContainer.textContent = response.responseData.message;
      errorMessageContainer.style.display = "block";
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
      }
    }
  });
};

const validateEmailAddress = () => {
  const emailField = document.querySelector("#email");
  const regex =
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/gm;
  const isValid = regex.test(emailField.value);
  return isValid;
};

const submitFormHandler = (e) => {
  e.preventDefault();
  let formHasError = false;
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value == "") {
      formHasError = true;
    }
  }
  if (formHasError) {
    errorMessageContainer.className = "error";
    errorMessageContainer.textContent =
      "Unable to process your request. Please ensure that all fields are filled out correctly.";
    errorMessageContainer.style.display = "block";
    return;
  }
  const emailIsValid = validateEmailAddress();
  if (!emailIsValid) {
    errorMessageContainer.className = "error";
    errorMessageContainer.textContent =
      "The email address provided does not appear to be valid. Please check the format and try again.";
    errorMessageContainer.style.display = "block";
    return;
  }
  constructData();
  return;
};

form.addEventListener("submit", submitFormHandler);
