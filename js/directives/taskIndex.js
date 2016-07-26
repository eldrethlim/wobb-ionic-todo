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
      console.log("error marking task")
    }
  }
}
