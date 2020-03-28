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

    /**
     * @class usb device manager
    */
    if (!_elpusk.device.usb) {
        'use strict';
        /**
         * @constructs elpusk.device.usb
         * @param {string} s_path the path of usb device.
        */
        _elpusk.device.usb = function(s_path){
            elpusk.device.call(this,s_path);
        };

        _elpusk.device.usb.prototype = Object.create(elpusk.device.prototype);
        _elpusk.device.usb.prototype.constructor = _elpusk.device.usb;
    }


    // the end of function
    window.elpusk = _elpusk;
}(window))