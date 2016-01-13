todo.
  factory('$localStorage', $localStorage)

$localStorage.$inject = ['$window']

function $localStorage($window) {

  var o = {}
  o.setObject = setObject
  o.removeObject = removeObject
  o.getObject = getObject
  return o

  function setObject(key, value) {
    $window.localStorage[key] = JSON.stringify(value);
  }

  function removeObject(key) {
    $window.localStorage.removeItem(key);
  }

  function getObject(key) {
    return JSON.parse($window.localStorage[key] || '{}')
  }
}
