console.log("FE script loaded");
const errorMsg = document.getElementById("error");
const successMsg = document.getElementById("success");

const fetchResult = (latV, longV) => {
  return fetch(`http://localhost:3000/weather?lat=${latV}&long=${longV}`).then(
    (response) => {
      response.json().then((data) => {
        if (data.error) {
          errorMsg.innerHTML = data.error;
        } else {
          successMsg.innerHTML = data.data;
        }
      });
    }
  );
};

const weatherForm = document.querySelector("form");
const latVal = document.getElementById("lat");
const longVal = document.getElementById("long");

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const latitude = latVal.value;
  const longitude = longVal.value;
  fetchResult(latitude, longitude);
});
