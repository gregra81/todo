(function($) {
    'use strict';

    /**
     * Todo tasks services
     */
    angular.module('autodesk.todo.tasks', [])

            /**
             * Get our data from "server"
             * @param {type} $http
             * @returns {Function}
             */
            .factory('dataModels', ['$http', function($http) {

                    /**
                     * Generic http request
                     * @param {type} endpoint
                     * @returns {unresolved}
                     */
                    var doServerRequest = function(endpoint) {
                        return $http.get(endpoint).then(
                                function(res) {
                                    return res.data;
                                });
                    };

                    return{
                        tasks: function() {
                            return doServerRequest('assets/data/tasks.json');
                        },
                        assignees: function() {
                            return doServerRequest('assets/data/assignees.json');
                        }
                    };
                }]);
}());
