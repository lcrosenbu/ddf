/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
/*global define, setTimeout*/
define(['jquery', 'underscore', 'marionette'], function($, _, Marionette) {
  var RefreshController = Marionette.Controller.extend({
    expectedCalls: 2, //number of calls to done expected before stopping
    initialize: function(options) {
      var self = this
      this.callback = options.callback
      this.spinner = $(options.spinnerSelector)
      this.$button = $(options.buttonSelector)
      this.counter--
      this.$button.click(function() {
        self.startSpinner()
      })
    },
    startSpinner: function() {
      var self = this
      if (!this.spinner.hasClass('fa-spin')) {
        this.counter = this.expectedCalls
        this.spinner.addClass('fa-spin')
        setTimeout(function() {
          self.stopSpinner()
        }, 2000)
        this.callback()
      }
    },
    stopSpinner: function() {
      this.spinner.removeClass('fa-spin')
    },
    done: function() {
      this.counter--
      if (this.counter <= 0) {
        this.stopSpinner()
      }
    },
    onClose: function() {
      this.$button.off('click')
    },
  })

  var ModalExplicitDismissalBehavior = Marionette.Behavior.extend({
    onRender: function() {
      this.$el.modal({
        backdrop: 'static',
        keyboard: false,
      })
    },
  })

  var Utils = {
    /**
     * Set up the popovers based on if the selector has a description.
     */
    setupPopOvers: function($popoverAnchor, id, title, description) {
      var selector = '.description',
        options = {
          title: title,
          content: description,
          trigger: 'hover',
        }
      $popoverAnchor.find(selector).popover(options)
    },
    /**
     * Utility that handles the starting and stopping of the refresh button spin. Callers simply provide the
     * selector text and a function to invoke. When the function has completed, it must call done() to signal a
     * stop spinning.
     * @param buttonSelector Selector for the refresh button
     * @param spinnerSelector Selector for the refresh icon.
     * @param toExec A function to invoke when the refresh button is pressed. This method should call done() when
     *               it has finished to signal an end to the spinning.
     * @returns A utility for managing the spinning of the refresh button.
     */
    refreshButton: function(buttonSelector, spinnerSelector, toExec) {
      return new RefreshController({
        buttonSelector: buttonSelector,
        spinnerSelector: spinnerSelector,
        callback: toExec,
      })
    },
    /**
     * Modal to not be dismissible by clicking outside or by pressing the ESC key
     */
    modalDismissalBehavior: ModalExplicitDismissalBehavior,
  }

  return Utils
})
