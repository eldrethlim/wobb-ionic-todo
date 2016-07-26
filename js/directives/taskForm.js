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
