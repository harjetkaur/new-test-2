async function generateCard() {
  // generate a random 16-digit credit card number
  var cardNumber = "";
  for (var i = 0; i < 16; i++) {
    cardNumber += Math.floor(Math.random() * 10);
  }

  // get the current date from an online API
  const response = await fetch('http://worldclockapi.com/api/json/utc/now');
  const data = await response.json();
  var currentDate = new Date(data.currentDateTime);

  // generate a random expiration date that is after the current date
  var expirationMonth = Math.floor(Math.random() * 12) + 1;
  var expirationYear = currentDate.getFullYear();
  var maxExpirationMonth = 12;
  if (expirationYear == currentDate.getFullYear()) {
    maxExpirationMonth = 12 - currentDate.getMonth();
  }
  var monthsUntilExpiration = Math.floor(Math.random() * (maxExpirationMonth - expirationMonth + 1)) + expirationMonth;
  var yearsUntilExpiration = Math.floor(monthsUntilExpiration / 12);
  monthsUntilExpiration = monthsUntilExpiration % 12;
  expirationYear += yearsUntilExpiration;
  var expirationDate = new Date(expirationYear, monthsUntilExpiration, 1);
  expirationDate.setDate(expirationDate.getDate() - 1);

  // generate a random 3-digit CVV
  var cvv = Math.floor(Math.random() * 900) + 100;

  // format the generated information in the required format
  var formattedCardInfo = cardNumber + "|" + String(expirationDate.getMonth() + 1).padStart(2, "0") + "|" + String(expirationDate.getFullYear()).slice(2) + "|" + cvv;

  return formattedCardInfo;
}

document.getElementById("card-generator").addEventListener("submit", async function(event) {
  event.preventDefault();
  var numCards = parseInt(document.getElementById("number_of_strings").value);
  var generatedCards = "";
  for (var i = 0; i < numCards; i++) {
    var card = await generateCard();
    generatedCards += card + "\n";
  }
  document.getElementById("generated-cards").value = generatedCards;
});
