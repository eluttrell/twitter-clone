const app = angular.module('twitter-clone', ['ui.router', 'ngCookies']);

// ========================
// SERVICE
// ========================

app.factory('TwitterFactory', function($http, $state, $cookies) {
    let service = {};

    service.showGlobal = function() {
        let url = '/global';
        return $http({
            method: 'GET',
            url: url
        });
    };

    service.showProfile = function(username) {
        let url = '/profile';
        return $http({
            method: 'GET',
            params: {
                username: username
            },
            url: url
        });
    };

    service.showTimeline = function() {
        let url = '/timeline';
        return $http({
            method: 'GET',
            params: {
                username: 'eliastheredbearded'
            },
            url: url
        });
    };

    service.showLogin = function(data) {
        let url = '/login';
        return $http({
                method: 'POST',
                data: data,
                url: url
            })
            .then(function(loggedIn) {
                // Put information to be stored as cookies here:
                $cookies.putObject('username', loggedIn.data.info.user_id);
                $cookies.putObject('token', loggedIn.data.info.token);
                $cookies.putObject('expiry', loggedIn.data.info.timestamp);
                console.log("Info:", loggedIn.data.info);
            });
    };

    service.showSignup = function(data) {
        let url = '/signup';
        return $http({
          method: 'POST',
          data: data,
          url: url
        });
    };

    return service;
});




// ========================
// CONTROLLERS
// ========================

app.controller('GlobalController', function($scope, $state, TwitterFactory) {
    TwitterFactory.showGlobal()
        .then(function(results) {
            $scope.results = results.data.response;
        })
        .catch(function(err) {
            console.error('Error!');
            console.log(err.message);
        });
});


app.controller('HomeController', ($scope, $state, TwitterFactory) => {

});

app.controller('LoginController', function($scope, $state, TwitterFactory) {
    $scope.login = function() {
        var data = {
            username: $scope.username,
            password: $scope.password
        }
        TwitterFactory.showLogin(data)
            .then(function() {
                $state.go('profile');
            })
            .catch(function(err) {
                console.log("Failed:", err.message);
            });
    };
});

app.controller('ProfileController', function($scope, $state, $stateParams, TwitterFactory) {
    var username = $stateParams.username;
    TwitterFactory.showProfile()
        .then(function(results) {
            $scope.results = results.data.response;
        })
        .catch(function(err) {
            console.error('Error!');
            console.log(err.message);
        });
});


app.controller('SignupController', function($scope, $state, TwitterFactory) {
    $scope.signUp = function() {
        let data = {
            username: $scope.username,
            email: $scope.email,
            password: $scope.password
        };
        TwitterFactory.showSignup(data)
            .then(function(results) {
                console.log('showSignup step 1');
                return results;
            })
            .then(function() {
                return TwitterFactory.showLogin(data);
            })
            .then(function() {
                $state.go('global');
            })
            .catch(function(err) {
                console.log("Failed:", err.stack);
            });
          ;
    }
});

app.controller('TimelineController', function($scope, $state, TwitterFactory) {
    TwitterFactory.showTimeline()
        .then(function(results) {
            $scope.results = results.data.results;
        })
        .catch(function(err) {
            console.log('Error!');
            console.log((err.message));
        });
});



// ========================
// STATES
// ========================

app.config(($stateProvider, $urlRouterProvider) => {
    $stateProvider
        .state({
            name: 'home',
            url: '/',
            templateUrl: '/templates/home.html',
            controller: 'HomeController'
        })
        .state({
            name: 'profile',
            url: '/profile',
            templateUrl: '/templates/profile.html',
            controller: 'ProfileController'
        })
        .state({
            name: 'global',
            url: '/global',
            templateUrl: '/templates/global.html',
            controller: 'GlobalController'
        })
        .state({
            name: 'timeline',
            url: '/timeline',
            templateUrl: '/templates/timeline.html',
            controller: 'TimelineController'
        })
        .state({
            name: 'signup',
            url: '/signup',
            templateUrl: '/templates/signup.html',
            controller: 'SignupController'
        })
        .state({
            name: 'login',
            url: '/login',
            templateUrl: '/templates/login.html',
            controller: 'LoginController'
        });

    $urlRouterProvider.otherwise('/');
});
