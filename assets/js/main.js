var when   = require('when')
  , log    = require('./log')
  , $      = require('jquery')
  , _      = require('underscore')
  ;

function showError (xhr, status, err) {
  log.error(err);
}

var api = function(path) {
  return 'https://api.github.com/' + path;
}

var userApi = function(username) {
  return api('users/' + username);
}

var username = 'dhh';



// first implementation of retrieving a user from the github api


// $.ajax({
  // url: userApi(username),
  // error: showError,
  // success: function(data, status, xhr) {
    // log.success(data);
  // }
// });



// let's get the repos for that user

// $.ajax({
  // url: userApi(username),
  // error: showError,
  // success: function(data, status, xhr) {
    // var reposUrl = data.repos_url
    // $.ajax({
      // url: reposUrl,
      // error: function(xhr, status, err) {
        // log.error(err);
      // },
      // success: function(data, status, xhr) {
        // log.success(data);
      // }
    // });
  // }
// });



// maybe i want to get the top starred repo for that user and view its issues


// $.ajax({
  // url: userApi(username),
  // error: showError,
  // success: function(data, status, xhr) {
    // var reposUrl = data.repos_url
    // $.ajax({
      // url: reposUrl,
      // error: showError,
      // success: function(data, status, xhr) {
        // var mostPopular = _.max(data, function(repo) { return repo.stargazers_count; })
        // $.ajax({
          // url: mostPopular.issues_url.replace('{/number}', ''),
          // error: showError,
          // success: function(data, status, xhr) {
            // log.success(data);
          // }
        // });
      // }
    // });
  // }
// });


// this is quickly getting out of hand and you can imagine what if there are other
// async events that need to happen after this data
//
// if this data all needs to be fetched before any of our handler logic happens
// what our code actually DOES is buried inside callback within nested callback
//
//
//
//
//
//
// a quick way to make this easier to read is to refactor out the callbacks into their
// own named functions instead of anonymous ones.
//
//

// function getIssues (data, status, xhr) {
  // var mostPopular = _.max(data, function(repo) { return repo.stargazers_count; })
  // $.ajax({
    // url: mostPopular.issues_url.replace('{/number}', ''),
    // error: function(xhr, status, err) {
      // log.error(err);
    // },
    // success: log.success
  // });
// }

// function getRepos (data, status, xhr) {
  // var reposUrl = data.repos_url
  // $.ajax({
    // url: reposUrl,
    // error: showError,
    // success: getIssues
  // });
// }

// function getUser (username) {
  // $.ajax({
    // url: userApi(username),
    // error: showError,
    // success: getRepos
  // });
// }

// getUser(username);


// this is better, still some issues with readability in following the
// flow of the code
//
// biggest issue vs sync code is that we lose the concept our functions
// having return values
//
//
//
//
//
// enter promises:
// jquery has them built in


// fetching a user

// $.ajax({url: userApi(username)}).then(function(data) { log.success(data); })


// fetching user, the most popular repo, and then its issues

// $.ajax({url: userApi(username)})
  // .then(function(data) {
    // log.success(data);
    // return $.ajax({url: data.repos_url});
  // }).then(function(data) {
    // var mostPopular = _.max(data, function(repo) { return repo.stargazers_count; })
    // return $.ajax({url: mostPopular.issues_url.replace('{/number}', '')})
  // }).then(function(data) {
    // log.success(data);
  // });


// making it even clearer with named functions

// function getUser(username) {
  // return $.ajax({url: userApi(username)});
// }

// function getRepos(userData) {
  // return $.ajax({url: userData.repos_url})
// }

// function findMostPopularRepo(reposData) {
  // return _.max(reposData, function(repo) { return repo.stargazers_count; })
// }

// function getRepoIssues(repoData) {
  // return $.ajax({url: repoData.issues_url.replace('{/number}', '')})
// }

// getUser(username)
  // .then(getRepos)
  // .then(findMostPopularRepo)
  // .then(getRepoIssues)
  // .then(log.success)



// jquery's promise library is limited and not fully up to A+ promise spec
// when.js is a robust promise library that gives us a ton of useful features
//
// how to wrap async code in a when promise?

// function get(url) {
  // return when.promise(function(resolve, reject) {
    // $.ajax({
      // url: url,
      // error: function(xhr, status, err) { reject(err); },
      // success: function(data, status, xhr) { resolve(data); }
    // });
  // });
// }

// function getUser(username) {
  // return get(userApi(username));
// }

// function getRepos(userData) {
  // return get(userData.repos_url);
// }

// function findMostPopularRepo(reposData) {
  // return _.max(reposData, function(repo) { return repo.stargazers_count; })
// }

// function getRepoIssues(repoData) {
  // return get(repoData.issues_url.replace('{/number}', ''));
// }

// getUser(username)
  // .then(getRepos)
  // .then(findMostPopularRepo)
  // .then(getRepoIssues)
  // .then(log.success)


//
// when.js gives us tap which allows us to run any functions that are side
// effects of the previous promises return value
//
//
// Using only .then()
// promise.then(function(x) {
    // doSideEffectsHere(x);
    // return x;
// });

// // Using .tap()
// promise.tap(doSideEffectsHere);
//
//
// any other "thenable" promise can be consumed and wrapped by when.js
// this is great for creating a standard interface between libraries that
// might use different promise libraries
//
//
//
// Show error handling
//
//
//
// Show .delay
//
//
// Show timeout




// Some other fancy and useful features
//
//
//
//
//
//
// when.map
//
//
//


// var users = [
  // 'aviflombaum', 'adamjonas', 'loganhasson', 'spencer1248', 'ahimmelstoss',
  // 'danielchangNYC', 'JessRudder', 'matbalez', 'ThisisEdvin', 'johnmarc',
  // 'joshrowley', 'EricR', 'ktravers', 'kvignali', 'snags88', 'caporta',
  // 'fis-spencer1248', 'abhishekpillai', 'frahman5'
// ]

// when.map(users, getUser).then(log.success)
//
//
//
//
//

// function getIssuesForMostPopularRepoForUser(username) {
  // return getUser(username)
    // .then(getRepos)
    // .then(findMostPopularRepo)
    // .then(getRepoIssues);
// }

// when.map(users, getIssuesForMostPopularRepoForUser)
  // .then(log.success);
//
//


// when.reduce
// to collect key value pairs of username => most popular repo name

// function usersMostPopularRepo (user) {
  // return getUser(user)
    // .then(getRepos)
    // .then(findMostPopularRepo)
// }



// when.reduce(when.map(users, usersMostPopularRepo), function(result, repo, index) {
  // if (_.isObject(repo)) {
    // result[repo.owner.login] = repo.name;
  // }
  // return result;
// }, {}).then(log.success);



//
//
// View docs for others
//
//
// when.filter
//
// Array Races
// when.some
// when.any
//
// when.lift
// when.sequence
// when.pipeline
//
//
// Infinite Promise Sequences
// when.iterate
//
//
// promise.with(context)
//
//
//
//
//
//
//
//
// PROMISES ARE AWESOME BECAUSE:
//
// 1. no more callbacks (kind of, at least no more pyramids)
// 2. restores the concept of a return value to asynchronous code
// 3. standard abstract interface allows us to deal with all sorts of different
//    async function in the same way with the same tools
// 4. easier consolidated error handling
// 5. the ability to chain promises together
