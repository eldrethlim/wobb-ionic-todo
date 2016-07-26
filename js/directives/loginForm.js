todo.
  directive('loginForm', loginForm)

function loginForm() {

  var directive = {
    templateUrl: 'templates/directives/login_form.html',
    restrict: 'EA',
    scope: {},
    controller: 'loginFormController',
    controllerAs: 'vm',
    bindToController: true
  }

  return directive
}

todo.controller('loginFormController', loginFormController)
loginFormController.$inject = ['$state', 'HttpService', 'User']
function loginFormController($state, HttpService, User) {

  var vm = this
  vm.login = loginUser

  function loginUser(credentials) {
    data = { user: credentials }
    HttpService.call('/api/v1/sessions', 'POST', data)
      .then(loginResponseSuccess, loginResponseFailure)
  }

  function loginResponseSuccess(response) {
    User.setSession(response.data.auth_token)
    console.log(response.data.message)
    $state.go('taskboard')
  }

  function loginResponseFailure(response) {
    var errors = [ response.data.message ]
    console.log(errors)
  }
}
