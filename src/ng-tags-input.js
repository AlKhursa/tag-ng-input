(function() {
'use strict';

/**
 * @ngdoc directive
 * @name tagsInput.directive:tagsInput
 *
 * @description
 * ngTagsInput is an Angular directive that renders an input box with tag editing support.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string} ngClass CSS class to style the control.
 * @param {number} tabindex Tab order of the control.
 * @param {string=Add a tag} placeholder Placeholder text for the control.
 * @param {number=3} minLength Minimum length for a new tag.
 * @param {number=} maxLength Maximum length allowed for a new tag.
 * @param {string=×} removeTagSymbol Symbol character for the remove tag button.
 * @param {boolean=true} addOnEnter Flag indicating that a new tag will be added on pressing the ENTER key.
 * @param {boolean=false} addOnSpace Flag indicating that a new tag will be added on pressing the SPACE key.
 * @param {boolean=true} addOnComma Flag indicating that a new tag will be added on pressing the COMMA key.
 * @param {boolean=true} replaceSpacesWithDashes Flag indicating that spaces will be replaced with dashes.
 * @param {string=^[a-zA-Z0-9\s]+$*} allowedTagsPattern Regular expression that determines whether a new tag is valid.
 * @param {boolean=false} enableEditingLastTag Flag indicating that the last tag will be moved back into
 *                                             the new tag input box instead of being removed when the backspace key
 *                                             is pressed and the input box is empty.
 */

angular.module('tags-input', []).directive('tagsInput', function() {
    function toBool(value, defaultValue) {
        return angular.isDefined(value) ? value === 'true' : defaultValue;
    }
    
    function loadOptions(scope, attrs) {
        scope.options = {
            placeholder: attrs.placeholder || 'Add a tag',
            tabindex: attrs.tabindex,
            removeTagSymbol: attrs.removeTagSymbol || String.fromCharCode(215),
            replaceSpacesWithDashes: toBool(attrs.replaceSpacesWithDashes, true),
            minLength: attrs.minLength || 3,
            maxLength: attrs.maxLength || '',
            addOnEnter: toBool(attrs.addOnEnter, true),
            addOnSpace: toBool(attrs.addOnSpace, false),
            addOnComma: toBool(attrs.addOnComma, true),
            allowedTagsPattern: new RegExp(attrs.allowedTagsPattern || '^[a-zA-Z0-9\\s]+$'),
            enableEditingLastTag: toBool(attrs.enableEditingLastTag, false)
        };
    }

    return {
        restrict: 'A,E',
        scope: { tags: '=ngModel', cssClass: '@ngClass' },
        replace: false,
        template: '<div class="ngTagsInput {{ cssClass }}">' +
                  '  <ul>' +
                  '    <li ng-repeat="tag in tags" ng-class="getCssClass($index)">' +
                  '      <span>{{ tag }}</span>' +
                  '      <button type="button" ng-click="remove($index)">{{ options.removeTagSymbol }}</button>' +
                  '    </li>' +
                  '  </ul>' +
                  '  <input type="text" placeholder="{{ options.placeholder }}" size="{{ options.placeholder.length }}" maxlength="{{ options.maxLength }}" tabindex="{{ options.tabindex }}" ng-model="newTag">' +
                  '</div>',
        controller: ['$scope', '$attrs', function($scope, $attrs) {
            loadOptions($scope, $attrs);

            $scope.newTag = '';
            $scope.tags = $scope.tags || [];

            $scope.tryAdd = function() {
                var changed = false;
                var tag = $scope.newTag;

                if (tag.length >= $scope.options.minLength && $scope.options.allowedTagsPattern.test(tag)) {

                    if ($scope.options.replaceSpacesWithDashes) {
                        tag = tag.replace(/\s/g, '-');
                    }

                    if ($scope.tags.indexOf(tag) === -1) {
                        $scope.tags.push(tag);
                    }

                    $scope.newTag = '';
                    changed = true;
                }
                return changed;
            };

            $scope.tryRemoveLast = function() {
                var changed = false;
                if ($scope.tags.length > 0) {
                    if ($scope.options.enableEditingLastTag) {
                        $scope.newTag = $scope.tags.pop();
                    }
                    else {
                        if ($scope.shouldRemoveLastTag) {
                            $scope.tags.pop();

                            $scope.shouldRemoveLastTag = false;
                        }
                        else {
                            $scope.shouldRemoveLastTag = true;
                        }
                    }
                    changed = true;
                }
                return changed;
            };

            $scope.remove = function(index) {
                $scope.tags.splice(index, 1);
            };

            $scope.getCssClass = function(index) {
                var isLastTag = index === $scope.tags.length - 1;
                return $scope.shouldRemoveLastTag && isLastTag ? 'selected' : '';
            };

            $scope.$watch(function() { return $scope.newTag.length > 0; }, function() {
                $scope.shouldRemoveLastTag = false;
            });

        }],
        link: function(scope, element) {
            var ENTER = 13, COMMA = 188, SPACE = 32, BACKSPACE = 8;

            element.find('input')
                .bind('keydown', function(e) {
                    if (e.keyCode === ENTER && scope.options.addOnEnter ||
                        e.keyCode === COMMA && scope.options.addOnComma ||
                        e.keyCode === SPACE && scope.options.addOnSpace) {

                        if (scope.tryAdd()) {
                            scope.$apply();
                        }
                        e.preventDefault();
                    }
                    else if (e.keyCode === BACKSPACE && this.value.length === 0) {
                        if (scope.tryRemoveLast()) {
                            scope.$apply();

                            e.preventDefault();
                        }
                    }
                });

            element.find('div').bind('click', function() {
                element.find('input')[0].focus();
            });
        }
    };
});
}());
