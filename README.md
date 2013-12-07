ngTagsInput
===========
[![Build Status](https://travis-ci.org/mbenford/ngTagsInput.png?branch=master)](https://travis-ci.org/mbenford/ngTagsInput)

Tags input directive for AngularJS. Check out the [ngTagsInput website](http://mbenford.github.io/ngTagsInput) for more information.

## Requirements

 - AngularJS 1.2+
 - A modern browser

## Installing

Download either `ng-tags-input.min.zip` or `ng-tags-input.zip` from the [Releases page](https://github.com/mbenford/ngTagsInput/releases) and add its content files to your web application. Make sure the JavaScript file is included after the AngularJS script.

You can also use Bower to install all files at once. Just run `bower install ng-tags-input`.

## Usage

 1. Add the `tags-input` module as a dependency in your AngularJS app;
 2. Add the custom directive `<tags-input>` to the HTML file where you want to use an input tag control and bind it to a property of your model. That property, if it exists, must be an array of strings;
 3. Set up the options that make sense to your application;
 4. Enable autocomplete, if you want to use it, by adding the directive `<auto-complete>` inside the `<tags-input>` tag, and bind it to a function of your model. That function must return a promise;
 5. Customize the CSS classes, if you want to.
 6. You're done!

## Example
    <html>
    <head>
        <script src="angular.min.js"></script>
        <script src="ng-tags-input.min.js"></script>
        <link rel="stylesheet" type="text/css" href="ng-tags-input.min.css">               
        <script>
            angular.module('myApp', ['tags-input'])
                .controller('MyCtrl', function($scope, $http) {
                    $scope.tags = ['just','some','cool','tags'];
                    $scope.loadTags = function(query) {
                        return $http.get('/tags?query=' + query);
                    }
                });
        </script>
    </head>
    <body ng-app="myApp" ng-controller="MyCtrl">
        <tags-input ng-model="tags">
            <auto-complete source="loadTags($query)"></auto-complete>
        </tags-input>
    </body>
    </html>    

## Options

Check out the [documentation](http://mbenford.github.io/ngTagsInput/documentation.html) page for a detailed view of all available options.

## Demo

You can see the directive in action in the [demo page](http://mbenford.github.io/ngTagsInput/demos.html).

## Building from the source code

Building the directive is a five-step process:

- Install Node.js;
- Install PhantomJS;
- Run `npm install -g grunt-cli karma` to install grunt-cli and karma globally;
- Run `npm install` to install the development dependencies;
- Run `grunt` to build the directive.

While coding you can execute `grunt test` to run the tests or `grunt watch` to run them automatically every time the source code files change.

## License

See the [LICENSE](https://github.com/mbenford/ngTagsInput/blob/master/LICENSE "") file.

## Changelog

See the [ChangeLog](https://github.com/mbenford/ngTagsInput/blob/master/ChangeLog) file.