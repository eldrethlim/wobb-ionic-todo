todo = angular.module('todo', [
  'ionic'
])

todo.run(initializeIonic)
initializeIonic.$inject = ['$ionicPlatform']
function initializeIonic($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true)
    }
    if(window.StatusBar) {
      StatusBar.styleDefault()
    }
  })
}

todo.constant('SERVER', {
  url: "http://localhost:3000"
})

todo.
  config(applicationRoutes)

applicationRoutes.$inject = ['$stateProvider', '$urlRouterProvider']

function applicationRoutes($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('home', {
    url: '/',
    views: {
      '': {
        templateUrl: 'templates/home.html'
      }
    }
  })

  .state('login', {
    url: '/login',
    views: {
      '': {
        templateUrl: 'templates/login.html'
      }
    }
  })

  .state('register', {
    url: '/register',
    views: {
      '': {
        templateUrl: 'templates/register.html'
      }
    }
  })

  .state('taskboard', {
    url: '/taskboard',
    cache: false,
    views: {
      '': {
        templateUrl: 'templates/taskboard.html'
      }
    },
    resolve: {
      checkSession: checkSession
    }
  })

  $urlRouterProvider.otherwise('/')
}

checkSession.$inject = ['User', '$state']
function checkSession(User, $state) {
  User.checkSession().then(function(hasSession) {
    if (!hasSession) {
      console.log("Please log in.")
      $state.go('home')
    }
  })
}

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
logoutButtonController.$inject = ['$state', 'User', 'Task', '$ionicHistory']
function logoutButtonController($state, User, Task, $ionicHistory) {

  var vm = this
  vm.logout = logout

  function logout() {
    User.removeSession();
    Task.list = [];
    console.log("You've logged out")
    $state.go('home')
    $ionicHistory.clearHistory()
    $ionicHistory.clearCache()
  }
}

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

todo.
  directive('taskForm', taskForm)

function taskForm() {

  var directive = {
    templateUrl: 'templates/directives/task_form.html',
    restrict: 'E',
    scope: {},
    controller: 'taskFormController',
    controllerAs: 'vm',
    bindToController: true
  }

  return directive
}

todo.controller('taskFormController', taskFormController)
taskFormController.$inject = ['HttpService', 'Task']
function taskFormController(HttpService, Task) {

  var vm = this
  vm.createTask = createTask

  function createTask(details) {
    data = { task: details }
    HttpService.call('/api/v1/tasks', 'POST', data)
      .then(taskCreateSuccess, taskCreateFailure)
  }

  function taskCreateSuccess(response) {
    Task.list.push(response.data)
    console.log(Task.list)
    console.log(response.data.message)
  }

  function taskCreateFailure(response) {
    console.log(response.data.message)
  }
}

todo.
  directive('taskList', taskList)

function taskList() {

  var directive = {
    templateUrl: 'templates/directives/task_index.html',
    restrict: 'E',
    scope: {},
    controller: 'taskListController',
    controllerAs: 'vm',
    bindToController: true
  }

  return directive
}

todo.controller('taskListController', taskListController)
taskListController.$inject = ['HttpService', 'Task', '$scope']
function taskListController(HttpService, Task, $scope) {

  var vm = this
  vm.tasks = undefined
  vm.markTask = markTask
  vm.deleteTask = deleteTask

  $scope.$watch(function() { return Task.list }, function(oV, nV) {
    vm.tasks = Task.list
  })

  fetchTasks()
  function fetchTasks() {
    HttpService.call('/api/v1/tasks', 'GET', undefined)
      .then(fetchTaskResponseSuccess, fetchTaskResponseFailure)

    function fetchTaskResponseSuccess(response) {
      Task.list = response.data
      console.log(Task.list)
      console.log(response.data)
    }

    function fetchTaskResponseFailure(response) {
      var errors = [ response.data.message ]
      console.log(errors)
    }
  }

  function markTask(task, index) {
    vm.index = index;
    HttpService.call('/api/v1/tasks/' + task.id + '/complete', 'POST', undefined)
      .then(markTaskResponseSuccess, markTaskResponseFailure)

    function markTaskResponseSuccess(response) {
      vm.tasks[vm.index].complete = !vm.tasks[vm.index].complete
      vm.index = undefined
      console.log(response.data.message)
    }

    function markTaskResponseFailure(response) {
      vm.index = undefined
      console.log("Rrror marking task")
    }
  }

  function deleteTask(task, index) {
    vm.index = index;
    HttpService.call('/api/v1/tasks/' + task.id, 'DELETE', undefined)
      .then(deleteTaskResponseSuccess, deleteTaskResponseFailure)

    function deleteTaskResponseSuccess(response) {
      vm.tasks.splice(vm.index, 1)
      vm.index = undefined
      console.log(response.data.message)
    }

    function deleteTaskResponseFailure(response) {
      console.log("Error deleting task")
    }
  }
}

todo.
  factory('HttpService', HttpService)

HttpService.$inject = ['$http', 'SERVER', '$localStorage']

function HttpService($http, SERVER, $localStorage) {

  var o = {}
  o.call = httpCall

  return o

  function httpCall(authRoute, method, data) {
    if (data) {
      data['format'] = 'json'
    }
    var params = {
      method: method,
      url: SERVER.url + authRoute,
      headers: {
        "Content-Type": "application/json",
        "Authorization": $localStorage.getObject('user').token
      },
      data: JSON.stringify(data)
    }
    console.log(params)
    return $http(params).
      success(successResponse).
      error(failureResponse)
  }

  function successResponse(response) {
    return response
  }

  function failureResponse(response) {
    return response
  }
}

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

todo.
  factory('Task', Task)

Task.$inject = []
function Task() {

  var o = {}
  o.list = []

  return o
}

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
