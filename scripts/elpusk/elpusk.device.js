/**
 * @license MIT
 * Copyright (c) 2025 Elpusk.Co.,Ltd.
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

    /** documented as elpusk */
    if (!_elpusk) {
        _elpusk = {};
    }
    /** documented as elpusk.device */
    if (!_elpusk.device) {
        'use strict';
        /**
         * @class elpusk.device
         * @classdesc Represents a device.
         * @param {string} s_path The path of the device.
        */
        _elpusk.device = function(s_path)
        {
            /**
             * The path of the device.
             * @private
             * @type {string}
             */
            this._s_path = (typeof s_path === 'string') ? s_path : '';

            /**
             * The index of the device. 0 is an undefined index number.
             * @private
             * @type {number}
             */
            this._n_device_index = 0;

        };

        /**
         * Gets the device path.
         * @returns {string} The device path.
         */
        _elpusk.device.prototype.get_path = function()
        {
            return this._s_path;
        }

        /**
         * Gets the index of the device.
         * @returns {number} The index of the device. 0 is an unknown index value.
         */
        _elpusk.device.prototype.get_device_index = function()
        {
            return this._n_device_index;
        }

        /**
         * Sets the device index when the device is opened.
         * @param {number} n_device_index The index of the device. 0 is an unknown index value.
         * @returns {void}
         */
        _elpusk.device.prototype.opened = function(n_device_index)
        {
            this._n_device_index = n_device_index;
        }

        /**
         * Resets the device index when the device is closed.
         * @returns {void}
         */
        _elpusk.device.prototype.closed = function()
        {
            this._n_device_index = 0;
        }
        
        // the end of public methods
    }


    // the end of function
    window.elpusk = _elpusk;
}(window));