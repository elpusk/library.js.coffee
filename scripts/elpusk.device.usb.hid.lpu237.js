
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

		var _type_change_parameter = {//public setter method
			cp_GlobalPrePostfixSendCondition : 0,
			cp_EnableiButton : 1,
			cp_Interface : 2,
			cp_BuzzerFrequency : 3,
			cp_BootRunTime : 4,
			cp_Language : 5,
			cp_EnableISO1 : 6, cp_EnableISO2 : 7, cp_EnableISO3 : 8,
			cp_Direction1 : 9, cp_Direction2 : 10, cp_Direction3 : 11,
			cp_GlobalPrefix : 12, cp_GlobalPostfix : 13,
			cp_PrivatePrefix1 : 14, cp_PrivatePrefix2 : 15, cp_PrivatePrefix3 : 16,
			cp_PrivatePostfix1 : 17, cp_PrivatePostfix2 : 18, cp_PrivatePostfix3 : 19,
			cp_Prefix_iButton : 20, cp_Postfix_iButton : 21,
			cp_Prefix_Uart : 22, cp_Postfix_Uart : 23,
            cp_BtcConfigData : 24,
            cp_EnableF12iButton : 25, cp_EnableZerosiButton : 26, cp_EnableZeros7TimesiButton : 27, cp_EnableAddmitCodeStickiButton : 28
		};

		var _type_generated_tx_type = {//
			gt_read_uid : 0,
			gt_change_authkey : 1,
			gt_change_status : 2,
			gt_change_sn : 3,
			gt_enter_config : 4,
			gt_leave_config : 5,
			gt_apply : 6,
			gt_goto_boot : 7,
			gt_enter_opos : 8,
			gt_leave_opos : 9,
			gt_support_mmd1000 : 10,
			gt_type_ibutton : 11,
			gt_type_device : 12,

			gt_set_config : 13,

			gt_get_version : 14,
			gt_get_name : 15,
			gt_get_global_prepostfix_send_condition : 16,
			gt_get_interface : 17,
			gt_get_language : 18,
			gt_get_buzzer_frequency : 19,
			gt_get_boot_run_time : 20,
			gt_get_enable_iso1 : 21, gt_get_enable_iso2 : 22, gt_get_enable_iso3 : 23,
			gt_get_direction1 : 24, gt_get_direction2 : 25, gt_get_direction3 : 26,
			gt_get_global_prefix : 27,  gt_get_global_postfix : 28,
			gt_get_private_prefix1 : 29, gt_get_private_prefix2 : 30,  gt_get_private_prefix3 : 31,
			gt_get_private_postfix1 : 32,gt_get_private_postfix2 : 33, gt_get_private_postfix3 : 34,
			gt_get_prefix_ibutton : 35, gt_get_postfix_ibutton : 36,
			gt_get_prefix_uart : 37, gt_get_postfix_uart : 38,
			gt_get_f12_ibutton : 39, gt_get_zeros_ibutton : 40, gt_get_zeros7_times_ibutton : 41, gt_get_addmit_code_stick_ibutton : 42
        };
                
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

		var _type_format = {
			ef_decimal : 0,
			ef_heximal : 1,
			ef_ascii : 2
		};

        /** 
         * @private 
         * @constant {string} 
         * @description the definition of request data in data field.
        */                
       var _type_cmd = {
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

		var _type_system_request_config = {
			request_config_set : 200,
			request_config_get : 201
		};

		var _type_manufacturer = {
			mf_elpusk : 0,
			mf_btc : 1
		};

		var _type_function = {
			fun_none : 0,
			fun_msr : 1,
			fun_msr_ibutton : 2,
			fun_ibutton : 3
		};

		var _type_system_interface = {

			system_interface_usb_keyboard : 0,	//system interface is USB keyboard.
			system_interface_usb_msr : 1,	//system interface is USB MSR(generic HID interface).
			system_interface_uart : 10,	//system interface is uart.
			system_interface_ps2_stand_alone : 20,	//system interface is PS2 stand along mode.
			system_interface_ps2_bypass : 21,	//system interface is bypass mode.
			system_interface_by_hw_setting : 100	//system interface is determined by HW Dip switch
		};

		var _type_keyboard_language_index = {
			language_map_index_english : 0,//U.S English
			language_map_index_spanish : 1,
			language_map_index_danish : 2,
			language_map_index_french : 3,
			language_map_index_german : 4,
			language_map_index_italian : 5,
			language_map_index_norwegian : 6,
			language_map_index_swedish : 7,
			language_map_index_uk_english : 8,
			language_map_index_israel : 9,
			language_map_index_turkey : 10
		};

		var _type_msr_track_Numer = {
			iso1_track : 0,
			iso2_track : 1,
			iso3_track : 2,
			iso_global : 10
		} ;

		var _type_ibutton_mode = {
			ibutton_zeros : 0,
			ibutton_f12 : 1,
			ibutton_zeros7 : 2,
			ibutton_addmit : 3
		};

        var _type_direction = {//reading diection, unsigned char
			dir_bidectional : 0,	//reading direction forward & backward
			dir_forward : 1,	//reading direction forward
			dir_backward : 2	//reading direction backward
        };
                
        var _const_min_size_request_header = 3;
        var _const_min_size_response_header = 3;
        var _const_the_number_of_reack = 3;
        var _const_the_size_of_uid = 4 * 4;
        var _const_the_size_of_system_blank = 4;
        var _const_the_number_of_frequency = 22;
        var _const_the_frequency_of_off_buzzer = 5000;
        var _const_the_frequency_of_on_buzzer = 26000;
        var _const_the_number_of_support_language = 11;	//the number of supported language.

        var _const_address_system_hid_key_map_offset = 0x400;	//size 1K
        var _const_address_system_ps2_key_map_offset = 0x800;	//size 1K
        var _const_default_buzzer_frequency = 25000;	// default buzzer frequency.
        var _const_default_buzzer_frequency_for_wiznova_board = 16000;	// default buzzer frequency. ganymede.

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
         * @function _get_15_bytes_tag_string
         * @param {string} s_tag - hex string of tag
         * @returns {string} hex string of tag, length 1 byte + 14 bytes tag
         * <br /> return value bytes stream is converted to hex string.
         */
        function _get_15_bytes_tag_string( s_tag ){
            var s_out = "000000000000000000000000000000";//default zeros 15 bytes
            do{
                if( typeof s_tag === 'undefined'){
                    continue;
                }
                if(typeof s_tag !== 'string' ){
                    continue;
                }
                if( s_tag.length % 2 !== 0 ){
                    continue;
                }
                if( s_tag.length > (14*2) ){
                    s_tag.length = 14*2;
                }

                var s_len = elpusk.util.get_byte_hex_string(s_tag.length / 2);
                s_out = s_len + s_tag;
            }while(false);
            return s_out;
        }

        /**
         * @private
         * @function _generate_request
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @param {string} s_type_request the type of request.  this valus is one of _type_cmd.
         * @param {string} s_hex_sub the type of request. 2 character hexcimal string format.
         * @param {string} s_hex_data_field the data field of request. hexcimal string format. none separator.
         * @returns {boolean} true(success) or false(failure).
         */
        function _generate_request( queue_s_tx, s_type_request, s_hex_sub, s_hex_data_field ){
            var b_result = false;
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

                queue_s_tx.push(s_request);
                b_result = true;
            }while(false);
            return b_result;
        }
        
        /**
         * @private
         * @function _generate_config_get
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number} n_offset the offset of a system parameter.
         * @param {number} n_size the size of a system parameter.
         * @returns {boolean} true(success) or false(failure).
         */
        function _generate_config_get( queue_s_tx,n_offset, n_size ){
            var b_result = false;
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

                var s_offset = elpusk.util.get_dword_hex_string( n_offset )
                var s_size = elpusk.util.get_dword_hex_string(n_size);
                var s_data = s_offset + s_size;

                b_result = _generate_request(
                    queue_s_tx
                    ,REQ_CONFIG
                    ,_type_system_request_config.request_config_get.toString(16)
                    ,s_data);
            }while(false);
            return b_result;
        }
        
        /**
         * @private
         * @function _generate_get_version
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */
       function _generate_get_version(queue_s_tx){
            var n_offset = _type_system_offset.SYS_OFFSET_VERSION;
            var n_size = system_size.SYS_SIZE_VERSION;;
            return _generate_config_get(queue_s_tx,n_offset,n_size);
        }

        /**
         * @private
         * @function _generate_get_name
         * @param {string[]} generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_name(queue_s_tx){
            var n_offset = _type_system_offset.SYS_OFFSET_NAME;
            var n_size = _type_system_size.SYS_SIZE_NAME;
            return _generate_config_get(queue_s_tx,n_offset,n_size);
        }

        /**
         * @private
         * @function _generate_get_device_support_mmd1000
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_device_support_mmd1000(queue_s_tx){
            return _generate_request( queue_s_tx,_type_cmd.REQ_IS_MMD1000,"00");
        }

        /**
         * @private
         * @function _generate_get_uid
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_uid(queue_s_tx){
            return _generate_request( queue_s_tx,_type_cmd.REQ_GET_ID,"00");
        }

        /**
         * @private
         * @function _generate_get_device_ibutton_type
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_device_ibutton_type(queue_s_tx){
            return _generate_request( queue_s_tx,_type_cmd.REQ_IS_ONLY_IBUTTON,"00");
        }

        /**
         * @private
         * @function _generate_get_device_type
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_device_type(queue_s_tx){
            return _generate_request( queue_s_tx,_type_cmd.REQ_IS_STANDARD,"00");
        }

        /**
         * @private
         * @function _generate_get_global_pre_postfix_send_condition
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_global_pre_postfix_send_condition(queue_s_tx){
            var n_offset = _type_system_offset.SYS_OFFSET_G_TAG_CONDITION;
            var n_size = _type_system_size.SYS_SIZE_G_TAG_CONDITION;
            return _generate_config_get(queue_s_tx,n_offset,n_size);
        }

        /**
         * @private
         * @function _generate_get_interface
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_interface(queue_s_tx){
            var n_offset = _type_system_offset.SYS_OFFSET_INTERFACE;
            var n_size = _type_system_size.SYS_SIZE_INTERFACE;
            return _generate_config_get(queue_s_tx,n_offset,n_size);
        }

        /**
         * @private
         * @function _generate_get_language
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_language(queue_s_tx){
            var n_offset = _type_system_offset.SYS_OFFSET_KEYMAP;
            var n_size = _type_system_size.SYS_SIZE_KEYMAP;
            return _generate_config_get(queue_s_tx,n_offset,n_size);
        }

        /**
         * @private
         * @function _generate_get_buzzer_frequency
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_buzzer_frequency(queue_s_tx){
            var n_offset = _type_system_offset.SYS_OFFSET_BUZZER_FREQ;
            var n_size = _type_system_size.SYS_SIZE_BUZZER_FREQ;
            return _generate_config_get(queue_s_tx,n_offset,n_size);
        }

        /**
         * @private
         * @function _generate_get_boot_run_time
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_boot_run_time(queue_s_tx){
            var n_offset = _type_system_offset.SYS_OFFSET_BOOT_RUN_TIME;
            var n_size = _type_system_size.SYS_SIZE_BOOT_RUN_TIME;
            return _generate_config_get(queue_s_tx,n_offset,n_size);
        }

        /**
         * @private
         * @function _generate_get_enable_track
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_enable_track(queue_s_tx,n_track){
            var b_result = false;
            var s_request = "";
            switch(n_track){
                case 0:
                    n_offset = _type_system_offset.SYS_OFFSET_ENABLE_TRACK[n_track];
                    n_size = _type_system_size.SYS_SIZE_ENABLE_TRACK[n_track];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 1:
                    n_offset = _type_system_offset.SYS_OFFSET_ENABLE_TRACK[n_track];
                    n_size = _type_system_size.SYS_SIZE_ENABLE_TRACK[n_track];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 2:
                    n_offset = _type_system_offset.SYS_OFFSET_ENABLE_TRACK[n_track];
                    n_size = _type_system_size.SYS_SIZE_ENABLE_TRACK[n_track];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                default:
                    break;
            }//end switch
            return b_result;      
        }

        /**
         * @private
         * @function _generate_get_direction
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */        
        function _generate_get_direction(queue_s_tx,n_track){
            var b_result = false;
            var s_request = "";
            switch(n_track){
                case 0:
                    n_offset = _type_system_offset.SYS_OFFSET_DIRECTION[n_track];
                    n_size = _type_system_size.SYS_SIZE_DIRECTION[n_track];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 1:
                    n_offset = _type_system_offset.SYS_OFFSET_DIRECTION[n_track];
                    n_size = _type_system_size.SYS_SIZE_DIRECTION[n_track];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 2:
                    n_offset = _type_system_offset.SYS_OFFSET_DIRECTION[n_track];
                    n_size = _type_system_size.SYS_SIZE_DIRECTION[n_track];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                default:
                    break;
            }//end switch
            return b_result;      
        }

        /**
         * @private
         * @function _generate_get_global_prefix
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */        
        function _generate_get_global_prefix(queue_s_tx){
            var n_offset = _type_system_offset.SYS_OFFSET_G_PRE;
            var n_size = _type_system_size.SYS_SIZE_G_PRE;
            return _generate_config_get(queue_s_tx,n_offset,n_size);
        }

        /**
         * @private
         * @function _generate_get_global_postfix
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */        
        function _generate_get_global_postfix(queue_s_tx){
            var n_offset = _type_system_offset.SYS_OFFSET_G_POST;
            var n_size = _type_system_size.SYS_SIZE_G_POST;
            return _generate_config_get(queue_s_tx,n_offset,n_size);
        }

        /**
         * @private
         * @function _generate_get_private_prefix
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */        
        function _generate_get_private_prefix(queue_s_tx,n_track){
            var b_result = false;
            var s_request = "";
            switch(n_track){
                case 0:
                    n_offset = _type_system_offset.SYS_OFFSET_P_PRE[n_track];
                    n_size = _type_system_size.SYS_SIZE_P_PRE[n_track];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 1:
                    n_offset = _type_system_offset.SYS_OFFSET_P_PRE[n_track];
                    n_size = _type_system_size.SYS_SIZE_P_PRE[n_track];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 2:
                    n_offset = _type_system_offset.SYS_OFFSET_P_PRE[n_track];
                    n_size = _type_system_size.SYS_SIZE_P_PRE[n_track];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                default:
                    break;
            }//end switch
            return b_result;      
        }

        /**
         * @private
         * @function _generate_get_private_postfix
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */        
        function _generate_get_private_postfix(queue_s_tx,n_track){
            var b_result = false;
            var s_request = "";
            switch(n_track){
                case 0:
                    n_offset = _type_system_offset.SYS_OFFSET_P_POST[n_track];
                    n_size = _type_system_size.SYS_SIZE_P_POST[n_track];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 1:
                    n_offset = _type_system_offset.SYS_OFFSET_P_POST[n_track];;
                    n_size = _type_system_size.SYS_SIZE_P_POST[n_track];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 2:
                    n_offset = _type_system_offset.SYS_OFFSET_P_POST[n_track];;
                    n_size = _type_system_size.SYS_SIZE_P_POST[n_track];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                default:
                    break;
            }//end switch
            return b_result;      
        }

        /**
         * @private
         * @function _generate_get_ibutton_prefix
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */        
        function _generate_get_ibutton_prefix(queue_s_tx){
            var n_offset = _type_system_offset.SYS_OFFSET_IBUTTON_G_PRE;
            var n_size = _type_system_size.SYS_SIZE_IBUTTON_G_PRE;
            return _generate_config_get(queue_s_tx,n_offset,n_size);
        }

        /**
         * @private
         * @function _generate_get_ibutton_postfix
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */        
        function _generate_get_ibutton_postfix(queue_s_tx){
            var n_offset = _type_system_offset.SYS_OFFSET_IBUTTON_G_POST;
            var n_size = _type_system_size.SYS_SIZE_IBUTTON_G_POST;
            return _generate_config_get(queue_s_tx,n_offset,n_size);
        }

        /**
         * @private
         * @function _generate_get_uart_prefix
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */        
        function _generate_get_uart_prefix(queue_s_tx){
            var n_offset = _type_system_offset.SYS_OFFSET_UART_G_PRE;
            var n_size = _type_system_size.SYS_SIZE_UART_G_PRE;
            return _generate_config_get(queue_s_tx,n_offset,n_size);
        }

        /**
         * @private
         * @function _generate_get_uart_postfix
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */        
        function _generate_get_uart_postfix(queue_s_tx){
            var n_offset = _type_system_offset.SYS_OFFSET_UART_G_POST;
            var n_size = _type_system_size.SYS_SIZE_UART_G_POST;
            return _generate_config_get(queue_s_tx,n_offset,n_size);
        }

        /**
         * @private
         * @function _generate_get_f12_ibutton
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */        
        function _generate_get_f12_ibutton(queue_s_tx){
            var n_offset = _type_system_offset.SYS_OFFSET_F12_IBUTTON;
            var n_size = _type_system_size.SYS_SIZE_F12_IBUTTON;
            return _generate_config_get(queue_s_tx,n_offset,n_size);
        }

        /**
         * @private
         * @function _generate_get_zeros_ibutton
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */        
        function _generate_get_zeros_ibutton(queue_s_tx){
            var n_offset = _type_system_offset.SYS_OFFSET_ZEROS_IBUTTON;
            var n_size = _type_system_size.SYS_SIZE_ZEROS_IBUTTON;
            return _generate_config_get(queue_s_tx,n_offset,n_size);
        }

        /**
         * @private
         * @function _generate_get_zeros_7times_ibutton
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */        
        function _generate_get_zeros_7times_ibutton(queue_s_tx){
            var n_offset = _type_system_offset.SYS_OFFSET_ZERO_7TIMES_IBUTTON;
            var n_size = _type_system_size.SYS_SIZE_ZERO_7TIMES_IBUTTON;
            return _generate_config_get(queue_s_tx,n_offset,n_size);
        }

        /**
         * @private
         * @function _generate_get_addmit_code_stick_ibutton
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */        
        function _generate_get_addmit_code_stick_ibutton(queue_s_tx){
            var n_offset = _type_system_offset.SYS_OFFSET_ADDMIT_CODE_STCIK_IBUTTON;
            var n_size = _type_system_size.SYS_SIZE_ADDMIT_CODE_STCIK_IBUTTON;
            return _generate_config_get(queue_s_tx,n_offset,n_size);
        }        

        //generate IO pattern with _generate_request()
        /**
         * @private
         * @function _generate_config_set
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number} n_offset the offset of a system parameter.
         * @param {number} n_size the size of a system parameter.
         * @param {string} s_setting_data setting data.( hex string , none separator)
         * @returns {boolean} true(success) or false(failure).
         */
        function _generate_config_set( queue_s_tx,n_offset, n_size, s_setting_data ){
            var b_result = false;
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

                var s_offset = elpusk.util.get_dword_hex_string( n_offset )
                var s_size = elpusk.util.get_dword_hex_string(n_size);
                var s_data = s_offset + s_size + s_setting_data;

                b_result = _generate_request(
                    queue_s_tx
                    ,REQ_CONFIG
                    ,_type_system_request_config.request_config_set.toString(16)
                    ,s_data
                    );
            }while(false);
            return b_result;
        }

        //generate IO pattern with _generate_config_set()
        /**
         * @private
         * @function _generate_set_global_pre_postfix_send_condition
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {boolean} b_global_pre_postfix_send_condition setting data.
         * @returns {boolean} true(success) or false(failure).
         */
        function _generate_set_global_pre_postfix_send_condition(queue_s_tx, b_global_pre_postfix_send_condition){
            var n_offset = _type_system_offset.SYS_OFFSET_G_TAG_CONDITION;
            var n_size = _type_system_size.SYS_SIZE_G_TAG_CONDITION;
            var s_data = "00000000";//dword zero

            if(b_global_pre_postfix_send_condition ){
                s_data = elpusk.util.get_dword_hex_string(1);
            }

            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_interface
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number} n_interface setting data.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_interface(queue_s_tx,n_interface){
            var n_offset = _type_system_offset.SYS_OFFSET_INTERFACE;
            var n_size = _type_system_size.SYS_SIZE_INTERFACE;
            var s_data = elpusk.util.get_byte_hex_string(n_interface);
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_language
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number} n_language setting data.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_language(queue_s_tx, n_language ){
            //todo more code.
            var n_offset = _type_system_offset.SYS_OFFSET_KEYMAP;
            var n_size = _type_system_size.SYS_SIZE_KEYMAP;
            var s_data = elpusk.util.get_dword_hex_string(n_language);
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_buzzer_frequency
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number} n_buzzer setting data.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_buzzer_frequency(queue_s_tx,n_buzzer){
            var n_offset = _type_system_offset.SYS_OFFSET_BUZZER_FREQ;
            var n_size = _type_system_size.SYS_SIZE_BUZZER_FREQ;
            var s_data = elpusk.util.get_dword_hex_string(n_buzzer);
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_enable_track
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number} n_track msr track number 0~2
         * @param {boolean} b_enable setting data.
         * @returns {boolean} true(success) or false(failure).
         */
        function _generate_set_enable_track(queue_s_tx,n_track,b_enable){
            var n_offset = _type_system_offset.SYS_OFFSET_ENABLE_TRACK[n_track];
            var n_size = _type_system_size.SYS_SIZE_ENABLE_TRACK[n_track];
            var s_data = "00";
            if(b_enable){
                s_data = elpusk.util.get_byte_hex_string(1);
            }
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_direction
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number} n_track msr track number 0~2
         * @param {number} n_direction setting data.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_direction(queue_s_tx,n_track,n_direction){
            var n_offset = _type_system_offset.SYS_OFFSET_DIRECTION[n_track];
            var n_size = _type_system_size.SYS_SIZE_DIRECTION[n_track];
            var s_data = elpusk.util.get_byte_hex_string(n_direction);
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_global_prefix
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {string} s_tag setting data.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_global_prefix(queue_s_tx,s_tag){
            var n_offset = _type_system_offset.SYS_OFFSET_G_PRE;
            var n_size = _type_system_size.SYS_SIZE_G_PRE;
            var s_data = _get_15_bytes_tag_string(s_tag);
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_global_postfix
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {string} s_tag setting data.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_global_postfix(queue_s_tx,s_tag){
            var n_offset = _type_system_offset.SYS_OFFSET_G_POST;
            var n_size = _type_system_size.SYS_SIZE_G_POST;
            var s_data = _get_15_bytes_tag_string(s_tag);
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_private_prefix
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {string} s_tag setting data.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_private_prefix(queue_s_tx,n_track,s_tag){
            var n_offset = _type_system_offset.SYS_OFFSET_P_PRE[n_track];
            var n_size = _type_system_size.SYS_SIZE_P_PRE[n_track];
            var s_data = _get_15_bytes_tag_string(s_tag);
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_private_postfix
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {string} s_tag setting data.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_private_postfix(queue_s_tx,n_track,s_tag){
            var n_offset = _type_system_offset.SYS_OFFSET_P_POST[n_track];
            var n_size = _type_system_size.SYS_SIZE_P_POST[n_track];
            var s_data = _get_15_bytes_tag_string(s_tag);
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_key_map
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number} n_language setting data.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_key_map(queue_s_tx,n_language){
            var b_result = false;

            do{
                //USB map
                var n_offset = _const_address_system_hid_key_map_offset;
                var n_size = elpusk.util.keyboard.const.FOR_CVT_MAX_ASCII_CODE;
                var s_full_data = elpusk.util.keyboard.map.get_ascii_to_hid_key_map_string(n_language);
                var s_half_data = s_full_data.substring(0,s_full_data,length/2);
                if(!_generate_config_set(queue_s_tx,n_offset,n_size,s_half_data) ){
                    continue;
                }

                n_offset = _const_address_system_hid_key_map_offset + elpusk.util.keyboard.const.FOR_CVT_MAX_ASCII_CODE;
                n_size = elpusk.util.keyboard.const.FOR_CVT_MAX_ASCII_CODE;
                s_half_data = s_full_data.substring(s_full_data,length/2);
                if(!_generate_config_set(queue_s_tx,n_offset,n_size,s_half_data)){
                    continue;
                }

                //PS2 map
                n_offset = _const_address_system_ps2_key_map_offset;
                n_size = elpusk.util.keyboard.const.FOR_CVT_MAX_ASCII_CODE;
                s_full_data = elpusk.util.keyboard.map.get_ascii_to_ps2_key_map_string(n_language);
                s_half_data = s_full_data.substring(0,s_full_data,length/2);
                if(!_generate_config_set(queue_s_tx,n_offset,n_size,s_half_data)){
                    continue;
                }

                n_offset = _const_address_system_ps2_key_map_offset + elpusk.util.keyboard.const.FOR_CVT_MAX_ASCII_CODE;
                n_size = elpusk.util.keyboard.const.FOR_CVT_MAX_ASCII_CODE;
                s_half_data = s_full_data.substring(s_full_data,length/2);
                if(!_generate_config_set(queue_s_tx,n_offset,n_size,s_half_data) ){
                    continue;
                }

                b_result = true;
            }while(false);

            return b_result;
        }

        /**
         * @private
         * @function _generate_set_ibutton_prefix
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {string} s_tag setting data.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_ibutton_prefix(queue_s_tx,s_tag){
            var n_offset = _type_system_offset.SYS_OFFSET_IBUTTON_G_PRE;
            var n_size = _type_system_size.SYS_SIZE_IBUTTON_G_PRE;
            var s_data = _get_15_bytes_tag_string(s_tag);
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_ibutton_postfix
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {string} s_tag setting data.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_ibutton_postfix(queue_s_tx,s_tag){
            var n_offset = _type_system_offset.SYS_OFFSET_IBUTTON_G_POST;
            var n_size = _type_system_size.SYS_SIZE_IBUTTON_G_POST;
            var s_data = _get_15_bytes_tag_string(s_tag);
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_uart_prefix
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {string} s_tag setting data.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_uart_prefix(queue_s_tx,s_tag){
            var n_offset = _type_system_offset.SYS_OFFSET_UART_G_PRE;
            var n_size = _type_system_size.SYS_SIZE_UART_G_PRE;
            var s_data = _get_15_bytes_tag_string(s_tag);
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_uart_postfix
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {string} s_tag setting data.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_uart_postfix(queue_s_tx,s_tag){
            var n_offset = _type_system_offset.SYS_OFFSET_UART_G_POST;
            var n_size = _type_system_size.SYS_SIZE_UART_G_POST;
            var s_data = _get_15_bytes_tag_string(s_tag);
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_f12_ibutton
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number[]} cblank 4 int array.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_f12_ibutton(queue_s_tx,cblank){
            var n_offset = _type_system_offset.SYS_OFFSET_F12_IBUTTON;
            var n_size = _type_system_size.SYS_SIZE_F12_IBUTTON;
            var s_data = "";

            for( var i = 0; i<4; i++ ){
                s_data.push(elpusk.util.get_byte_hex_string(cblank[i]));
            }//end for

            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_zeros_ibutton
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number[]} cblank 4 int array.
         * @returns {{boolean} true(success) or false(failure).
         */        
        function _generate_set_zeros_ibutton(queue_s_tx,cblank){
            return _generate_set_f12_ibutton(queue_s_tx,cblank);
        }

        /**
         * @private
         * @function _generate_set_zeros_7times_ibutton
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number[]} cblank 4 int array.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_zeros_7times_ibutton(queue_s_tx,cblank){
            return _generate_set_f12_ibutton(queue_s_tx,cblank);
        }

        /**
         * @private
         * @function _generate_set_addmit_code_stick
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number[]} cblank 4 int array.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_addmit_code_stick(queue_s_tx,cblank){
            return _generate_set_f12_ibutton(queue_s_tx,cblank);
        }






        /**
         * @private
         * @function _generate_enter_opos_mode
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_enter_opos_mode(queue_s_tx){
            return _generate_request( queue_s_tx,_type_cmd.REQ_ENTER_OPOS,"00");
        }

        /**
         * @private
         * @function _generate_leave_opos_mode
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_leave_opos_mode(queue_s_tx){
            return _generate_request( queue_s_tx,_type_cmd.REQ_LEAVE_OPOS,"00");
        }

        /**
         * @private
         * @function _generate_enter_config_mode
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_enter_config_mode(queue_s_tx){
            return _generate_request( queue_s_tx,_type_cmd.REQ_ENTER_CS,"00");
        }

        /**
         * @private
         * @function _generate_leave_config_mode
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_leave_config_mode(queue_s_tx){
            return _generate_request( queue_s_tx,_type_cmd.REQ_LEAVE_CS,"00");
        }

        /**
         * @private
         * @function _generate_apply_config_mode
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_apply_config_mode(queue_s_tx){
            return _generate_request( queue_s_tx,_type_cmd.REQ_APPLY,"00");
        }

        /**
         * @private
         * @function _generate_run_boot_loader
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_run_boot_loader(queue_s_tx){
            return _generate_request( queue_s_tx,_type_cmd.REQ_GOTO_BOOT,"00");
        }


        
        /**
         * @constructs elpusk.device.usb.hid.lpu237
         * @param {string} s_path the path of usb hid lpu237 device.
        */
        _elpusk.device.usb.hid.lpu237 = function( s_path ){

            elpusk.device.usb.hid.call(this,s_path);
            
            /**
             * @private
             * 
             */
            this._deque_generated_tx = [];
            this._dequeu_s_tx = [];
            this._dequeu_s_rx = [];
            
            this._set_change_parameter = [];

            this._b_global_pre_postfix_send_condition = true;
            this._manufacture = _type_manufacturer.mf_elpusk;
    
            this._v_uid= null;
            this._device_function = _type_function.fun_none;
            this._version = [0,0,0,0];
    
            //device information
            this._b_is_hid_boot = false;
            this._b_removed_key_map_table = false;
    
            ///////////////////////////////
            //device parameters
            this._b_device_is_mmd1000 = false;
            this._b_device_is_ibutton_only = false;
            this._b_device_is_standard = false;
    
            this._interface = _type_system_interface.system_interface_usb_keyboard;
            this._dw_buzzer_frequency = _const_default_buzzer_frequency;
            this._dw_boot_run_time = 15000;
            this._language_index = _type_keyboard_language_index.language_map_index_english;
    
            this._b_enable_iso = [true,true,true];
    
            this._direction = [_type_direction.dir_bidectional,_type_direction.dir_bidectional,_type_direction.dir_bidectional];
    
            this._v_global_prefix = null;
            this._v_global_postfix = null;
    
            this._v_private_prefix = [null,null,null];
            this._v_private_postfix = [null,null,null];
    
            //i-button
            this._v_prefix_ibutton = null;
            this._v_postfix_ibutton = null;
            this._b_f12_ibutton = false;
            this._b_zeros_ibutton = true;
            this._b_zeros_7times_ibutton = false;
            this._b_addmit_code_stick_ibutton = false;
            this._c_blank = [0,0,0,0];
    
            //rs232
            this._v_prefix_uart = null;
            this._v_postfix_uart = null;
            //
            this._token_format = _type_format.ef_decimal;
            this._v_name = null;            
        };

        _elpusk.device.usb.hid.lpu237.prototype = Object.create(elpusk.device.usb.hid.prototype);
        _elpusk.device.usb.hid.lpu237.prototype.constructor = _elpusk.device.usb.hid.lpu237;

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_tx_transaction
         * @returns {string} request string or null
         */
        _elpusk.device.usb.hid.lpu237.prototype.get_tx_transaction = function(){
            if( this._deque_generated_tx.length <= 0 ){
                return null;
            }

            return this._deque_generated_tx.shift();
        }

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
         * @function elpusk.device.usb.hid.lpu237.generate_get_system_information
         * @return {boolean} generate result success or failure
        */
        _elpusk.device.usb.hid.lpu237.prototype.generate_get_system_information = function(){
            var b_result = false;

			do {
                if( !_generate_enter_config_mode(this._dequeu_s_tx) ){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_enter_config );

                if( !_generate_get_version(this._dequeu_s_tx) ){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_get_version );
                
                if( !_generate_leave_config_mode(this._dequeu_s_tx) ){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_leave_config );
                
				b_result = true;
            } while (false);
            
            if( !b_result ){
                this._dequeu_s_tx.length = 0;
                this._deque_generated_tx.length = 0;
            }

            return b_result;
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.generate_get_parameters
         * @return {boolean} generate result success or failure
        */
       _elpusk.device.usb.hid.lpu237.prototype.generate_get_parameters = function(){
            var b_result = false;

            do {
                if( !_generate_enter_config_mode(this._dequeu_s_tx) ){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_enter_config );

                if( !_generate_get_version(this._dequeu_s_tx) ){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_get_version );

                /////////////////////////////
                // setting detail
                if( !_generate_get_global_pre_postfix_send_condition(this._dequeu_s_tx) ){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_get_global_prepostfix_send_condition );
                
                if( !_generate_get_device_support_mmd1000(this._dequeu_s_tx) ){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_support_mmd1000 );

                if( !_generate_get_interface(this._dequeu_s_tx) ){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_get_interface );
                
                if( !_generate_get_language(this._dequeu_s_tx) ){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_get_language );
                
                if( !_generate_get_buzzer_frequency(this._dequeu_s_tx) ){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_get_buzzer_frequency );

                if( !_generate_get_boot_run_time(this._dequeu_s_tx) ){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_get_boot_run_time );
                
                b_result = true;
                for( var i = 0; i<3; i++){
                    if( !_generate_get_direction(this._dequeu_s_tx,i) ){ b_result = false; break;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_get_direction1+i );
                }//end for
                if( !b_result ){
                    continue;
                }
                b_result = false;

                if( _first_version_greater_then_second_version( this._version,[3,0,0,0]) ){
                    if( !_generate_get_ibutton_prefix(this._dequeu_s_tx) ){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_get_prefix_ibutton );
                        
                    if( !_generate_get_ibutton_postfix(this._dequeu_s_tx) ){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_get_postfix_ibutton );
    
                    if( !_generate_get_uart_prefix(this._dequeu_s_tx) ){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_get_prefix_uart );
                        
                    if( !_generate_get_uart_postfix(this._dequeu_s_tx) ){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_get_postfix_uart );
                        
                    if( !_generate_get_f12_ibutton(this._dequeu_s_tx) ){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_get_f12_ibutton );
                        
                    if( !_generate_get_zeros_ibutton(this._dequeu_s_tx) ){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_get_zeros_ibutton );
                }

                if( _first_version_greater_then_second_version([4,0,0,0],this._version) ){
                    if( _first_version_greater_then_second_version(this._version, [3,15,0,0]) ){
                        if( !_generate_get_zeros_7times_ibutton(this._dequeu_s_tx) ){continue;}
                        this._deque_generated_tx.push( _type_generated_tx_type.gt_get_zeros7_times_ibutton );
                    }
                    if( _first_version_greater_then_second_version(this._version, [3,16,0,0]) ){
                        if( !_generate_get_addmit_code_stick_ibutton(this._dequeu_s_tx) ){continue;}
                        this._deque_generated_tx.push( _type_generated_tx_type.gt_get_addmit_code_stick_ibutton );
                    }
                }
                else{
                    if( _first_version_greater_then_second_version(this._version, [5,7,0,0]) ){
                        if( !_generate_get_zeros_7times_ibutton(this._dequeu_s_tx) ){continue;}
                        this._deque_generated_tx.push( _type_generated_tx_type._generate_get_zeros_7times_ibutton );
                    }
                    if( _first_version_greater_then_second_version(this._version, [5,8,0,0]) ){
                        if( !_generate_get_addmit_code_stick_ibutton(this._dequeu_s_tx) ){continue;}
                        this._deque_generated_tx.push( _type_generated_tx_type.gt_get_addmit_code_stick_ibutton );
                    }
                }

                b_result = true;
                for( var i = 0; i<3; i++){
                    if( !_generate_get_enable_track(this._dequeu_s_tx,i) ){ b_result = false; break;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_get_enable_iso1+i );
                    //
                    if( !_generate_get_private_prefix(this._dequeu_s_tx,i) ){ b_result = false; break;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_get_private_prefix1+i );
                    //
                    if( !_generate_get_private_postfix(this._dequeu_s_tx,i) ){ b_result = false; break;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_get_private_postfix1+i );

                }//end for
                if( !b_result ){
                    continue;
                }
                b_result = false;

                if( !_generate_get_global_prefix(this._dequeu_s_tx) ){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_get_global_prefix );
        
                if( !_generate_get_global_postfix(this._dequeu_s_tx) ){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_get_global_postfix );

                ////////////////////////////
                
                if( !_generate_leave_config_mode(this._dequeu_s_tx) ){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_leave_config );
                
                b_result = true;
            } while (false);
            
            if( !b_result ){
                this._dequeu_s_tx.length = 0;
                this._deque_generated_tx.length = 0;
            }

            return b_result;
        }        

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.generate_set_parameters
         * @return {boolean} generate result success or failure
        */
        _elpusk.device.usb.hid.lpu237.prototype.generate_set_parameters = function(){
            var b_result = false;
            var s_req = "";

            do{
                if(!_generate_enter_config_mode(this._dequeu_s_tx) ){ continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_enter_config );

                //
                if( _first_version_greater_then_second_version(this._version,[3,0,0,0])){
                    /*
                    // . set device type.
                    if (!_generate_set_device_type())//dummy code
                        continue;
                    */

                    // . set iButton Pretag
                    if( elpusk.util.find_from_set( _set_change_parameter, _type_change_parameter.cp_Prefix_iButton ) >= 0 ){
                        if (!_generate_set_ibutton_prefix(this._dequeu_s_tx,)){continue;}
                        this._deque_generated_tx.push( _type_generated_tx_type.gt_set_config );
                    }

                    // . set iButton Posttag
                    if( elpusk.util.find_from_set( _set_change_parameter, _type_change_parameter.cp_Postfix_iButton ) >= 0 ){
                        if (!_generate_set_ibutton_postfix(this._dequeu_s_tx,)){continue;}
                        this._deque_generated_tx.push( _type_generated_tx_type.gt_set_config );
                    }

                    // . set Uart Pretag
                    if( elpusk.util.find_from_set( _set_change_parameter, _type_change_parameter.cp_Prefix_Uart ) >= 0 ){
                        if (!_generate_set_uart_prefix(this._dequeu_s_tx,)){continue;}
                        this._deque_generated_tx.push( _type_generated_tx_type.gt_set_config );
                    }

                    // . set Uart Posttag
                    if( elpusk.util.find_from_set( _set_change_parameter, _type_change_parameter.cp_Postfix_Uart ) >= 0 ){
                        if (!_generate_set_uart_postfix(this._dequeu_s_tx,)){continue;}
                        this._deque_generated_tx.push( _type_generated_tx_type.gt_set_config );
                    }

                    do {//ibutton setting
                        if( elpusk.util.find_from_set( _set_change_parameter, _type_change_parameter.cp_EnableF12iButton ) >= 0 ){
                            if (!_generate_set_f12_ibutton(this._dequeu_s_tx,)){continue;}
                            this._deque_generated_tx.push( _type_generated_tx_type.gt_set_config );
                        }

                        if( elpusk.util.find_from_set( _set_change_parameter, _type_change_parameter.cp_EnableZerosiButton ) >= 0 ){
                            if (!_generate_set_zeros_ibutton(this._dequeu_s_tx,)){continue;}
                            this._deque_generated_tx.push( _type_generated_tx_type.gt_set_config );
                        }

                        if( elpusk.util.find_from_set( _set_change_parameter, _type_change_parameter.cp_EnableZeros7TimesiButton ) >= 0 ){
                            if (!_generate_set_zeros_7times_ibutton(this._dequeu_s_tx,)){continue;}
                            this._deque_generated_tx.push( _type_generated_tx_type.gt_set_config );
                        }

                        if( elpusk.util.find_from_set( _set_change_parameter, _type_change_parameter.cp_EnableAddmitCodeStickiButton ) >= 0 ){
                            if (!_generate_set_addmit_code_stick(this._dequeu_s_tx,)){continue;}
                            this._deque_generated_tx.push( _type_generated_tx_type.gt_set_config );
                        }
                    } while (false);
                }
                //. set globalPrePostfixSendCondition
                if( elpusk.util.find_from_set( _set_change_parameter, _type_change_parameter.cp_GlobalPrePostfixSendCondition ) >= 0 ){
                    if (!_generate_set_global_pre_postfix_send_condition(this._dequeu_s_tx,)){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_config );
                }

                // . set interface
                if( elpusk.util.find_from_set( _set_change_parameter, _type_change_parameter.cp_Interface ) >= 0 ){
                    if (!_generate_set_interface(this._dequeu_s_tx,)){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_config );
                }

                // . get language
                if( elpusk.util.find_from_set( _set_change_parameter, _type_change_parameter.cp_Language ) >= 0 ){
                    if (!_generate_set_language(this._dequeu_s_tx,)){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_config );
                }

                if (m_set_change_parameter.find() != m_set_change_parameter.end()) {
                    if(!())
                        continue;
                    //set key map
                    if (get_removed_key_map_table())
                        if(!_generate_set_key_map())
                            continue;
                }

                // . set buzzer
                if (m_set_change_parameter.find(cp_BuzzerFrequency) != m_set_change_parameter.end())
                    if(!_generate_set_buzzer_frequency())
                        continue;

                // .enable 1
                if (m_set_change_parameter.find(cp_EnableISO1) != m_set_change_parameter.end())
                    if (!_generate_set_enable_track(iso1_track))
                        continue;
                // .enable 2
                if (m_set_change_parameter.find(cp_EnableISO2) != m_set_change_parameter.end())
                    if (!_generate_set_enable_track(iso2_track))
                        continue;
                // .enable 3
                if (m_set_change_parameter.find(cp_EnableISO3) != m_set_change_parameter.end())
                    if (!_generate_set_enable_track(iso3_track))
                        continue;

                // direction 1
                if (m_set_change_parameter.find(cp_Direction1) != m_set_change_parameter.end())
                    if (!_generate_set_direction(iso1_track))
                        continue;
                if (m_set_change_parameter.find(cp_Direction2) != m_set_change_parameter.end())
                    if (!_generate_set_direction(iso2_track))
                        continue;
                if (m_set_change_parameter.find(cp_Direction3) != m_set_change_parameter.end())
                    if (!_generate_set_direction(iso3_track))
                        continue;


                // . global prefix
                if (m_set_change_parameter.find(cp_GlobalPrefix) != m_set_change_parameter.end())
                    if (!_generate_set_global_prefix())
                        continue;

                // . global postfix
                if (m_set_change_parameter.find(cp_GlobalPostfix) != m_set_change_parameter.end())
                    if (!_generate_set_global_postfix())
                        continue;

                // . private prefix 1
                if (m_set_change_parameter.find(cp_PrivatePrefix1) != m_set_change_parameter.end())
                    if (!_generate_set_private_prefix(iso1_track))
                        continue;
                // . private postfix 1
                if (m_set_change_parameter.find(cp_PrivatePostfix1) != m_set_change_parameter.end())
                    if (!_generate_set_private_postfix(iso1_track))
                        continue;

                // . private prefix 2
                if (m_set_change_parameter.find(cp_PrivatePrefix2) != m_set_change_parameter.end())
                    if (!_generate_set_private_prefix(iso2_track))
                        continue;
                // . private postfix 2
                if (m_set_change_parameter.find(cp_PrivatePostfix2) != m_set_change_parameter.end())
                    if (!_generate_set_private_postfix(iso2_track))
                        continue;

                // . private prefix 3
                if (m_set_change_parameter.find(cp_PrivatePrefix3) != m_set_change_parameter.end())
                    if (!_generate_set_private_prefix(iso3_track))
                        continue;
                // . private postfix 3
                if (m_set_change_parameter.find(cp_PrivatePostfix3) != m_set_change_parameter.end())
                    if (!_generate_set_private_postfix(iso3_track))
                        continue;

                //
                if (!generate_apply_config_mode())
                    continue;
                if (!generate_leave_config_mode())
                    continue;
                //
                b_result = true;
                m_set_change_parameter.clear();
            }while (false);
            return b_result;           
       }
                    
    }


    // the end of function
    window.elpusk = _elpusk;
}(window))