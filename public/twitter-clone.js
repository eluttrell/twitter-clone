let app = angular.module('twitter_clone', ['ui.router']);

app.config(($stateProvider, $urlRouterProvider) => {
  $stateProvider
    .state({
      name: 'home',
      url: '/',
      templateUrl: 'home.html',
      controller: 'HomeController'
    })
    .state({
      name: 'profile',
      url: '/profile',
      templateUrl: 'profile.html',
      controller: 'ProfileController'
    })
    .state({
      name: 'global',
      url: '/global',
      templateUrl: 'global.html',
      controller: 'GlobalController'
    })
    .state({
      name: 'feed',
      url: '/feed',
      templateUrl: 'feed.html',
      controller: 'FeedController'
    });

    $urlRouterProvider.otherwise('/');
});
