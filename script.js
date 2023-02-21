// initialize a variable to store the cached current date
var cachedCurrentDate = null;

// function to fetch the current date from the API and store it in the cache
async function cacheCurrentDate() {
  const response = await fetch('https://worldtimeapi.org/api/ip');
  const data = await response.json();
  cachedCurrentDate = new Date(data.utc_datetime);
}

// call the function to cache the current date when the page loads
cacheCurrentDate();


// function to generate a random integer between min and max (inclusive)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate a random credit card number that follows the Luhn algorithm
function generateCardNumber(bin, isAmex) {
  var cardNumber = bin.toString();
  var length = (isAmex) ? 14 : 15; // set length to 14 for Amex cards, 15 for others

  // replace "x" with a random digit
  var numX = cardNumber.split('x').length - 1;
  for (var i = 0; i < numX; i++) {
    cardNumber = cardNumber.replace('x', randomInt(0, 9));
  }

  // pad with random digits if necessary
  while (cardNumber.length < length) {
    cardNumber += randomInt(0, 9);
  }

  var digits = cardNumber.split('');
  var sum = 0;
  var even = false;

  for (var i = digits.length - 1; i >= 0; i--) {
    var digit = parseInt(digits[i]);

    if (even) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    even = !even;
  }

  var checkDigit = (10 - (sum % 10)) % 10;
  cardNumber += checkDigit;

  // check if generated number is valid Luhn number
  if (!isValidLuhn(cardNumber)) {
    return generateCardNumber(bin, isAmex);
  }

  return cardNumber;
}


function isValidLuhn(cardNumber) {
  var digits = cardNumber.split('');
  var sum = 0;
  var even = false;

  for (var i = digits.length - 1; i >= 0; i--) {
    var digit = parseInt(digits[i]);

    if (even) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    even = !even;
  }

  return sum % 10 == 0;
}




  

async function generateCard(bin) {
  var isAmex = document.getElementById("amex").checked;
  var cardNumber = generateCardNumber(bin, isAmex);
  var currentDate = cachedCurrentDate;

  var expirationMonthInput = document.getElementById("month").value;
  var expirationMonth = (expirationMonthInput !== "") ? parseInt(expirationMonthInput) : Math.floor(Math.random() * 12) + 1;

  var expirationYearInput = document.getElementById("year").value;
  var expirationYear = (expirationYearInput !== "") ? parseInt(expirationYearInput) : currentDate.getFullYear() + Math.floor(Math.random() * 10);
  if (expirationYear < currentDate.getFullYear()) {
    expirationYear = currentDate.getFullYear();
  }

  var maxExpirationMonth = 12;
  if (expirationYear == currentDate.getFullYear()) {
    maxExpirationMonth = 12 - currentDate.getMonth();
  }

  if (expirationMonth < 1 || expirationMonth > 12) {
    expirationMonth = Math.floor(Math.random() * maxExpirationMonth) + currentDate.getMonth() + 1;
  }

  var monthsUntilExpiration = (expirationYear - currentDate.getFullYear()) * 12 + (expirationMonth - currentDate.getMonth() - 1);

  var cvvInput = document.getElementById("cvv").value;
  var cvv = (cvvInput === "") ? (isAmex ? Math.floor(Math.random() * 9000) + 0000 : Math.floor(Math.random() * 900) + 000) : cvvInput.replace(/x/g, function() { return Math.floor(Math.random() * 10); });

  

  var expirationDate = new Date(currentDate);
  expirationDate.setMonth(expirationDate.getMonth() + monthsUntilExpiration);
  expirationDate.setDate(expirationDate.getDate() - 1);

  var formattedCardInfo = cardNumber + "|" + String(expirationDate.getMonth() + 1).padStart(2, "0") + "|" + expirationDate.getFullYear() + "|" + cvv.toString().padStart(isAmex ? 4 : 3, "0");

  return formattedCardInfo;
}

document.getElementById("card-generator").addEventListener("submit", async function(event) {
  event.preventDefault();
  var numCards = parseInt(document.getElementById("number_of_strings").value);
  var generatedCards = "";
  var bin = document.getElementById("bin").value;
  for (var i = 0; i < numCards; i++) {
    var card = await generateCard(bin);
    generatedCards += card + "\n";
  }
  document.getElementById("generated-cards").value = generatedCards;
});

function copyToClipboard() {
  var copyText = document.getElementById("generated-cards");
  copyText.select();
  document.execCommand("copy");
}
