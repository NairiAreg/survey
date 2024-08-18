const question1Options = [
  { value: "Անիմե", image: "imgs/anime.jpeg" },
  { value: "Ֆուտբոլ", image: "imgs/football.png" },
  { value: "K-pop", image: "imgs/k-pop.png" },
  { value: "Կենդանիներ (տնային կամ ոչ)", image: "imgs/animals.png" },
  { value: "Ծաղիկներ", image: "imgs/flowers.avif" },
  { value: "Սնունդ", image: "imgs/food.png" },
  { value: "Հայտնիություններ", image: "imgs/celebs.png" },
  { value: "Ֆիլմեր / Մուլտֆիլմեր / Սերիալներ", image: "imgs/tv.png" },
  { value: "Դոռամաներ", image: "imgs/dorama.png" },
  { value: "Համակարգչային խաղեր", image: "imgs/games.png" },
  { value: "Երգ / Երաժշտություն", image: "imgs/music.png" },
  { value: "Հայաստան", image: "imgs/Armenia.webp" },
  { value: "Ձեր ընտանիքի", image: "imgs/family.png" },
  { value: "Ձեր և ձեր սիրելիի նկարներ", image: "imgs/love.png" },
  { value: "Մեմեր", image: "imgs/memes.png" },
];

const question2Options = [
  { value: "Շատ Նոսր", image: "imgs/mosaics/28.png" },
  { value: "Նոսր", image: "imgs/mosaics/35.png" },
  { value: "Միջին", image: "imgs/mosaics/41.png" },
  { value: "Խիտ", image: "imgs/mosaics/50.png" },
  { value: "Շատ Խիտ", image: "imgs/mosaics/58.png" },
];

const question3Options = [
  { value: "28x28 սմ", image: "imgs/mosaics/sizes/28.png" },
  { value: "35x35 սմ", image: "imgs/mosaics/sizes/35.png" },
  { value: "41x41 սմ", image: "imgs/mosaics/sizes/41.png" },
  { value: "50x50 սմ", image: "imgs/mosaics/sizes/50.png" },
  { value: "58x58 սմ", image: "imgs/mosaics/sizes/58.png" },
  { value: "70x70 սմ", image: "imgs/mosaics/sizes/70.png" },
  { value: "90x90 սմ", image: "imgs/mosaics/sizes/90.png" },
];

const question4Options = [
  { value: "5,000 - 10,000 դրամ" },
  { value: "10,000 - 15,000 դրամ" },
  { value: "15,000 - 20,000 դրամ" },
  { value: "20,000 - 30,000 դրամ" },
  { value: "30,000 - 40,000 դրամ" },
  { value: "40,000 - 50,000 դրամ" },
  { value: "50,000 դրամից ավել" },
];

const question5Options = [
  { value: "Անձնական տան դեկոր" },
  { value: "Նվեր ընկերների/ընտանիքի համար" },
  { value: "Գրասենյակի կամ աշխատավայրի ձևավորում" },
  { value: "Հատուկ միջոցառում (հարսանիք, տարեդարձ և այլն)" },
  { value: "Այլ" },
];

function createOptions(questionId, options, maxSelections = null) {
  const optionsContainer = document.querySelector(`#${questionId} .options`);
  options.forEach((option, index) => {
    const optionElement = document.createElement("div");
    optionElement.className = "option";
    optionElement.innerHTML = `
        <input type="${
          maxSelections ? "checkbox" : "radio"
        }" id="${questionId}-${index}" name="${questionId}" value="${
      option.value
    }">
        <label for="${questionId}-${index}">
          ${
            option.image
              ? `<img src="${option.image}" alt="${option.value}">`
              : ""
          }
          <span>${option.value}</span>
        </label>
      `;
    optionsContainer.appendChild(optionElement);

    const input = optionElement.querySelector("input");
    const label = optionElement.querySelector("label");
    label.addEventListener("click", (e) => {
      if (maxSelections) {
        const checkedInputs =
          optionsContainer.querySelectorAll("input:checked");
        if (checkedInputs.length >= maxSelections && !input.checked) {
          e.preventDefault();
          showToaster(
            `Դուք չեք կարող ընտրել ${maxSelections}-ից ավելի տարբերակ:`
          );
        }
      }
    });
  });

  if (questionId !== "question2") {
    const otherOption = document.createElement("div");
    otherOption.className = "option other";
    otherOption.innerHTML = `
        <input type="${
          maxSelections ? "checkbox" : "radio"
        }" id="${questionId}-other" name="${questionId}" value="other">
        <label for="${questionId}-other">Այլ</label>
        <input type="text" class="other-input" placeholder="Խնդրում ենք նշել">
      `;
    optionsContainer.appendChild(otherOption);

    const otherCheckbox = otherOption.querySelector(
      'input[type="checkbox"], input[type="radio"]'
    );
    const otherInput = otherOption.querySelector(".other-input");

    otherCheckbox.addEventListener("change", () => {
      otherInput.style.display = otherCheckbox.checked
        ? "inline-block"
        : "none";
    });

    otherInput.addEventListener("input", () => {
      otherCheckbox.checked = otherInput.value.trim() !== "";
    });
  }
}

function initializeSurvey() {
  createOptions("question1", question1Options, 6);
  createOptions("question2", question2Options, 3);
  createOptions("question3", question3Options, 3);

  const form = document.getElementById("surveyForm");
  const questions = document.querySelectorAll(".question-container");
  const submitButton = document.getElementById("submitButton");
  let currentQuestion = 0;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const currentQuestionElement = questions[currentQuestion];
    const questionId = currentQuestionElement.id;
    let answers = formData.getAll(questionId);

    // Handle "Other" option
    const otherInput = currentQuestionElement.querySelector(".other-input");
    if (
      otherInput &&
      answers.includes("other") &&
      otherInput.value.trim() !== ""
    ) {
      answers = answers.filter((a) => a !== "other");
      answers.push(otherInput.value.trim());
    }

    if (answers.length === 0 && questionId !== "question6") {
      showToaster("Խնդրում ենք պատասխանել հարցին:");
      return;
    }

    if (currentQuestion < questions.length - 1) {
      currentQuestionElement.style.display = "none";
      currentQuestion++;
      questions[currentQuestion].style.display = "block";
      submitButton.textContent =
        currentQuestion === questions.length - 1 ? "ուղարկել" : "հաջորդը";
    } else {
      const data = {
        question1: formData.getAll("question1").join(", "),
        question2: formData.get("question2"),
        question3: formData.getAll("question3").join(", "),
      };

      // Disable submit button
      submitButton.disabled = true;
      submitButton.textContent = "Ուղարկվում է...";

      submitFormJsonp(data);
    }
  });
}

function submitFormJsonp(data) {
  const script = document.createElement("script");
  const callback = "jsonpCallback_" + Date.now();
  const loader = document.getElementById("loader");

  // Show loader
  loader.style.display = "block";

  window[callback] = function (response) {
    // Hide loader
    loader.style.display = "none";

    if (response.result === "success") {
      showThankYouMessage();
    } else {
      showToaster("Տեղի է ունեցել սխալ: Խնդրում ենք փորձել կրկին:", "error");
      // Re-enable submit button
      const submitButton = document.getElementById("submitButton");
      submitButton.disabled = false;
      submitButton.textContent = "ուղարկել";
    }
    delete window[callback];
    document.body.removeChild(script);
  };

  const url =
    "https://script.google.com/macros/s/AKfycbzPIHFHd_mnMdMi9vnXDcEG2HPvqXrfgZtNbkZqPAIJWAHuOSqi-vlEnmKKCZvnLEvu/exec";
  const params = Object.entries(data)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  script.src = `${url}?callback=${callback}&${params}`;
  document.body.appendChild(script);
}

function showThankYouMessage() {
  const container = document.querySelector(".container");
  container.innerHTML = `
      <div class="running-line-container">
        <div class="running-line">
          <div class="units">
            <div>Շնորհակալություն</div>
            <div>Շնորհակալություն</div>
          </div>
          <div class="units">
            <div>Շնորհակալություն</div>
            <div>Շնորհակալություն</div>
          </div>
        </div>
      </div>
    `;
}

function showToaster(message, type = "error") {
  const toaster = document.getElementById("toaster");
  toaster.textContent = message;
  toaster.className = `toaster show ${type}`;
  setTimeout(() => {
    toaster.className = "toaster";
  }, 3000);
}

document.addEventListener("DOMContentLoaded", initializeSurvey);
