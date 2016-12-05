(function () {
    'use strict';

    angular.module('mk.timepicker', [])
        .directive('timePicker', ['$log', '$window', function ($log, $window) {
            return {
                restrict: 'A',
                require: 'ngModel',
                scope: {
                },
                link: function (scope, element, attrs, ngModelCtrl) {
                    var maxlength = 5;

                    function hoursToMs(hours) {
                        if (hours && hours > 0) {
                            return hours * 60 * 60 * 1000;
                        } else {
                            return 0;
                        }
                    }

                    function minutesToMs(minutes) {
                        if (minutes && minutes > 0) {
                            return minutes * 60 * 1000;
                        } else {
                            return 0;
                        }
                    }

                    function containsColon(str) {
                        var values = str.split('');
                        for (var i = 0; i < values.length; i++) {
                            if (values[i] === ':') {
                                return true;
                            }
                        }
                        return false;
                    }

                    var invalidate = function () {
                        ngModelCtrl.$setValidity('time', false);
                        ngModelCtrl.$render();
                    };

                    var validate = function () {
                        ngModelCtrl.$setValidity('time', true);
                        ngModelCtrl.$render();
                    };

                    ngModelCtrl.$parsers.push(function (viewValue) {
                        var value, values, hours, minutes = null;
                        if (viewValue.length === 4) {
                            values = viewValue.split('');
                            hours = parseInt(values[0] + '' + values[1]);
                            minutes = parseInt(values[2] + '' + values[3]);
                            value = hoursToMs(hours) + minutesToMs(minutes);

                            if (!containsColon(viewValue)) {
                                render(values[0] + '' + values[1] + ':' + values[2] + '' + values[3]);
                            }

                            if (value > 86400000) invalidate();
                            else validate();

                            return value;
                        }
                        else if (viewValue.length === 5) {
                            values = viewValue.split('');
                            //values = viewValue.split('');

                            hours = parseInt(values[0] + values[1]);
                            minutes = parseInt(values[3] + values[4]);

                            value = hoursToMs(hours) + minutesToMs(minutes);

                            if (value > 86400000 || !containsColon(viewValue)) invalidate();
                            else validate();
                            return value;
                        }
                        return null;
                    });

                    ngModelCtrl.$formatters.push(function (modelValue) {
                        var hours = null;
                        var minutes = null;
                        var value = null;
                        if (modelValue == null) return modelValue;

                        modelValue = parseInt(modelValue || 0);

                        hours = Math.floor(modelValue / 1000 / 60 / 60);
                        minutes = (modelValue / 1000 / 60) % 60;
                        value = (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);

                        return value;
                    });


                    element.addClass('timepicker');

                    element.on('click', function () {
                        if (!$window.getSelection().toString()) {
                            // Required for mobile Safari
                            this.setSelectionRange(0, this.value.length);
                        }
                    });

                    element.on('change keypress focus textInput input', function (e) {
                        if (e.charCode) {
                            if (!(e.charCode >= 48 && e.charCode <= 58 || e.charCode == 0)) {
                                e.preventDefault();
                            }
                        }
                    });


                    element.on('paste', function (e) {
                        e.preventDefault();
                    });

                    element.on('blur', function () {
                        if (ngModelCtrl.$viewValue != null) {
                            if (ngModelCtrl.$viewValue.length === 1) {
                                if (ngModelCtrl.$viewValue === "0") {
                                    render(ngModelCtrl.$viewValue + '0:00');
                                } else {
                                    render('0' + ngModelCtrl.$viewValue + ':00');
                                }
                            } else if (ngModelCtrl.$viewValue.length === 2) {
                                render(ngModelCtrl.$viewValue + ':00');
                            } else if (ngModelCtrl.$viewValue.length === 3) {
                                if (containsColon(ngModelCtrl.$viewValue)) {
                                    render(ngModelCtrl.$viewValue + '00');
                                } else {
                                    render(ngModelCtrl.$viewValue + '0');
                                }
                            } else if (ngModelCtrl.$viewValue.length === 4) {
                                if (containsColon(ngModelCtrl.$viewValue)) {
                                    render(ngModelCtrl.$viewValue + '0');
                                } else {
                                    render(ngModelCtrl.$viewValue + '');
                                }
                            }
                        }
                    });

                    function render(value) {
                        ngModelCtrl.$setViewValue(value);
                        ngModelCtrl.$render();
                    }


                },
            };
        }]);
})();