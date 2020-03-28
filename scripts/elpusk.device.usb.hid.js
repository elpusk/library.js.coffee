
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
     * @class usb hid base class
    */
    if (!_elpusk.device.usb.hid) {

        'use strict';
        /**
         * @constructs elpusk.device.usb.hid
         * @param {string} s_path the path of usb hid device.
        */
        _elpusk.device.usb.hid = function( s_path ){
            elpusk.device.usb.call(this,s_path);
        };

        _elpusk.device.usb.hid.prototype = Object.create(elpusk.device.usb.prototype);
        _elpusk.device.usb.hid.prototype.constructor = _elpusk.device.usb.hid;
    }


    // the end of function
    window.elpusk = _elpusk;
}(window))