let number, name, cvvnumber, isChecked;

function cardNumber(event) {
  console.log('number')
  var input = document.getElementById("cardNumber");
  var s = input.value;
  number = (/[0-9]/i.test(event.key) && s.length < 16) ? s + event.key : s;
  return /[0-9]/i.test(event.key);
}

function cardName(event) {
  var input = document.getElementById("cardName");
  var s = input.value;
  name = /[a-z]/i.test(event.key) ? s + event.key : s;
  return /[a-z]/i.test(event.key);
}

function cvv(event) {
  var input = document.getElementById("cvv");
  var s = input.value;
  cvvnumber = (/[0-9]/i.test(event.key) && s.length < 4) ? s + event.key : s;
  return /[0-9]/i.test(event.key);
}

function checkBox() {
  var checkBox = document.getElementById("card-checkbox");
  isChecked = checkBox.checked;
}

(function () {
  // get references to select list and display text box
  var month = document.getElementById('card-month');
  var year = document.getElementById('card-year');
  function getSelectedOption(sel) {
    var opt;
    for (var i = 0, len = sel.options.length; i < len; i++) {
      opt = sel.options[i];
      if (opt.selected === true) {
        break;
      }
    }
    return opt;
  }
}());

var stripeElements = function (publicKey, setupIntent) {
  var stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

  var elements = stripe.elements();
  var cardElement = elements.create('card');
  // cardElement.mount('#card-element');
  // var clientSecret = cardButton.dataset.secret;

  var cardholderName = document.getElementById('cardholder-name');
  var cardButton = document.getElementById('submit');
  var clientSecret = cardButton.dataset.secret;

  // cardButton.addEventListener('click', function (ev) {
  // document.getElementById('submit').onclick = function () {
  var button = document.getElementById("submit");
  button.addEventListener("click", function (event) {
    event.preventDefault();
    // changeLoadingState(true);
    var month = document.getElementById('card-month');
    var year = document.getElementById('card-year');
    function getSelectedOption(sel) {
      var opt;
      for (var i = 0, len = sel.options.length; i < len; i++) {
        opt = sel.options[i];
        if (opt.selected === true) {
          break;
        }
      }
      return opt;
    }
    var cardMonth = getSelectedOption(month).value;
    var cardYear = getSelectedOption(year).value;
    console.log('here', number, cvvnumber, name, cardMonth, cardYear);
    stripe.confirmCardSetup(
      setupIntent.client_secret,
      {
        payment_method: {
          card: {
            number: number,
            exp_month: cardMonth,
            exp_year: cardYear,
            cvc: cvvnumber,
          },
          billing_details: { name: name }
        }
      }
    ).then(function (result) {
      if (result.error) {
        // Display error.message in your UI.
      } else {
        // The setup has succeeded. Display a success message.
      }
    });
  });
}

var getSetupIntent = function(publicKey) {
  return fetch("http://localhost:8000/create-setup-intent", {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(setupIntent) {
      stripeElements(publicKey, setupIntent);
    });
};

var getPublicKey = function () {
  return fetch("http://localhost:8000/public-key", {
    method: "get",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      getSetupIntent(response.publicKey);
    });
};

getPublicKey();
// stripe.confirmCardPayment(intent.client_secret, {
//   payment_method: intent.last_payment_error.payment_method.id
// }).then(function (result) {
//   if (result.error) {
//     // Show error to your customer
//     console.log(result.error.message);
//   } else {
//     if (result.paymentIntent.status === 'succeeded') {
//       // The payment is complete!
//     }
//   }
// });