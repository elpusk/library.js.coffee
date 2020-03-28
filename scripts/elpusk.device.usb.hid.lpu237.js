
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
    /** documented as elpusk.device.usb */
    if (!_elpusk.device.usb.hid) {
        _elpusk.device.usb.hid = {};
    }


    /**
     * @class usb hid base class
    */
    if (!_elpusk.device.usb.hid.lpu237) {
        /** 
         * @private 
         * @constant {string} 
         * @description the definition of request data in data field.
        */                
        var _type_request_data = {
            REQ_GET_ID : "550000",
            REQ_ENTER_OPOS : "490000",
            REQ_LEAVE_OPOS : "4a0000",
            REQ_ENTER_CS : "580000",
            REQ_LEAVE_CS : "590000"
        };

        var _const_min_size_response_header = 3;


        /**
         * @constructs elpusk.device.usb.hid.lpu237
         * @param {string} s_path the path of usb hid lpu237 device.
        */
        _elpusk.device.usb.hid.lpu237 = function( s_path ){
            elpusk.device.usb.hid.call(this,s_path);
        };

        _elpusk.device.usb.hid.lpu237.prototype = Object.create(elpusk.device.usb.hid.prototype);
        _elpusk.device.usb.hid.lpu237.prototype.constructor = _elpusk.device.usb.hid.lpu237;

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.is_valid_response
         * @param {string} data field of response
         * @returns {boolean} true is valid response.
         */
        _elpusk.device.usb.hid.lpu237.prototype.is_valid_response = function(s_data_field){
            var b_result = false;

            do{
                if( typeof s_data_field !== 'string'){
                    continue;
                }
                if(s_data_field.length<(2*_const_min_size_response_header)){
                    continue;
                }
                var n_index = 0;
                if( parseInt(s_data_field.substr(n_index,2),16) !== 0x52 ){
                    continue;//invalid prefix
                }

                b_result = true;
            }while(false);
            return b_result;
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.is_good_response
         * @param {string} data field of response
         * @returns {boolean} true is that process result is good or negative good.
         */
        _elpusk.device.usb.hid.lpu237.prototype.is_good_response = function(s_data_field){
            var b_result = false;

            do{
                var n_index = 1*2;
                var n_result = parseInt(s_data_field.substr(n_index,2),16);
                switch(n_result){
                    case 0xFF:
                    case 0x80:
                        break;
                    default:
                        continue;
                }//end swtich

                b_result = true;
            }while(false);
            return b_result;
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.is_good_negative_response
         * @param {string} data field of response
         * @returns {boolean} true is that process result is negative good.
         */
        _elpusk.device.usb.hid.lpu237.prototype.is_good_negative_response = function(s_data_field){
            var b_result = false;

            do{
                var n_index = 1*2;
                var n_result = parseInt(s_data_field.substr(n_index,2),16);
                switch(n_result){
                    case 0x80:
                        break;
                    default:
                        continue;
                }//end swtich

                b_result = true;
            }while(false);
            return b_result;
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_data_field
         * @param {string} data field of response
         * @returns {string} the data field of lpu237 protocol
         */
        _elpusk.device.usb.hid.lpu237.prototype.get_data_field = function(s_data_field){
            var s_data = "";

            do{
                var n_index = 2*2;
                var n_length = parseInt(s_data_field.substr(n_index,2),16);
                if(n_length<=0){
                    continue;
                }

                n_index += 2;
                s_data = s_data_field.substr(n_index,n_length*2);

            }while(false);
            return s_data;
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_request_data_field_of_get_id
         * @return {string} hex string for get id request.
        */
        _elpusk.device.usb.hid.lpu237.prototype.get_request_data_field_of_get_id = function()
        {
            return _type_request_data.REQ_GET_ID;
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_request_data_field_of_enter_opos
         * @return {string} hex string for enter opos mode
        */
       _elpusk.device.usb.hid.lpu237.prototype.get_request_data_field_of_enter_opos = function()
       {
            return _type_request_data.REQ_ENTER_OPOS;
       }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_request_data_field_of_leave_opos
         * @return {string} hex string for leave opos mode
        */
       _elpusk.device.usb.hid.lpu237.prototype.get_request_data_field_of_leave_opos = function()
       {
            return _type_request_data.REQ_LEAVE_OPOS;
       }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_request_data_field_of_enter_cs
         * @return {string} hex string for enter config mode
        */
       _elpusk.device.usb.hid.lpu237.prototype.get_request_data_field_of_enter_cs = function()
       {
            return _type_request_data.REQ_ENTER_CS;
       }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_request_data_field_of_leave_cs
         * @return {string} hex string for leave config mode
        */
       _elpusk.device.usb.hid.lpu237.prototype.get_request_data_field_of_leave_cs = function()
       {
            return _type_request_data.REQ_LEAVE_CS;
       }

    }


    // the end of function
    window.elpusk = _elpusk;
}(window))