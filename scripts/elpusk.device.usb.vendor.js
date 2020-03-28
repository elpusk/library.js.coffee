'use strict';

(function (windows, undefined) {
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

    /**
     * @class usb vendor defined class
    */
    if (!_elpusk.device.usb.vendor) {
        _elpusk.device.usb.vendor = function( s_path ){
            /**
             * device path
             * @private
             */
            this._s_path = s_path;

            /**
             * @private
             * @function x
             * @return {string} device path.
             */

        };

        /**
         * @public
         * @function get_path
         * @return {string} device path.
         */
        _elpusk.device.usb.vendor.prototype.get_path = function()
        {
            return this._s_path;
        }        
    }


    // the end of function
    window.elpusk = _elpusk;
}(window))