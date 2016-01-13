todo.
  factory('User', User)

User.$inject = ['$q', '$localStorage']

function User($q, $localStorage) {

  var o = {}
  o.details = {}
  o.removeSession = removeSession
  o.setSession = setSession
  o.checkSession = checkSession
  return o

  function removeSession() {
    $localStorage.removeObject('user')
  }

  function setSession(token) {
    if (token) {
      $localStorage.setObject('user', { token: token })
    }
  }

  function checkSession() {
    var defer = $q.defer()
    var user = $localStorage.getObject('user')
    if (user.token) {
      defer.resolve(true)
    } else {
      defer.resolve(false)
    }
    return defer.promise
  }
}
