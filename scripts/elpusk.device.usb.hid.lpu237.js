
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
       var _type_request = {
            REQ_CHANGE_AUTH_KEY : "43",
            REQ_CHANGE_EN_KEY : "4b",

            REQ_CHANGE_STATUS : "4d",
            REQ_CHANGE_SN : "53",
            REQ_CONFIG : "41",
            REQ_APPLY : "42",

            REQ_ENTER_CS : "58",
            REQ_LEAVE_CS : "59",

            REQ_GOTO_BOOT : "47",

            REQ_ENTER_OPOS : "49",
            REQ_LEAVE_OPOS : "4a",

            REQ_IS_STANDARD : "44",
            REQ_IS_ONLY_IBUTTON : "57",
            REQ_GET_ID : "55",
            REQ_IS_MMD1000 : "N"
        };

        var _const_min_size_request_header = 3;
        var _const_min_size_response_header = 3;

        /**
         * @public
         * @function _generate_request
         * @param {string} s_type_request the type of request.  this valus is one of _type_request.
         * @param {string} s_hex_sub the type of request. 2 character hexcimal string format.
         * @param {string} s_hex_data_field the data field of request. hexcimal string format. none separator.
         * @returns {string} request data by hexcimal string format. none separator.
         */
        function _generate_request( s_type_request, s_hex_sub, s_hex_data_field ){
            var s_request = "";

            do{
                var n_length = 0;

                if( typeof s_hex_data_field === 'string' ){
                    if( s_hex_data_field.length %2 !== 0 ){
                        continue;
                    }
                    n_length = s_hex_data_field.length /2;
                }

                s_request += s_type_request;
                s_request += s_hex_sub;

                var s_lenght = n_length.toString(16);
                if( s_lenght.length % 2 !== 0 ){
                    s_lenght = "0" + s_lenght;
                }

                s_request += s_lenght;
                if( n_length > 0 ){
                    s_request += s_hex_data_field;
                }

            }while(false);
            return s_request;
        }
        
        function _generate_config_get( n_offset, n_size ){
            var s_request = "";

            do{
                if( typeof n_offset !== 'number'){
                    continue;
                }
                if( typeof n_size !== 'number' ){
                    continue;
                }
                if( n_offset< 0 ){
                    continue;
                }
                if( n_size < 0 ){
                    continue;
                }

                //todo here ...
            }while(false);
            return s_request;
        }
        

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
         * @function elpusk.device.usb.hid.lpu237.get_request_of_get_id
         * @return {string} hex string for get id request.
        */
        _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_id = function(){
            return _generate_request( _type_request.REQ_GET_ID,"00");
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_request_of_enter_opos
         * @return {string} hex string for enter opos mode
        */
       _elpusk.device.usb.hid.lpu237.prototype.get_request_of_enter_opos = function(){
            return _generate_request( _type_request.REQ_ENTER_OPOS,"00");
       }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_request_of_leave_opos
         * @return {string} hex string for leave opos mode
        */
       _elpusk.device.usb.hid.lpu237.prototype.get_request_of_leave_opos = function(){
            return _generate_request( _type_request.REQ_LEAVE_OPOS,"00");
       }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_request_of_enter_cs
         * @return {string} hex string for enter config mode
        */
       _elpusk.device.usb.hid.lpu237.prototype.get_request_of_enter_cs = function(){
            return _generate_request( _type_request.REQ_ENTER_CS,"00");
       }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_request_of_leave_cs
         * @return {string} hex string for leave config mode
        */
       _elpusk.device.usb.hid.lpu237.prototype.get_request_of_leave_cs = function(){
            return _generate_request( _type_request.REQ_LEAVE_CS,"00");
       }

       _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_version = function(){

       }

       _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_global_pre_postfix_send_condition = function(){

        }
        _elpusk.device.usb.hid.lpu237.prototype.get_request_f_get_device_support_mmd1000 = function(){

        }
        _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_interface = function(){

        }
        _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_language = function(){

        }
        _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_buzzer_frequency = function(){

        }
        _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_boot_run_time = function(){

        }
        _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_direction = function(){

        }
        _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_ibutton_prefix = function(){

        }
        _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_ibutton_postfix = function(){

        }
        _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_uart_prefix = function(){

        }
        _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_uart_postfix = function(){

        }
        _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_f12_ibutton = function(){

        }
        _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_zeros_ibutton = function(){

        }
        _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_zeros_7times_ibutton = function(){

        }
        _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_addmit_code_stick_ibutton = function(){

        }
        _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_enable_track = function(n_track){

        }
        _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_private_prefix = function(n_track){

        }
        _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_private_postfix = function(n_track){

        }
        _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_global_prefix = function(){

        }
        _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_global_postfix = function(){

        }
        _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_version = function(){

        }
        _elpusk.device.usb.hid.lpu237.prototype.get_request_of_get_version = function(){

        }
                    
    }


    // the end of function
    window.elpusk = _elpusk;
}(window))