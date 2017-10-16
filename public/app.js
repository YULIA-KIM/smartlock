var app = angular.module('sampleApp',['ngRoute'])

app.config(function config($routeProvider) {
    $routeProvider
        .when('/main', {
            // controller: '',
            templateUrl: 'main.view.html'
        })
        .when('/memberInfo', {
            // controller: 'memberInfoCtrl',
            templateUrl: 'contents/memberInfo/memberInfo.view.html'
        })
        .when('/certificate', {
            // controller: 'certificateCtrl',
            templateUrl: 'contents/certificate/certificate.view.html',
        })

        .when('/overallStatus', {
            // controller: 'overallStatusCtrl',
            templateUrl: 'contents/overallStatus/overallStatus.view.html',
        })
        .when('/login', {
            // controller: '',
            templateUrl: 'contents/memberManagement/login.view.html',
        })
        .when('/regulation', {
            // controller: '',
            templateUrl: 'contents/memberManagement/regulation.view.html',
        })
    		.when('/idsearch', {
    			// controller: '',
    			templateUrl: 'contents/memberManagement/idsearch.view.html',
    		})
    		.when('/email_verify', {
    			// controller: '',
    			templateUrl: 'contents/users/email_verify/email_verify.view.html',
          controller: 'emailVerifyCtrl'
    		})
        .otherwise({ redirectTo: '/main' });
});

app.controller("emailVerifyCtrl", function ($scope, $routeParams, $http) {
  var code = $routeParams.code;

  $scope.click = function() {
    alert("PLEASE WAIT");

    $http({
      method: 'GET',
      url: '/users/email_verify?code=' + code
    }).then(function successCallback(response) {
      alert("SUCCESS");
    }, function errorCallback(response) {
      alert("FAILURE");
    });
  };
});
