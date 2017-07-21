'use strict';
angular.module('siBelApp')
  .controller('HomeCtrl', ['$scope', '$sce', '$http', function ($scope, $sce, $http) {

    // $scope.dynamicTooltip = 'Hello, World!';
    // $scope.dynamicTooltipText = 'dynamic';
    // $scope.htmlTooltip = $sce.trustAsHtml('I\'ve been made <b>bold</b>!');
    $scope.years = [1985,
      1986,
      1987,
      1988,
      1989,
      1990,
      1991,
      1992,
      1993,
      1994,
      1995,
      1996,
      1997,
      1998,
      1999,
      2000,
      2001,
      2002,
      2003,
      2004,
      2005,
      2006,
      2007,
      2008,
      2009,
      2010,
      2011,
      2012,
      2013,
      2014,
      2015,
      2016,
      2017,
    ];

      $http({
          method: 'GET',
          url: '/brendCard'
      }).then(function successCallback(res) {
          $scope.itemsBrands = res.data;
      }, function errorCallback(res) {
          console.log(res);
      });

    $scope.price = [ '1000', '2000', '3000', '4000', '5000', '6000', '7000', '8000'];

    $scope.searchParams=[];
    $scope.alerts = [];


    $scope.SelectCarsChange = function () {
      $scope.models = $scope.car.model;
    };



    $scope.Search = function () {
      $scope.Push();
      // $scope.Clear();
      console.log($scope.searchParams);
    };

    $scope.addAlert = function() {
      $scope.Push();
      // $scope.Clear();
      var array = $scope.searchParams[$scope.searchParams.length-1];

      var params_str = array.name+','+array.model+','+array.costFrom+','+array.costTo+','+array.yearFrom+','+array.yearTo;
      $scope.alerts.push({msg: params_str});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.Push = function () {
      var array = {
        name: $scope.car.name || null,
        model: $scope.model || null,
        costFrom: $scope.costFrom || null,
        costTo: $scope.costTo || null,
        yearFrom: $scope.yearFrom || null,
        yearTo: $scope.yearTo || null
      };
      if ($scope.searchParams.indexOf(array) === -1) {
        $scope.searchParams.push(array);
      } else {
        return false;
      }
    };

    // $scope.Clear = function () {
      // $scope.car.name = null;
      // $scope.model = null;
      // $scope.costFrom = null;
      // $scope.costTo = null;
      // $scope.yearFrom = null;
      // $scope.yearTo = null;
    // };


  }]);
