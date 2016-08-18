var jenkinsapi = require('jenkins-api');

var jenkins = jenkinsapi.init("https://fbeyer:quickbase1@jenkins1.ci.quickbaserocks.com");

jenkins.build('try-flow-ui', {GIT_BRANCH: 'delete_fit_finish'}, function(err, data) {
    if (err){ return console.log(err); }
    console.log(data)
});