/* global angular */
'use strict';

(function () {
  var app = angular.module('app')

  app.controller(
    'KeywordsController',
    function ($scope, RepositoryFactory, resolveEntity) {
      /* resolveEntity is a helper function which is used in partials/keywordCategoryGridCell.html
         in order to display the name of a keyword category based on its id */
      $scope.resolveEntity = resolveEntity

      /* A repository is the connection between this controller and the REST Api.
         We use one for keyword categories... */
      var KeywordCategoriesRepository = new RepositoryFactory({
        endpoint: 'keywords/categories',
        retrieveItems: function (data) {
          return data._items
        }
      })

      /* ...and one for keywords */
      var KeywordsRepository = new RepositoryFactory({
        endpoint: 'keywords',
        retrieveItems: function (data) {
          return data._items
        }
      })

      KeywordCategoriesRepository.readAll().then(function (keywordCategories) {
        $scope.keywordCategories = keywordCategories
        KeywordsRepository.readAll().then(function (keywords) {
          $scope.keywords = keywords
        })
      })

      $scope.keywordsGridOptions = {
        data: 'keywords',
        enableCellSelection: false,
        enableCellEdit: true,
        keepLastSelected: false,
        enableRowSelection: false,
        multiSelect: false,
        enableSorting: true,
        enableColumnResize: true,
        enableColumnReordering: true,
        showFilter: false,
        rowHeight: '40',
        columnDefs: [{
          field: 'id',
          displayName: 'ID',
          enableCellEdit: false,
          width: '80'
        }, {
          field: 'value',
          displayName: 'Value'
        }, {
          field: 'keywordCategoryID',
          displayName: 'Category',
          cellTemplate: 'app/keywords/partials/keywordCategoryGridCell.html',
          editableCellTemplate: 'app/keywords/partials/keywordCategoryGridCellEditor.html'
        }, {
          field: '',
          displayName: 'Operations',
          cellTemplate: 'app/keywords/partials/operationsGridCell.html',
          enableCellEdit: false,
          name: 'operations',
          sortable: false
        }]
      }

      $scope.createKeyword = function (newKeyword) {
        $scope.$broadcast('ngGridEventEndCellEdit')
        if (newKeyword.value.length > 0) {
          KeywordsRepository.createOne(newKeyword).then(function () {
            KeywordsRepository.readAll().then(function (keywords) {
              $scope.keywords = keywords
            })
          })
        }
      }

      $scope.updateKeyword = function (keyword) {
        $scope.$broadcast('ngGridEventEndCellEdit')
        KeywordsRepository.updateOne(keyword)
      }

      $scope.deleteKeyword = function (keyword) {
        $scope.$broadcast('ngGridEventEndCellEdit')
        KeywordsRepository.deleteOne(keyword).then(function () {
          KeywordsRepository.readAll().then(function (keywords) {
            $scope.keywords = keywords
          })
        })
      }

      $scope.stopEditingKeywordCategory = function () {
        $scope.$broadcast('ngGridEventEndCellEdit')
      }

      $scope.$on('ngGridEventRows', function (newRows) {
        $scope.$broadcast('ngGridEventEndCellEdit')
      })
    }
  )
})()
