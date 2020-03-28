
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
        'use strict';
        /**
         * @constructs elpusk.device
         * @param {string} s_path the path of device.
        */
        _elpusk.device = function(s_path)
        {
            /**
             * @type {string}
             */
            if( typeof s_path !== 'string' ){
                this._s_path = "";
            }
            else{
                this._s_path = s_path;
            }

            /**
             * @type {number}
             */
            this._n_device_index = 0;// 0 is undefined index number

        };

        /**
         * @public
         * @function get_path
         * @return {string} device path.
         */
        _elpusk.device.prototype.get_path = function()
        {
            return this._s_path;
        }

        /**
         * @public
         * @function get_device_index
         * @return {number} the index of device. 0 is unknown index value.
         */
        _elpusk.device.prototype.get_device_index = function()
        {
            return this._n_device_index;
        }

        /**
         * @public
         * @function opened
         * @param {number} n_device_index the index of device. 0 is unknown index value.
         */
        _elpusk.device.prototype.opened = function(n_device_index)
        {
            this._n_device_index = n_device_index;
        }

        /**
         * @public
         * @function closed
         */
        _elpusk.device.prototype.closed = function()
        {
            this._n_device_index = 0;
        }
        
        // the end of public methods
    }


    // the end of function
    window.elpusk = _elpusk;
}(window))