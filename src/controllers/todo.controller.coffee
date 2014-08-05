### jshint strict: false ###
### jslint node: true ###
### global angular ###
'use strict'

todoApp = angular.module 'todoControllers', []

todoApp.controller 'TodoListController',
  class TodoListController
    list:  [
      title: "Hello, World!"
      description: "This is an example application using polymer."
      index: 0
    ,
      title: "Bottles of Beer"
      description: "This is going to be a very long description for
      this card. Ninety nine thousand bottles of beer on the wall.
      Ninety nine thousand bottles of beer!"
      index: 1
    ]

    addItem : ->
      console.log "Adding a new item."
      @list.push
        title: "New Todo Item"
        description: "You've just added a new item to your todo list."
        index: 2