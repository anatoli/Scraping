angular.module('siBelApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ui.router',
  'ngSanitize',
  'ngTouch',
  'ui.bootstrap',
  'pascalprecht.translate',
  'angularFileUpload',
  'file-model',
  'leaflet-directive',
  'echarts-ng',
  'ui.select'
])
  .config(function ($stateProvider, $urlRouterProvider) {
    "use strict";
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('root', {
        url: '',
        abstract: true,
        views: {
          'header': {
            // templateUrl: 'views/header.html',
            // controller: 'HeaderCtrl'
          },
          'footer': {
            // templateUrl: '/views/footer.html',
            // controller: 'FooterCtrl'
          }
          // 'sidebar':{
          //   templateUrl: 'views/layouts/sidebar.html',
          //   controller: 'SidebarCtrl'
          // }
        }
      })

      .state('root.404', {
        url: '/sorry',
        views: {
          'container@': {
            templateUrl: 'views/404.html',
            controller: 'ErrorCtrl'
          }
        }
      })
      .state('root.main', {
        url: '/',
        ncyBreadcrumb: {
          label: "Главная",
          parent: 'root'
        },
        views: {
          'container@': {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
          }
        }
      });


  });



