var appTodos = angular.module('todosApp', ['ngRoute', 'oitozero.ngSweetAlert', 'ngStorage', 'ngAnimate', 'ngDialog', 'ui.bootstrap']);

appTodos.config(function (ngDialogProvider) {
    ngDialogProvider
        .setDefaults({
            className: 'ngdialog-theme-default',
            showClose: true,
            closeByDocument: true,
            closeByEscape: true
        });
    ngDialogProvider.setForceHtmlReload(true);
});