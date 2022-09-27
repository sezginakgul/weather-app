const inputBox = document.querySelector(".form-control");
const searchBtn = document.querySelector(".btn");
const errorMessage = document.querySelector("#error-message");
const screen = document.querySelector("#screen");

const weatherApp = async (name) => {
  const apiKey = "26177b56931be80e12c0660121517f13";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      renderError();
      throw new Error(`Something went wrong: ${res.status}`);
    }
    const data = await res.json();
    renderWeather(data);
  } catch (error) {}
};

let screenCardTotal = [];

searchBtn.addEventListener("click", () => {
  if (screenCardTotal.includes(inputBox.value.toUpperCase())) {
    counter = 0;
    const intervalMessage = setInterval(() => {
      errorMessage.innerHTML = `You already now the weather for ${inputBox.value.toUpperCase()}, please search for another`;
      counter++;
      if (counter > 10) {
        clearInterval(intervalMessage);
        errorMessage.innerHTML = "";
        inputBox.value = "";
      }
    }, 200);
  } else if (screenCardTotal.length < 6) {
    if (!inputBox.value) {
      counter = 0;
      const intervalMessage = setInterval(() => {
        errorMessage.innerHTML = `Please enter a city name...`;
        counter++;
        if (counter > 10) {
          clearInterval(intervalMessage);
          errorMessage.innerHTML = "";
        }
      }, 200);
      return;
    } else {
      weatherApp(inputBox.value);
      inputBox.value = "";
    }
  } else {
    let question = confirm(
      "Maximum city listed. Do you want to remove all items?"
    );
    if (question) {
      inputBox.value = "";
      screen.textContent = "";
      screenCardTotal = [];
    }
  }

  inputBox.focus();
});

screen.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-x")) {
    e.target.closest(".card").remove();
    screenCardTotal.splice(
      screenCardTotal.indexOf(
        e.target.parentElement.parentElement.parentElement.children[0].textContent.toUpperCase()
      ),
      1
    );
    console.log(screenCardTotal);
  }
});

inputBox.addEventListener("keydown", (e) => {
  if (e.code == "Enter") {
    searchBtn.click();
  }
});

window.addEventListener("load", () => {
  inputBox.focus();
});

const renderError = () => {
  counter = 0;
  const intervalMessage = setInterval(() => {
    errorMessage.innerHTML = `
    <div class="text-center mb-2">Enter the city name exactly...</div>
    <img src="./error.jpg" width="300px" alt="">
    `;
    counter++;
    if (counter > 10) {
      clearInterval(intervalMessage);
      errorMessage.innerHTML = "";
    }
  }, 200);
};

const renderWeather = (weath) => {
  const {
    name,
    sys: { country },
    main: { temp, temp_max, temp_min, feels_like },
    wind: { speed },
    clouds: { all },
  } = weath;

  screenCardTotal.push(name.toUpperCase());

  const screen = document.querySelector("#screen");
  screen.innerHTML =
    `
    <div class="col-md-4 col-lg-3 card shadow-lg" style="width: 18rem;">
        <ul class="list-group list-group-flush text-center">
            <li class="list-group-item fs-5 fw-bold d-flex justify-content-between align-items-center text-uppercase"><div>${name}</div> <div><span class="text-danger text-end">${country} </span> <span><i class="fa-solid fa-x ms-1"></i></span></div></li>
            <li class="list-group-item fw-bold"><div class=" display-1 fw-bold">${(
              temp - 273.15
            ).toFixed()}&#8451 </div>
            
            <i class="fa-solid fa-arrow-up text-danger fs-6"></i> H: ${(
              temp_max - 273.15
            ).toFixed()}&#8451 
            <i class="fa-solid fa-arrow-down text-primary fs-6"></i> L: ${(
              temp_min - 273.15
            ).toFixed()}&#8451
            <div class="text-capitalize fw-bold opacity-75 fs-4 m-2">${
              weath.weather[0].description
            }</div>
            </li>
            <li class="list-group-item"><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
              weath.weather[0].icon
            }.svg" /></li>
            
            <li class="list-group-item text-center  fw-bold opacity-75 fs-6">
            <i class="fa-solid fa-cloud text-black"></i> Clouds: %${all} 
            <br>
            <i class="fa-solid fa-temperature-three-quarters text-secondary fs-6 text-success"></i> Feels Like: ${(
              temp_min - 273.15
            ).toFixed()}&#8451
            <br>
            <i class="fa-solid fa-wind text-secondary"></i> Wind Speed: ${speed} Km/h
            </li>
            
        </ul>
    </div>
  ` + screen.innerHTML;
};
