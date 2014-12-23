angular.module('angular-balanced', []
.factory('$balanced', ['$window', function($window) {
  return $window.balanced;
}])
.factory('$creditcard', ['$q', '$balanced', function($q, $balanced) {
  function capitalizeFilter(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  }
  function first(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  var module = {
    type: function(number) {
      return $balanced.card.cardType(number);
    },
    create: function(data) {
      var newCard = {
        expiration_month: data.expiration_month,
        expiration_year: data.expiration_year,
        number: data.number,
        address: data.address,
        cvv: data.cvv,
        name: data.name
      };
      var dfd = $q.defer();
      $balanced.card.create(newCard, function(res) {
        console.log('balanced.card.create', res);
        if (res.status_code === 201) {
          
          var card = first(res.cards);
          dfd.resolve({
            id: card.id,
            href: card.href
          });
        } else {
          dfd.reject(res);
        }
      });

      return dfd.promise;
    },
    validate: function(card) {
      var newCard = {
        expiration_month: card.expiration_month,
        expiration_year: card.expiration_year,
        number: card.number,
        address: card.address,
        cvv: card.cvv,
        name: card.name
      };
      return $balanced.card.validate(newCard);
    },
    isValidExpiry:function(month, year) {
      return $balanced.card.isExpiryValid(month, year);
    },
    isValidNumber: function(number) {
      return $balanced.card.isCardNumberValid(number);
    },
    isValidSecurityCode: function(number, cvv) {
      return $balanced.card.isCVVValid(number, cvv);
    },
    isValid: function(type, args) {
      args = Array.prototype.slice.call(args, 1);

      var method = module['isValid'+capitalizeFilter(type)];

      return method.apply(method, args);
    }
  }; // end module

  return module;
}]);
