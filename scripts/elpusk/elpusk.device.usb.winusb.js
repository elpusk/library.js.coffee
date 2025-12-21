/**
 * @license MIT
 * Copyright (c) 2023 Elpusk.Co.,Ltd.
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
     * @classdesc Represents a USB WinUSB device, inheriting from `elpusk.device.usb`.
     * @augments elpusk.device.usb
     */
    if (!_elpusk.device.usb.winusb) {
        /**
         * @constructs elpusk.device.usb.winusb
         * @param {string} s_path The path of the USB WinUSB device.
         */
        _elpusk.device.usb.winusb = function( s_path ){
            elpusk.device.usb.call(this,s_path);
        };

        _elpusk.device.usb.winusb.prototype = Object.create(elpusk.device.usb.prototype);
        _elpusk.device.usb.winusb.prototype.constructor = _elpusk.device.usb.winusb;
    }

    // the end of function
    window.elpusk = _elpusk;
}(window));