console.log("random");

const apiUrl = "http://localhost:3001/api/guests";
axios
  .get(apiUrl)
  .then((response) => {
    const guests = response.data;

    for (const guest of guests) {
      console.log(product.name);
      const listElement = document.getElementbyId("guestList");
      const newListItemElement = document.createElement("li");
      newListItemElement.classList.add("guest");
      const nameElement = document.createElement("div");
      nameElement.innerText = guest.name;

      newListItemElement.appendChild(nameElement);

      listElement.appendChild(newListItemElement);
    }
  })
  .catch((error) => {
    debugger;
  });
