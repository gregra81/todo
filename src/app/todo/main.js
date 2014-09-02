(function($) {
    'use strict';

    /**
     * This module enables us to manage tasks for our team
     * @type type
     */
    angular.module('autodesk.todo', ['ui.router', 'ui.bootstrap', 'autodesk.todo.tasks'])

            /**
             * Config of the state
             * @param {type} $stateProvider - Angular ui-router state provider
             */
            .config(['$stateProvider', function config($stateProvider) {

                    //states
                    $stateProvider
                            .state('todo', {
                                abstract: true,
                                url: '/todo',
                                templateUrl: 'todo/templates/todo.tpl.html',
                                controller: 'TodoCtrl'
                            })
                            .state('todo.list', {
                                url: '/list',
                                templateUrl: 'todo/templates/todo-list.tpl.html',
                                controller: 'TaskListCtrl',
                                data: {pageTitle: 'Don\'t forget the milk'}
                            })
                            .state('todo.addTask', {
                                url: '/add',
                                templateUrl: 'todo/templates/add-task.tpl.html',
                                controller: 'TodoAddCtrl',
                                data: {pageTitle: 'Add new task'}
                            })
                            .state('todo.edit', {
                                url: '/task/:id',
                                templateUrl: 'todo/templates/add-task.tpl.html',
                                controller: 'TodoAddCtrl',
                                data: {pageTitle: 'Add new task'}
                            })
                            ;
                }])

            /**
             *
             * Todo Controller - This is a "parent" controller for the other controllers
             *      that belong to the nested states of the todo abstract state
             * @param {type} $scope
             * @param {service} dataModels - The service that fetches our data models
             */
            .controller('TodoCtrl', ['$scope', 'dataModels', function TodoCtrl($scope, dataModels) {


                    /*********************/
                    /** PRIVATE METHODS **/
                    /*********************/

                    /**
                     * Check tasks completion status
                     */
                    var setTasksCompletion = function() {
                        $scope.completedTasksCount = 0;
                        for (var i in $scope.tasks) {
                            if ($scope.tasks[i].status) {
                                $scope.completedTasksCount++;
                            }
                        }

                        $scope.inCompletedTasksCount = $scope.tasks.length - $scope.completedTasksCount;
                    };

                    /********************/
                    /** PUBLIC METHODS **/
                    /********************/

                    /**
                     * Check tasks completion
                     */
                    $scope.checkTasksCompletion = function() {
                        setTasksCompletion();
                    };


                    /***********************/
                    /** These run onload **/
                    /**********************/

                    /**
                     * Get the tasks
                     */
                    dataModels.tasks().then(function(response) {
                        $scope.tasks = response;
                        setTasksCompletion();
                    });


                    /**
                     * Get the assignees
                     */
                    dataModels.assignees().then(function(response) {
                        $scope.assignees = response;
                    });

                }])
            /**
             *
             * Task list Controller - he is a "child" controller of the todo controller in 
             *      the sense that he gets the same scope
             * @param {type} $scope
             */
            .controller('TaskListCtrl', ['$scope',
                function TodoAddCtrl($scope) {


                }])
            /**
             *
             * Add task Controller - he is a "child" controller of the todo controller in 
             *      the sense that he gets the same scope
             * @param {type} $scope
             * @param {$state} $state - Angular ui-router state helper
             */
            .controller('TodoAddCtrl', ['$scope', '$state', '$stateParams', 'dataModels',
                function TodoAddCtrl($scope, $state, $stateParams, dataModels) {

                    /*********************/
                    /** PRIVATE METHODS **/
                    /*********************/
                    /**
                     * Get current day
                     * @returns {Date|String}
                     */
                    var getNow = function() {
                        var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth() + 1; //January is 0!
                        var yyyy = today.getFullYear();
                        var hour = today.getHours();
                        var minutes = today.getMinutes();

                        if (dd < 10) {
                            dd = '0' + dd;
                        }

                        if (mm < 10) {
                            mm = '0' + mm;
                        }

                        if (hour < 10) {
                            hour = '0' + hour;
                        }

                        if (minutes < 10) {
                            minutes = '0' + minutes;
                        }

                        var now = yyyy + '-' + mm + '-' + dd + 'T' + hour + ':' + minutes + ':' + '00';
                        return now;
                    };



                    /********************/
                    /** PUBLIC METHODS **/
                    /********************/

                    /**
                     * Date stuff
                     */
                    $scope.today = function() {
                        $scope.dt = new Date();
                    };
                    $scope.today();

                    $scope.clear = function() {
                        $scope.dt = null;
                    };

                    // Disable weekend selection
                    $scope.disabled = function(date, mode) {
                        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
                    };

                    $scope.toggleMin = function() {
                        $scope.minDate = $scope.minDate ? null : new Date();
                    };
                    $scope.toggleMin();

                    $scope.open = function($event) {
                        $event.preventDefault();
                        $event.stopPropagation();

                        $scope.opened = true;
                    };

                    $scope.dateOptions = {
                        formatYear: 'yy',
                        startingDay: 1
                    };

                    $scope.initDate = new Date('2016-15-20');
                    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                    $scope.format = $scope.formats[0];


                    /**
                     * Add a new task - called from view
                     * @param {type} task
                     * @returns {undefined}
                     */
                    $scope.addOrUpdateTask = function(passedTask) {
                        
                        //If updating
                        if ($scope.task) {
                            for (var i in $scope.tasks) {
                                if ($scope.tasks[i].id === parseInt(passedTask, 10)) {
                                    $scope.tasks[i] = passedTask;
                                }
                            }
                        //else if saving new    
                        } else {
                            passedTask.status = 0;
                            passedTask.due = task.due || getNow();
                            passedTask.assignee = task.assignee || {};
                            $scope.tasks.push(passedTask);
                        }
                        $state.go('todo.list');

                    };



                    /***********************/
                    /** These run onload **/
                    /**********************/

                    //if this is an existing task
                    var taskId = $stateParams.id;
                    if (taskId) {
                        //Make sure we came from list controller first
                        if ($scope.tasks) {
                            for (var i in $scope.tasks) {
                                if ($scope.tasks[i].id === parseInt(taskId, 10)) {
                                    $scope.task = $scope.tasks[i];
                                }
                            }
                            if (!$scope.task) {
                                $state.go('todo.addTask');
                            } else {
                                //$scope.task.assignee = $scope.task.assignee.id;

                                //since JS can't realy compare objects
                                //  based on their json representation, we do ot manually
                                for (var j in $scope.assignees) {
                                    if ($scope.assignees[j].id === parseInt($scope.task.assignee.id, 10)) {
                                        $scope.task.assignee = $scope.assignees[j];
                                    }
                                }
                            }
                        } else {
                            $state.go('todo.list');
                        }
                    } else {//create
                        $state.go('todo.addTask');
                    }


                }]);

}());