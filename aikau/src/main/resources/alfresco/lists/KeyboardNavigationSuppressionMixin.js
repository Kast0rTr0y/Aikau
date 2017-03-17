/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * This mixin provides both the ability to request the suppression of keyboard events that are handled by 
 * the dijit/_KeyNavContainer mixin and the ability to perform the actual suppression. As such this should
 * always be mixed into a module after dijit/_KeyNavContainer as it overrides some of its functions.
 * 
 * @module alfresco/lists/KeyboardNavigationSuppressionMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dojo/on",
        "dojo/_base/event",
        "dojo/keys"], 
        function(declare, on, event, keys) {
   
   return declare(null, {
      
      /**
       * The ability to suppress keyboard navigation (e.g. the ability to move around the rendered list of items using
       * the keyboard) has been added to support widgets that allow inline editing (such as the
       * [InlineEditProperty]{@link alfresco/renderers/InlineEditProperty} widget). In order to allow their keyboard
       * events to bubble up to the browser, this widget needs to stop searching for keyboard navigation matches.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.63
       */
      suppressKeyNavigation: false,

      /**
       * Checks for the CTRL-e combination and when detected moves into edit mode.
       * 
       * @instance
       * @param {object} evt The keypress event
       */
      onKeyPress: function alfresco_lists_KeyboardNavigationSuppressionMixin__onKeyPress(evt) {
         if (evt.ctrlKey === true && evt.charCode === 101)
         {
            // On ctrl-e simulate an edit click
            evt && event.stop(evt);
            if (typeof this.onEditClick === "function")
            {
               this.onEditClick();
            }
         }
      },

      /**
       * This function is connected via the widget template. It occurs whenever a key is pressed whilst
       * focus is on the input field for updating the property value. All keypress events other than the
       * enter and escape key are ignored. Enter will save the data, escape will cancel editing
       * 
       * @instance
       * @param {object} e The key press event
       */
      onValueEntryKeyPress: function alfresco_lists_KeyboardNavigationSuppressionMixin__onValueEntryKeyPress(e) {
         if(e.charOrCode === keys.ESCAPE || e.keyCode === keys.ESCAPE)
         {
            event.stop(e);
            if (typeof this.onCancel === "function")
            {
               this.onCancel();
            }
         }
         // NOTE: This isn't currently working because Dojo form controls suppress certain keys, including ENTER...
         else if(e.charOrCode === keys.ENTER || e.keyCode === keys.ENTER)
         {
            event.stop(e);
            if (typeof this.onSave === "function")
            {
               this.onSave();
            }
         }
      },

      /**
       * Emits a custom event to notify any containers that use keyboard navigation that handling
       * keyboard events needs to be suppressed whilst editing is taking place. If the argument
       * is passed as false then it emits a custom event that indicates to containers that keyboard
       * navigation can resume.
       *
       * @instance
       * @param {boolean} suppress Whether or not to suppress keyboard navigation
       * @param {element} [node] The node to suppress navigation from.
       */
      suppressContainerKeyboardNavigation: function alfresco_lists_KeyboardNavigationSuppressionMixin__suppressContainerKeyboardNavigation(suppress, node) {
         on.emit(node || this.domNode, "onSuppressKeyNavigation", {
            bubbles: true,
            cancelable: true,
            suppress: suppress
         });
      },

      /**
       * A common use of this widget is to be placed inside a 
       * [_MultiItemRendererMixin]{@link module:alfresco/lists/views/layouts/_MultiItemRendererMixin}
       * that listens for click events on any of the DOM elements inside each row so that it can focus
       * on the correct item when clicked on. Therefore it is necessary to prevent focus being "stolen" whilst
       * clicking on the edit control so this function handles click events and prevents them from bubbling
       * any further out through the DOM.
       *
       * @instance
       * @param {object} evt The click event
       */
      suppressFocusRequest: function alfresco_lists_KeyboardNavigationSuppressionMixin__suppressFocusRequest(evt) {
         evt && event.stop(evt);
      },

      /**
       * Updates the [suppressKeyNavigation]{@link module:alfresco/lists/KeyboardNavigationSuppressionMixin#suppressKeyNavigation}
       * with the emitted event details
       *
       * @instance
       * @param {object} evt The emitted event.
       * @since 1.0.63
       */
      onSuppressKeyNavigation: function alfresco_lists_KeyboardNavigationSuppressionMixin__onSuppressKeyNavigation(evt) {
         this.suppressKeyNavigation = evt.suppress === true;
      },

      /**
       * Extends the function mixed in from the dijit/_KeyNavContainer module to perform no action when
       * [suppressKeyNavigation]{@link module:alfresco/lists/KeyboardNavigationSuppressionMixin#suppressKeyNavigation}
       * is set to true.
       * 
       * @instance
       * @param {object} evt The keyboard event
       * @since 1.0.63
       */
      _onContainerKeypress: function alfresco_lists_KeyboardNavigationSuppressionMixin___onContainerKeypress(/*jshint unused:false*/ evt) {
         if (this.suppressKeyNavigation === false)
         {
            this.inherited(arguments);
         }
      },

      /**
       * Extends the function mixed in from the dijit/_KeyNavContainer module to perform no action when
       * [suppressKeyNavigation]{@link module:alfresco/lists/KeyboardNavigationSuppressionMixin#suppressKeyNavigation}
       * is set to true.
       * 
       * @instance
       * @param {object} evt The keyboard event
       * @since 1.0.63
       */
      _onContainerKeydown: function lfresco_lists_KeyboardNavigationSuppressionMixin___onContainerKeydown(/*jshint unused:false*/ evt) {
         if (this.suppressKeyNavigation === false)
         {
            this.inherited(arguments);
         }
      }
   });
});