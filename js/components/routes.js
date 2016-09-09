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
