/* global angular */
'use strict';

(function () {
  var app = angular.module('app', ['ngRoute', 'ui.grid', 'restangular'])

  app.config([
    '$routeProvider',
    function ($routeProvider) {
      // This makes app/keywords/KeywordsController.js handle the http://localhost:3000/#/ URL
      $routeProvider
        .when('/', {
          controller: 'KeywordsController',
          templateUrl: 'app/keywords/partials/editor.html'
        })
    }
  ])
})()
