/**
 * 2020.4.10
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
 * @description elpusk lpu237 device protocol layer library.
 * <br />  2020.4.10 - release 1.0. 
 * @namespace
 */
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
    /** documented as elpusk.device.usb.hid */
    if (!_elpusk.device.usb.hid) {
        _elpusk.device.usb.hid = {};
    }

    /** documented as elpusk.device.usb.hid.lpu237 */
    if (!_elpusk.device.usb.hid.lpu237) {

        var _const_min_size_request_header = 3;
        var _const_min_size_response_header = 3;
        var _const_the_number_of_track = 3;
        var _const_the_size_of_name = 16;
        var _const_the_size_of_uid = 4 * 4;
        var _const_the_size_of_system_blank = 4;
        var _const_the_number_of_frequency = 22;
        var _const_the_frequency_of_off_buzzer = 5000;
        var _const_the_frequency_of_on_buzzer = 26000;
        var _const_the_number_of_support_language = 11;	//the number of supported language.
        var _const_max_size_tag_byte = 14;
        var _const_max_size_tag_key = _const_max_size_tag_byte/2;

        var _const_address_system_hid_key_map_offset = 0x400;	//size 1K
        var _const_address_system_ps2_key_map_offset = 0x800;	//size 1K
        var _const_default_buzzer_frequency = 25000;	// default buzzer frequency.
        var _const_default_buzzer_frequency_for_wiznova_board = 16000;	// default buzzer frequency. ganymede.

        /**
         * enum for changed paramemter type.
         * @private 
         * @readonly
         * @enum {number}
         */
		var _type_change_parameter = {
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

        /**
         * enum for changed paramemter type.
         * @private 
         * @readonly
         * @enum {number}
         */        
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

            //get config series
			gt_get_version : 13,
			gt_get_name : 14,
			gt_get_global_prepostfix_send_condition : 15,
			gt_get_interface : 16,
			gt_get_language : 17,
			gt_get_buzzer_frequency : 18,
			gt_get_boot_run_time : 19,
			gt_get_enable_iso1 : 20, gt_get_enable_iso2 : 21, gt_get_enable_iso3 : 22,
			gt_get_direction1 : 23, gt_get_direction2 : 24, gt_get_direction3 : 25,
			gt_get_global_prefix : 26,  gt_get_global_postfix : 27,
			gt_get_private_prefix1 : 28, gt_get_private_prefix2 : 29,  gt_get_private_prefix3 : 30,
			gt_get_private_postfix1 : 31,gt_get_private_postfix2 : 32, gt_get_private_postfix3 : 33,
			gt_get_prefix_ibutton : 34, gt_get_postfix_ibutton : 35,
			gt_get_prefix_uart : 36, gt_get_postfix_uart : 37,
            gt_get_f12_ibutton : 38, gt_get_zeros_ibutton : 39, gt_get_zeros7_times_ibutton : 40, gt_get_addmit_code_stick_ibutton : 41,

            //set
			gt_set_global_prepostfix_send_condition : 42,
			gt_set_interface : 43,
			gt_set_language : 44, get_set_keymap : 45,
			gt_set_buzzer_frequency : 46,
			gt_set_enable_iso1 : 47, gt_set_enable_iso2 : 48, gt_set_enable_iso3 : 49,
			gt_set_direction1 : 50, gt_set_direction2 : 51, gt_set_direction3 : 52,
			gt_set_global_prefix : 53,  gt_set_global_postfix : 54,
			gt_set_private_prefix1 : 55, gt_set_private_prefix2 : 56,  gt_set_private_prefix3 : 57,
			gt_set_private_postfix1 : 58,gt_set_private_postfix2 : 59, gt_set_private_postfix3 : 60,
			gt_set_prefix_ibutton : 61, gt_set_postfix_ibutton : 62,
			gt_set_prefix_uart : 63, gt_set_postfix_uart : 64,
			gt_set_f12_ibutton : 65, gt_set_zeros_ibutton : 66, gt_set_zeros7_times_ibutton : 67, gt_set_addmit_code_stick_ibutton : 68
            
        };
                
        /**
         * @private
         * @readonly
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
            SYS_OFFSET_ADDMIT_CODE_STCIK_IBUTTON : 0,
            SYS_OFFSET_CONTAINER_MAP_INDEX : 103,
            SYS_OFFSET_INFOMSR_MAP_INDEX : [334,521,708]
        };

        /**
         * @private
         * @readonly
         * @constant {number}
         * @description the size value of system parameters.
         */
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
            SYS_SIZE_ADDMIT_CODE_STCIK_IBUTTON : 4,
            SYS_SIZE_CONTAINER_MAP_INDEX : 4,
            SYS_SIZE_INFOMSR_MAP_INDEX : [4,4,4]
        };

		var _type_format = {
			ef_decimal : 0,
			ef_heximal : 1,
			ef_ascii : 2
		};

        /** 
         * @private 
         * @readonly
         * @enum {string}
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
            REQ_IS_MMD1000 : "4e"
        };

        /** 
         * @private 
         * @readonly
         * @enum {number}
         * @description the definition of config request type
        */                
		var _type_system_request_config = {
			request_config_set : 200,
			request_config_get : 201
		};

        /** 
         * @private 
         * @readonly
         * @enum {number}
         * @description the definition of device manufacturer
        */        
		var _type_manufacturer = {
			mf_elpusk : 0,
			mf_btc : 1
		};

        /** 
         * @private 
         * @constant {map} 
         *  @description error code to error message map.
        */                
        var _error_name_message = [
            {name:'en_e_parameter',message:"invalied parameter"}
        ];

        /** 
         * @private 
         * @function _get_error_message
         * @param {string} s_error_name
         * @returns {string}
         * @description get error message with error name
        */                
        function _get_error_message(s_error_name){
            var s_message="";
            do{
                if( typeof s_error_name === 'undefined'){
                    continue;
                }
                // don't use Array find method. for supporting, IE11.
                for( var i = 0; i<_error_name_message.length; i++ ){
                    if( _error_name_message[i].name ===  s_error_name ){
                        s_message = _error_name_message[i].message;
                        break;
                    }
                }//end for
            }while(false);
            return s_message;
        }

        /** 
         * @private 
         * @function _get_error_object
         * @param {string} s_name
         * @returns {object}
         * @description get error object with error name
        */                
        function _get_error_object(s_name){
            var s_message = _get_error_message(s_name);
            var e = new Error(s_message);
            e.name = s_name;
            return e;
        }


        /**
         * @private
         * @function _get_manufacturer_string
         * @param {number} type_manufacturer _type_manufacturer value.
         * @returns {string} manufacturer name
         */
        function _get_manufacturer_string( type_manufacturer ){
            var s_value = "unknown";
            do{
                if( typeof type_manufacturer !== 'number'){
                    continue;
                }
                switch(type_manufacturer){
                    case _type_manufacturer.mf_elpusk:
                        s_value = "Elpusk";
                        break;
                    case _type_manufacturer.mf_elpusk:
                        s_value = "BTC";
                        break;
                    default:
                        break;
                }//end switch
            }while(false);
            return s_value;
        }

        /** 
         * @private 
         * @readonly
         * @enum {number}
         * @description the definition of device functionality
        */        
		var _type_function = {
			fun_none : 0,
			fun_msr : 1,
			fun_msr_ibutton : 2,
			fun_ibutton : 3
		};

        /**
         * @private
         * @function _get_function_string
         * @param {number} type_function _type_function value.
         * @returns {string} supported functions.
         */
        function _get_function_string( type_function ){
            var s_value = "unknown";
            do{
                if( typeof type_function !== 'number'){
                    continue;
                }
                switch(type_function){
                    case _type_function.fun_none:
                        s_value = "None";
                        break;
                    case _type_function.fun_msr:
                        s_value = "MSR only";
                        break;
                    case _type_function.fun_msr_ibutton:
                        s_value = "MSR and i-button";
                        break;
                    case _type_function.fun_ibutton:
                        s_value = "i-button only";
                        break;
                    default:
                        break;
                }//end switch
            }while(false);
            return s_value;
        }

        /** 
         * @private 
         * @readonly
         * @enum {number}
         * @description the definition of device interface
        */        
		var _type_system_interface = {

			system_interface_usb_keyboard : 0,	//system interface is USB keyboard.
			system_interface_usb_msr : 1,	//system interface is USB MSR(generic HID interface).
			system_interface_uart : 10,	//system interface is uart.
			system_interface_ps2_stand_alone : 20,	//system interface is PS2 stand along mode.
			system_interface_ps2_bypass : 21,	//system interface is bypass mode.
			system_interface_by_hw_setting : 100	//system interface is determined by HW Dip switch
		};

        /**
         * @private
         * @function _get_system_inferface_string
         * @param {number} type_system_interface _type_system_interface value.
         * @returns {string} system interface string.
         */
        function _get_system_inferface_string( type_system_interface ){
            var s_value = "unknown";
            do{
                if( typeof type_system_interface !== 'number'){
                    continue;
                }
                switch(type_system_interface){
                    case _type_system_interface.system_interface_usb_keyboard:
                        s_value = "Usb Hid keyboard";
                        break;
                    case _type_system_interface.system_interface_usb_msr:
                        s_value = "Usb Hid vendor defined";
                        break;
                    case _type_system_interface.system_interface_uart:
                        s_value = "Uart";
                        break;
                    case _type_system_interface.system_interface_ps2_stand_alone:
                        s_value = "Standalone PS2";
                        break;
                    case _type_system_interface.system_interface_ps2_bypass:
                        s_value = "Bypass PS2";
                        break;
                    case _type_system_interface.system_interface_by_hw_setting:
                        s_value = "By HW setting";
                        break;
                    default:
                        break;
                }//end switch
            }while(false);
            return s_value;
        }

        /** 
         * @private 
         * @readonly
         * @enum {number}
         * @description the definition of device lanuage map index
        */        
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

        /**
         * @private
         * @function _get_keyboard_language_index_string
         * @param {number} type_keyboard_language_index _type_keyboard_language_index value.
         * @returns {string} language.
         */
        function _get_keyboard_language_index_string( type_keyboard_language_index ){
            var s_value = "unknown";
            do{
                if( typeof type_keyboard_language_index !== 'number'){
                    continue;
                }
                switch(type_keyboard_language_index){
                    case _type_keyboard_language_index.language_map_index_english:
                        s_value = "English";
                        break;
                    case _type_keyboard_language_index.language_map_index_spanish:
                        s_value = "Spanish";
                        break;
                    case _type_keyboard_language_index.language_map_index_danish:
                        s_value = "Danish";
                        break;
                    case _type_keyboard_language_index.language_map_index_french:
                        s_value = "French";
                        break;
                    case _type_keyboard_language_index.language_map_index_german:
                        s_value = "German";
                        break;
                    case _type_keyboard_language_index.language_map_index_italian:
                        s_value = "Italian";
                        break;
                    case _type_keyboard_language_index.language_map_index_norwegian:
                        s_value = "Norwegian";
                        break;
                    case _type_keyboard_language_index.language_map_index_swedish:
                        s_value = "Swedish";
                        break;
                    case _type_keyboard_language_index.language_map_index_uk_english:
                        s_value = "UK English";
                        break;
                    case _type_keyboard_language_index.language_map_index_israel:
                        s_value = "Israel";
                        break;
                    case _type_keyboard_language_index.language_map_index_turkey:
                        s_value = "Turkey";
                        break;
                    default:
                        break;
                }//end switch
            }while(false);
            return s_value;
        }

        /** 
         * @private 
         * @readonly
         * @enum {number}
         * @description the definition of ISO7811 magnetic card track number
        */        
		var _type_msr_track_Numer = {
			iso1_track : 0,
			iso2_track : 1,
			iso3_track : 2,
			iso_global : 10
		} ;

        /** 
         * @private 
         * @readonly
         * @enum {number}
         * @description the definition of i-button reading mode.
        */        
		var _type_ibutton_mode = {
			ibutton_zeros : 0,
			ibutton_f12 : 1,
			ibutton_zeros7 : 2,
			ibutton_addmit : 3
		};

        /**
         * @private
         * @function _is_equal_tag
         * @param {string} s_tag0 tag string with it's length in front.( all hex string format )
         * @param {string} s_tag1 tag string with it's length in front.( all hex string format )
         * @returns {boolean} If s_tag0 tag is equal to s_tag1 tag, return true.
         * <br /> else return false
         */
        function _is_equal_tag( s_tag0, s_tag1 ){
            var b_equal = false;

            do{
                if( typeof s_tag0 !== 'string'){
                    continue;
                }
                if( typeof s_tag1 !== 'string'){
                    continue;
                }
                if( s_tag0.length % 2 !== 0 ){
                    continue;
                }
                if( s_tag1.length % 2 !== 0 ){
                    continue;
                }

                if( s_tag0.length === 0 && s_tag1.length === 0 ){
                    b_equal = true;
                    continue;
                }

                var s_one_byte = "";
                var array_n_len = [0,0];
                var n_tag0 = [];
                var n_tag1 = [];

                for( var i = 0; i<s_tag0.length; i=i+2 ){
                    s_one_byte = s_tag0.substring(i,i+2);
                    n_tag0.push(parseInt(s_one_byte,16));
                }//end for
                for( var i = 0; i<s_tag1.length; i=i+2 ){
                    s_one_byte = s_tag1.substring(i,i+2);
                    n_tag1.push(parseInt(s_one_byte,16));
                }//end for

                array_n_len[0] = n_tag0.shift();
                array_n_len[1] = n_tag1.shift();
                if( array_n_len[0] !== array_n_len[1] ){
                    continue;
                }

                b_equal = true;
                for( var i = 0; i<array_n_len[0]; i++ ){
                    if(n_tag0[i] !== n_tag1[i] ){
                        b_equal = false;
                        break;
                    }
                }//end for

            }while(false);
            return b_equal;
        }

        /**
         * @private
         * @function _get_ibutton_mode_string
         * @param {number} type_ibutton_mode _type_ibutton_mode value.
         * @returns {string} i-button reading mode.
         */
        function _get_ibutton_mode_string( type_ibutton_mode ){
            var s_value = "unknown";
            do{
                if( typeof type_ibutton_mode !== 'number'){
                    continue;
                }
                switch(type_ibutton_mode){
                    case _type_ibutton_mode.ibutton_zeros:
                        s_value = "Zeros mode";
                        break;
                    case _type_ibutton_mode.ibutton_f12:
                        s_value = "F12 key mode";
                        break;
                    case _type_ibutton_mode.ibutton_zeros7:
                        s_value = "Zeros 7times mode";
                        break;
                    case _type_ibutton_mode.ibutton_addmit:
                        s_value = "Addmit codestick mode";
                        break;
                    default:
                        break;
                }//end switch
            }while(false);
            return s_value;
        }

        /** 
         * @private 
         * @readonly
         * @enum {number}
         * @description the definition of magnetic card reading direction
        */        
        var _type_direction = {//reading diection, unsigned char
			dir_bidectional : 0,	//reading direction forward & backward
			dir_forward : 1,	//reading direction forward
			dir_backward : 2	//reading direction backward
        };

        /**
         * @private
         * @function _get_ibutton_mode_string
         * @param {number} type_ibutton_mode _type_ibutton_mode value.
         * @returns {string} i-button reading mode.
         */
        function _get_direction_string( type_direction ){
            var s_value = "unknown";
            do{
                if( typeof type_direction !== 'number'){
                    continue;
                }
                switch(type_direction){
                    case _type_direction.dir_bidectional:
                        s_value = "Bidirectional reading";
                        break;
                    case _type_direction.dir_forward:
                        s_value = "Forward reading";
                        break;
                    case _type_direction.dir_backward:
                        s_value = "Backward reading";
                        break;
                    default:
                        break;
                }//end switch
            }while(false);
            return s_value;
        }
         
        /**
         * @private
         * @function _get_version_string
         * @param {number[]} version 4 number array
         * @returns {string} version string
         */
        function _get_version_string( version ){
            var s_value = "0.0.0.0";
            do{
                if( !Array.isArray(version)){
                    continue;
                }
                if( version.length !== 4 ){
                    continue;
                }

                s_value = version[0].toString(10) + "." 
                + version[1].toString(10) + "." 
                + version[2].toString(10) + "." 
                + version[3].toString(10);
            }while(false);
            return s_value;
        }
        

        /**
         * @private
         * @function _first_version_greater_then_second_version
         * @param {number[]} first_version 4 number array. this value indicate version.
         * @param {number[]} second_version 4 number array. this value indicate version.
         * @returns {boolean} true - first_version is greater then second_version.
         * <br /> false - else case.
         */
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
         * @function _is_success_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} true - response contains good or negative good.
         * <br /> false - else case.
         */
        function _is_success_response(s_response){
            var b_result = false;

            do{
                if( typeof s_response !== 'string'){
                    continue;
                }
                if(s_response.length<(2*_const_min_size_response_header)){
                    continue;
                }
                var n_offset = 0;
                var n_size = 1;
                if( parseInt(s_response.substr(n_offset*2,n_size*2),16) !== 0x52 ){
                    continue;//invalid prefix
                }
                b_result = true;
                n_offset++;

                var c_result = parseInt(s_response.substr(n_offset*2,n_size*2),16);
                if( c_result === 0xFF ){
                    continue;//good
                }
                if( c_result === 0x80 ){
                    continue;//negative good
                }

                b_result = false;
            }while(false);
            return b_result;
        }

        /**
         * @private
         * @function _is_good_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} true - response contains good.
         * <br /> false - else case.
         */
        function _is_good_response(s_response){
            var b_result = false;

            do{
                if( typeof s_response !== 'string'){
                    continue;
                }
                if(s_response.length<(2*_const_min_size_response_header)){
                    continue;
                }
                var n_offset = 0;
                var n_size = 1;
                if( parseInt(s_response.substr(n_offset*2,n_size*2),16) !== 0x52 ){
                    continue;//invalid prefix
                }
                b_result = true;
                n_offset++;

                var c_result = parseInt(s_response.substr(n_offset*2,n_size*2),16);
                if( c_result === 0xFF ){
                    continue;//good
                }

                b_result = false;
            }while(false);
            return b_result;
        }

        /**
         * @private
         * @function _is_success_enter_opos_mode
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} true - response contains good or negative good.
         * <br /> false - else case.
         */
        function _is_success_enter_opos_mode(s_response){
            return _is_success_response(s_response);
        }

        /**
         * @private
         * @function _is_success_leave_opos_mode
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} true - response contains good or negative good.
         * <br /> false - else case.
         */        
        function _is_success_leave_opos_mode(s_response){
            return _is_success_response(s_response);
        }

        /**
         * @private
         * @function _is_success_enter_config_mode
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} true - response contains good or negative good.
         * <br /> false - else case.
         */        
        function _is_success_enter_config_mode(s_response){
            return _is_success_response(s_response);
        }

        /**
         * @private
         * @function _is_success_leave_config_mode
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} true - response contains good or negative good.
         * <br /> false - else case.
         */        
        function _is_success_leave_config_mode(s_response){
            return _is_success_response(s_response);
        }

        /**
         * @private
         * @function _is_success_apply_config_mode
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} true - response contains good or negative good.
         * <br /> false - else case.
         */        
        function _is_success_apply_config_mode(s_response){
            return _is_success_response(s_response);
        }

        /**
         * @private
         * @function _is_success_run_boot_loader
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} true - response contains good or negative good.
         * <br /> false - else case.
         */        
        function _is_success_run_boot_loader(s_response){
            return _is_success_response(s_response);
        }

        /**
         * @private
         * @function _get_length_member_of_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {number} greater then equal 0, the length member of response.
         * <br /> negative value.
         */
        function _get_length_member_of_response(s_response){
            var n_length = -1;

            do{
                if( typeof s_response !== 'string'){
                    continue;
                }
                if(s_response.length<(2*_const_min_size_response_header)){
                    continue;
                }
                var n_offset = 2;
                var n_size = 1;

                n_length = parseInt(s_response.substr(n_offset*2,n_size*2),16);

            }while(false);
            return n_length;
        }

        /**
         * @private
         * @function _get_data_field_member_of_response_by_number_array
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {(null|number[])} each byte of lpu237 protocol packet's data field to number array
         * <br /> null - error
         */
        function _get_data_field_member_of_response_by_number_array(s_response){
            var n_data = null;

            do{
                var n_length = -1;
                if( typeof s_response !== 'string'){
                    continue;
                }
                if(s_response.length<(2*_const_min_size_response_header)){
                    continue;
                }
                var n_offset = 2;
                var n_size = 1;

                n_length = parseInt(s_response.substr(n_offset*2,n_size*2),16);
                if( n_length <= 0 ){
                    continue;
                }
                
                n_data = [];
                var c_val = 0;

                for( var i = 0; i<n_length; i++ ){
                    c_val = parseInt(s_response.substr((++n_offset)*2,n_size*2),16);
                    n_data.push(c_val);
                }//end for

            }while(false);
            return n_data;
        }

        /**
         * @private
         * @function _get_data_field_member_of_response_by_string
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {(null|string)} lpu237 protocol packet's data field to string
         * <br /> null - error
         */
        function _get_data_field_member_of_response_by_string(s_response){
            var s_data = null;

            do{
                var n_length = -1;
                if( typeof s_response !== 'string'){
                    continue;
                }
                if(s_response.length<(2*_const_min_size_response_header)){
                    continue;
                }
                var n_offset = 2;
                var n_size = 1;

                n_length = parseInt(s_response.substr(n_offset*2,n_size*2),16);
                if( n_length <= 0 ){
                    continue;
                }
                
                s_data = "";
                var n_val = 0;

                for( var i = 0; i<n_length; i++ ){
                    n_val = parseInt(s_response.substr((++n_offset)*2,n_size*2),16);
                    if( n_val == 0){
                        break;//terminate null
                    }
                    s_data += String.fromCharCode(n_val);
                }//end for

            }while(false);
            return s_data;
        }

        /**
         * @private
         * @function _get_data_field_member_of_response_by_hex_string
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {(null|string)} lpu237 protocol packet's data field.
         * <br /> null - error.
         */
        function _get_data_field_member_of_response_by_hex_string(s_response){
            var s_data = null;

            do{
                var n_length = -1;
                if( typeof s_response !== 'string'){
                    continue;
                }
                if(s_response.length<(2*_const_min_size_response_header)){
                    continue;
                }
                var n_offset = 2;
                var n_size = 1;

                n_length = parseInt(s_response.substr(n_offset*2,n_size*2),16);
                if( n_length <= 0 ){
                    continue;
                }
                
                s_data = s_response.substr((++n_offset)*2,n_length*2);
            }while(false);
            return s_data;
        }
        
        /**
         * @private
         * @function _get_data_field_member_of_response_by_boolean
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {(null|boolean)} lpu237 protocol packet's data field to boolean.
         * <br /> null - error.
         */
        function _get_data_field_member_of_response_by_boolean(s_response){
            var b_result = null;

            do{
                var n_length = -1;
                if( typeof s_response !== 'string'){
                    continue;
                }
                if(s_response.length<(2*_const_min_size_response_header)){
                    continue;
                }
                var n_offset = 2;
                var n_size = 1;

                n_length = parseInt(s_response.substr(n_offset*2,n_size*2),16);
                if( n_length <= 0 ){
                    continue;
                }
                
                b_result = false;
                var c_val = 0;

                for( var i = 0; i<n_length; i++ ){
                    c_val = parseInt(s_response.substr((++n_offset)*2,n_size*2),16);
                    if( c_val !== 0 ){
                        b_result = true;
                        break;
                    }
                }//end for

            }while(false);
            return b_result;
        }        
        
        /**
         * @private
         * @function _get_data_field_member_of_response_by_number
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {number} lpu237 protocol packet's data field to number.
         * <br /> negative value is error.
         */
        function _get_data_field_member_of_response_by_number(s_response){
            var n_data = -1;

            do{
                var s_data = "";
                var n_length = -1;
                if( typeof s_response !== 'string'){
                    continue;
                }
                if(s_response.length<(2*_const_min_size_response_header)){
                    continue;
                }
                var n_offset = 2;
                var n_size = 1;

                n_length = parseInt(s_response.substr(n_offset*2,n_size*2),16);
                if( n_length <= 0 ){
                    continue;
                }
                
                s_data = s_response.substr((++n_offset)*2,n_length*2);
                n_data = elpusk.util.get_number_from_little_endian_hex_string(s_data);
            }while(false);
            return n_data;
        }

		//set by response data.
        ///////////////////////////////////////////////////////////////////////////////
        /**
         * @private
         * @function _get_version_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {(null|number[])} version - number 4 array for version data.
         * <br /> null - processing failure.
         */
		function _get_version_from_response(s_response ){
            var version = null;

			do {
				if (!_is_success_response(s_response)){
                    continue;
                }

                var n_size = _type_system_size.SYS_SIZE_VERSION;
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }

                version = _get_data_field_member_of_response_by_number_array(s_response);
			} while (false);
			return version;
        }
        
        /**
         * @private
         * @function _get_name_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {(null|string)} name - the system name.
         * <br /> null - processing failure.
         */
		function _get_name_from_response(s_response,s_name){
			var s_name = null;

			do {
				if (!_is_success_response(s_response)){
                    continue;
                }
                
                var n_size = _type_system_size.SYS_SIZE_NAME;
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }
                    
                s_name = _get_data_field_member_of_response_by_string(s_response);
			} while (false);
			return s_name;
        }
        
        /**
         * @private
         * @function _get_support_mmd1000_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} true - used  mmd1000 decoder
         * <br /> false - used deltaAsic.
         */
		function _get_support_mmd1000_from_response(s_response){
            return _is_good_response(s_response);
        }
        
        /**
         * @private
         * @function _get_uid_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {(null|string)} hex string format UID.
         * <br /> null - error.
         */
		function _get_uid_from_response(s_response){
			var s_data = null;

			do {
				if (!_is_success_response(s_response)){
                    continue;
                }
                
                var n_size = _const_the_size_of_uid;
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }

                s_data = _get_data_field_member_of_response_by_hex_string(s_response);
			} while (false);
			return s_data;
        }
        
        /**
         * @private
         * @function _get_ibutton_type_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} true - HW support i-button
         * <br /> false - HW is not support i-button.
         */
		function _get_ibutton_type_from_response(s_response){
            return _is_good_response(s_response);
        }

        /**
         * @private
         * @function _get_type_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} true - HW is standard type
         * <br /> false - HW is not standard type
         */
		function _get_type_from_response(s_response){
            return _is_good_response(s_response);
        }
        
        /**
         * @private
         * @function _get_global_pre_postfix_send_condition_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {(null|boolean)} true - if all track is not error,global pro/postfix will be sent. 
         * <br /> false - else case.
         * <br /> null - error.
         */
		function _get_global_pre_postfix_send_condition_from_response(s_response){
			var b_result = null;

			do {
				if (!_is_success_response(s_response)){
                    continue;
                }
                
                var n_size = _type_system_size.SYS_SIZE_G_TAG_CONDITION;
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }
                b_result = false;
                b_result = _get_data_field_member_of_response_by_boolean(s_response);
			} while (false);
			return b_result;
        }
        
        /**
         * @private
         * @function _get_interface_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {number} interface number.
         * <br /> negative value is error.
         */
		function _get_interface_from_response(s_response){
			var n_value = -1;

			do {
				if (!_is_success_response(s_response)){
                    continue;
                }
                
                var n_size = _type_system_size.SYS_SIZE_INTERFACE;
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }

                n_value = _get_data_field_member_of_response_by_number(s_response);
			} while (false);
			return n_value;
        }
        
        /**
         * @private
         * @function _get_language_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {number} language number.
         * <br /> negative value is error.
         */
		function _get_language_from_response(s_response){
			var n_value = -1;

			do {
				if (!_is_success_response(s_response)){
                    continue;
                }
                
                var n_size = _type_system_size.SYS_SIZE_CONTAINER_MAP_INDEX;
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }

                n_value = _get_data_field_member_of_response_by_number(s_response);
			} while (false);
			return n_value;
        }
        
        /**
         * @private
         * @function _get_buzzer_frequency_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {number} buzzer frequency.
         * <br /> negative value is error.
         */
		function _get_buzzer_frequency_from_response(s_response){
			var n_value = -1;

			do {
				if (!_is_success_response(s_response)){
                    continue;
                }
                
                var n_size = _type_system_size.SYS_SIZE_BUZZER_FREQ;
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }

                n_value = _get_data_field_member_of_response_by_number(s_response);
			} while (false);
			return n_value;
        }
        
        /**
         * @private
         * @function _get_boot_run_time_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {number} MSD bootloader running msec time .
         * <br /> negative value is error.
         */
		function _get_boot_run_time_from_response(s_response){
			var n_value = -1;

			do {
				if (!_is_success_response(s_response)){
                    continue;
                }
                
                var n_size = _type_system_size.SYS_SIZE_BOOT_RUN_TIME;
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }

                n_value = _get_data_field_member_of_response_by_number(s_response);
			} while (false);
			return n_value;
        }

        /**
         * @private
         * @function _get_enable_track_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @param {number} n_track - ISO track 0~2
         * @returns {(null|boolean)} true - read track.
         * <br /> false - don't read track.
         * <br /> null - error.
         */
		function _get_enable_track_from_response(s_response,n_track){
			var b_result = null;

			do {
                var n_size = 0;
                
				switch (n_track) {
				case _type_msr_track_Numer.iso1_track:
                case _type_msr_track_Numer.iso2_track:
                case _type_msr_track_Numer.iso3_track:
                    n_size = _type_system_size.SYS_SIZE_ENABLE_TRACK[n_track];
					break;
				default:
					continue;
                }//end switch
                
				if (!_is_success_response(s_response)){
                    continue;
                }
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }

                b_result = false;
				b_result = _get_data_field_member_of_response_by_boolean(s_response);
			} while (false);
			return b_result;
        }
        
        /**
         * @private
         * @function _get_direction_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @param {number} n_track - ISO track 0~2
         * @returns {number} reading direction.
         * <br /> negative value is error.
         */
		function _get_direction_from_response(s_response,n_track){
			var n_value = -1;

			do {
                var n_size = 0;
                
				switch (n_track) {
				case _type_msr_track_Numer.iso1_track:
                case _type_msr_track_Numer.iso2_track:
                case _type_msr_track_Numer.iso3_track:
                    n_size = _type_system_size.SYS_SIZE_DIRECTION[n_track];
					break;
				default:
					continue;
                }//end switch
                
				if (!_is_success_response(s_response)){
                    continue;
                }
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }

				n_value = _get_data_field_member_of_response_by_number(s_response);
			} while (false);
			return n_value;
        }

        /**
         * @private
         * @function _get_global_prefix_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {(null|string)} hex string format.
         * <br /> null - error.
         */
		function _get_global_prefix_from_response(s_response){
			var s_data = null;

			do {
				if (!_is_success_response(s_response)){
                    continue;
                }
                
                var n_size = _type_system_size.SYS_SIZE_G_PRE;
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }

                s_data = _get_data_field_member_of_response_by_hex_string(s_response);
			} while (false);
			return s_data;
        }
        
        /**
         * @private
         * @function _get_global_postfix_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {(null|string)} hex string format.
         * <br /> null - error.
         */
		function _get_global_postfix_from_response(s_response){
			var s_data = null;

			do {
				if (!_is_success_response(s_response)){
                    continue;
                }
                
                var n_size = _type_system_size.SYS_SIZE_G_POST;
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }

                s_data = _get_data_field_member_of_response_by_hex_string(s_response);
			} while (false);
			return s_data;
        }

        /**
         * @private
         * @function _get_private_prefix_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @param {number} n_track - ISO track 0~2
         * @returns {(null|string)} hex string format.
         * <br /> null - error.
         */
		function _get_private_prefix_from_response(s_response, n_track ){
			var s_data = null;

			do {
                var n_size = 0;
                
				switch (n_track) {
				case _type_msr_track_Numer.iso1_track:
                case _type_msr_track_Numer.iso2_track:
                case _type_msr_track_Numer.iso3_track:
                    n_size = _type_system_size.SYS_SIZE_P_PRE[n_track];
					break;
				default:
					continue;
                }//end switch
                
				if (!_is_success_response(s_response)){
                    continue;
                }
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }
                s_data = _get_data_field_member_of_response_by_hex_string(s_response);
			} while (false);
			return s_data;
        }
        
        /**
         * @private
         * @function _get_private_postfix_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @param {number} n_track - ISO track 0~2
         * @returns {(null|string)} hex string format.
         * <br /> null - error.
         */
		function _get_private_postfix_from_response(s_response, n_track ){
			var s_data = null;

			do {
                var n_size = 0;
                
				switch (n_track) {
				case _type_msr_track_Numer.iso1_track:
                case _type_msr_track_Numer.iso2_track:
                case _type_msr_track_Numer.iso3_track:
                    n_size = _type_system_size.SYS_SIZE_P_POST[n_track];
					break;
				default:
					continue;
                }//end switch
                
				if (!_is_success_response(s_response)){
                    continue;
                }
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }
                s_data = _get_data_field_member_of_response_by_hex_string(s_response);
			} while (false);
			return s_data;
        }

        /**
         * @private
         * @function _get_ibutton_prefix_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {(null|string)} hex string format.
         * <br /> null - error.
         */
		function _get_ibutton_prefix_from_response(s_response){
			var s_data = null;

			do {
				if (!_is_success_response(s_response)){
                    continue;
                }
                
                var n_size = _type_system_size.SYS_SIZE_IBUTTON_G_PRE;
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }

                s_data = _get_data_field_member_of_response_by_hex_string(s_response);
			} while (false);
			return s_data;
        }
        
        /**
         * @private
         * @function _get_ibutton_postfix_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {(null|string)} hex string format.
         * <br /> null - error.
         */
		function _get_ibutton_postfix_from_response(s_response){
			var s_data = null;

			do {
				if (!_is_success_response(s_response)){
                    continue;
                }
                
                var n_size = _type_system_size.SYS_SIZE_IBUTTON_G_POST;
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }

                s_data = _get_data_field_member_of_response_by_hex_string(s_response);
			} while (false);
			return s_data;
        }
        
        /**
         * @private
         * @function _get_uart_prefix_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {(null|string)} hex string format.
         * <br /> null - error.
         */
		function _get_uart_prefix_from_response(s_response){
			var s_data = null;

			do {
				if (!_is_success_response(s_response)){
                    continue;
                }
                
                var n_size = _type_system_size.SYS_SIZE_UART_G_PRE;
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }

                s_data = _get_data_field_member_of_response_by_hex_string(s_response);
			} while (false);
			return s_data;
        }
        
        /**
         * @private
         * @function _get_uart_postfix_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {(null|string)} hex string format.
         * <br /> null - error.
         */
		function _get_uart_postfix_from_response(s_response){
			var s_data = null;

			do {
				if (!_is_success_response(s_response)){
                    continue;
                }
                
                var n_size = _type_system_size.SYS_SIZE_UART_G_POST;
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }

                s_data = _get_data_field_member_of_response_by_hex_string(s_response);
			} while (false);
			return s_data;
        }
        
        /**
         * @private
         * @function _get_f12_ibutton_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} the current i-button mode is F12.
         */
		function _get_f12_ibutton_from_response(s_response){
            var b_result = false;

			do {
                var c_blank = [];
				if (!_is_success_response(s_response)){
                    continue;
                }

                var n_size = _type_system_size.SYS_SIZE_F12_IBUTTON;
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }

                c_blank = _get_data_field_member_of_response_by_number_array(s_response);
                if( c_blank[2] & 0x01 ){
                    b_result = true;
                }
			} while (false);
			return b_result;
        }
        
        /**
         * @private
         * @function _get_zeros_ibutton_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} the current i-button mode is zeros.
         */
		function _get_zeros_ibutton_from_response(s_response){
            var b_result = false;

			do {
                var c_blank = [];
				if (!_is_success_response(s_response)){
                    continue;
                }

                var n_size = _type_system_size.SYS_SIZE_F12_IBUTTON;
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }

                c_blank = _get_data_field_member_of_response_by_number_array(s_response);
                if( c_blank[2] & 0x02 ){
                    b_result = true;
                }
			} while (false);
			return b_result;
        }
        
        /**
         * @private
         * @function _get_zeros_7times_ibutton_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} the current i-button mode is 7 times zeros.
         */
		function _get_zeros_7times_ibutton_from_response(s_response){
            var b_result = false;

			do {
                var c_blank = [];
				if (!_is_success_response(s_response)){
                    continue;
                }

                var n_size = _type_system_size.SYS_SIZE_F12_IBUTTON;
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }

                c_blank = _get_data_field_member_of_response_by_number_array(s_response);
                if( c_blank[2] & 0x04 ){
                    b_result = true;
                }
			} while (false);
			return b_result;
        }
        
        /**
         * @private
         * @function _get_addmit_code_stick_ibutton_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} the current i-button mode is addmit codestick.
         */
		function _get_addmit_code_stick_ibutton_from_response(s_response){
            var b_result = false;

			do {
                var c_blank = [];
				if (!_is_success_response(s_response)){
                    continue;
                }

                var n_size = _type_system_size.SYS_SIZE_F12_IBUTTON;
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }

                c_blank = _get_data_field_member_of_response_by_number_array(s_response);
                if( c_blank[2] & 0x08 ){
                    b_result = true;
                }
			} while (false);
			return b_result;
        }

        
        /**
         * @private
         * @function _get_global_pre_postfix_send_condition_from_string
         * @param {string} s_string - "and" or "or"
         * @returns {(null|boolean)} true - if all track is not error,global pro/postfix will be sent. 
         * <br /> false - else case.
         * <br /> null - error.
         */
		function _get_global_pre_postfix_send_condition_from_string(s_string){
			var b_result = null;

			do {
				if (typeof s_string !== 'string'){
                    continue;
                }
                if( s_string === "and"){
                    b_result = true;
                    continue;
                }
                if( s_string === "or"){
                    b_result = false;
                    continue;
                }
			} while (false);
			return b_result;
        }
        
        /**
         * @private
         * @function _get_interface_from_string
         * @param {string} s_string - "usb_kb", "usb_hid" or "rs232".
         * @returns {number} interface number.
         * <br /> negative value is error.
         */
		function _get_interface_from_string(s_string){
			var n_value = -1;

			do {
				if (typeof s_string !== 'string'){
                    continue;
                }
                if( s_string === "usb_kb"){
                    n_value = _type_system_interface.system_interface_usb_keyboard;
                    continue;
                }
                if( s_string === "usb_hid"){
                    n_value = _type_system_interface.system_interface_usb_msr;
                    continue;
                }             
                if( s_string === "rs232"){
                    n_value = _type_system_interface.system_interface_uart;
                    continue;
                }             
			} while (false);
			return n_value;
        }
        
        /**
         * @private
         * @function _get_language_from_string
         * @param {string} s_string - "usa_english" , "spanish", "danish", "french", "german", "italian", "norwegian", "swedish", "hebrew" or "turkey"
         * @returns {number} language number.
         * <br /> negative value is error.
         */
		function _get_language_from_string(s_string){
			var n_value = -1;

			do {
				if (typeof s_string !== 'string'){
                    continue;
                }
                if( s_string === "usa_english"){
                    n_value = _type_keyboard_language_index.language_map_index_english;
                    continue;
                }
                if( s_string === "spanish"){
                    n_value = _type_keyboard_language_index.language_map_index_spanish;
                    continue;
                }
                if( s_string === "danish"){
                    n_value = _type_keyboard_language_index.language_map_index_danish;
                    continue;
                }
                if( s_string === "french"){
                    n_value = _type_keyboard_language_index.language_map_index_french;
                    continue;
                }
                if( s_string === "german"){
                    n_value = _type_keyboard_language_index.language_map_index_german;
                    continue;
                }
                if( s_string === "italian"){
                    n_value = _type_keyboard_language_index.language_map_index_italian;
                    continue;
                }
                if( s_string === "norwegian"){
                    n_value = _type_keyboard_language_index.language_map_index_norwegian;
                    continue;
                }
                if( s_string === "swedish"){
                    n_value = _type_keyboard_language_index.language_map_index_swedish;
                    continue;
                }
                if( s_string === "hebrew"){
                    n_value = _type_keyboard_language_index.language_map_index_israel;
                    continue;
                }
                if( s_string === "turkey"){
                    n_value = _type_keyboard_language_index.language_map_index_turkey;
                    continue;
                }
			} while (false);
			return n_value;
        }
        
        /**
         * @private
         * @function _get_buzzer_frequency_from_string
         * @param {string} s_string - "on" or "off"
         * @returns {boolean} true - buzzer on,
         * false - buzzer off
         * <br /> null is error
         */
		function _get_buzzer_frequency_from_string(s_string){
			var b_value = null;

			do {
				if (typeof s_string !== 'string'){
                    continue;
                }
                if( s_string === "on"){
                    b_value = true;
                    continue;
                }
                if( s_string === "off"){
                    b_value = false;
                    continue;
                }
			} while (false);
			return b_value;
        }
        
        /**
         * @private
         * @function _get_enable_track_from_string
         * @param {string} s_string - "enable" or "disable"
         * @returns {(null|boolean)} true - read track.
         * <br /> false - don't read track.
         * <br /> null - error.
         */
		function _get_enable_track_from_string(s_string){
			var b_result = null;

			do {
				if (typeof s_string !== 'string'){
                    continue;
                }
                if( s_string === "enable"){
                    b_result = true;
                    continue;
                }
                if( s_string === "disable"){
                    b_result = false;
                    continue;
                }
			} while (false);
			return b_result;
        }
        
        /**
         * @private
         * @function _get_direction_from_string
         * @param {string} s_string - "bidirectional", "forward" or "backward"
         * @returns {number} reading direction.
         * <br /> negative value is error.
         */
		function _get_direction_from_string(s_string){
			var n_value = -1;

			do {
				if (typeof s_string !== 'string'){
                    continue;
                }
                if( s_string === "bidirectional"){
                    n_value = _type_direction.dir_bidectional;
                    continue;
                }
                if( s_string === "forward"){
                    n_value = _type_direction.dir_forward;
                    continue;
                }
                if( s_string === "backward"){
                    n_value = _type_direction.dir_backward;
                    continue;
                }
			} while (false);
			return n_value;
        }

        /**
         * @private
         * @function _get_tag_from_string
         * @param {string} s_string - "[][0x00][][0x01][][0x02][][0x03][][0x04][][0x05][][0x06]"
         * @returns {(null|string)} hex string format.( included length in front. )
         * <br /> null - error.
         */
		function _get_tag_from_string(s_string){
            var s_tag_hex = null;
            var b_error = false;

			do {
				if (typeof s_string !== 'string'){
                    continue;
                }

                if( s_string.length === 0 ){
                    s_tag_hex = "000000000000000000000000000000";
                    continue;
                }
                var s_data = s_string;
                var reg_ex = /\s*(?:\]\s*\[|$)\s*/;

                s_data = s_data.trim();
                var array_token = s_data.split(reg_ex);  

                s_tag_hex = "";

                if( array_token.length === 0 ){
                    continue;
                }

                var n_tag = 0;
                var s_token = "";
                var n_modifier = 0;
                var b_hex = false;
                var b_all_zero = true;

                for(var i in array_token) {
                    n_tag++;
                    s_token = "";
                    b_hex = false;

                    if( array_token[i].length === 0 ){
                        b_hex = true;
                        s_token = "00";//only []
                    }
                    else if( array_token[i].trim() === '[' ){
                        s_token = "00";//the first case in only []
                    }
                    else{
                        var array_tag = array_token[i].split(/\s*]$/);
                        for(var j in array_tag) {
                            array_tag[j] = array_tag[j].replace("[","");
                            array_tag[j] = array_tag[j].trim();
                            if( array_tag[j].length > 0  ){
                                if( array_tag[j].indexOf("0x") !== -1 ){
                                    b_hex = true;
                                    array_tag[j] = array_tag[j].replace(/0x/,"");
                                }
                                s_token += array_tag[j];
                            }
                        }//end for j
                    }

                    b_error = false;

                    if( i%2 === 0 ){
                        //Modifier
                        n_modifier = 0;

                        if( s_token.indexOf("s") !== -1 ){
                            n_modifier |= 0x02;//left shift
                        }
                        if( s_token.indexOf("c") !== -1 ){
                            n_modifier |= 0x01;//left control
                        }
                        if( s_token.indexOf("a") !== -1 ){
                            n_modifier |= 0x04;//left alt
                        }

                        s_token = "0" + n_modifier.toString(16);
                    }
                    else{
                        //key
                        do{
                            if( b_hex){
                                continue;
                            }
                            if( s_token === "f1" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY________F1;
                                continue;
                            }
                            if( s_token === "f2" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY________F2;
                                continue;
                            }
                            if( s_token === "f3" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY________F3;
                                continue;
                            }
                            if( s_token === "f4" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY________F4;
                                continue;
                            }
                            if( s_token === "f5" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY________F5;
                                continue;
                            }
                            if( s_token === "f6" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY________F6;
                                continue;
                            }
                            if( s_token === "f7" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY________F7;
                                continue;
                            }
                            if( s_token === "f8" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY________F8;
                                continue;
                            }
                            if( s_token === "f9" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY________F9;
                                continue;
                            }
                            if( s_token === "f10" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY_______F10;
                                continue;
                            }
                            if( s_token === "f11" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY_______F11;
                                continue;
                            }
                            if( s_token === "f12" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY_______F12;
                                continue;
                            }
                            if( s_token === "esc" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____ESCAPE;
                                continue;
                            }
                            if( s_token === "space" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY_____SPACE;
                                continue;
                            }
                            if( s_token === "tab" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY_______TAB;
                                continue;
                            }
                            if( s_token === "q" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____q____Q;
                                continue;
                            }
                            if( s_token === "w" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____w____W;
                                continue;
                            }
                            if( s_token === "e" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____e____E;
                                continue;
                            }
                            if( s_token === "r" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____r____R;
                                continue;
                            }
                            if( s_token === "t" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____t____T;
                                continue;
                            }
                            if( s_token === "y" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____y____Y;
                                continue;
                            }
                            if( s_token === "u" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____u____U;
                                continue;
                            }
                            if( s_token === "i" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____i____I;
                                continue;
                            }
                            if( s_token === "o" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____o____O;
                                continue;
                            }
                            if( s_token === "p" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____p____P;
                                continue;
                            }
                            if( s_token === "[" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY_LBT___LBR;
                                continue;
                            }
                            if( s_token === "]" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY_RBT___RBR;
                                continue;
                            }
                            if( s_token === "\\" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY_BSLA_VBAR;
                                continue;
                            }
                            if( s_token === "del" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____DELETE;
                                continue;
                            }
                            if( s_token === "z" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____z____Z;
                                continue;
                            }
                            if( s_token === "x" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____x____X;
                                continue;
                            }
                            if( s_token === "c" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____c____C;
                                continue;
                            }
                            if( s_token === "v" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____v____V;
                                continue;
                            }
                            if( s_token === "b" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____b____B;
                                continue;
                            }
                            if( s_token === "n" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____n____N;
                                continue;
                            }
                            if( s_token === "m" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____m____M;
                                continue;
                            }
                            if( s_token === "," ){
                                s_token = elpusk.util.keyboard.const.HIDKEY_COMA___LT;
                                continue;
                            }
                            if( s_token === "." ){
                                s_token = elpusk.util.keyboard.const.HIDKEY_PERIOD_GT;
                                continue;
                            }
                            if( s_token === "/" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY_SLASH__QM;
                                continue;
                            }
                            if( s_token === "`" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY_GRAV_TILD;
                                continue;
                            }
                            if( s_token === "1" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____1_EXCL;
                                continue;
                            }
                            if( s_token === "2" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____2_QUOT;
                                continue;
                            }
                            if( s_token === "3" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____3_SHAR;
                                continue;
                            }
                            if( s_token === "4" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____4_DOLL;
                                continue;
                            }
                            if( s_token === "5" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____5_PERC;
                                continue;
                            }
                            if( s_token === "6" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____6_CIRC;
                                continue;
                            }
                            if( s_token === "7" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____7_AMPE;
                                continue;
                            }
                            if( s_token === "8" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____8_ASTE;
                                continue;
                            }
                            if( s_token === "9" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____9_L_PA;
                                continue;
                            }
                            if( s_token === "0" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____0_R_PA;
                                continue;
                            }
                            if( s_token === "-" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY_MIN_UNDER;
                                continue;
                            }
                            if( s_token === "=" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY_EQU__PLUS;
                                continue;
                            }
                            if( s_token === "bs" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY_BACKSPACE;
                                continue;
                            }
                            if( s_token === "a" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____a____A;
                                continue;
                            }
                            if( s_token === "s" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____s____S;
                                continue;
                            }
                            if( s_token === "d" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____d____D;
                                continue;
                            }
                            if( s_token === "f" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____f____F;
                                continue;
                            }
                            if( s_token === "g" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____g____G;
                                continue;
                            }
                            if( s_token === "h" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____h____H;
                                continue;
                            }
                            if( s_token === "j" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____j____J;
                                continue;
                            }
                            if( s_token === "k" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____k____K;
                                continue;
                            }
                            if( s_token === "l" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____l____L;
                                continue;
                            }
                            if( s_token === ";" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY_SEMI__COL;
                                continue;
                            }
                            if( s_token === "'" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY_APOS_QUOT;
                                continue;
                            }
                            if( s_token === "enter" ){
                                s_token = elpusk.util.keyboard.const.HIDKEY____RETURN;
                                continue;
                            }
                            if(s_token.length === 0 ){
                                s_token = "00";
                                continue;
                            }
                            b_error = true;
                        }while(false);

                        if( b_error ){
                            break;//exit for
                        }
                    }

                    s_tag_hex += s_token;

                    if( s_token !== "00" ){
                        b_all_zero = false;
                    }
                }// end for i
                
                if( b_error ){
                    s_tag_hex = null;
                    continue;
                }
                var s_len = n_tag.toString(16);
                if( s_len.length %2 !== 0 ){
                    s_len = "0" + s_len;
                }
                if( b_all_zero ){
                    s_tag_hex = "000000000000000000000000000000";
                }
                else{
                    s_tag_hex = s_len + s_tag_hex;
                }
			} while (false);
			return s_tag_hex;
        }
        
        /**
         * @private
         * @function _get_ibutton_mode_from_string
         * @param {string} s_string - "zeros", "f12", "zeros7" or "addimat"
         * @returns {number} the current i-button mode is F12.
         * <br /> negative - error.
         */
		function _get_ibutton_mode_from_string(s_string){
            var n_value = -1;

			do {
				if (typeof s_string !== 'string'){
                    continue;
                }
                if( s_string === "zeros"){
                    n_value = _type_ibutton_mode.ibutton_zeros;
                    continue;
                }
                if( s_string === "f12"){
                    n_value = _type_ibutton_mode.ibutton_f12;
                    continue;
                }
                if( s_string === "zeros7"){
                    n_value = _type_ibutton_mode.ibutton_zeros7;
                    continue;
                }
                if( s_string === "addimat"){
                    n_value = _type_ibutton_mode.ibutton_addmit;
                    continue;
                }

			} while (false);
			return n_value;
        }
    
        ////////////////////////////////////////////////////////////////////////////////////////////////
        // generate basic IO pattern.
        ////////////////////////////////////////////////////////////////////////////////////////////////

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

                var s_offset = elpusk.util.get_dword_hex_string_from_number( n_offset )
                var s_size = elpusk.util.get_dword_hex_string_from_number(n_size);
                var s_data = s_offset + s_size;

                b_result = _generate_request(
                    queue_s_tx
                    ,_type_cmd.REQ_CONFIG
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
            var n_size = _type_system_size.SYS_SIZE_VERSION;
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
            var n_offset = 0;
            var n_size = 0;

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
            var n_offset = 0;
            var n_size = 0;

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
            var n_offset = 0;
            var n_size = 0;

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
            var n_offset = 0;
            var n_size = 0;

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

                var s_offset = elpusk.util.get_dword_hex_string_from_number( n_offset )
                var s_size = elpusk.util.get_dword_hex_string_from_number(n_size);
                var s_data = s_offset + s_size + s_setting_data;

                b_result = _generate_request(
                    queue_s_tx
                    ,_type_cmd.REQ_CONFIG
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
                s_data = elpusk.util.get_dword_hex_string_from_number(1);
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
            var s_data = elpusk.util.get_byte_hex_string_from_number(n_interface);
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
            var b_result  = false;

            do{
                var n_offset = 0;
                var n_size = 0;
                var s_full_data = "";
                var s_half_data = "";

                n_offset = _type_system_offset.SYS_OFFSET_CONTAINER_MAP_INDEX;
                n_size = _type_system_size.SYS_SIZE_CONTAINER_MAP_INDEX;
                s_data = elpusk.util.get_dword_hex_string_from_number(n_language);
                if( !_generate_config_set(queue_s_tx,n_offset,n_size,s_data) ){
                    continue;
                }

                b_result = true;
                for( var i = 0; i<_const_the_number_of_track; i++ ){
                    n_offset = _type_system_offset.SYS_OFFSET_INFORMSR_MAP_INDEX[i];
                    n_size = _type_system_size.SYS_SIZE_INFORMSR_MAP_INDEX[i];
                    if( !_generate_config_set(queue_s_tx,n_offset,n_size,s_data) ){
                        b_result = false;
                        break;
                    }
    
                }//end for
                if(!b_result){
                    continue;
                }
                //
                b_result = true;
            }while(false);

            return b_result;
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
            var s_data = elpusk.util.get_dword_hex_string_from_number(n_buzzer);
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
                s_data = elpusk.util.get_byte_hex_string_from_number(1);
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
            var s_data = elpusk.util.get_byte_hex_string_from_number(n_direction);
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
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_tag);
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
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_tag);
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
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_tag);
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
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_tag);
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
                var n_offset = 0;
                var n_size = 0;
                var s_full_data = "";
                var s_half_data = "";
                //USB map
                n_offset = _const_address_system_hid_key_map_offset;
                n_size = elpusk.util.keyboard.const.FOR_CVT_MAX_ASCII_CODE;
                s_full_data = elpusk.util.keyboard.map.get_ascii_to_hid_key_map_string(n_language);
                s_half_data = s_full_data.substring(0,s_full_data,length/2);
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
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_tag);
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
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_tag);
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
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_tag);
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
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_tag);
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
                s_data.push(elpusk.util.get_byte_hex_string_from_number(cblank[i]));
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
         * @private
         * @function _get_tag_by_ascii_code
         * @param {number} n_language language index number 0~10. type is _type_keyboard_language_index.
         * @param {string} s_len_tag_hex this string is received from device by hex string format.
         * @returns {number[]} ASCII code array of tag.
         */
        function _get_tag_by_ascii_code(n_language,s_len_tag_hex){
            var n_hex = [];

            do{
                if( typeof n_language !== 'number'){
                    continue;
                }
                if( typeof s_len_tag_hex !== 'string'){
                    continue;
                }
                if( (s_len_tag_hex.length % 2) !== 0){
                    continue;
                }

                var s_one_byte = "";
                var n_len = 0;
                var n_tag = [];

                for( var i = 0; i<s_len_tag_hex.length; i=i+2 ){
                    s_one_byte = s_len_tag_hex.substring(i,i+2);
                    n_tag.push(parseInt(s_one_byte,16));
                }//end for

                n_len = n_tag.shift();
                if( n_len === 0 ){
                    continue;//none tag
                }
                if( n_len > _const_max_size_tag_byte ){
                    n_len = _const_max_size_tag_byte;
                }
                n_tag.length = n_len;

                //
                var c_mod = 0;
                var c_key = 0;
                for( var i = 0; i<n_tag.length; i=i+2 ){
                    if(n_tag[i] === 0 && n_tag[i+1] === 0 ){
                        continue;
                    }
                    if(n_tag[i]===0xff ){
                        //ascii code format
                        n_hex.push(n_tag[i+1]);
                        continue;
                    }
                    //hid keyboard code.
                    for( var j = 0; j< elpusk.util.keyboard.map.sASCToHIDKeyMap[n_language].length; j++ ){
                        c_mod = parseInt(elpusk.util.keyboard.map.sASCToHIDKeyMap[n_language][j][0],16);
                        if( c_mod !==  n_tag[i] ){
                            continue;
                        }
                        c_key = parseInt(elpusk.util.keyboard.map.sASCToHIDKeyMap[n_language][j][1],16);
                        if(c_key !==  n_tag[i+1] ){
                            continue;
                        }
                        n_hex.push( j );
                    }//end for j
                }//end for i

            }while(false);
            return n_hex;
        }

        /**
         * @private
         * @function _get_tag_by_ascii_hex_string
         * @param {number} n_language language index number 0~10. type is _type_keyboard_language_index.
         * @param {string} s_len_tag_hex this string is received from device by hex string format.
         * @returns {string[]} hex string format of ASCII code of tag.
         */
        function _get_tag_by_ascii_hex_string(n_language,s_len_tag_hex){
            var s_hex = [];

            var n_ascii = _get_tag_by_ascii_code(n_language,s_len_tag_hex);

            for( var i =0 ; i<n_ascii.length; i++ ){
                s_hex.push( elpusk.util.get_byte_hex_string_from_number(n_ascii[i]) );
            }//end for
            return s_hex;
        }

        /**
         * @private
         * @function _get_tag_by_ascii_string
         * @param {number} n_language language index number 0~10. type is _type_keyboard_language_index.
         * @param {string} s_len_tag_hex this string is received from device by hex string format.
         * @returns {string[]} string format of ASCII code of tag.
         */
        function _get_tag_by_ascii_string(n_language,s_len_tag_hex){
            var s_ascii = [];

            var n_ascii = _get_tag_by_ascii_code(n_language,s_len_tag_hex);

            for( var i =0 ; i<n_ascii.length; i++ ){
                s_ascii.push( String.fromCharCode(n_ascii[i]) );
            }//end for
            return s_ascii;
        }

        /**
         * @class lpu237
         * @classdesc this class support protocol layer for lpu237 magnetic card reader.
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
            this._n_manufacture = _type_manufacturer.mf_elpusk;
    
            this._s_uid= null;
            this._n_device_function = _type_function.fun_none;
            this._version = [0,0,0,0];
    
            //device information
            this._b_is_hid_boot = false;
            this._b_removed_key_map_table = false;
    
            ///////////////////////////////
            //device parameters
            this._b_device_is_mmd1000 = false;
            this._b_device_is_ibutton_only = false;
            this._b_device_is_standard = false;
    
            this._n_interface = _type_system_interface.system_interface_usb_keyboard;
            this._dw_buzzer_frequency = _const_default_buzzer_frequency;
            this._dw_boot_run_time = 15000;
            this._n_language_index = _type_keyboard_language_index.language_map_index_english;
    
            this._b_enable_iso = [true,true,true];
    
            this._n_direction = [_type_direction.dir_bidectional,_type_direction.dir_bidectional,_type_direction.dir_bidectional];
    
            this._s_global_prefix = null;//you must include the length in front of this array.
            this._s_global_postfix = null;//you must include the length in front of this array.
    
            this._s_private_prefix = [null,null,null];//you must include the length in front of this each array.
            this._s_private_postfix = [null,null,null];//you must include the length in front of this each array.
    
            //i-button
            this._s_prefix_ibutton = null;//you must include the length in front of this array.
            this._s_postfix_ibutton = null;//you must include the length in front of this array.

            this._n_ibutton_mode = _type_ibutton_mode.ibutton_zeros;
            this._c_blank = [0,0,0,0];
    
            //rs232
            this._s_prefix_uart = null;//you must include the length in front of this array.
            this._s_postfix_uart = null;//you must include the length in front of this array.
            //
            this._token_format = _type_format.ef_decimal;
            this._s_name = null;            
        };

        _elpusk.device.usb.hid.lpu237.prototype = Object.create(elpusk.device.usb.hid.prototype);
        _elpusk.device.usb.hid.lpu237.prototype.constructor = _elpusk.device.usb.hid.lpu237;

        /////////////////////////////////////////////////////////////////////
        // getter
        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_version
         * @returns {(null|number[])} 4 number array or null - error
         */
		_elpusk.device.usb.hid.lpu237.prototype.get_version = function(){
            var version = null;

            do{
                if( !Array.isArray(this._version) ){
                    continue;
                }
                if( this._version.length !== 4 ){
                    continue;
                }

                version = this._version;
            }while(false);
            return version;
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_name
         * @returns {string} system name or null
         */
		_elpusk.device.usb.hid.lpu237.prototype.get_name = function(){
            var s_name = "";

            do{
                if( typeof this._s_name !== 'string' ){
                    continue;
                }
                if( this._s_name.length > _const_the_size_of_name ){
                    s_name = this._s_name.substring(0,_const_the_size_of_name);
                }
                else{
                    s_name = this._s_name;
                }
            }while(false);
            return s_name;
        }
        
        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_global_pre_postfix_send_condition
         * @returns {boolean} true - send prepostfix data when all track don't have error.
         * <br /> false - send prepostfix data when any track have none-error.
         */
		_elpusk.device.usb.hid.lpu237.prototype.get_global_pre_postfix_send_condition = function(){
            return this._b_global_pre_postfix_send_condition; 
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_device_is_mmd1000
         * @returns {boolean} true - used decoder is MMD1000.
         * <br /> false - used decoder is Magtek DeltaAsic
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_device_is_mmd1000 = function(){ 
            return this._b_device_is_mmd1000; 
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_manufacture
         * @returns {number} 0 - manufacture is elpusk.
         * <br /> 1 - manufacture is BTC.(not supported now. old device)
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_manufacture = function(){ 
            return this._n_manufacture; 
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_uid
         * @returns {(null|string)} hex string or null
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_uid = function(){ 
            var s_uid = null;

            do{
                if( typeof this._s_uid !== 'string' ){
                    continue;
                }
                if( this._s_uid.length > (_const_the_size_of_uid*2) ){
                    s_uid = this._s_uid.substring(0,_const_the_size_of_uid*2);
                }
                else{
                    s_uid = this._s_uid;
                }
            }while(false);
            return s_uid;
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_device_function
         * @returns {number} 0 - function is undefined.
         * <br /> 1 - support msr function.
         * <br /> 2 - support msr & i-button function.
         * <br /> 3 - support i-button function.
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_device_function = function(){ 
            return this._n_device_function; 
        }
        
        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_system_version
         * @returns {number[]} 4 number array.
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_system_version = function(){ 
            return  this._version; 
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_removed_key_map_table
         * @returns {boolean} true - saved only the selected language key map.
         * <br /> false - all language key map is saved.
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_removed_key_map_table = function(){ 
            return this._b_removed_key_map_table; 
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_hid_boot
         * @returns {boolean} true - hid bootloader is used.
         * <br /> false - MSD bootloader is used.
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_hid_boot = function(){ 
            return this._b_is_hid_boot; 
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_device_is_ibutton_only
         * @returns {boolean} true - this device supports only i-button reader.
         * <br /> false - this device is support i-button & msr reader or msr reader only.
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_device_is_ibutton_only = function(){ 
            return this._b_device_is_ibutton_only; 
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_device_is_standard
         * @returns {boolean} true - this device is D or E type HW.
         * <br /> false - this device is C or F type HW.
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_device_is_standard = function(){ 
            return this._b_device_is_standard; 
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_interface
         * @returns {number} return interface type.
         * <br /> 0 - system interface is USB keyboard.
         * <br /> 1 - system interface is USB MSR(generic HID interface).
		 * <br /> 10 - system interface is uart.
		 * <br /> 20 - system interface is PS2 stand along mode.
		 * <br /> 21 - system interface is bypass mode.
		 * <br /> 100 - system interface is determined by HW Dip switch
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_interface = function(){ 
            return this._n_interface; 
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_buzzer_frequency
         * @returns {number} return buzzer frequency
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_buzzer_frequency = function(){ 
            return this._dw_buzzer_frequency; 
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_boot_run_time
         * @returns {number} MSD boot loader runnung time( unit msec ).
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_boot_run_time = function(){ 
            return this._dw_boot_run_time; 
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_language
         * @returns {number} language index
         * <br /> 0 - US english
         * <br /> 1 - spanish 
         * <br /> 2 - danish
         * <br /> 3 - french
         * <br /> 4 - german
         * <br /> 5 - italian
         * <br /> 6 - norwegian
         * <br /> 7 - swedish
         * <br /> 8 - UK english
         * <br /> 9 - israel
         * <br /> 10 - turkey
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_language = function(){ 
            return this._n_language_index; 
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_enable_iso
         * @param {number} n_track msr track number 0~2
         * @returns {boolean} true - read a track.
         * <br /> false - not read.
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_enable_iso = function (n_track){ 
            var b_enable = false;
            do{
                if( typeof n_track !== 'number'){
                    continue;
                }
                if( !Array.isArray(this._b_enable_iso) ){
                    continue;
                }
                if(this._b_enable_iso.length !== _const_the_number_of_track ){
                    continue;
                }

                b_enable = this._b_enable_iso[n_track];
            }while(false);
            return b_enable;
		}

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_direction
         * @param {number} n_track msr track number 0~2
         * @returns {number} reading direction.
         * <br /> 0 - reading direction forward & backward.
         * <br /> 1 - reading direction forward.
         * <br /> 2 - reading direction backward.
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_direction = function(n_track){
            var n_dir = _type_direction.dir_bidectional;
            do{
                if( typeof n_track === 'undefined'  ){
                    if( !Array.isArray(this._n_direction)){
                        continue;
                    }
                    if( this._n_direction.length !== _const_the_number_of_track ){
                        continue;
                    }
                    n_dir = this._n_direction[0];
                    continue;
                }
                if( typeof n_track !== 'number'  ){
                    continue;
                }
                if( !Array.isArray(this._n_direction)){
                    continue;
                }
                if( this._n_direction.length !== _const_the_number_of_track ){
                    continue;
                }
                n_dir = this._n_direction[n_track];

            }while(false);

            return n_dir;
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_global_prefix
         * @returns {string} hex string or null
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_global_prefix = function(){
            return this._s_global_prefix; 
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_global_postfix
         * @returns {string} hex string or null
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_global_postfix = function(){ 
            return this._s_global_postfix; 
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_private_prefix
         * @param {number} n_track msr track number 0~2
         * @returns {string} hex string or null
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_private_prefix = function(n_track){
            var s_value = null;
            do{
                if( typeof n_track !== 'number'){
                    continue;
                }
                if( !Array.isArray(this._s_private_prefix)){
                    continue;
                }
                if( this._s_private_prefix.length !== _const_the_number_of_track ){
                    continue;
                }
                s_value = this._s_private_prefix[n_track];
            }while(false);
            return s_value; 
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_private_postfix
         * @param {number} n_track msr track number 0~2
         * @returns {string} hex string or null
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_private_postfix = function(n_track){ 
            var s_value = null;
            do{
                if( typeof n_track !== 'number'){
                    continue;
                }
                if( !Array.isArray(this._s_private_postfix)){
                    continue;
                }
                if( this._s_private_postfix.length !== _const_the_number_of_track ){
                    continue;
                }
                s_value = this._s_private_postfix[n_track];
            }while(false);
            return s_value; 
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_prefix_ibutton
         * @returns {string} hex string or null
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_prefix_ibutton = function(){ 
            return this._s_prefix_ibutton; 
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_postfix_ibutton
         * @returns {string} hex string or null
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_postfix_ibutton = function(){ 
            return this._s_postfix_ibutton; 
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_prefix_uart
         * @returns {string} hex string or null
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_prefix_uart = function(){ 
            return this._s_prefix_uart; 
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_postfix_uart
         * @returns {string} hex string or null
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_postfix_uart = function(){ 
            return this._s_postfix_uart; 
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_enable_f12_ibutton
         * @returns {boolean} true - the current i-button mode is F12 mode.
         * <br /> false - the current i-button mode isn't F12 mode.
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_enable_f12_ibutton = function(){ 
            if( this._n_ibutton_mode === _type_ibutton_mode.ibutton_f12){
                return true;
            }
            else{
                return false;
            }
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_enable_zeros_ibutton
         * @returns {boolean} true - the current i-button mode is zeros mode.
         * <br /> false - the current i-button mode isn't zeros mode.
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_enable_zeros_ibutton = function(){ 
            if( this._n_ibutton_mode === _type_ibutton_mode.ibutton_zeros){
                return true;
            }
            else{
                return false;
            }
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_enable_zeros_7times_ibutton
         * @returns {boolean} true - the current i-button mode is zeros7 mode.
         * <br /> false - the current i-button mode isn't zeros7 mode.
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_enable_zeros_7times_ibutton = function(){ 
            if( this._n_ibutton_mode === _type_ibutton_mode.ibutton_zeros7){
                return true;
            }
            else{
                return false;
            }
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_enable_addmit_code_stick_ibutton
         * @returns {boolean} true - the current i-button mode is ibutton_addmit mode.
         * <br /> false - the current i-button mode isn't ibutton_addmit mode.
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_enable_addmit_code_stick_ibutton = function(){ 
            if( this._n_ibutton_mode === _type_ibutton_mode.ibutton_addmit){
                return true;
            }
            else{
                return false;
            }
        }        

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_tx_transaction
         * @returns {number} request string
         * <br /> null none request string
         */
        _elpusk.device.usb.hid.lpu237.prototype.get_tx_transaction = function(){
            var s_request = null;

            do{
                if( this._dequeu_s_tx.length <= 0 ){
                    continue;
                }

                s_request = this._dequeu_s_tx.shift();
            }while(false);
            return s_request;
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.set_rx_transaction
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} true - rx is saved ok.
         * <br /> false - error.
         */
        _elpusk.device.usb.hid.lpu237.prototype.set_rx_transaction = function( s_response ){
            var b_result = false;

            do{
                if( typeof s_response !== 'string'){
                    continue;
                }
                if(s_response.length <= 0 ){
                    continue;
                }

                this._dequeu_s_rx.push(s_response);
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
         * @function elpusk.device.usb.hid.lpu237.get_current_request_type
         * @returns {number} greater then equal zero (_type_generated_tx_type.gt_xxx value).
         * <br /> error negative value.
         * @description get the current request type.
         * <br /> It will be used for debugging. before calling set_from_rx() method.
         */
        _elpusk.device.usb.hid.lpu237.prototype.get_current_request_type = function(){
            var n_result = -1;
            do{
                if( this._deque_generated_tx.length <= 0 ){
                    continue;
                }
                n_result = this._deque_generated_tx[0];
            }while(false);
            return n_result;
        }
        
        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_request_type_string_with_number
         * @param {number} n_type request type number (_type_generated_tx_type.gt_xxx value).
         * @returns {string} the description string of type number.
         * <br /> error return null.
         * @description get the request type description with it's number.
         */
        _elpusk.device.usb.hid.lpu237.prototype.get_request_type_string_with_number = function(n_type){
            var s_description = null;
            do{
                if( typeof n_type !== 'number'){
                    continue;
                }
                if( n_type < _type_generated_tx_type.gt_read_uid ){
                    continue;
                }
                if( n_type > _type_generated_tx_type.gt_set_addmit_code_stick_ibutton ){
                    continue;
                }
                //
                switch (n_type) {
                    case _type_generated_tx_type.gt_get_version:
                        s_description = "get version"; break;
                    case _type_generated_tx_type.gt_type_device:
                        s_description = "get device type"; break;
                    case _type_generated_tx_type.gt_type_ibutton:
                        s_description = "get i-button mode"; break;
                    case _type_generated_tx_type.gt_read_uid:
                        s_description = "get uid"; break;
                    case _type_generated_tx_type.gt_change_authkey:
                        s_description = "change authentication key"; break;
                    case _type_generated_tx_type.gt_change_status:
                        s_description = "change status"; break;
                    case _type_generated_tx_type.gt_change_sn:
                        s_description = "change serial number"; break;
                    case _type_generated_tx_type.gt_enter_config:
                        s_description = "enter configuration"; break;
                    case _type_generated_tx_type.gt_leave_config:
                        s_description = "leave configuration"; break;
                    case _type_generated_tx_type.gt_apply:
                        s_description = "apply"; break;
                    case _type_generated_tx_type.gt_goto_boot:
                        s_description = "goto boot"; break;
                    case _type_generated_tx_type.gt_enter_opos:
                        s_description = "enter OPOS"; break;
                    case _type_generated_tx_type.gt_leave_opos:
                        s_description = "leave OPOS"; break;
                    case _type_generated_tx_type.gt_support_mmd1000:
                        s_description = "support mmd1000"; break;
                    case _type_generated_tx_type.gt_get_name:
                        s_description = "get name"; break;
                    case _type_generated_tx_type.gt_get_global_prepostfix_send_condition:
                        s_description = "get global send condition"; break;
                    case _type_generated_tx_type.gt_get_interface:
                        s_description = "get interface"; break;
                    case _type_generated_tx_type.gt_get_language:
                        s_description = "get language"; break;
                    case _type_generated_tx_type.gt_get_buzzer_frequency:
                        s_description = "get buzzer frequency"; break;
                    case _type_generated_tx_type.gt_get_boot_run_time:
                        s_description = "get MSD boot run time"; break;
                    case _type_generated_tx_type.gt_get_enable_iso1:
                        s_description = "get enable iso1"; break;
                    case _type_generated_tx_type.gt_get_enable_iso2:
                        s_description = "get enable iso2"; break;
                    case _type_generated_tx_type.gt_get_enable_iso3:
                        s_description = "get enable iso3"; break;
                    case _type_generated_tx_type.gt_get_direction1:
                        s_description = "get iso1 direction"; break;
                    case _type_generated_tx_type.gt_get_direction2:
                        s_description = "get iso2 direction"; break;
                    case _type_generated_tx_type.gt_get_direction3:
                        s_description = "get iso3 direction"; break;
                    case _type_generated_tx_type.gt_get_global_prefix:
                        s_description = "get global prefix"; break;
                    case _type_generated_tx_type.gt_get_global_postfix:
                        s_description = "get global postfix"; break;
                    case _type_generated_tx_type.gt_get_private_prefix1:
                        s_description = "get private prefix1"; break;
                    case _type_generated_tx_type.gt_get_private_prefix2:
                        s_description = "get private prefix2"; break;
                    case _type_generated_tx_type.gt_get_private_prefix3:
                        s_description = "get private prefix3"; break;
                    case _type_generated_tx_type.gt_get_private_postfix1:
                        s_description = "get private posfix1"; break;
                    case _type_generated_tx_type.gt_get_private_postfix2:
                        s_description = "get private posfix2"; break;
                    case _type_generated_tx_type.gt_get_private_postfix3:
                        s_description = "get private posfix3"; break;
                    case _type_generated_tx_type.gt_get_prefix_ibutton:
                        s_description = "get i-button prefix"; break;
                    case _type_generated_tx_type.gt_get_postfix_ibutton:
                        s_description = "get i-button postfix"; break;
                    case _type_generated_tx_type.gt_get_prefix_uart:
                        s_description = "get uart prefix"; break;
                    case _type_generated_tx_type.gt_get_postfix_uart:
                        s_description = "get uart postfix"; break;
                    case _type_generated_tx_type.gt_get_f12_ibutton:
                        s_description = "get i-button F12 mode"; break;
                    case _type_generated_tx_type.gt_get_zeros_ibutton:
                        s_description = "get i-button Zeros mode"; break;
                    case _type_generated_tx_type.gt_get_zeros7_times_ibutton:
                        s_description = "get i-button Zeros7 mode"; break;
                    case _type_generated_tx_type.gt_get_addmit_code_stick_ibutton:
                        s_description = "get i-button Codestick mode"; break;

                    case _type_generated_tx_type.gt_set_global_prepostfix_send_condition:
                        s_description = "set global send condition"; break;
                    case _type_generated_tx_type.gt_set_interface:
                        s_description = "set interface"; break;
                    case _type_generated_tx_type.gt_set_language:
                        s_description = "set language"; break;
                    case _type_generated_tx_type.get_set_keymap:
                        s_description = "set keymap"; break;
                    case _type_generated_tx_type.gt_set_buzzer_frequency:
                        s_description = "set buzzer frequency"; break;
                    case _type_generated_tx_type.gt_set_enable_iso1:
                        s_description = "set enable iso1"; break;
                    case _type_generated_tx_type.gt_set_enable_iso2:
                        s_description = "set enable iso2"; break;
                    case _type_generated_tx_type.gt_set_enable_iso3:
                        s_description = "set enable iso3"; break;
                    case _type_generated_tx_type.gt_set_direction1:
                        s_description = "set iso1 direction"; break;
                    case _type_generated_tx_type.gt_set_direction2:
                        s_description = "set iso2 direction"; break;
                    case _type_generated_tx_type.gt_set_direction3:
                        s_description = "set iso3 direction"; break;
                    case _type_generated_tx_type.gt_set_global_prefix:
                        s_description = "set global prefix"; break;
                    case _type_generated_tx_type.gt_set_global_postfix:
                        s_description = "set global postfix"; break;
                    case _type_generated_tx_type.gt_set_private_prefix1:
                        s_description = "set private prefix1"; break;
                    case _type_generated_tx_type.gt_set_private_prefix2:
                        s_description = "set private prefix2"; break;
                    case _type_generated_tx_type.gt_set_private_prefix3:
                        s_description = "set private prefix3"; break;
                    case _type_generated_tx_type.gt_set_private_postfix1:
                        s_description = "set private postfix1"; break;
                    case _type_generated_tx_type.gt_set_private_postfix2:
                        s_description = "set private postfix2"; break;
                    case _type_generated_tx_type.gt_set_private_postfix3:
                        s_description = "set private postfix3"; break;
                    case _type_generated_tx_type.gt_set_prefix_ibutton:
                        s_description = "set i-button prefix"; break;
                    case _type_generated_tx_type.gt_set_postfix_ibutton:
                        s_description = "set i-button postfix"; break;
                    case _type_generated_tx_type.gt_set_prefix_uart:
                        s_description = "set uart prefix"; break;
                    case _type_generated_tx_type.gt_set_postfix_uart:
                        s_description = "set uart postfix"; break;
                    case _type_generated_tx_type.gt_set_f12_ibutton:
                        s_description = "set i-button F12 mode"; break;
                    case _type_generated_tx_type.gt_set_zeros_ibutton:
                        s_description = "set i-button Zeros mode"; break;
                    case _type_generated_tx_type.gt_set_zeros7_times_ibutton:
                        s_description = "set i-button Zeros7 mode"; break;
                    case _type_generated_tx_type.gt_set_addmit_code_stick_ibutton:
                        s_description = "set i-button Codestick mode"; break;
                    default:
                        continue;
                }//end switch
            }while(false);
            return s_description;
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.clear_transaction
         * @description clear transaction buffer( clear all tx , rx data and generated requests )
         */
		_elpusk.device.usb.hid.lpu237.prototype.clear_transaction = function()
		{
            this._deque_generated_tx.length = 0;
            this._dequeu_s_rx.length = 0;
            this._dequeu_s_tx.length = 0;
		}

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.generate_get_system_information
         * @return {number} the number of generated requests.
         * <br /> 0 - error
        */
        _elpusk.device.usb.hid.lpu237.prototype.generate_get_system_information = function(){
            var b_result = false;

			do {
                if( !_generate_enter_config_mode(this._dequeu_s_tx) ){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_enter_config );

                if( !_generate_get_version(this._dequeu_s_tx) ){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_get_version );
                
                if( !_generate_get_device_type(this._dequeu_s_tx) ){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_type_device );

                if( !_generate_leave_config_mode(this._dequeu_s_tx) ){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_leave_config );
                
				b_result = true;
            } while (false);
            
            if( !b_result ){
                this._dequeu_s_tx.length = 0;
                this._deque_generated_tx.length = 0;
            }

            return this._deque_generated_tx.length;
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.generate_get_parameters
         * @return {number} the number of generated requests.
         * <br /> 0 - error
        */
       _elpusk.device.usb.hid.lpu237.prototype.generate_get_parameters = function(){
            var b_result = false;

            do {
                if( !_generate_enter_config_mode(this._dequeu_s_tx) ){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_enter_config );


                //this._version, 
                //_b_device_is_standard and _b_device_is_ibutton_only settting by get_system_info.
				if (this._b_device_is_standard) {
                    if( _first_version_greater_then_second_version( this._version,[3,6,0,4]) ){
                        //i-button support from greater then v3.6.0.4
                        if( !_generate_get_device_ibutton_type(this._dequeu_s_tx) ){continue;}
                        this._deque_generated_tx.push( _type_generated_tx_type.gt_type_ibutton );
					}
				}

				if( _first_version_greater_then_second_version( this._version,[3,6,0,4]) ){
                    //i-button support from greater then v3.6.0.4
                    if( !_generate_get_uid(this._dequeu_s_tx) ){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_read_uid );
				}


                if( !_generate_get_name(this._dequeu_s_tx) ){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_get_name );

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
                for( var i = 0; i<_const_the_number_of_track; i++){
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
                for( var i = 0; i<_const_the_number_of_track; i++){
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

            return this._deque_generated_tx.length;
        }        

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.generate_set_parameters
         * @return {number} the number of generated requests.
         * <br /> 0 - error
        */
        _elpusk.device.usb.hid.lpu237.prototype.generate_set_parameters = function(){
            var b_result = false;

            do{
                if(!_generate_enter_config_mode(this._dequeu_s_tx) ){ continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_enter_config );

                //
                if( _first_version_greater_then_second_version(this._version,[3,0,0,0])){

                    // . set iButton Pretag
                    if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_Prefix_iButton ) >= 0 ){
                        if (!_generate_set_ibutton_prefix(this._dequeu_s_tx,this._s_prefix_ibutton )){continue;}
                        this._deque_generated_tx.push( _type_generated_tx_type.gt_set_prefix_ibutton );
                    }

                    // . set iButton Posttag
                    if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_Postfix_iButton ) >= 0 ){
                        if (!_generate_set_ibutton_postfix(this._dequeu_s_tx,this._s_postfix_ibutton )){continue;}
                        this._deque_generated_tx.push( _type_generated_tx_type.gt_set_postfix_ibutton );
                    }

                    // . set Uart Pretag
                    if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_Prefix_Uart ) >= 0 ){
                        if (!_generate_set_uart_prefix(this._dequeu_s_tx,this._s_prefix_uart )){continue;}
                        this._deque_generated_tx.push( _type_generated_tx_type.gt_set_prefix_uart );
                    }

                    // . set Uart Posttag
                    if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_Postfix_Uart ) >= 0 ){
                        if (!_generate_set_uart_postfix(this._dequeu_s_tx,this._s_postfix_uart )){continue;}
                        this._deque_generated_tx.push( _type_generated_tx_type.gt_set_postfix_uart );
                    }

                    do {//ibutton setting
                        if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_EnableF12iButton ) >= 0 ){
                            if (!_generate_set_f12_ibutton(this._dequeu_s_tx,_elpusk.device.usb.hid.lpu237.get_enable_f12_ibutton() )){continue;}
                            this._deque_generated_tx.push( _type_generated_tx_type.gt_set_f12_ibutton );
                        }

                        if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_EnableZerosiButton ) >= 0 ){
                            if (!_generate_set_zeros_ibutton(this._dequeu_s_tx,_elpusk.device.usb.hid.lpu237.prototype.get_enable_zeros_ibutton() )){continue;}
                            this._deque_generated_tx.push( _type_generated_tx_type.gt_set_zeros_ibutton );
                        }

                        if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_EnableZeros7TimesiButton ) >= 0 ){
                            if (!_generate_set_zeros_7times_ibutton(this._dequeu_s_tx,_elpusk.device.usb.hid.lpu237.prototype.get_enable_zeros_7times_ibutton() )){continue;}
                            this._deque_generated_tx.push( _type_generated_tx_type.gt_set_zeros7_times_ibutton );
                        }

                        if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_EnableAddmitCodeStickiButton ) >= 0 ){
                            if (!_generate_set_addmit_code_stick(this._dequeu_s_tx,_elpusk.device.usb.hid.lpu237.prototype.get_enable_addmit_code_stick_ibutton() )){continue;}
                            this._deque_generated_tx.push( _type_generated_tx_type.gt_set_addmit_code_stick_ibutton );
                        }
                    } while (false);
                }
                //. set globalPrePostfixSendCondition
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_GlobalPrePostfixSendCondition ) >= 0 ){
                    if (!_generate_set_global_pre_postfix_send_condition(this._dequeu_s_tx,this._b_global_pre_postfix_send_condition)){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_global_prepostfix_send_condition );
                }

                // . set interface
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_Interface ) >= 0 ){
                    if (!_generate_set_interface(this._dequeu_s_tx,this._n_interface )){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_interface );
                }

                // . set language
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_Language ) >= 0 ){
                    if (!_generate_set_language(this._dequeu_s_tx,this._n_language_index)){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_language );

                    //set key map
                    if( this._b_removed_key_map_table ){
                        if( !_generate_set_key_map(this._deque_generated_tx,this._n_language_index)){continue;}
                        this._deque_generated_tx.push( _type_generated_tx_type.get_set_keymap );
                    }
                    
                }

                // . set buzzer
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_BuzzerFrequency ) >= 0 ){
                    if(!_generate_set_buzzer_frequency(this._dequeu_s_tx,this._dw_buzzer_frequency)){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_buzzer_frequency );
                }

                // .enable 1
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_EnableISO1 ) >= 0 ){
                    if (!_generate_set_enable_track(this._dequeu_s_tx,_type_msr_track_Numer.iso1_track,this._b_enable_iso[_type_msr_track_Numer.iso1_track])){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_enable_iso1 );
                }
                    
                // .enable 2
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_EnableISO2 ) >= 0 ){
                    if (!_generate_set_enable_track(this._dequeu_s_tx,_type_msr_track_Numer.iso2_track,this._b_enable_iso[_type_msr_track_Numer.iso2_track])){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_enable_iso2 );
                }

                // .enable 3
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_EnableISO3 ) >= 0 ){
                    if (!_generate_set_enable_track(this._dequeu_s_tx,_type_msr_track_Numer.iso3_track,this._b_enable_iso[_type_msr_track_Numer.iso3_track])){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_enable_iso3 );
                }

                // direction 1
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_Direction1 ) >= 0 ){
                    if (!_generate_set_direction(this._dequeu_s_tx,_type_msr_track_Numer.iso1_track,this._n_direction[_type_msr_track_Numer.iso1_track])){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_direction1 );
                }
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_Direction2 ) >= 0 ){
                    if (!_generate_set_direction(this._dequeu_s_tx,_type_msr_track_Numer.iso2_track,this._n_direction[_type_msr_track_Numer.iso2_track])){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_direction2 );
                }
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_Direction3 ) >= 0 ){
                    if (!_generate_set_direction(this._dequeu_s_tx,_type_msr_track_Numer.iso3_track,this._n_direction[_type_msr_track_Numer.iso3_track])){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_direction3 );
                }


                // . global prefix.............................................
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_GlobalPrefix ) >= 0 ){
                    if (!_generate_set_global_prefix(this._dequeu_s_tx,this._s_global_prefix )){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_global_prefix );
                }

                // . global postfix
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_GlobalPostfix ) >= 0 ){
                    if (!_generate_set_global_postfix(this._dequeu_s_tx,this._s_global_postfix )){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_global_postfix );
                }

                // . private prefix 1
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_PrivatePrefix1 ) >= 0 ){
                    if (!_generate_set_private_prefix(this._dequeu_s_tx,_type_msr_track_Numer.iso1_track,this._s_private_prefix[_type_msr_track_Numer.iso1_track] )){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_private_prefix1 );
                }

                // . private postfix 1
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_PrivatePostfix1 ) >= 0 ){
                    if (!_generate_set_private_postfix(this._dequeu_s_tx,_type_msr_track_Numer.iso1_track,this._s_private_postfix[_type_msr_track_Numer.iso1_track] )){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_private_postfix1 );
                }

                // . private prefix 2
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_PrivatePrefix2 ) >= 0 ){
                    if (!_generate_set_private_prefix(this._dequeu_s_tx,_type_msr_track_Numer.iso2_track,this._s_private_prefix[_type_msr_track_Numer.iso2_track] )){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_private_prefix2 );
                }
                
                // . private postfix 2
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_PrivatePostfix2 ) >= 0 ){
                    if (!_generate_set_private_postfix(this._dequeu_s_tx,_type_msr_track_Numer.iso2_track,this._s_private_postfix[_type_msr_track_Numer.iso2_track])){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_private_postfix2 );
                }

                // . private prefix 3
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_PrivatePrefix3 ) >= 0 ){
                    if (!_generate_set_private_prefix(this._dequeu_s_tx,_type_msr_track_Numer.iso3_track,this._s_private_prefix[_type_msr_track_Numer.iso3_track])){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_private_prefix3 );
                }
                // . private postfix 3
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_PrivatePostfix3 ) >= 0 ){
                    if (!_generate_set_private_postfix(this._dequeu_s_tx,_type_msr_track_Numer.iso3_track,this._s_private_postfix[_type_msr_track_Numer.iso3_track])){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_private_postfix3 );
                }

                //
                if (!_generate_apply_config_mode(this._dequeu_s_tx)){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_apply );

                if (!_generate_leave_config_mode(this._dequeu_s_tx)){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_leave_config );
                //
                b_result = true;
                elpusk.util.clear_set(this._set_change_parameter);
            }while (false);

            if( !b_result ){
                this._dequeu_s_tx.length = 0;
                this._deque_generated_tx.length = 0;
            }

            return this._deque_generated_tx.length;;           
       }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.set_from_rx
         * @return {boolean} processing result
         * @description analysis and save from response.
        */
        _elpusk.device.usb.hid.lpu237.prototype.set_from_rx = function(){
            var b_result = false;
            do {
                if (this._deque_generated_tx.length <= 0){
                    continue;
                }
                if( this._dequeu_s_rx.length <= 0 ){
                    continue;
                }
                var s_response = this._dequeu_s_rx.shift();

                var b_value = null;
                var s_value = null;
                var n_value = 0;
                var version = [];
                var n_generated_tx = this._deque_generated_tx.shift();

                switch (n_generated_tx) {
                case _type_generated_tx_type.gt_get_version:
                    version = _get_version_from_response(s_response);
                    if( version === null ){
                        break;
                    }
                    if( _first_version_greater_then_second_version(version,[1,1,0,0])){
                        if( _first_version_greater_then_second_version(version,[2,2,0,0])){
                            this._b_is_hid_boot = true;
                            if( _first_version_greater_then_second_version(version,[3,3,0,2])){
                                // From FW version 3.4.0.1, Keymapping table was removed from firmware.
                                // therefor less then equal version 3.3.0.2, Don't call SetKeyMapToDevice() method of CMsrDevice class. 
                                this._b_removed_key_map_table = true;
                            }
                        }
                    }
                    else{
                        break;
                    }
                    //
                    this._version = version;
                    b_result = true;
                    break;
                case _type_generated_tx_type.gt_type_device:
                    this._b_device_is_standard = _get_type_from_response(s_response);
                    if(!this._b_device_is_standard){
                        this._n_device_function = _type_function.fun_msr;//compact model
                    }
                    else{
                        this._n_device_function = _type_function.fun_msr_ibutton;//standard model
                    }
                    b_result = true;
                    break;
                case _type_generated_tx_type.gt_type_ibutton:
                    this._b_device_is_ibutton_only = _get_ibutton_type_from_response(s_response);
                    if(this._b_device_is_ibutton_only){
                        this._n_device_function = _type_function.fun_ibutton;//ibutton only model
                    }
                    b_result = true;
                    break;
                case _type_generated_tx_type.gt_read_uid:
                    s_value = _get_uid_from_response(s_response);
                    if( s_value !== null ){
                        this._s_uid = s_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_change_authkey:
                case _type_generated_tx_type.gt_change_status:
                case _type_generated_tx_type.gt_change_sn:
                case _type_generated_tx_type.gt_enter_config:
                case _type_generated_tx_type.gt_leave_config:
                case _type_generated_tx_type.gt_apply:
                case _type_generated_tx_type.gt_goto_boot:
                case _type_generated_tx_type.gt_enter_opos:
                case _type_generated_tx_type.gt_leave_opos:
                    b_result = _is_success_response(s_response);
                    break;
                case _type_generated_tx_type.gt_support_mmd1000:
                    this._b_device_is_mmd1000 = _get_support_mmd1000_from_response(s_response);
                    b_result = true;
                    break;
                case _type_generated_tx_type.gt_get_name:
                    this._s_name = _get_name_from_response(s_response);
                    if( this._s_name !== null ){
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_global_prepostfix_send_condition:
                    b_value = _get_global_pre_postfix_send_condition_from_response(s_response);
                    if( b_value !== null ){                    
                        this._b_global_pre_postfix_send_condition = b_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_interface:
                    n_value = _get_interface_from_response(s_response);
                    if( n_value >= 0 ){
                        this._n_interface = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_language:
                    n_value  = _get_language_from_response(s_response);
                    if( n_value >= 0 ){
                        this._n_language_index = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_buzzer_frequency:
                    n_value = _get_buzzer_frequency_from_response(s_response);
                    if( n_value >= 0 ){
                        this._dw_buzzer_frequency = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_boot_run_time:
                    n_value = _get_boot_run_time_from_response(s_response);
                    if( n_value >= 0 ){
                        this._dw_boot_run_time = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_enable_iso1:
                    b_value = _get_enable_track_from_response(s_response,_type_msr_track_Numer.iso1_track);
                    if( b_value !== null ){
                        this._b_enable_iso[_type_msr_track_Numer.iso1_track] = b_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_enable_iso2:
                    b_value = _get_enable_track_from_response(s_response,_type_msr_track_Numer.iso2_track);
                    if( b_value !== null ){
                        this._b_enable_iso[_type_msr_track_Numer.iso2_track] = b_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_enable_iso3:
                    b_value = _get_enable_track_from_response(s_response,_type_msr_track_Numer.iso3_track);
                    if( b_value !== null ){
                        this._b_enable_iso[_type_msr_track_Numer.iso3_track] = b_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_direction1:
                    n_value = _get_direction_from_response(s_response,_type_msr_track_Numer.iso1_track);
                    if( n_value >= 0 ){
                        this._n_direction[_type_msr_track_Numer.iso1_track] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_direction2:
                    n_value = _get_direction_from_response(s_response,_type_msr_track_Numer.iso2_track);
                    if( n_value >= 0 ){
                        this._n_direction[_type_msr_track_Numer.iso2_track] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_direction3:
                    n_value = _get_direction_from_response(s_response,_type_msr_track_Numer.iso3_track);
                    if( n_value >= 0 ){
                        this._n_direction[_type_msr_track_Numer.iso3_track] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_global_prefix:
                    s_value = _get_global_prefix_from_response(s_response);
                    if( s_value !== null ){
                        this._s_global_prefix = s_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_global_postfix:
                    s_value = _get_global_postfix_from_response(s_response);
                    if( s_value !== null ){
                        this._s_global_postfix = s_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_private_prefix1:
                    s_value = _get_private_prefix_from_response(s_response,_type_msr_track_Numer.iso1_track);
                    if( s_value !== null ){
                        this._s_private_prefix[_type_msr_track_Numer.iso1_track] = s_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_private_prefix2:
                    s_value = _get_private_prefix_from_response(s_response,_type_msr_track_Numer.iso2_track);
                    if( s_value !== null ){
                        this._s_private_prefix[_type_msr_track_Numer.iso2_track] = s_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_private_prefix3:
                    s_value = _get_private_prefix_from_response(s_response,_type_msr_track_Numer.iso3_track);
                    if( s_value !== null ){
                        this._s_private_prefix[_type_msr_track_Numer.iso3_track] = s_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_private_postfix1:
                    s_value = _get_private_postfix_from_response(s_response,_type_msr_track_Numer.iso1_track);
                    if( s_value !== null ){
                        this._s_private_postfix[_type_msr_track_Numer.iso1_track] = s_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_private_postfix2:
                    s_value = _get_private_postfix_from_response(s_response,_type_msr_track_Numer.iso2_track);
                    if( s_value !== null ){
                        this._s_private_postfix[_type_msr_track_Numer.iso2_track] = s_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_private_postfix3:
                    s_value = _get_private_postfix_from_response(s_response,_type_msr_track_Numer.iso3_track);
                    if( s_value !== null ){
                        this._s_private_postfix[_type_msr_track_Numer.iso3_track] = s_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_prefix_ibutton:
                    s_value = _get_ibutton_prefix_from_response(s_response);
                    if( s_value !== null ){
                        this._s_prefix_ibutton = s_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_postfix_ibutton:
                    s_value = _get_ibutton_postfix_from_response(s_response);
                    if( s_value !== null ){
                        this._s_postfix_ibutton = s_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_prefix_uart:
                    s_value = _get_uart_prefix_from_response(s_response);
                    if( s_value !== null ){
                        this._s_prefix_uart = s_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_postfix_uart:
                    s_value = _get_uart_postfix_from_response(s_response);
                    if( s_value !== null ){
                        this._s_postfix_uart = s_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_f12_ibutton:
                    if( _get_f12_ibutton_from_response(s_response) ){
                        this._n_ibutton_mode = _type_ibutton_mode.ibutton_f12;
                    }
                    b_result = true;
                    break;
                case _type_generated_tx_type.gt_get_zeros_ibutton:
                    if( _get_zeros_ibutton_from_response(s_response) ){
                        this._n_ibutton_mode = _type_ibutton_mode.ibutton_zeros;
                    }
                    b_result = true;
                    break;
                case _type_generated_tx_type.gt_get_zeros7_times_ibutton:
                    if( _get_zeros_7times_ibutton_from_response(s_response) ){
                        this._n_ibutton_mode = _type_ibutton_mode.ibutton_zeros7;
                    }
                    b_result = true;
                    break;
                case _type_generated_tx_type.gt_get_addmit_code_stick_ibutton:
                    if( _get_addmit_code_stick_ibutton_from_response(s_response) ){
                        this._n_ibutton_mode = _type_ibutton_mode.ibutton_addmit;
                    }
                    b_result = true;
                    break;
                case _type_generated_tx_type.gt_set_global_prepostfix_send_condition:
                case _type_generated_tx_type.gt_set_interface:
                case _type_generated_tx_type.gt_set_language:
                case _type_generated_tx_type.get_set_keymap:
                case _type_generated_tx_type.gt_set_buzzer_frequency:
                case _type_generated_tx_type.gt_set_enable_iso1:
                case _type_generated_tx_type.gt_set_enable_iso2:
                case _type_generated_tx_type.gt_set_enable_iso3:
                case _type_generated_tx_type.gt_set_direction1:
                case _type_generated_tx_type.gt_set_direction2:
                case _type_generated_tx_type.gt_set_direction3:
                case _type_generated_tx_type.gt_set_global_prefix:
                case _type_generated_tx_type.gt_set_global_postfix:
                case _type_generated_tx_type.gt_set_private_prefix1:
                case _type_generated_tx_type.gt_set_private_prefix2:
                case _type_generated_tx_type.gt_set_private_prefix3:
                case _type_generated_tx_type.gt_set_private_postfix1:
                case _type_generated_tx_type.gt_set_private_postfix2:
                case _type_generated_tx_type.gt_set_private_postfix3:
                case _type_generated_tx_type.gt_set_prefix_ibutton:
                case _type_generated_tx_type.gt_set_postfix_ibutton:
                case _type_generated_tx_type.gt_set_prefix_uart:
                case _type_generated_tx_type.gt_set_postfix_uart:
                case _type_generated_tx_type.gt_set_f12_ibutton:
                case _type_generated_tx_type.gt_set_zeros_ibutton:
                case _type_generated_tx_type.gt_set_zeros7_times_ibutton:
                case _type_generated_tx_type.gt_set_addmit_code_stick_ibutton:
                    b_result = _is_success_response(s_response);
                    break;
                default:
                    continue;
                }
            } while (false);
            return b_result;
        }   
        
        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.set_from_file
         * @param {File} file_xml xml file format setting file.
         * @return {Promise} processing result.
         * @description load from xml setting file. and set parameter with this setting.
         */
        _elpusk.device.usb.hid.lpu237.prototype.set_from_file = function(file_xml){

            var this_device = this;

            return new Promise(function (resolve, reject) {

                do{
                    if( typeof file_xml !== 'object'){
                        reject(_get_error_object('en_e_parameter'));
                        continue;
                    }
                    //
                    var reader = new FileReader();

                    reader._device = this_device;
                    
                    reader.onload = function(evt) {
                        var s_data = evt.target.result;
                        //
                        var parser = new DOMParser();
                        var xml_doc = parser.parseFromString(s_data,"text/xml");
                        
                        var s_attr_name = "";
                        var s_attr = "";
                        var ele = null;
                        //common element
                        var array_ele = [];

                        var n_interface = null;
                        var b_buzzer = null;
                        var n_language = null;
                        var array_b_enable_track = [null,null,null];
                        var b_condition = null;
                        var n_ibutton = null;
                        var n_direction = null;
                        var s_gpre = null;
                        var s_gpost = null;
                        var s_ppretag = [null,null,null];
                        var s_pposttag = [null,null,null];
                        var s_ipre = null;
                        var s_ipost = null;
                        var s_upre = null;
                        var s_upost = null;

                        var b_result = false;

                        do{
                            array_ele = xml_doc.getElementsByTagName("common");
                            if(array_ele.length>0 ){
                                ele =  array_ele[0];
                                // interface attribute
                                s_attr_name = "interface";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    n_interface = _get_interface_from_string(s_attr);
                                    if( n_interface < 0 ){
                                        continue;//error
                                    }
                                }
                                // buzzer attribute
                                s_attr_name = "buzzer";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    b_buzzer = _get_buzzer_frequency_from_string(s_attr);
                                    if( b_buzzer === null ){
                                        continue;
                                    }
                                }
                                // language attribute
                                s_attr_name = "language";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    n_language = _get_language_from_string(s_attr);
                                    if( n_language < 0 ){
                                        continue;
                                    }
                                }
                                // iso1 attribute
                                s_attr_name = "iso1";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    array_b_enable_track[0] = _get_enable_track_from_string(s_attr);
                                    if( array_b_enable_track[0] === null ){
                                        continue;
                                    }
                                }
                                // iso2 attribute
                                s_attr_name = "iso2";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    array_b_enable_track[1] = _get_enable_track_from_string(s_attr);
                                    if( array_b_enable_track[1] === null ){
                                        continue;
                                    }
                                }
                                // iso3 attribute
                                s_attr_name = "iso3";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    array_b_enable_track[2] = _get_enable_track_from_string(s_attr);
                                    if( array_b_enable_track[2] === null ){
                                        continue;
                                    }
                                }
                                // condition attribute
                                s_attr_name = "condition";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    b_condition = _get_global_pre_postfix_send_condition_from_string(s_attr);
                                    if( b_condition === null ){
                                        continue;
                                    }
                                }
                                // ibutton attribute
                                s_attr_name = "ibutton";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    n_ibutton = _get_ibutton_mode_from_string(s_attr);
                                    if( n_ibutton < 0 ){
                                        continue;
                                    }
                                }
                                // direction attribute
                                s_attr_name = "direction";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    n_direction = _get_direction_from_string(s_attr);
                                    if( n_direction < 0 ){
                                        continue;
                                    }
                                }
                            }//the end of common element.

                            //global element
                            array_ele = xml_doc.getElementsByTagName("global");
                            if(array_ele.length>0 ){
                                ele =  array_ele[0];

                                // prefix attribute
                                s_attr_name = "prefix";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    s_gpre = _get_tag_from_string(s_attr);
                                    if( s_gpre === null ){
                                        continue;
                                    }
                                }
                                // postfix attribute
                                s_attr_name = "postfix";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    s_gpost = _get_tag_from_string(s_attr);
                                    if( s_gpost === null ){
                                        continue;
                                    }
                                }
                            }//the end of global element.

                            //iso1 element
                            array_ele = xml_doc.getElementsByTagName("iso1");
                            if(array_ele.length>0 ){
                                ele =  array_ele[0];

                                // prefix attribute
                                s_attr_name = "prefix";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    s_ppretag[0] = _get_tag_from_string(s_attr);
                                    if( s_ppretag[0] === null ){
                                        continue;
                                    }
                                }
                                // postfix attribute
                                s_attr_name = "postfix";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    s_pposttag[0] = _get_tag_from_string(s_attr);
                                    if( s_pposttag[0] === null ){
                                        continue;
                                    }
                                }
                            }//the end of iso1 element.

                            //iso2 element
                            array_ele = xml_doc.getElementsByTagName("iso2");
                            if(array_ele.length>0 ){
                                ele =  array_ele[0];
                                
                                // prefix attribute
                                s_attr_name = "prefix";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    s_ppretag[1] = _get_tag_from_string(s_attr);
                                    if( s_ppretag[1] === null ){
                                        continue;
                                    }
                                }
                                // postfix attribute
                                s_attr_name = "postfix";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    s_pposttag[1] = _get_tag_from_string(s_attr);
                                    if( s_pposttag[1] === null ){
                                        continue;
                                    }
                                }
                            }//the end of iso2 element.

                            //iso3 element
                            array_ele = xml_doc.getElementsByTagName("iso3");
                            if(array_ele.length>0 ){
                                ele =  array_ele[0];
                                
                                // prefix attribute
                                s_attr_name = "prefix";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    s_ppretag[2] = _get_tag_from_string(s_attr);
                                    if( s_ppretag[2] === null ){
                                        continue;
                                    }
                                }
                                // postfix attribute
                                s_attr_name = "postfix";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    s_pposttag[2] = _get_tag_from_string(s_attr);
                                    if( s_pposttag[2] === null ){
                                        continue;
                                    }
                                }
                            }//the end of iso3 element.

                            //ibutton element
                            array_ele = xml_doc.getElementsByTagName("ibutton");
                            if(array_ele.length>0 ){
                                ele =  array_ele[0];
                                
                                // prefix attribute
                                s_attr_name = "prefix";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    s_ipre = _get_tag_from_string(s_attr);
                                    if( s_ipre === null ){
                                        continue;
                                    }
                                }
                                // postfix attribute
                                s_attr_name = "postfix";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    s_ipost = _get_tag_from_string(s_attr);
                                    if( s_ipost === null ){
                                        continue;
                                    }
                                }
                            }//the end of ibutton element.

                            //uart element or rs232
                            array_ele = xml_doc.getElementsByTagName("uart");
                            if(array_ele.length>0 ){
                                ele =  array_ele[0];
                                
                                // prefix attribute
                                s_attr_name = "prefix";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    s_upre = _get_tag_from_string(s_attr);
                                    if( s_upre === null ){
                                        continue;
                                    }
                                }
                                // postfix attribute
                                s_attr_name = "postfix";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    s_upost = _get_tag_from_string(s_attr);
                                    if( s_upost === null ){
                                        continue;
                                    }
                                }
                            }//the end of ibutton element.

                            array_ele = xml_doc.getElementsByTagName("rs232");
                            if(array_ele.length>0 ){
                                ele =  array_ele[0];
                                
                                // prefix attribute
                                s_attr_name = "prefix";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    s_upre = _get_tag_from_string(s_attr);
                                    if( s_upre === null ){
                                        continue;
                                    }
                                }
                                // postfix attribute
                                s_attr_name = "postfix";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    s_upost = _get_tag_from_string(s_attr);
                                    if( s_upost === null ){
                                        continue;
                                    }
                                }
                            }//the end of ibutton element.

                            b_result = true;
                        }while(false);

                        if( b_result ){
                            if( n_interface !== null ){
                                if( this._device._n_interface !== n_interface){
                                    elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_Interface );
                                    this._device._n_interface = n_interface;
                                }
                            }
                            if( b_buzzer !== null ){
                                if( b_buzzer ){
                                    if( this._device._dw_buzzer_frequency !== _const_the_frequency_of_on_buzzer){
                                        elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_BuzzerFrequency )
                                        this._device._dw_buzzer_frequency = _const_the_frequency_of_on_buzzer;
                                    }
                                }
                                else{
                                    if( this._device._dw_buzzer_frequency === _const_the_frequency_of_on_buzzer){
                                        elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_BuzzerFrequency )
                                        this._device._dw_buzzer_frequency = _const_the_frequency_of_off_buzzer;
                                    }
                                }
                            }
                            if( n_language !== null ){
                                if( this._device._n_language_index !== n_language){
                                    elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_Language );
                                    this._device._n_language_index = n_language;
                                }
                            }
                            if( b_condition !== null ){
                                if( this._device._b_global_pre_postfix_send_condition !== b_condition ){
                                    elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_GlobalPrePostfixSendCondition );
                                    this._device._b_global_pre_postfix_send_condition = b_condition;
                                }
                            }
                            if( n_ibutton !== null ){
                                if(this._device._n_ibutton_mode !== n_ibutton){
                                    elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_EnableF12iButton );
                                    this._device._n_ibutton_mode = n_ibutton;
                                }
                            }
                            if( n_direction !== null ){
                                if(this._device._n_direction[_type_msr_track_Numer.iso1_track] !== n_direction){
                                    elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_Direction1 );
                                    elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_Direction2 );
                                    elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_Direction3 );
                                    this._device._n_direction[_type_msr_track_Numer.iso1_track] = n_direction;
                                    this._device._n_direction[_type_msr_track_Numer.iso2_track] = n_direction;
                                    this._device._n_direction[_type_msr_track_Numer.iso3_track] = n_direction;
                                }
                            }

                            if( s_gpre !== null ){
                                if( !_is_equal_tag( this._device._s_global_prefix,s_gpre) ){
                                    elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_GlobalPrefix );
                                    this._device._s_global_prefix = s_gpre;
                                }
                            }
                            if( s_gpost !== null ){
                                if( !_is_equal_tag(this._device._s_global_postfix,s_gpost) ){
                                    elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_GlobalPostfix );
                                    this._device._s_global_postfix = s_gpost;
                                }
                            }
                            if( s_ipre !== null ){
                                if( !_is_equal_tag( this._device._s_prefix_ibutton,s_ipre) ){
                                    elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_Prefix_iButton );
                                    this._device._s_prefix_ibutton = s_ipre;
                                }
                            }
                            if( s_ipost !== null ){
                                if( !_is_equal_tag(this._device._s_postfix_ibutton,s_ipost) ){
                                    elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_Postfix_iButton );
                                    this._device._s_postfix_ibutton = s_ipost; 
                                }
                            }
                            if( s_upre !== null ){
                                if( !_is_equal_tag(this._device._s_prefix_uart,s_upre) ){
                                    elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_Prefix_Uart );
                                    this._device._s_prefix_uart = s_upre;
                                }
                            }
                            if( s_upost !== null ){
                                if( !_is_equal_tag(this._device._s_prefix_uart,s_upost) ){
                                    elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_Postfix_Uart );
                                    this._device._s_prefix_uart = s_upost; 
                                }
                            }

                            var cp_enable = [_type_change_parameter.cp_EnableISO1 ,_type_change_parameter.cp_EnableISO2 ,_type_change_parameter.cp_EnableISO3  ];
                            var cp_pre = [_type_change_parameter.cp_PrivatePrefix1,_type_change_parameter.cp_PrivatePrefix2,_type_change_parameter.cp_PrivatePrefix3 ];
                            var cp_post = [_type_change_parameter.cp_PrivatePostfix1 ,_type_change_parameter.cp_PrivatePostfix2 ,_type_change_parameter.cp_PrivatePostfix3  ];
                            for( var i = 0; i<_const_the_number_of_track; i++ ){
                                if( array_b_enable_track[i] !== null ){
                                    if( this._device._b_enable_iso[i]  !== array_b_enable_track[i] ){
                                        elpusk.util.insert_to_set ( this._device._set_change_parameter, cp_enable[i] );
                                        this._device._b_enable_iso[i]  = array_b_enable_track[i];
                                    }
                                }
                                if( s_ppretag[i] !== null ){
                                    if(!_is_equal_tag(this._device._s_private_prefix[i],s_ppretag[i])){
                                        elpusk.util.insert_to_set ( this._device._set_change_parameter, cp_pre[i] );
                                        this._device._s_private_prefix[i] = s_ppretag[i];
                                    }
                                }
                                if( s_pposttag[i] !== null ){
                                    if( !_is_equal_tag(this._device._s_private_postfix[i],s_pposttag[i]) ){
                                        elpusk.util.insert_to_set ( this._device._set_change_parameter, cp_post[i] );
                                        this._device._s_private_postfix[i] = s_pposttag[i];
                                    }
                                }
                            }//end for
    
                            resolve(true);
                        }
                        else{//error
                            reject(_get_error_object('en_e_parameter'));
                        }
                        //
                        
                    };// the end of onload event handler.
                    //
                    reader.readAsText(file_xml);
    
                }while(false);
                
            });//the end of Promise definition.
        }   


        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_string
         * @return {string} the system parameters
         * @description return the string of system parameters.
         * <br /> each parameter is seperated by "\n".
        */
        _elpusk.device.usb.hid.lpu237.prototype.get_string = function(){
           var s_description = "";

           do{
               var ver = [0,0,0,0];
               var n_value = 0;

                s_description = s_description + "System name : " + this._s_name + "\n";

                s_description = s_description + "System version : " + _get_version_string(this._version) + "\n";
                s_description = s_description + "System UID : " + this._s_uid + "\n";

                if( this._b_is_hid_boot ){
                    s_description = s_description + "Used bootloader : Hid.\n";
                }
                else{
                    s_description = s_description + "Used bootloader : MSD.\n";
                }
                
                s_description = s_description + "System interface : " + _get_system_inferface_string(this._n_interface) + "\n";
                s_description = s_description + "Language : " + _get_keyboard_language_index_string(this._n_language_index) + "\n";
                s_description = s_description + "Manufacture : " + _get_manufacturer_string( this._n_manufacture )+ "\n";

                s_description = s_description + "MSD bootloader running time : " + String(this._dw_boot_run_time) + "\n";

                s_description = s_description + "Buzzer frequency : " + String(this._dw_buzzer_frequency) + "\n";
                s_description = s_description + "The supported functions : " + _get_function_string(this._n_device_function) + "\n";
                
                s_description = s_description + "i-Button mode : " + _get_ibutton_mode_string(this._n_ibutton_mode) + "\n";

                if(this._b_global_pre_postfix_send_condition){
                    s_description = s_description + "MSR global pre/postfixs sending condition : send when all track isn't error.\n";
                }
                else{
                    s_description = s_description + "MSR global pre/postfixs sending condition : send when a track isn't error.\n";
                }

                s_description = s_description + "MSR global prefixs : " + this._s_global_prefix + "\n";
                s_description = s_description + "MSR global postfixs : " + this._s_global_postfix + "\n";

                s_description = s_description + "i-button prefixs : " + this._s_prefix_ibutton + "\n";
                s_description = s_description + "i-button postfixs : " + this._s_postfix_ibutton + "\n";

                s_description = s_description + "Uart prefixs : " + this._s_prefix_uart + "\n";
                s_description = s_description + "Uart postfixs : " + this._s_postfix_uart + "\n";

                for( var i = 0; i<_const_the_number_of_track; i++ ){
                    if( this._b_enable_iso[i] ){
                        s_description = s_description + "MSR enabled track " + String(i+1) + " : enabled.\n";
                    }
                    else{
                        s_description = s_description + "MSR enabled track " + String(i+1) + " : disabled.\n";
                    }
                    s_description = s_description + "MSR reading direction track " + String(i+1) + " : " + _get_direction_string( this._n_direction[i]) + "\n";
                    s_description = s_description + "MSR private prefix track " + String(i+1) + " : " + this._s_private_prefix[i] + "\n";
                    s_description = s_description + "MSR private postfix track " + String(i+1) + " : " + this._s_private_postfix[i] + "\n";
                }//end for

           }while(false);
           return s_description;
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_tag_by_ascii_hex_string
         * @param {string} s_tag this string is received from device by hex string format.
         * @returns {string[]} hex string format array of ASCII code of tag.
        */
        _elpusk.device.usb.hid.lpu237.prototype.get_tag_by_ascii_hex_string = function(s_tag){
            return _get_tag_by_ascii_hex_string( this._n_language_index, s_tag );
        }

        /**
         * @private
         * @function elpusk.device.usb.hid.lpu237.get_tag_by_ascii_code
         * @param {string} s_len_tag_hex this string is received from device by hex string format.
         * @returns {number[]} ASCII code array of tag.
         */
        _elpusk.device.usb.hid.lpu237.prototype.get_tag_by_ascii_code = function(s_tag){
            return _get_tag_by_ascii_code(this._n_language_index, s_tag );
        }

        /**
         * @private
         * @function elpusk.device.usb.hid.lpu237.get_tag_by_ascii_string
         * @param {string} s_len_tag_hex this string is received from device by hex string format.
         * @returns {string[]} string format of ASCII code of tag.
         */
        _elpusk.device.usb.hid.lpu237.prototype.get_tag_by_ascii_string = function(s_tag){
            return _get_tag_by_ascii_string(this._n_language_index, s_tag );
        }


    }//the end of _elpusk.device.usb.hid.lpu237


    // the end of function
    window.elpusk = _elpusk;
}(window))