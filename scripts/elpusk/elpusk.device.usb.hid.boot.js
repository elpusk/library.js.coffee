/**
 * 2020.6.12
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
 * 
 * @author developer 00000006
 * @copyright Elpusk.Co.,Ltd 2020
 * @version 1.0.0
 * @description elpusk lpu237 hid bootloader device protocol layer library.
 * <br />   2020.6.? - release 1.0. 
 * @namespace
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
        _elpusk.device = {};
    }
    /** documented as elpusk.device.usb */
    if (!_elpusk.device.usb) {
        _elpusk.device.usb = {};
    }
    /** documented as elpusk.device.usb.hid */
    if (!_elpusk.device.usb.hid) {
        _elpusk.device.usb.hid = {};
    }

    /** documented as elpusk.device.usb.hid.boot */
    if (!_elpusk.device.usb.hid.boot) {

        var _const_xxx = 3;

        /**
         * enum for changed paramemter type.
         * @private 
         * @readonly
         * @enum {number}
         */
		var _type_x = {
			x0 : 0,
			x1 : 1
		};

        /** 
         * @private 
         * @function _get_error_message
         * @param {string} s_error_name
         * @returns {string}
         * @description get error message with error name
        */                
        function _x_func(){
            //code
        }

        /**
         * @class boot
         * @classdesc this class support protocol layer for lpu237 hid booloader.
         * @constructs elpusk.device.usb.hid.boot
         * @param {string} s_path the path of usb hid boot device.
        */
        _elpusk.device.usb.hid.boot = function( s_path ){

            elpusk.device.usb.hid.call(this,s_path);
            
            /**
             * @private
             * 
             */
            this._x = [];

        };

        _elpusk.device.usb.hid.boot.prototype = Object.create(elpusk.device.usb.hid.prototype);
        _elpusk.device.usb.hid.boot.prototype.constructor = _elpusk.device.usb.hid.boot;

        /////////////////////////////////////////////////////////////////////
        // getter
        /**
         * @public
         * @function elpusk.device.usb.hid.boot.get_x
         * @returns {boolean} true - 
         * <br /> false - 
         */
        _elpusk.device.usb.hid.boot.prototype.get_x = function(){
            return  this._x;
        }


    }//the end of _elpusk.device.usb.hid.boot


    // the end of function
    window.elpusk = _elpusk;
}(window));