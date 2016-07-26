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
