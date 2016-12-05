// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', ['mk.timepicker']);


myApp.controller('demoController', function ($scope) {
    $scope.time = 0;
});
