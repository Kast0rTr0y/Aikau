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
 * Test class for the Dashlet widget.
 *
 * @author Dave Draper
 */
define(["module",
        "alfresco/TestCommon",
        "intern/chai!assert",
        "alfresco/defineSuite",
        "intern/dojo/node!leadfoot/keys"],
        function(module, TestCommon, assert, defineSuite, keys) {

   defineSuite(module, {
      name: "Infinite Scrolling Dashlet Tests",
      testPage: "/InfiniteScrollDashlet",

      "Scroll to bottom of first dashlet body": function() {
         var numRowsBeforeResize;
         return this.remote.findAllByCssSelector("#INFINITE_SCROLL_LIST_1 tr")
            .then(function(elements) {
               numRowsBeforeResize = elements.length;
            })
            .end()

         .findByCssSelector("#INFINITE_SCROLL_LIST_1 tr:nth-child(1) .alfresco-renderers-Property")
            .click()
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .end()

         .getLastPublish("BELOW_ALF_EVENTS_SCROLL", "List scroll event not registered")
            .end()

         .findAllByCssSelector("#INFINITE_SCROLL_LIST_1 tr")
            .then(function(elements) {
               assert(elements.length > numRowsBeforeResize, "Additional rows were not loaded when the bottom of the list was reached");
            });
      },

      "Scroll to bottom of second dashlet body": function() {
         // Click on the first row to give it focus...
         return this.remote.findByCssSelector("#INFINITE_SCROLL_LIST_2 tr:nth-child(1) .alfresco-renderers-Property")
            .clearLog()
            .click()
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .end()

         .getLastPublish("ABOVE_ALF_EVENTS_SCROLL", "List scroll event not registered")

         .getLastPublish("ABOVE_ALF_DOCLIST_REQUEST_FINISHED", "More data not loaded")

         .findAllByCssSelector("#INFINITE_SCROLL_LIST_2 tr")
            .then(function(elements) {
               assert.lengthOf(elements, 40, "Additional rows were not loaded when the bottom of the list was reached");
            });
      },

      // This does not work in Chrome currently, however we expect the FF test to pass, so this provides some level of regression testability
      "Resizing first dashlet prompts data-load": function() {
         TestCommon.skipIf(this, "environment", "chrome");

         var numRowsBeforeResize;
         return this.remote.findAllByCssSelector("#INFINITE_SCROLL_LIST_1 tr")
            .then(function(elements) {
               numRowsBeforeResize = elements.length;
            })
            .end()

         .findByCssSelector("#BELOW_DASHLET .alfresco-dashlets-Dashlet__resize-bar__icon")
            .moveMouseTo(0, 0)
            .pressMouseButton()
            .moveMouseTo(0, 50)
            .releaseMouseButton()
            .end()

         .findAllByCssSelector("#INFINITE_SCROLL_LIST_1 tr")
            .then(function(elements) {
               assert(elements.length > numRowsBeforeResize, "Additional rows were not loaded when the dashlet was resized");
            });
      }
   });
});