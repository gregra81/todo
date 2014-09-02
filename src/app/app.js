(function($) {
    'use strict';

    angular.module('autodesk', [
        'templates-app',
        'templates-common',
        'autodesk.todo',
        'ui.router'
    ])

            .config(['$urlRouterProvider', function myAppConfig($urlRouterProvider) {
                    $urlRouterProvider.otherwise('todo/list');
                    

                    

                }])
            .controller('AppCtrl', ['$scope', function AppCtrl($scope) {

                    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                        if (angular.isDefined(toState.data.pageTitle)) {
                            $scope.pageTitle = toState.data.pageTitle + ' | Autodesk Test';
                        }
                    });

                }])

            ;

}());