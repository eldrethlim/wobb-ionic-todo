todo.
  directive('logoutButton', logoutButton)

function logoutButton() {

  var directive = {
    templateUrl: 'templates/directives/logout_button.html',
    restrict: 'E',
    scope: {},
    controller: 'logoutButtonController',
    controllerAs: 'vm',
    bindToController: true
  }

  return directive
}

todo.controller('logoutButtonController', logoutButtonController)
logoutButtonController.$inject = ['$state', 'User', 'Task']
function logoutButtonController($state, User, Task) {

  var vm = this
  vm.logout = logout

  function logout() {
    User.removeSession();
    Task.list = [];
    console.log("You've logged out")
    $state.go('home')
  }
}
