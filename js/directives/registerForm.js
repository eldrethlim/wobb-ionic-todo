todo.
  directive('registerForm', registerForm)

function registerForm() {

  var directive = {
    templateUrl: 'templates/directives/register_form.html',
    restrict: 'E',
    scope: {},
    controller: 'registerFormController',
    controllerAs: 'vm',
    bindToController: true
  }

  return directive
}

todo.controller('registerFormController', registerFormController)
registerFormController.$inject = ['$state', 'HttpService', 'User']
function registerFormController($state, HttpService, User) {

  var vm = this
  vm.register = registerUser

  function registerUser(credentials) {
    data = { user: credentials }
    HttpService.call('/api/v1/users', 'POST', data)
      .then(registerResponseSuccess, registerResponseFailure)
  }

  function registerResponseSuccess(response) {
    User.setSession(response.data.auth_token)
    console.log(response.data.message)
    $state.go('taskboard')
  }

  function registerResponseFailure(response) {
    console.log(response.data.message)
  }
}
