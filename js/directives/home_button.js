todo.
  directive('homeButton', homeButton)

function homeButton() {

  var directive = {
    templateUrl: 'templates/directives/home_button.html',
    restrict: 'E',
    scope: {},
    controller: 'homeButtonController',
    controllerAs: 'vm',
    bindToController: true
  }

  return directive
}

todo.controller('homeButtonController', homeButtonController)
homeButtonController.$inject = ['$state']
function homeButtonController($state) {
}
