/**
 * @license MIT
 * Copyright (c) 2020 Elpusk.Co.,Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

(function (window, undefined) {
    /**@private */
    var _elpusk = window.elpusk;

    if (!_elpusk) {
        _elpusk = {};
    }
    if (!_elpusk.device) {
        _elpusk.device = {};
    }
    if (!_elpusk.device.usb) {
        _elpusk.device.usb = {};
    }

    /**
     * @class
     * @classdesc This class is a base class for USB vendor-specific device implementations.
     */
    if (!_elpusk.device.usb.vendor) {
        /**
         * @constructs elpusk.device.usb.vendor
         * @param {string} s_path The device path.
         */
        _elpusk.device.usb.vendor = function( s_path ){
            /**
             * @private
             * @desc The device path.
             * @type {string}
             */
            this._s_path = s_path;
        };

        /**
         * @public
         * @description Retrieves the device path.
         * @returns {string} The device path.
         */
        _elpusk.device.usb.vendor.prototype.get_path = function()
        {
            return this._s_path;
        }        
    }
    // the end of function
    window.elpusk = _elpusk;
}(window));