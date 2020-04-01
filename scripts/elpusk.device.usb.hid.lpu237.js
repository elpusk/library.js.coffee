
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
         * @constant {number}
         * @description the offset value of system parameters.
         */
        var _type_system_offset = {
            SYS_OFFSET_VERSION : 28,
            SYS_OFFSET_NAME : 12,
            SYS_OFFSET_G_TAG_CONDITION : 83,
            SYS_OFFSET_INTERFACE : 42,
            SYS_OFFSET_KEYMAP : 103,
            SYS_OFFSET_BUZZER_FREQ : 43,
            SYS_OFFSET_BOOT_RUN_TIME : 51,
            SYS_OFFSET_ENABLE_TRACK : [171,358,545],
            SYS_OFFSET_DIRECTION : [201,388,575],
            SYS_OFFSET_G_PRE : 141,
            SYS_OFFSET_G_POST : 156,
            SYS_OFFSET_P_PRE : [244,431,618],
            SYS_OFFSET_P_POST : [289,476,663],
            SYS_OFFSET_IBUTTON_G_PRE : 762,
            SYS_OFFSET_IBUTTON_G_POST : 777,
            SYS_OFFSET_UART_G_PRE : 822,
            SYS_OFFSET_UART_G_POST : 837,
            SYS_OFFSET_F12_IBUTTON : 0,
            SYS_OFFSET_ZEROS_IBUTTON : 0,
            SYS_OFFSET_ZERO_7TIMES_IBUTTON : 0,
            SYS_OFFSET_ADDMIT_CODE_STCIK_IBUTTON : 0
        };
        var _type_system_size = {
            SYS_SIZE_VERSION : 4,
            SYS_SIZE_NAME : 16,
            SYS_SIZE_G_TAG_CONDITION : 4,
            SYS_SIZE_INTERFACE : 1,
            SYS_SIZE_KEYMAP : 4,
            SYS_SIZE_BUZZER_FREQ : 4,
            SYS_SIZE_BOOT_RUN_TIME : 4,
            SYS_SIZE_ENABLE_TRACK : [1,1,1],
            SYS_SIZE_DIRECTION : [1,1,1],
            SYS_SIZE_G_PRE : 15,
            SYS_SIZE_G_POST : 15,
            SYS_SIZE_P_PRE : [15,15,15],
            SYS_SIZE_P_POST : [15,15,15],
            SYS_SIZE_IBUTTON_G_PRE : 15,
            SYS_SIZE_IBUTTON_G_POST : 15,
            SYS_SIZE_UART_G_PRE : 15,
            SYS_SIZE_UART_G_POST : 15,
            SYS_SIZE_F12_IBUTTON : 4,
            SYS_SIZE_ZEROS_IBUTTON : 4,
            SYS_SIZE_ZERO_7TIMES_IBUTTON : 4,
            SYS_SIZE_ADDMIT_CODE_STCIK_IBUTTON : 4
        };

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

        function _first_version_greater_then_second_version(first_version,second_version){
            var b_result = false;

            do{
                if( !Array.isArray(first_version) && (typeof(first_version) !== 'number') ){
                    continue;
                }
                if( !Array.isArray(second_version) && (typeof(second_version) !== 'number') ){
                    continue;
                }

                var ar1 = [0,0,0,0];
                var ar2 = [0,0,0,0];
                var n_check =ar1.length;

                if( typeof first_version === 'number'){
                    ar1[0] = first_version;
                }
                else{
                    n_check =ar1.length;
                    if( first_version.length < n_check){
                        n_check = first_version.length;
                    }
                    for( var i = 0; i<n_check; i++ ){
                        ar1[i] = first_version[i];
                    }//end for
                }

                if( typeof second_version === 'number'){
                    ar2[0] = second_version;
                }
                else{
                    n_check =ar2.length;
                    if( second_version.length < n_check){
                        n_check = second_version.length;
                    }
                    for( var i = 0; i<n_check; i++ ){
                        ar2[i] = second_version[i];
                    }//end for
                }

                var j = 0;
                if( ar1[j] < ar2[j] ){
                    continue;
                }
                if( ar1[j] > ar2[j] ){
                    b_result = true;
                    continue;
                }

                j++;
                if( ar1[j] < ar2[j] ){
                    continue;
                }
                if( ar1[j] > ar2[j] ){
                    b_result = true;
                    continue;
                }

                j++;
                if( ar1[j] < ar2[j] ){
                    continue;
                }
                if( ar1[j] > ar2[j] ){
                    b_result = true;
                    continue;
                }

                j++;
                if( ar1[j] <= ar2[j] ){
                    continue;
                }

                b_result = true;

            }while(false);
            return b_result;
        }
        /**
         * @private
         * @function _get_dword_hex_string
         * @param {number} dw_data unsigned int - double word number.
         * @returns {string} little endian double word hex string format. always 8 characters.
         */
        function _get_dword_hex_string( dw_data ){
            var s_big_hex = dw_data.toString(16);

            s_big_hex = s_big_hex.replace(/^(.(..)*)$/, "0$1"); // add a leading zero if needed
            var n_need_zeros = 4*2 - s_big_hex.length;
            for( var i = 0; i<n_need_zeros; i++ ){
                s_big_hex = "0" + s_big_hex;    //padding for dword.
            }//end for

            var a = s_big_hex.match(/../g);     // split number in groups of two
            a.reverse();                        // reverse the groups

            var s_little_hex = a.join("");
            return s_little_hex;
        }

        /**
         * @private
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
        
        /**
         * @private
         * @function _generate_config_get
         * @param {number} n_offset the offset of a system parameter.
         * @param {number} n_size the size of a system parameter.
         * @returns {string} request data by hexcimal string format. none separator.
         */
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

                var s_offset = _get_dword_hex_string( n_offset )
                var s_size = _get_dword_hex_string(n_size);
                var s_data = s_offset + s_size;

                s_request = _generate_request(REQ_CONFIG,"00",s_data);
            }while(false);
            return s_request;
        }
        
        /**
         * @public
         * @function _generate_get_version
         * @return {string} hex string for get version request
        */
       function _generate_get_version(){
            var n_offset = _type_system_offset.SYS_OFFSET_VERSION;
            var n_size = system_size.SYS_OFFSET_VERSION;;
            return _generate_config_get(n_offset,n_size);
    }

        function _generate_get_name(){
            var n_offset = _type_system_offset.SYS_OFFSET_NAME;
            var n_size = _type_system_size.SYS_OFFSET_NAME;
            return _generate_config_get(n_offset,n_size);
        }

        function _generate_get_device_support_mmd1000(){
            return _generate_request( _type_request.REQ_IS_MMD1000,"00");
        }

        /**
         * @private
         * @function _generate_get_uid
         * @return {string} hex string for get id request.
        */
        function _generate_get_uid(){
            return _generate_request( _type_request.REQ_GET_ID,"00");
        }
        function _generate_get_device_ibutton_type(){
            return _generate_request( _type_request.REQ_IS_ONLY_IBUTTON,"00");
        }
        function _generate_get_device_type(){
            return _generate_request( _type_request.REQ_IS_STANDARD,"00");
        }

        function _get_request_of_get_global_pre_postfix_send_condition(){
            var n_offset = _type_system_offset.SYS_OFFSET_G_TAG_CONDITION;
            var n_size = _type_system_size.SYS_OFFSET_G_TAG_CONDITION;
            return _generate_config_get(n_offset,n_size);
        }

        function _get_request_of_get_interface(){
            var n_offset = _type_system_offset.SYS_OFFSET_INTERFACE;
            var n_size = _type_system_size.SYS_OFFSET_INTERFACE;
            return _generate_config_get(n_offset,n_size);
        }
        function _get_request_of_get_language(){
            var n_offset = _type_system_offset.SYS_OFFSET_KEYMAP;
            var n_size = _type_system_size.SYS_OFFSET_KEYMAP;
            return _generate_config_get(n_offset,n_size);
        }
        function _get_request_of_get_buzzer_frequency(){
            var n_offset = _type_system_offset.SYS_OFFSET_BUZZER_FREQ;
            var n_size = _type_system_size.SYS_OFFSET_BUZZER_FREQ;
            return _generate_config_get(n_offset,n_size);
        }
        function _get_request_of_get_boot_run_time(){
            var n_offset = _type_system_offset.SYS_OFFSET_BOOT_RUN_TIME;
            var n_size = _type_system_size.SYS_OFFSET_BOOT_RUN_TIME;
            return _generate_config_get(n_offset,n_size);
        }
        function _get_request_of_get_enable_track(n_track){
            var s_request = "";
            switch(n_track){
                case 0:
                    n_offset = _type_system_offset.SYS_OFFSET_ENABLE_TRACK[n_track];
                    n_size = _type_system_size.SYS_OFFSET_ENABLE_TRACK[n_track];
                    s_request = _generate_config_get(n_offset,n_size);
                    break;
                case 1:
                    n_offset = _type_system_offset.SYS_OFFSET_ENABLE_TRACK[n_track];
                    n_size = _type_system_size.SYS_OFFSET_ENABLE_TRACK[n_track];
                    s_request = _generate_config_get(n_offset,n_size);
                    break;
                case 2:
                    n_offset = _type_system_offset.SYS_OFFSET_ENABLE_TRACK[n_track];
                    n_size = _type_system_size.SYS_OFFSET_ENABLE_TRACK[n_track];
                    s_request = _generate_config_get(n_offset,n_size);
                    break;
                default:
                    break;
            }//end switch
            return s_request;      
        }

        function _get_request_of_get_direction(n_track){
            var s_request = "";
            switch(n_track){
                case 0:
                    n_offset = _type_system_offset.SYS_OFFSET_DIRECTION[n_track];
                    n_size = _type_system_size.SYS_OFFSET_DIRECTION[n_track];
                    s_request = _generate_config_get(n_offset,n_size);
                    break;
                case 1:
                    n_offset = _type_system_offset.SYS_OFFSET_DIRECTION[n_track];
                    n_size = _type_system_size.SYS_OFFSET_DIRECTION[n_track];
                    s_request = _generate_config_get(n_offset,n_size);
                    break;
                case 2:
                    n_offset = _type_system_offset.SYS_OFFSET_DIRECTION[n_track];
                    n_size = _type_system_size.SYS_OFFSET_DIRECTION[n_track];
                    s_request = _generate_config_get(n_offset,n_size);
                    break;
                default:
                    break;
            }//end switch
            return s_request;      
        }

        function _get_request_of_get_global_prefix(){
            var n_offset = _type_system_offset.SYS_OFFSET_G_PRE;
            var n_size = _type_system_size.SYS_OFFSET_G_PRE;
            return _generate_config_get(n_offset,n_size);
        }
        function _get_request_of_get_global_postfix(){
            var n_offset = _type_system_offset.SYS_OFFSET_G_POST;
            var n_size = _type_system_size.SYS_OFFSET_G_POST;
            return _generate_config_get(n_offset,n_size);
        }
        function _get_request_of_get_private_prefix(n_track){
            var s_request = "";
            switch(n_track){
                case 0:
                    n_offset = _type_system_offset.SYS_OFFSET_P_PRE[n_track];
                    n_size = _type_system_size.SYS_OFFSET_P_PRE[n_track];
                    s_request = _generate_config_get(n_offset,n_size);
                    break;
                case 1:
                    n_offset = _type_system_offset.SYS_OFFSET_P_PRE[n_track];
                    n_size = _type_system_size.SYS_OFFSET_P_PRE[n_track];
                    s_request = _generate_config_get(n_offset,n_size);
                    break;
                case 2:
                    n_offset = _type_system_offset.SYS_OFFSET_P_PRE[n_track];
                    n_size = _type_system_size.SYS_OFFSET_P_PRE[n_track];
                    s_request = _generate_config_get(n_offset,n_size);
                    break;
                default:
                    break;
            }//end switch
            return s_request;      
        }

        function _get_request_of_get_private_postfix(n_track){
            var s_request = "";
            switch(n_track){
                case 0:
                    n_offset = _type_system_offset.SYS_OFFSET_P_POST[n_track];
                    n_size = _type_system_size.SYS_OFFSET_P_POST[n_track];
                    s_request = _generate_config_get(n_offset,n_size);
                    break;
                case 1:
                    n_offset = _type_system_offset.SYS_OFFSET_P_POST[n_track];;
                    n_size = _type_system_size.SYS_OFFSET_P_POST[n_track];
                    s_request = _generate_config_get(n_offset,n_size);
                    break;
                case 2:
                    n_offset = _type_system_offset.SYS_OFFSET_P_POST[n_track];;
                    n_size = _type_system_size.SYS_OFFSET_P_POST[n_track];
                    s_request = _generate_config_get(n_offset,n_size);
                    break;
                default:
                    break;
            }//end switch
            return s_request;      
        }

        function _get_request_of_get_ibutton_prefix(){
            var n_offset = _type_system_offset.SYS_OFFSET_IBUTTON_G_PRE;
            var n_size = _type_system_size.SYS_OFFSET_IBUTTON_G_PRE;
            return _generate_config_get(n_offset,n_size);
        }
        function _get_request_of_get_ibutton_postfix(){
            var n_offset = _type_system_offset.SYS_OFFSET_IBUTTON_G_POST;
            var n_size = _type_system_size.SYS_OFFSET_IBUTTON_G_POST;
            return _generate_config_get(n_offset,n_size);
        }
        function _get_request_of_get_uart_prefix(){
            var n_offset = _type_system_offset.SYS_OFFSET_UART_G_PRE;
            var n_size = _type_system_size.SYS_OFFSET_UART_G_PRE;
            return _generate_config_get(n_offset,n_size);
        }
        function _get_request_of_get_uart_postfix(){
            var n_offset = _type_system_offset.SYS_OFFSET_UART_G_POST;
            var n_size = _type_system_size.SYS_OFFSET_UART_G_POST;
            return _generate_config_get(n_offset,n_size);
        }
        function _get_request_of_get_f12_ibutton(){
            var n_offset = _type_system_offset.SYS_OFFSET_F12_IBUTTON;
            var n_size = _type_system_size.SYS_OFFSET_F12_IBUTTON;
            return _generate_config_get(n_offset,n_size);
        }
        function _get_request_of_get_zeros_ibutton(){
            var n_offset = _type_system_offset.SYS_OFFSET_ZEROS_IBUTTON;
            var n_size = _type_system_size.SYS_OFFSET_ZEROS_IBUTTON;
            return _generate_config_get(n_offset,n_size);
        }
        function _get_request_of_get_zeros_7times_ibutton(){
            var n_offset = _type_system_offset.SYS_OFFSET_ZERO_7TIMES_IBUTTON;
            var n_size = _type_system_size.SYS_OFFSET_ZERO_7TIMES_IBUTTON;
            return _generate_config_get(n_offset,n_size);
        }
        function _get_request_of_get_addmit_code_stick_ibutton(){
            var n_offset = _type_system_offset.SYS_OFFSET_ADDMIT_CODE_STCIK_IBUTTON;
            var n_size = _type_system_size.SYS_OFFSET_ADDMIT_CODE_STCIK_IBUTTON;
            return _generate_config_get(n_offset,n_size);
        }        

        /**
         * @constructs elpusk.device.usb.hid.lpu237
         * @param {string} s_path the path of usb hid lpu237 device.
        */
        _elpusk.device.usb.hid.lpu237 = function( s_path ){
            elpusk.device.usb.hid.call(this,s_path);
            this._version = [0,0,0,0];
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
         * @function elpusk.device.usb.hid.lpu237.generate_enter_opos_mode
         * @return {string} hex string for enter opos mode
        */
       _elpusk.device.usb.hid.lpu237.prototype.generate_enter_opos_mode = function(){
            return _generate_request( _type_request.REQ_ENTER_OPOS,"00");
       }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.generate_leave_opos_mode
         * @return {string} hex string for leave opos mode
        */
       _elpusk.device.usb.hid.lpu237.prototype.generate_leave_opos_mode = function(){
            return _generate_request( _type_request.REQ_LEAVE_OPOS,"00");
       }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.generate_enter_config_mode
         * @return {string} hex string for enter config mode
        */
       _elpusk.device.usb.hid.lpu237.prototype.generate_enter_config_mode = function(){
            return _generate_request( _type_request.REQ_ENTER_CS,"00");
       }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.generate_leave_config_mode
         * @return {string} hex string for leave config mode
        */
       _elpusk.device.usb.hid.lpu237.prototype.generate_leave_config_mode = function(){
            return _generate_request( _type_request.REQ_LEAVE_CS,"00");
       }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.generate_apply_config_mode
         * @return {string} hex string for leave config mode
        */
        _elpusk.device.usb.hid.lpu237.prototype.generate_apply_config_mode = function(){
            return _generate_request( _type_request.REQ_APPLY,"00");
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.generate_run_boot_loader
         * @return {string} hex string for leave config mode
        */
        _elpusk.device.usb.hid.lpu237.prototype.generate_run_boot_loader = function(){
            return _generate_request( _type_request.REQ_GOTO_BOOT,"00");
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.generate_get_system_information
         * @return {string} hex string array for get system information requests.
        */
        _elpusk.device.usb.hid.lpu237.prototype.generate_get_system_information = function(){
            var b_result = false;
            var requests = [];
            var s_req;

			do {
                s_req = generate_enter_config_mode();
                if( typeof s_req !== 'string'){
                    continue;
                }
                if( s_req.length <= 0 ){
                    continue;
                }
                requests.push( s_req );

                s_req = _generate_get_version();
                if( typeof s_req !== 'string'){
                    continue;
                }
                if( s_req.length <= 0 ){
                    continue;
                }
                requests.push( s_req );
                
                s_req = generate_leave_config_mode();
                if( typeof s_req !== 'string'){
                    continue;
                }
                if( s_req.length <= 0 ){
                    continue;
                }
                requests.push( s_req );
                
				b_result = true;
            } while (false);
            
            if( !b_result ){
                requests.length = 0;
            }

            return requests;
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.generate_get_parameters
         * @return {string} hex string array for get system parameters requests.
        */
       _elpusk.device.usb.hid.lpu237.prototype.generate_get_parameters = function(){
            var b_result = false;
            var requests = [];
            var s_req;

            do {
                s_req = generate_enter_config_mode();
                if( typeof s_req !== 'string'){
                    continue;
                }
                if( s_req.length <= 0 ){
                    continue;
                }
                requests.push( s_req );

                s_req = _generate_get_version();
                if( typeof s_req !== 'string'){  continue;        }
                if( s_req.length <= 0 ){         continue;        }
                requests.push( s_req );

                /////////////////////////////
                // setting detail
                s_req = _generate_get_global_pre_postfix_send_condition();
                if( typeof s_req !== 'string'){  continue;        }
                if( s_req.length <= 0 ){         continue;        }
                requests.push( s_req );
                
                s_req = _generate_get_device_support_mmd1000();
                if( typeof s_req !== 'string'){  continue;        }
                if( s_req.length <= 0 ){         continue;        }
                requests.push( s_req );

                s_req = _generate_get_interface();
                if( typeof s_req !== 'string'){  continue;        }
                if( s_req.length <= 0 ){         continue;        }
                requests.push( s_req );
                
                s_req = _generate_get_language();
                if( typeof s_req !== 'string'){  continue;        }
                if( s_req.length <= 0 ){         continue;        }
                requests.push( s_req );
                
                s_req = _generate_get_buzzer_frequency();
                if( typeof s_req !== 'string'){  continue;        }
                if( s_req.length <= 0 ){         continue;        }
                requests.push( s_req );

                s_req = _generate_get_boot_run_time();
                if( typeof s_req !== 'string'){  continue;        }
                if( s_req.length <= 0 ){         continue;        }
                requests.push( s_req );
                
                b_result = true;
                for( var i = 0; i<3; i++){
                    s_req = _generate_get_direction(i);
                    if( typeof s_req !== 'string'){
                        b_result = false;
                        break;
                    }
                    if( s_req.length <= 0 ){
                        b_result = false;
                        break;
                    }
                    requests.push( s_req );
                }//end for
                if( !b_result ){
                    continue;
                }
                b_result = false;

                if( _first_version_greater_then_second_version( this._version,[3,0,0,0]) ){
                    s_req = _generate_get_ibutton_prefix();
                    if( typeof s_req !== 'string'){  continue;        }
                    if( s_req.length <= 0 ){         continue;        }
                    requests.push( s_req );
                        
                    s_req = _generate_get_ibutton_postfix();
                    if( typeof s_req !== 'string'){  continue;        }
                    if( s_req.length <= 0 ){         continue;        }
                    requests.push( s_req );
    
                    s_req = _generate_get_uart_prefix();
                    if( typeof s_req !== 'string'){  continue;        }
                    if( s_req.length <= 0 ){         continue;        }
                    requests.push( s_req );
                        
                    s_req = _generate_get_uart_postfix();
                    if( typeof s_req !== 'string'){  continue;        }
                    if( s_req.length <= 0 ){         continue;        }
                    requests.push( s_req );
                        
                    s_req = _generate_get_f12_ibutton();
                    if( typeof s_req !== 'string'){  continue;        }
                    if( s_req.length <= 0 ){         continue;        }
                    requests.push( s_req );
                        
                    s_req = _generate_get_zeros_ibutton();
                    if( typeof s_req !== 'string'){  continue;        }
                    if( s_req.length <= 0 ){         continue;        }
                    requests.push( s_req );
                }

                if( _first_version_greater_then_second_version([4,0,0,0],this._version) ){
                    if( _first_version_greater_then_second_version(this._version, [3,15,0,0]) ){
                        s_req =  _generate_get_zeros_7times_ibutton();
                        if( typeof s_req !== 'string'){  continue;        }
                        if( s_req.length <= 0 ){         continue;        }
                        requests.push( s_req );
                    }
                    if( _first_version_greater_then_second_version(this._version, [3,16,0,0]) ){
                        s_req =  _generate_get_addmit_code_stick_ibutton();
                        if( typeof s_req !== 'string'){  continue;        }
                        if( s_req.length <= 0 ){         continue;        }
                        requests.push( s_req );
                    }
                }
                else{
                    if( _first_version_greater_then_second_version(this._version, [5,7,0,0]) ){
                        s_req =  _generate_get_zeros_7times_ibutton();
                        if( typeof s_req !== 'string'){  continue;        }
                        if( s_req.length <= 0 ){         continue;        }
                        requests.push( s_req );
                    }
                    if( _first_version_greater_then_second_version(this._version, [5,8,0,0]) ){
                        s_req =  _generate_get_addmit_code_stick_ibutton();
                        if( typeof s_req !== 'string'){  continue;        }
                        if( s_req.length <= 0 ){         continue;        }
                        requests.push( s_req );
                    }
                }

                b_result = true;
                for( var i = 0; i<3; i++){
                    s_req = _generate_get_enable_track(i);
                    if( typeof s_req !== 'string'){
                        b_result = false;
                        break;
                    }
                    if( s_req.length <= 0 ){
                        b_result = false;
                        break;
                    }
                    requests.push( s_req );
                    //
                    s_req = _generate_get_private_prefix(i);
                    if( typeof s_req !== 'string'){
                        b_result = false;
                        break;
                    }
                    if( s_req.length <= 0 ){
                        b_result = false;
                        break;
                    }
                    requests.push( s_req );
                    //
                    s_req = _generate_get_private_postfix(i);
                    if( typeof s_req !== 'string'){
                        b_result = false;
                        break;
                    }
                    if( s_req.length <= 0 ){
                        b_result = false;
                        break;
                    }
                    requests.push( s_req );

                }//end for
                if( !b_result ){
                    continue;
                }
                b_result = false;

                s_req =  _generate_get_global_prefix();
                if( typeof s_req !== 'string'){  continue;        }
                if( s_req.length <= 0 ){         continue;        }
                requests.push( s_req );
        
				s_req =  _generate_get_global_postfix();
                if( typeof s_req !== 'string'){  continue;        }
                if( s_req.length <= 0 ){         continue;        }
                requests.push( s_req );

                ////////////////////////////
                
                s_req = generate_leave_config_mode();
                if( typeof s_req !== 'string'){
                    continue;
                }
                if( s_req.length <= 0 ){
                    continue;
                }
                requests.push( s_req );
                
                b_result = true;
            } while (false);
            
            if( !b_result ){
                requests.length = 0;
            }

            return requests;
        }        

                    
    }


    // the end of function
    window.elpusk = _elpusk;
}(window))