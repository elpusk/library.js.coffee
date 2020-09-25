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
 * @version 1.4.0
 * @description elpusk lpu237 device protocol layer library.
 * <br />   2020.4.10 - release 1.0. 
 * <br />   2020.5.12 - release 1.1. 
 * <br />   2020.6.0  - release 1.2.
 * <br />               add this._b_opos_mode and it's getter.
 * <br />               add this._b_config_mode and it's getter.
 * <br />   2020.6.12 - release 1.3.
 * <br />               add generate_run_bootloader() method.
 * <br />   2020.7.14 - release 1.4
 *                    - support ganymede v5.13. support multi-combination. 
 *                    - support callisto v3.21. support multi-combination. 
 * <br />   2020.7.15 - release 1.5
 *                    - fix _generate_set_etxl() missing code.
 * <br />   2020.7.16 - release 1.6
 *                    - support ISO1 ignore mode.
 *                    - support ISO3 ignore mode.
 *                    - support colon ignore mode.
 * <br />   2020.7.17 - release 1.7
 *                    - support system parameter table view.
 *                    - bugfix always displayed even parity.
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

    /** documented as elpusk.device.usb.hid.lpu237 */
    if (!_elpusk.device.usb.hid.lpu237) {

        var _const_min_size_request_header = 3;
        var _const_min_size_response_header = 3;
        var _const_the_number_of_track = 3;
        var _const_the_number_of_combination = 3;
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
            //
            cp_IndicateErrorCondition : 1,
            //
			cp_EnableiButton : 2,
			cp_Interface : 3,
			cp_BuzzerFrequency : 4,
			cp_BootRunTime : 5,
			cp_Language : 6,
			cp_EnableISO1 : 7, cp_EnableISO2 : 8, cp_EnableISO3 : 9,
			cp_Direction1 : 10, cp_Direction2 : 11, cp_Direction3 : 12,
            cp_GlobalPrefix : 13, cp_GlobalPostfix : 14,
            //
            cp_ISO1_NumberCombi : 15,   cp_ISO2_NumberCombi : 16,   cp_ISO3_NumberCombi : 17,

            cp_ISO1_Combi0_MaxSize : 18,    cp_ISO1_Combi1_MaxSize : 19,    cp_ISO1_Combi2_MaxSize : 20,
            cp_ISO2_Combi0_MaxSize : 21,    cp_ISO2_Combi1_MaxSize : 22,    cp_ISO2_Combi2_MaxSize : 23,
            cp_ISO3_Combi0_MaxSize : 24,    cp_ISO3_Combi1_MaxSize : 25,    cp_ISO3_Combi2_MaxSize : 26,
            //
            cp_ISO1_Combi0_BitSize : 27,    cp_ISO1_Combi1_BitSize : 28,    cp_ISO1_Combi2_BitSize : 29,
            cp_ISO2_Combi0_BitSize : 30,    cp_ISO2_Combi1_BitSize : 31,    cp_ISO2_Combi2_BitSize : 32,
            cp_ISO3_Combi0_BitSize : 33,    cp_ISO3_Combi1_BitSize : 34,    cp_ISO3_Combi2_BitSize : 35,

            cp_ISO1_Combi0_DataMask : 36,    cp_ISO1_Combi1_DataMask : 37,    cp_ISO1_Combi2_DataMask : 38,
            cp_ISO2_Combi0_DataMask : 39,    cp_ISO2_Combi1_DataMask : 40,    cp_ISO2_Combi2_DataMask : 41,
            cp_ISO3_Combi0_DataMask : 42,    cp_ISO3_Combi1_DataMask : 43,    cp_ISO3_Combi2_DataMask : 44,

            cp_ISO1_Combi0_UseParity : 45,    cp_ISO1_Combi1_UseParity : 46,    cp_ISO1_Combi2_UseParity : 47,
            cp_ISO2_Combi0_UseParity : 48,    cp_ISO2_Combi1_UseParity : 49,    cp_ISO2_Combi2_UseParity : 50,
            cp_ISO3_Combi0_UseParity : 51,    cp_ISO3_Combi1_UseParity : 52,    cp_ISO3_Combi2_UseParity : 53,

            cp_ISO1_Combi0_ParityType : 54,    cp_ISO1_Combi1_ParityType : 55,    cp_ISO1_Combi2_ParityType : 56,
            cp_ISO2_Combi0_ParityType : 57,    cp_ISO2_Combi1_ParityType : 58,    cp_ISO2_Combi2_ParityType : 59,
            cp_ISO3_Combi0_ParityType : 60,    cp_ISO3_Combi1_ParityType : 61,    cp_ISO3_Combi2_ParityType : 62,

            cp_ISO1_Combi0_STX_L : 63,    cp_ISO1_Combi1_STX_L : 64,    cp_ISO1_Combi2_STX_L : 65,
            cp_ISO2_Combi0_STX_L : 66,    cp_ISO2_Combi1_STX_L : 67,    cp_ISO2_Combi2_STX_L : 68,
            cp_ISO3_Combi0_STX_L : 69,    cp_ISO3_Combi1_STX_L : 70,    cp_ISO3_Combi2_STX_L : 71,

            cp_ISO1_Combi0_ETX_L : 72,    cp_ISO1_Combi1_ETX_L : 73,    cp_ISO1_Combi2_ETX_L : 74,
            cp_ISO2_Combi0_ETX_L : 75,    cp_ISO2_Combi1_ETX_L : 76,    cp_ISO2_Combi2_ETX_L : 77,
            cp_ISO3_Combi0_ETX_L : 78,    cp_ISO3_Combi1_ETX_L : 79,    cp_ISO3_Combi2_ETX_L : 80,

            cp_ISO1_Combi0_UseErrorCorrect : 81,    cp_ISO1_Combi1_UseErrorCorrect : 82,    cp_ISO1_Combi2_UseErrorCorrect : 83,
            cp_ISO2_Combi0_UseErrorCorrect : 84,    cp_ISO2_Combi1_UseErrorCorrect : 85,    cp_ISO2_Combi2_UseErrorCorrect : 86,
            cp_ISO3_Combi0_UseErrorCorrect : 87,    cp_ISO3_Combi1_UseErrorCorrect : 88,    cp_ISO3_Combi2_UseErrorCorrect : 89,

            cp_ISO1_Combi0_ECMType : 90,    cp_ISO1_Combi1_ECMType : 91,    cp_ISO1_Combi2_ECMType : 92,
            cp_ISO2_Combi0_ECMType : 93,    cp_ISO2_Combi1_ECMType : 94,    cp_ISO2_Combi2_ECMType : 95,
            cp_ISO3_Combi0_ECMType : 96,    cp_ISO3_Combi1_ECMType : 97,    cp_ISO3_Combi2_ECMType : 98,

            cp_ISO1_Combi0_AddValue : 99,    cp_ISO1_Combi1_AddValue : 100,    cp_ISO1_Combi2_AddValue : 101,
            cp_ISO2_Combi0_AddValue : 102,    cp_ISO2_Combi1_AddValue : 103,    cp_ISO2_Combi2_AddValue : 104,
            cp_ISO3_Combi0_AddValue : 105,    cp_ISO3_Combi1_AddValue : 106,    cp_ISO3_Combi2_AddValue : 107,
            //
            cp_PrivatePrefix10 : 108,    cp_PrivatePrefix11 : 109,    cp_PrivatePrefix12 : 110, 
            cp_PrivatePrefix20 : 111,    cp_PrivatePrefix21 : 112,    cp_PrivatePrefix22 : 113, 
            cp_PrivatePrefix30 : 114,    cp_PrivatePrefix31 : 115,    cp_PrivatePrefix32 : 116,
            
            cp_PrivatePostfix10 : 117,   cp_PrivatePostfix11 : 118,   cp_PrivatePostfix12 : 119, 
            cp_PrivatePostfix20 : 120,   cp_PrivatePostfix21 : 121,   cp_PrivatePostfix22 : 122, 
            cp_PrivatePostfix30 : 123,   cp_PrivatePostfix31 : 124,   cp_PrivatePostfix32 : 125,
            //
			cp_Prefix_iButton : 126, cp_Postfix_iButton : 127,
			cp_Prefix_Uart : 128, cp_Postfix_Uart : 129,
            cp_BtcConfigData : 130,
            cp_EnableF12iButton : 131, 
            cp_EnableZerosiButton : 132, 
            cp_EnableZeros7TimesiButton : 133, 
            cp_EnableAddmitCodeStickiButton : 134,
            cp_EnableIgnoreISO1 : 135,
            cp_EnableIgnoreISO3 : 136,
            cp_EnableRemoveColon : 137
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

            /////////////////////////////
            //get config series
			gt_get_version : 13,
			gt_get_name : 14,
            gt_get_global_prepostfix_send_condition : 15,
            gt_get_indicate_error_condition : 16,
            //
			gt_get_interface : 17,
			gt_get_language : 18,
			gt_get_buzzer_frequency : 19,
			gt_get_boot_run_time : 20,
			gt_get_enable_iso1 : 21, gt_get_enable_iso2 : 22, gt_get_enable_iso3 : 23,
			gt_get_direction1 : 24, gt_get_direction2 : 25, gt_get_direction3 : 26,
            gt_get_global_prefix : 27,  gt_get_global_postfix : 28,
            //
            gt_get_iso1_number_combi : 29,   gt_get_iso2_number_combi : 30,   gt_get_iso3_number_combi : 31,

            gt_get_iso1_Combi0_MaxSize : 32,    gt_get_iso1_Combi1_MaxSize : 33,    gt_get_iso1_Combi2_MaxSize : 34,
            gt_get_iso2_Combi0_MaxSize : 35,    gt_get_iso2_Combi1_MaxSize : 36,    gt_get_iso2_Combi2_MaxSize : 37,
            gt_get_iso3_Combi0_MaxSize : 38,    gt_get_iso3_Combi1_MaxSize : 39,    gt_get_iso3_Combi2_MaxSize : 40,
            
            gt_get_iso1_Combi0_BitSize : 41,    gt_get_iso1_Combi1_BitSize : 42,    gt_get_iso1_Combi2_BitSize : 43,
            gt_get_iso2_Combi0_BitSize : 44,    gt_get_iso2_Combi1_BitSize : 45,    gt_get_iso2_Combi2_BitSize : 46,
            gt_get_iso3_Combi0_BitSize : 47,    gt_get_iso3_Combi1_BitSize : 48,    gt_get_iso3_Combi2_BitSize : 49,

            gt_get_iso1_Combi0_DataMask : 50,   gt_get_iso1_Combi1_DataMask : 51,   gt_get_iso1_Combi2_DataMask : 52,
            gt_get_iso2_Combi0_DataMask : 53,   gt_get_iso2_Combi1_DataMask : 54,   gt_get_iso2_Combi2_DataMask : 55,
            gt_get_iso3_Combi0_DataMask : 56,   gt_get_iso3_Combi1_DataMask : 57,   gt_get_iso3_Combi2_DataMask : 58,

            gt_get_iso1_Combi0_UseParity : 59,  gt_get_iso1_Combi1_UseParity : 60,   gt_get_iso1_Combi2_UseParity : 61,
            gt_get_iso2_Combi0_UseParity : 62,  gt_get_iso2_Combi1_UseParity : 63,   gt_get_iso2_Combi2_UseParity : 64,
            gt_get_iso3_Combi0_UseParity : 65,  gt_get_iso3_Combi1_UseParity : 66,   gt_get_iso3_Combi2_UseParity : 67,

            gt_get_iso1_Combi0_ParityType : 68, gt_get_iso1_Combi1_ParityType : 69, gt_get_iso1_Combi2_ParityType : 70,
            gt_get_iso2_Combi0_ParityType : 71, gt_get_iso2_Combi1_ParityType : 72, gt_get_iso2_Combi2_ParityType : 73,
            gt_get_iso3_Combi0_ParityType : 74, gt_get_iso3_Combi1_ParityType : 75, gt_get_iso3_Combi2_ParityType : 76,

            gt_get_iso1_Combi0_STX_L : 77,      gt_get_iso1_Combi1_STX_L : 78,    gt_get_iso1_Combi2_STX_L : 79,
            gt_get_iso2_Combi0_STX_L : 80,      gt_get_iso2_Combi1_STX_L : 81,    gt_get_iso2_Combi2_STX_L : 82,
            gt_get_iso3_Combi0_STX_L : 83,      gt_get_iso3_Combi1_STX_L : 84,    gt_get_iso3_Combi2_STX_L : 85,

            gt_get_iso1_Combi0_ETX_L : 86,      gt_get_iso1_Combi1_ETX_L : 87,    gt_get_iso1_Combi2_ETX_L : 88,
            gt_get_iso2_Combi0_ETX_L : 89,      gt_get_iso2_Combi1_ETX_L : 90,    gt_get_iso2_Combi2_ETX_L : 91,
            gt_get_iso3_Combi0_ETX_L : 92,      gt_get_iso3_Combi1_ETX_L : 93,    gt_get_iso3_Combi2_ETX_L : 94,

            gt_get_iso1_Combi0_UseErrorCorrect : 95,    gt_get_iso1_Combi1_UseErrorCorrect : 96,    gt_get_iso1_Combi2_UseErrorCorrect : 97,
            gt_get_iso2_Combi0_UseErrorCorrect : 98,    gt_get_iso2_Combi1_UseErrorCorrect : 99,    gt_get_iso2_Combi2_UseErrorCorrect : 100,
            gt_get_iso3_Combi0_UseErrorCorrect : 101,   gt_get_iso3_Combi1_UseErrorCorrect : 102,    gt_get_iso3_Combi2_UseErrorCorrect : 103,

            gt_get_iso1_Combi0_ECMType : 104,            gt_get_iso1_Combi1_ECMType : 105,            gt_get_iso1_Combi2_ECMType : 106,
            gt_get_iso2_Combi0_ECMType : 107,            gt_get_iso2_Combi1_ECMType : 108,            gt_get_iso2_Combi2_ECMType : 109,
            gt_get_iso3_Combi0_ECMType : 110,            gt_get_iso3_Combi1_ECMType : 111,            gt_get_iso3_Combi2_ECMType : 112,

            gt_get_iso1_Combi0_AddValue : 113,           gt_get_iso1_Combi1_AddValue : 114,          gt_get_iso1_Combi2_AddValue : 115,
            gt_get_iso2_Combi0_AddValue : 116,          gt_get_iso2_Combi1_AddValue : 117,          gt_get_iso2_Combi2_AddValue : 118,
            gt_get_iso3_Combi0_AddValue : 119,          gt_get_iso3_Combi1_AddValue : 120,          gt_get_iso3_Combi2_AddValue : 121,
            //            
            gt_get_private_prefix10 : 122,   gt_get_private_prefix11 : 123,   gt_get_private_prefix12 : 124, 
            gt_get_private_prefix20 : 125,   gt_get_private_prefix21 : 126,   gt_get_private_prefix22 : 127,  
            gt_get_private_prefix30 : 128,   gt_get_private_prefix31 : 129,   gt_get_private_prefix32 : 130,
            
            gt_get_private_postfix10 : 131,  gt_get_private_postfix11 : 132,  gt_get_private_postfix12 : 133,
            gt_get_private_postfix20 : 134,  gt_get_private_postfix21 : 135,  gt_get_private_postfix22 : 136, 
            gt_get_private_postfix30 : 137,  gt_get_private_postfix31 : 138,  gt_get_private_postfix32 : 139,
            //
			gt_get_prefix_ibutton : 140, gt_get_postfix_ibutton : 141,
			gt_get_prefix_uart : 142, gt_get_postfix_uart : 143,
            gt_get_f12_ibutton : 144, gt_get_zeros_ibutton : 145, gt_get_zeros7_times_ibutton : 146, gt_get_addmit_code_stick_ibutton : 147,
            // get_get_x is more exist at the end of this defintion.
            /////////////////////////////
            //set
            gt_set_global_prepostfix_send_condition : 148,
            gt_set_indicate_error_condition : 149,
            //
			gt_set_interface : 150,
			gt_set_language : 151, get_set_keymap : 152,
			gt_set_buzzer_frequency : 153,
			gt_set_enable_iso1 : 154, gt_set_enable_iso2 : 155, gt_set_enable_iso3 : 156,
			gt_set_direction1 : 157, gt_set_direction2 : 158, gt_set_direction3 : 159,
            gt_set_global_prefix : 160,  gt_set_global_postfix : 161,
            
            gt_set_iso1_number_combi : 162,      gt_set_iso2_number_combi : 163,      gt_set_iso3_number_combi : 164,

            gt_set_iso1_Combi0_MaxSize : 165,    gt_set_iso1_Combi1_MaxSize : 166,    gt_set_iso1_Combi2_MaxSize : 167,
            gt_set_iso2_Combi0_MaxSize : 168,    gt_set_iso2_Combi1_MaxSize : 169,    gt_set_iso2_Combi2_MaxSize : 170,
            gt_set_iso3_Combi0_MaxSize : 171,    gt_set_iso3_Combi1_MaxSize : 172,    gt_set_iso3_Combi2_MaxSize : 173,
            
            gt_set_iso1_Combi0_BitSize : 174,    gt_set_iso1_Combi1_BitSize : 175,    gt_set_iso1_Combi2_BitSize : 176,
            gt_set_iso2_Combi0_BitSize : 177,    gt_set_iso2_Combi1_BitSize : 178,    gt_set_iso2_Combi2_BitSize : 179,
            gt_set_iso3_Combi0_BitSize : 180,    gt_set_iso3_Combi1_BitSize : 181,    gt_set_iso3_Combi2_BitSize : 182,

            gt_set_iso1_Combi0_DataMask : 183,   gt_set_iso1_Combi1_DataMask : 184,   gt_set_iso1_Combi2_DataMask : 185,
            gt_set_iso2_Combi0_DataMask : 186,   gt_set_iso2_Combi1_DataMask : 187,   gt_set_iso2_Combi2_DataMask : 188,
            gt_set_iso3_Combi0_DataMask : 189,   gt_set_iso3_Combi1_DataMask : 190,   gt_set_iso3_Combi2_DataMask : 191,

            gt_set_iso1_Combi0_UseParity : 192,  gt_set_iso1_Combi1_UseParity : 193,   gt_set_iso1_Combi2_UseParity : 194,
            gt_set_iso2_Combi0_UseParity : 195,  gt_set_iso2_Combi1_UseParity : 196,   gt_set_iso2_Combi2_UseParity : 197,
            gt_set_iso3_Combi0_UseParity : 198,  gt_set_iso3_Combi1_UseParity : 199,   gt_set_iso3_Combi2_UseParity : 200,

            gt_set_iso1_Combi0_ParityType : 201, gt_set_iso1_Combi1_ParityType : 202, gt_set_iso1_Combi2_ParityType : 203,
            gt_set_iso2_Combi0_ParityType : 204, gt_set_iso2_Combi1_ParityType : 205, gt_set_iso2_Combi2_ParityType : 206,
            gt_set_iso3_Combi0_ParityType : 207, gt_set_iso3_Combi1_ParityType : 208, gt_set_iso3_Combi2_ParityType : 209,

            gt_set_iso1_Combi0_STX_L : 210,      gt_set_iso1_Combi1_STX_L : 211,      gt_set_iso1_Combi2_STX_L : 212,
            gt_set_iso2_Combi0_STX_L : 213,      gt_set_iso2_Combi1_STX_L : 214,      gt_set_iso2_Combi2_STX_L : 215,
            gt_set_iso3_Combi0_STX_L : 216,      gt_set_iso3_Combi1_STX_L : 217,      gt_set_iso3_Combi2_STX_L : 218,

            gt_set_iso1_Combi0_ETX_L : 219,      gt_set_iso1_Combi1_ETX_L : 220,      gt_set_iso1_Combi2_ETX_L : 221,
            gt_set_iso2_Combi0_ETX_L : 222,      gt_set_iso2_Combi1_ETX_L : 223,      gt_set_iso2_Combi2_ETX_L : 224,
            gt_set_iso3_Combi0_ETX_L : 225,      gt_set_iso3_Combi1_ETX_L : 226,      gt_set_iso3_Combi2_ETX_L : 227,

            gt_set_iso1_Combi0_UseErrorCorrect : 228,    gt_set_iso1_Combi1_UseErrorCorrect : 229,    gt_set_iso1_Combi2_UseErrorCorrect : 230,
            gt_set_iso2_Combi0_UseErrorCorrect : 231,    gt_set_iso2_Combi1_UseErrorCorrect : 232,    gt_set_iso2_Combi2_UseErrorCorrect : 233,
            gt_set_iso3_Combi0_UseErrorCorrect : 234,    gt_set_iso3_Combi1_UseErrorCorrect : 235,    gt_set_iso3_Combi2_UseErrorCorrect : 236,

            gt_set_iso1_Combi0_ECMType : 237,            gt_set_iso1_Combi1_ECMType : 238,            gt_set_iso1_Combi2_ECMType : 239,
            gt_set_iso2_Combi0_ECMType : 240,            gt_set_iso2_Combi1_ECMType : 241,            gt_set_iso2_Combi2_ECMType : 242,
            gt_set_iso3_Combi0_ECMType : 243,            gt_set_iso3_Combi1_ECMType : 244,            gt_set_iso3_Combi2_ECMType : 245,

            gt_set_iso1_Combi0_AddValue : 246,           gt_set_iso1_Combi1_AddValue : 247,          gt_set_iso1_Combi2_AddValue : 248,
            gt_set_iso2_Combi0_AddValue : 249,          gt_set_iso2_Combi1_AddValue : 250,          gt_set_iso2_Combi2_AddValue : 251,
            gt_set_iso3_Combi0_AddValue : 252,          gt_set_iso3_Combi1_AddValue : 253,          gt_set_iso3_Combi2_AddValue : 254,
            //          
            gt_set_private_prefix10 : 255,   gt_set_private_prefix11 : 256,   gt_set_private_prefix12 : 257, 
            gt_set_private_prefix20 : 258,   gt_set_private_prefix21 : 259,   gt_set_private_prefix22 : 260,  
            gt_set_private_prefix30 : 261,   gt_set_private_prefix31 : 262,   gt_set_private_prefix32 : 263,
            
            gt_set_private_postfix10 : 264,  gt_set_private_postfix11 : 265,  gt_set_private_postfix12 : 266,
            gt_set_private_postfix20 : 267,  gt_set_private_postfix21 : 268,  gt_set_private_postfix22 : 269, 
            gt_set_private_postfix30 : 270,  gt_set_private_postfix31 : 271,  gt_set_private_postfix32 : 272,
            //
			gt_set_prefix_ibutton : 273, gt_set_postfix_ibutton : 274,
			gt_set_prefix_uart : 275, gt_set_postfix_uart : 276,
            gt_set_f12_ibutton : 277, 
            gt_set_zeros_ibutton : 278, 
            gt_set_zeros7_times_ibutton : 279, 
            gt_set_addmit_code_stick_ibutton : 230,

            //additional 
            gt_get_ignore_iso1 : 231,
            gt_get_ignore_iso3 : 232,
            gt_get_remove_colon : 233,

            gt_set_ignore_iso1 : 234,
            gt_set_ignore_iso3 : 235,
            gt_set_remove_colon : 236
        };
                
        /**
         * @private
         * @readonly
         * @constant {number}
         * @description the offset value of system parameters.
         * <br /> generated by tools_gen_lpu237_data.exe
         */

        var _type_system_offset = {
            SYS_OFFSET_VERSION : 28,
            SYS_OFFSET_NAME : 12,
            SYS_OFFSET_G_TAG_CONDITION : 83,
            SYS_OFFSET_INDICATE_ERROR_CONDITION : 0,
            SYS_OFFSET_IGNORE_ISO1 : 0,
            SYS_OFFSET_IGNORE_ISO3 : 0,
            SYS_OFFSET_REMOVE_COLON : 0,
            SYS_OFFSET_INTERFACE : 42,
            SYS_OFFSET_KEYMAP : 103,
            SYS_OFFSET_BUZZER_FREQ : 43,
            SYS_OFFSET_BOOT_RUN_TIME : 51,
            SYS_OFFSET_ENABLE_TRACK : [171,358,545],
            SYS_OFFSET_DIRECTION : [201,388,575],
            SYS_OFFSET_G_PRE : 141,
            SYS_OFFSET_G_POST : 156,
            SYS_OFFSET_COMBINATION : [172,359,546],
            SYS_OFFSET_MAX_SIZE : [[174,175,176],[361,362,363],[548,549,550]],
            SYS_OFFSET_BIT_SIZE : [[177,178,179],[364,365,366],[551,552,553]],
            SYS_OFFSET_DATA_MASK : [[180,181,182],[367,368,369],[554,555,556]],
            SYS_OFFSET_USE_PARITY : [[183,184,185],[370,371,372],[557,558,559]],
            SYS_OFFSET_PARITY_TYPE : [[186,187,188],[373,374,375],[560,561,562]],
            SYS_OFFSET_STXL : [[189,190,191],[376,377,378],[563,564,565]],
            SYS_OFFSET_ETXL : [[192,193,194],[379,380,381],[566,567,568]],
            SYS_OFFSET_USE_ERROR_CORRECT : [[195,196,197],[382,383,384],[569,570,571]],
            SYS_OFFSET_ECM_TYPE : [[198,199,200],[385,386,387],[572,573,574]],
            SYS_OFFSET_ADD_VALUE : [[208,209,210],[395,396,397],[582,583,584]],
            SYS_OFFSET_P_PRE : [[244,259,274],[431,446,461],[618,633,648]],
            SYS_OFFSET_P_POST : [[289,304,319],[476,491,506],[663,678,693]],
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
         * <br /> generated by tools_gen_lpu237_data.exe
         */
        var _type_system_size = {
            SYS_SIZE_VERSION : 4,
            SYS_SIZE_NAME : 16,
            SYS_SIZE_G_TAG_CONDITION : 4,
            SYS_SIZE_INDICATE_ERROR_CONDITION : 4,
            SYS_SIZE_IGNORE_ISO1 : 4,
            SYS_SIZE_IGNORE_ISO3 : 4,
            SYS_SIZE_REMOVE_COLON : 4,
            SYS_SIZE_INTERFACE : 1,
            SYS_SIZE_KEYMAP : 4,
            SYS_SIZE_BUZZER_FREQ : 4,
            SYS_SIZE_BOOT_RUN_TIME : 4,
            SYS_SIZE_ENABLE_TRACK : [1,1,1],
            SYS_SIZE_DIRECTION : [1,1,1],
            SYS_SIZE_G_PRE : 15,
            SYS_SIZE_G_POST : 15,
            SYS_SIZE_COMBINATION : [1,1,1],
            SYS_SIZE_MAX_SIZE : [[1,1,1],[1,1,1],[1,1,1]],
            SYS_SIZE_BIT_SIZE : [[1,1,1],[1,1,1],[1,1,1]],
            SYS_SIZE_DATA_MASK : [[1,1,1],[1,1,1],[1,1,1]],
            SYS_SIZE_USE_PARITY : [[1,1,1],[1,1,1],[1,1,1]],
            SYS_SIZE_PARITY_TYPE : [[1,1,1],[1,1,1],[1,1,1]],
            SYS_SIZE_STXL : [[1,1,1],[1,1,1],[1,1,1]],
            SYS_SIZE_ETXL : [[1,1,1],[1,1,1],[1,1,1]],
            SYS_SIZE_USE_ERROR_CORRECT : [[1,1,1],[1,1,1],[1,1,1]],
            SYS_SIZE_ECM_TYPE : [[1,1,1],[1,1,1],[1,1,1]],
            SYS_SIZE_ADD_VALUE : [[1,1,1],[1,1,1],[1,1,1]],
            SYS_SIZE_P_PRE : [[15,15,15],[15,15,15],[15,15,15]],
            SYS_SIZE_P_POST : [[15,15,15],[15,15,15],[15,15,15]],
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
         * @function _get_hid_modifier_code_hex_string_by_key_symbol
         * @param {string} s_key_symbol  oring of "c", "s", "a" or ""
         * @returns {string} hex string. (excluded "0x")
         * @description get hid modifier hex string code of hid key.
         * <br /> modifier represents alt, shift, ctl key status.
        */                
        function _get_hid_modifier_code_hex_string_by_key_symbol( s_key_symbol ){
        
            var s_hid_modifier_code_hex = null;
    
            do{
                if( typeof s_key_symbol !== 'string' ){
                    continue;
                }
                if(s_key_symbol.length === 0 ){
                    s_hid_modifier_code_hex = "00";
                    continue;
                }
    
                var n_modifier = 0;
    
                if( s_key_symbol.indexOf("s") !== -1 ){
                    n_modifier |= 0x02;//left shift
                }
                if( s_key_symbol.indexOf("c") !== -1 ){
                    n_modifier |= 0x01;//left control
                }
                if( s_key_symbol.indexOf("a") !== -1 ){
                    n_modifier |= 0x04;//left alt
                }
    
                s_hid_modifier_code_hex = "0" + n_modifier.toString(16);
    
            }while(false);
    
            return s_hid_modifier_code_hex;
        }
    
        /** 
         * @private 
         * @function _get_key_symbol_string_by_hid_modifier_code_number
         * @param {number} n_hid_modifier_code hid modifier keycode number.
         * @returns {string} the symbol of hid modifier
         * <br /> error case return ""
         * @description get a symbol from hid modifier number.
        */                
        function _get_key_symbol_string_by_hid_modifier_code_number( n_hid_modifier_code ){
        
            var s_symbol = "";
    
            do{
                if( typeof n_hid_modifier_code !== 'number' ){
                    continue;
                }
    
                if( n_hid_modifier_code & 0x02 ){
                    s_symbol += "left_shift"
                }
                if( n_hid_modifier_code & 0x01 ){
                    s_symbol += "left_control"
                }
                if( n_hid_modifier_code & 0x04 ){
                    s_symbol += "left_alt"
                }
    
            }while(false);
    
            return s_symbol;
        }

        /** 
         * @private 
         * @function _get_hid_key_code_hex_string_by_key_symbol
         * @param {string} s_key_symbol  english keyboard key symbol or hex string with "0x"( this is hid key code)
         * @returns {string} hex string. (excluded "0x")
         * @description get hid key hex string code.
        */                
        function _get_hid_key_code_hex_string_by_key_symbol( s_key_symbol ){
            //key
            var s_hid_key_code_hex = null;
            
            do{
                if( typeof s_key_symbol !== 'string' ){
                    continue;
                }
                if(s_key_symbol.length === 0 ){
                    s_hid_key_code_hex = "00";
                    continue;
                }
                if( s_key_symbol.indexOf("0x")>=0 ){
                    if( s_key_symbol.length !== 4 ){
                        continue;
                    }
                    //hex string
                    s_hid_key_code_hex = s_key_symbol.substring(2);
                    var s_pattern = /[^0-9A-Fa-f]+/;
    
                    if( s_hid_key_code_hex.match(s_pattern) !== null ){
                        s_hid_key_code_hex = null;//error
                    }
                    continue;
                }
                if( s_key_symbol === "f1" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY________F1;
                    continue;
                }
                if( s_key_symbol === "f2" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY________F2;
                    continue;
                }
                if( s_key_symbol === "f3" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY________F3;
                    continue;
                }
                if( s_key_symbol === "f4" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY________F4;
                    continue;
                }
                if( s_key_symbol === "f5" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY________F5;
                    continue;
                }
                if( s_key_symbol === "f6" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY________F6;
                    continue;
                }
                if( s_key_symbol === "f7" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY________F7;
                    continue;
                }
                if( s_key_symbol === "f8" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY________F8;
                    continue;
                }
                if( s_key_symbol === "f9" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY________F9;
                    continue;
                }
                if( s_key_symbol === "f10" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_______F10;
                    continue;
                }
                if( s_key_symbol === "f11" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_______F11;
                    continue;
                }
                if( s_key_symbol === "f12" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_______F12;
                    continue;
                }
                if( s_key_symbol === "esc" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____ESCAPE;
                    continue;
                }
                if( s_key_symbol === "space" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_____SPACE;
                    continue;
                }
                if( s_key_symbol === "tab" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_______TAB;
                    continue;
                }
                if( s_key_symbol === "q" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____q____Q;
                    continue;
                }
                if( s_key_symbol === "w" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____w____W;
                    continue;
                }
                if( s_key_symbol === "e" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____e____E;
                    continue;
                }
                if( s_key_symbol === "r" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____r____R;
                    continue;
                }
                if( s_key_symbol === "t" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____t____T;
                    continue;
                }
                if( s_key_symbol === "y" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____y____Y;
                    continue;
                }
                if( s_key_symbol === "u" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____u____U;
                    continue;
                }
                if( s_key_symbol === "i" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____i____I;
                    continue;
                }
                if( s_key_symbol === "o" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____o____O;
                    continue;
                }
                if( s_key_symbol === "p" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____p____P;
                    continue;
                }
                if( s_key_symbol === "[" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_LBT___LBR;
                    continue;
                }
                if( s_key_symbol === "]" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_RBT___RBR;
                    continue;
                }
                if( s_key_symbol === "\\" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_BSLA_VBAR;
                    continue;
                }
                if( s_key_symbol === "del" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____DELETE;
                    continue;
                }
                if( s_key_symbol === "z" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____z____Z;
                    continue;
                }
                if( s_key_symbol === "x" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____x____X;
                    continue;
                }
                if( s_key_symbol === "c" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____c____C;
                    continue;
                }
                if( s_key_symbol === "v" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____v____V;
                    continue;
                }
                if( s_key_symbol === "b" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____b____B;
                    continue;
                }
                if( s_key_symbol === "n" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____n____N;
                    continue;
                }
                if( s_key_symbol === "m" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____m____M;
                    continue;
                }
                if( s_key_symbol === "," ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_COMA___LT;
                    continue;
                }
                if( s_key_symbol === "." ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_PERIOD_GT;
                    continue;
                }
                if( s_key_symbol === "/" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_SLASH__QM;
                    continue;
                }
                if( s_key_symbol === "`" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_GRAV_TILD;
                    continue;
                }
                if( s_key_symbol === "1" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____1_EXCL;
                    continue;
                }
                if( s_key_symbol === "2" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____2_QUOT;
                    continue;
                }
                if( s_key_symbol === "3" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____3_SHAR;
                    continue;
                }
                if( s_key_symbol === "4" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____4_DOLL;
                    continue;
                }
                if( s_key_symbol === "5" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____5_PERC;
                    continue;
                }
                if( s_key_symbol === "6" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____6_CIRC;
                    continue;
                }
                if( s_key_symbol === "7" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____7_AMPE;
                    continue;
                }
                if( s_key_symbol === "8" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____8_ASTE;
                    continue;
                }
                if( s_key_symbol === "9" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____9_L_PA;
                    continue;
                }
                if( s_key_symbol === "0" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____0_R_PA;
                    continue;
                }
                if( s_key_symbol === "-" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_MIN_UNDER;
                    continue;
                }
                if( s_key_symbol === "=" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_EQU__PLUS;
                    continue;
                }
                if( s_key_symbol === "bs" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_BACKSPACE;
                    continue;
                }
                if( s_key_symbol === "a" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____a____A;
                    continue;
                }
                if( s_key_symbol === "s" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____s____S;
                    continue;
                }
                if( s_key_symbol === "d" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____d____D;
                    continue;
                }
                if( s_key_symbol === "f" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____f____F;
                    continue;
                }
                if( s_key_symbol === "g" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____g____G;
                    continue;
                }
                if( s_key_symbol === "h" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____h____H;
                    continue;
                }
                if( s_key_symbol === "j" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____j____J;
                    continue;
                }
                if( s_key_symbol === "k" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____k____K;
                    continue;
                }
                if( s_key_symbol === "l" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____l____L;
                    continue;
                }
                if( s_key_symbol === ";" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_SEMI__COL;
                    continue;
                }
                if( s_key_symbol === "'" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_APOS_QUOT;
                    continue;
                }
                if( s_key_symbol === "enter" ){
                    s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____RETURN;
                    continue;
                }
            }while(false);
            return s_hid_key_code_hex;
        }
    
        /** 
         * @private 
         * @function _get_key_symbol_string_by_hid_key_code_number
         * @param {number} n_hid_key_code hid keycode number.
         * @returns {string} the symbol of hid key
         * <br /> error case return ""
         * @description get hid key symbol string.
        */                
        function _get_key_symbol_string_by_hid_key_code_number( n_hid_key_code ){
            //key
            var s_key_symbol = "";
            var s_hid_key_code = 0;
            
            do{
                if( typeof n_hid_key_code !== 'number' ){
                    continue;
                }

                s_hid_key_code = n_hid_key_code.toString(16).toLowerCase();


                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY________F1 ){
                    s_key_symbol = "f1";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY________F2 ){
                    s_key_symbol = "f2";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY________F3 ){
                    s_key_symbol = "f3";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY________F4 ){
                    s_key_symbol = "f4";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY________F5 ){
                    s_key_symbol = "f5";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY________F6 ){
                    s_key_symbol = "f6";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY________F7 ){
                    s_key_symbol = "f7";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY________F8 ){
                    s_key_symbol = "f8";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY________F9 ){
                    s_key_symbol = "f9";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY_______F10 ){
                    s_key_symbol = "f10";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY_______F11 ){
                    s_key_symbol = "f11";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY_______F12 ){
                    s_key_symbol = "f12";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____ESCAPE ){
                    s_key_symbol = "esc";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY_____SPACE ){
                    s_key_symbol = "space";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY_______TAB ){
                    s_key_symbol = "tab";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____q____Q ){
                    s_key_symbol = "q";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____w____W ){
                    s_key_symbol = "w";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____e____E ){
                    s_key_symbol = "e";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____r____R ){
                    s_key_symbol = "r";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____t____T ){
                    s_key_symbol = "t";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____y____Y ){
                    s_key_symbol = "y";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____u____U ){
                    s_key_symbol = "u";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____i____I ){
                    s_key_symbol = "i";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____o____O ){
                    s_key_symbol = "o";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____p____P ){
                    s_key_symbol = "p";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY_LBT___LBR ){
                    s_key_symbol = "[";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY_RBT___RBR ){
                    s_key_symbol = "]";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY_BSLA_VBAR ){
                    s_key_symbol = "\\";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____DELETE ){
                    s_key_symbol = "del";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____z____Z ){
                    s_key_symbol = "z";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____x____X ){
                    s_key_symbol = "x";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____c____C ){
                    s_key_symbol = "c";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____v____V ){
                    s_key_symbol = "v";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____b____B ){
                    s_key_symbol = "b";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____n____N ){
                    s_key_symbol = "n";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____m____M ){
                    s_key_symbol = "m";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY_COMA___LT ){
                    s_key_symbol = ",";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY_PERIOD_GT ){
                    s_key_symbol = ".";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY_SLASH__QM ){
                    s_key_symbol = "/";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY_GRAV_TILD ){
                    s_key_symbol = "`";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____1_EXCL ){
                    s_key_symbol = "1";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____2_QUOT ){
                    s_key_symbol = "2";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____3_SHAR ){
                    s_key_symbol = "3";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____4_DOLL ){
                    s_key_symbol = "4";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____5_PERC ){
                    s_key_symbol = "5";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____6_CIRC ){
                    s_key_symbol = "6";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____7_AMPE ){
                    s_key_symbol = "7";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____8_ASTE ){
                    s_key_symbol = "8";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____9_L_PA ){
                    s_key_symbol = "9";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____0_R_PA ){
                    s_key_symbol = "0";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY_MIN_UNDER ){
                    s_key_symbol = "-";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY_EQU__PLUS ){
                    s_key_symbol = "=";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY_BACKSPACE ){
                    s_key_symbol = "bs";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____a____A ){
                    s_key_symbol = "a";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____s____S ){
                    s_key_symbol = "s";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____d____D ){
                    s_key_symbol = "d";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____f____F ){
                    s_key_symbol = "f";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____g____G ){
                    s_key_symbol = "g";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____h____H ){
                    s_key_symbol = "h";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____j____J ){
                    s_key_symbol = "j";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____k____K ){
                    s_key_symbol = "k";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____l____L ){
                    s_key_symbol = "l";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY_SEMI__COL ){
                    s_key_symbol = ";";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY_APOS_QUOT ){
                    s_key_symbol = "'";
                    continue;
                }
                if( s_hid_key_code === elpusk.util.keyboard.const.HIDKEY____RETURN ){
                    s_key_symbol = "enter";
                    continue;
                }
            }while(false);
            return s_key_symbol;
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
         * @readonly
         * @enum {number}
         * @description the definition of parity bit type
        */        
        var _type_parity = {//parity bit type, unsigned char
            parity_even : 0,	//even parity
            parity_odd : 1	//odd parity
        };

        /**
         * @private
         * @function _get_parity_type_string
         * @param {number} type_parity _type_parity value.
         * @returns {string} parity type.
         */
        function _get_parity_type_string( type_parity ){
            var s_value = "unknown";
            do{
                if( typeof type_parity !== 'number'){
                    continue;
                }
                switch(type_parity){
                    case _type_parity.parity_even:
                        s_value = "even parity";
                        break;
                    case _type_parity.parity_odd:
                        s_value = "odd parity";
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
         * @description the definition of error correction type
        */        
       var _type_error_correct = {//error correction type, unsigned char
            error_correct_lrc : 0,	//LRC
            error_correct_inv_lrc : 1,	//inversion LRC
            error_correct_crc : 2	//CRC
        };

        /**
         * @private
         * @function _get_error_correct_type_string
         * @param {number} type_error_correct _type_error_correct value.
         * @returns {string} error correction type.
         */
        function _get_error_correct_type_string( type_error_correct ){
            var s_value = "unknown";
            do{
                if( typeof type_error_correct !== 'number'){
                    continue;
                }
                switch(type_error_correct){
                    case _type_error_correct.error_correct_lrc:
                        s_value = "LRC error correction";
                        break;
                    case _type_error_correct.error_correct_inv_lrc:
                        s_value = "Inversion LRC error correction";
                        break;
                    case _type_error_correct.error_correct_crc:
                        s_value = "CRC error correction";
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
         * @function _get_indicate_error_condition_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} false - When any track is not a error, reader indicate success-processing.
         * <br />   true - When all track are not a error, reader indicate success-processing.
         * <br /> null - error.
         */
		function _get_indicate_error_condition_from_response(s_response){
            var b_result = null;

			do {
                var c_blank = [];
				if (!_is_success_response(s_response)){
                    continue;
                }

                var n_size = _type_system_size.SYS_SIZE_INDICATE_ERROR_CONDITION;
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }

                c_blank = _get_data_field_member_of_response_by_number_array(s_response);
                if( c_blank[1] & 0x01 ){
                    b_result = false;
                }
                else{
                    b_result = true;
                }
			} while (false);
			return b_result;
        }

        /**
         * @private
         * @function _get_ignore_iso1_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} true - If 1 & 2 track data is equal, send 2 track data only.
         * <br />   true - else
         * <br /> null - error.
         */
		function _get_ignore_iso1_from_response(s_response){
            var b_result = null;

			do {
                var c_blank = [];
				if (!_is_success_response(s_response)){
                    continue;
                }

                var n_size = _type_system_size.SYS_SIZE_IGNORE_ISO1;
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }

                c_blank = _get_data_field_member_of_response_by_number_array(s_response);
                if( c_blank[1] & 0x02 ){
                    b_result = true;
                }
                else{
                    b_result = false;
                }
			} while (false);
			return b_result;
        }
        /**
         * @private
         * @function _get_ignore_iso3_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} true - If 2 & 3 track data is equal, send 2 track data only.
         * <br />   false - else.
         * <br /> null - error.
         */
		function _get_ignore_iso3_from_response(s_response){
            var b_result = null;

			do {
                var c_blank = [];
				if (!_is_success_response(s_response)){
                    continue;
                }

                var n_size = _type_system_size.SYS_SIZE_IGNORE_ISO3;
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }

                c_blank = _get_data_field_member_of_response_by_number_array(s_response);
                if( c_blank[1] & 0x04 ){
                    b_result = true;
                }
                else{
                    b_result = false;
                }
			} while (false);
			return b_result;
        }
        /**
         * @private
         * @function _get_remove_colon_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} true - If a track ETXL is 0xe0 and the first data is ASCII ':', then track's ':' isn't sent.
         * <br />   false - else.
         * <br /> null - error.
         */
		function _get_remove_colon_from_response(s_response){
            var b_result = null;

			do {
                var c_blank = [];
				if (!_is_success_response(s_response)){
                    continue;
                }

                var n_size = _type_system_size.SYS_SIZE_REMOVE_COLON;
                if( _get_length_member_of_response(s_response) !== n_size ){
                    continue;
                }

                c_blank = _get_data_field_member_of_response_by_number_array(s_response);
                if( c_blank[1] & 0x08 ){
                    b_result = true;
                }
                else{
                    b_result = false;
                }
			} while (false);
			return b_result;
        }


        //////////////////
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
         * @function _get_number_combi_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @param {number} n_track - ISO track 0~2
         * @returns {number} the number of combination that is supported a format in each track.
         * <br /> negative value is error.
         */
		function _get_number_combi_from_response(s_response,n_track){
			var n_value = -1;

			do {
                var n_size = 0;
                
				switch (n_track) {
				case _type_msr_track_Numer.iso1_track:
                case _type_msr_track_Numer.iso2_track:
                case _type_msr_track_Numer.iso3_track:
                    n_size = _type_system_size.SYS_SIZE_COMBINATION[n_track];
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
         * @function _get_max_size_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @param {number} n_track - ISO track 0~2
         * @param {number} n_combi - combination index 0~2
         * @returns {number} the maximum number of data at a combination of track.(except STX,ETX,LRC)
         * <br /> negative value is error.
         */
		function _get_max_size_from_response(s_response,n_track,n_combi){
			var n_value = -1;

			do {
                if( n_combi > 2 || n_combi < 0 ){
                    continue;
                }
                var n_size = 0;
                
				switch (n_track) {
				case _type_msr_track_Numer.iso1_track:
                case _type_msr_track_Numer.iso2_track:
                case _type_msr_track_Numer.iso3_track:
                    n_size = _type_system_size.SYS_SIZE_MAX_SIZE[n_track][n_combi];
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
         * @function _get_bit_size_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @param {number} n_track - ISO track 0~2
         * @param {number} n_combi - combination index 0~2
         * @returns {number} the size of each data at a combination of track.(unit : bit)
         * <br /> negative value is error.
         */
		function _get_bit_size_from_response(s_response,n_track,n_combi){
			var n_value = -1;

			do {
                if( n_combi > 2 || n_combi < 0 ){
                    continue;
                }
                var n_size = 0;
                
				switch (n_track) {
				case _type_msr_track_Numer.iso1_track:
                case _type_msr_track_Numer.iso2_track:
                case _type_msr_track_Numer.iso3_track:
                    n_size = _type_system_size.SYS_SIZE_BIT_SIZE[n_track][n_combi];
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
         * @function _get_data_mask_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @param {number} n_track - ISO track 0~2
         * @param {number} n_combi - combination index 0~2
         * @returns {number}the mask pattern of each data at a combination of track.( including Error check bit, left arrangement)
         */
		function _get_data_mask_from_response(s_response,n_track,n_combi){
			var n_value = 0;

			do {
                if( n_combi > 2 || n_combi < 0 ){
                    continue;
                }
                var n_size = 0;
                
				switch (n_track) {
				case _type_msr_track_Numer.iso1_track:
                case _type_msr_track_Numer.iso2_track:
                case _type_msr_track_Numer.iso3_track:
                    n_size = _type_system_size.SYS_SIZE_DATA_MASK[n_track][n_combi];
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
         * @function _get_use_parity_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @param {number} n_track - ISO track 0~2
         * @param {number} n_combi - combination index 0~2
         * @returns {boolean} true : use parity bit at a combination of track.( including Error check bit, left arrangement)
         * <br /> false - Don't use parity bit.
         * <br /> null - error.
         */
		function _get_use_parity_from_response(s_response,n_track,n_combi){
			var b_result = false;

			do {
                if( n_combi > 2 || n_combi < 0 ){
                    continue;
                }
                var n_size = 0;
                
				switch (n_track) {
				case _type_msr_track_Numer.iso1_track:
                case _type_msr_track_Numer.iso2_track:
                case _type_msr_track_Numer.iso3_track:
                    n_size = _type_system_size.SYS_SIZE_USE_PARITY[n_track][n_combi];
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

                b_result = _get_data_field_member_of_response_by_boolean(s_response);
			} while (false);
			return b_result;
        }

        /**
         * @private
         * @function _get_parity_type_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @param {number} n_track - ISO track 0~2
         * @param {number} n_combi - combination index 0~2
         * @returns {number} 0 - even parity.
         * <br /> 1 - odd parity.
         * <br /> negative value is error.
         */
		function _get_parity_type_from_response(s_response,n_track,n_combi){
			var n_value = -1;

			do {
                if( n_combi > 2 || n_combi < 0 ){
                    continue;
                }
                var n_size = 0;
                
				switch (n_track) {
				case _type_msr_track_Numer.iso1_track:
                case _type_msr_track_Numer.iso2_track:
                case _type_msr_track_Numer.iso3_track:
                    n_size = _type_system_size.SYS_SIZE_PARITY_TYPE[n_track][n_combi];
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
         * @function _get_stxl_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @param {number} n_track - ISO track 0~2
         * @param {number} n_combi - combination index 0~2
         * @returns {number} the start sentinel pattern of each data at a combination of track.( including parity, left arrangement)
         */
		function _get_stxl_from_response(s_response,n_track,n_combi){
			var n_value = 0;

			do {
                if( n_combi > 2 || n_combi < 0 ){
                    continue;
                }
                var n_size = 0;
                
				switch (n_track) {
				case _type_msr_track_Numer.iso1_track:
                case _type_msr_track_Numer.iso2_track:
                case _type_msr_track_Numer.iso3_track:
                    n_size = _type_system_size.SYS_SIZE_STXL[n_track][n_combi];
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
         * @function _get_etxl_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @param {number} n_track - ISO track 0~2
         * @param {number} n_combi - combination index 0~2
         * @returns {number} the end sentinel pattern of each data at a combination of track.( including parity, left arrangement)
         */
		function _get_etxl_from_response(s_response,n_track,n_combi){
			var n_value = 0;

			do {
                if( n_combi > 2 || n_combi < 0 ){
                    continue;
                }
                var n_size = 0;
                
				switch (n_track) {
				case _type_msr_track_Numer.iso1_track:
                case _type_msr_track_Numer.iso2_track:
                case _type_msr_track_Numer.iso3_track:
                    n_size = _type_system_size.SYS_SIZE_ETXL[n_track][n_combi];
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
         * @function _get_use_error_correct_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @param {number} n_track - ISO track 0~2
         * @param {number} n_combi - combination index 0~2
         * @returns {boolean} true : use error correction at a combination of track.( including Error check bit, left arrangement)
         * <br /> false - Don't use error correction.
         * <br /> null - error.
         */
		function _get_use_error_correct_from_response(s_response,n_track,n_combi){
			var b_result = false;

			do {
                if( n_combi > 2 || n_combi < 0 ){
                    continue;
                }
                var n_size = 0;
                
				switch (n_track) {
				case _type_msr_track_Numer.iso1_track:
                case _type_msr_track_Numer.iso2_track:
                case _type_msr_track_Numer.iso3_track:
                    n_size = _type_system_size.SYS_SIZE_USE_ERROR_CORRECT[n_track][n_combi];
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

                b_result = _get_data_field_member_of_response_by_boolean(s_response);
			} while (false);
			return b_result;
        }

        /**
         * @private
         * @function _get_ecm_type_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @param {number} n_track - ISO track 0~2
         * @param {number} n_combi - combination index 0~2
         * @returns {number} 0 - error correction type is LRC.
         * <br /> 1 - Error correction type is inversion LRC.( after calcuating LRC, inverse LRC )
         * <br /> 2 - Error correction type is CRC.
         * <br /> negative value is error.
         */
		function _get_ecm_type_from_response(s_response,n_track,n_combi){
			var n_value = -1;

			do {
                if( n_combi > 2 || n_combi < 0 ){
                    continue;
                }
                var n_size = 0;
                
				switch (n_track) {
				case _type_msr_track_Numer.iso1_track:
                case _type_msr_track_Numer.iso2_track:
                case _type_msr_track_Numer.iso3_track:
                    n_size = _type_system_size.SYS_SIZE_ECM_TYPE[n_track][n_combi];
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
         * @function _get_add_value_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @param {number} n_track - ISO track 0~2
         * @param {number} n_combi - combination index 0~2
         * @returns {number} For converting to ASCII code, the value of each data at a combination of track.
         * <br /> negative value is error.
         */
		function _get_add_value_from_response(s_response,n_track,n_combi){
			var n_value = -1;

			do {
                if( n_combi > 2 || n_combi < 0 ){
                    continue;
                }
                var n_size = 0;
                
				switch (n_track) {
				case _type_msr_track_Numer.iso1_track:
                case _type_msr_track_Numer.iso2_track:
                case _type_msr_track_Numer.iso3_track:
                    n_size = _type_system_size.SYS_SIZE_ADD_VALUE[n_track][n_combi];
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
         * @function _get_private_prefix_from_response
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @param {number} n_track - ISO track 0~2
         * @param {number} n_combi - combination index 0~2
         * @returns {(null|string)} hex string format.
         * <br /> null - error.
         */
		function _get_private_prefix_from_response(s_response, n_track,n_combi ){
			var s_data = null;

			do {
                var n_size = 0;
                
				switch (n_track) {
				case _type_msr_track_Numer.iso1_track:
                case _type_msr_track_Numer.iso2_track:
                case _type_msr_track_Numer.iso3_track:
                    n_size = _type_system_size.SYS_SIZE_P_PRE[n_track][n_combi];
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
         * @param {number} n_combi - combination index 0~2
         * @returns {(null|string)} hex string format.
         * <br /> null - error.
         */
		function _get_private_postfix_from_response(s_response, n_track,n_combi ){
			var s_data = null;

			do {
                var n_size = 0;
                
				switch (n_track) {
				case _type_msr_track_Numer.iso1_track:
                case _type_msr_track_Numer.iso2_track:
                case _type_msr_track_Numer.iso3_track:
                    n_size = _type_system_size.SYS_SIZE_P_POST[n_track][n_combi];
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
         * @function _get_indicate_error_condition_from_string
         * @param {string} s_string - "and" or "or"
         * @returns {(null|boolean)} false - When any track is not a error, reader indicate success-processing.
         * <br /> true - When all track are not a error, reader indicate success-processing.
         * <br /> null - error.
         */
		function _get_indicate_error_condition_from_string(s_string){
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
         * @function _get_use_parity_from_string
         * @param {string} s_string - "enable" or "disable"
         * @returns {(null|boolean)} true - use parity bit
         * <br /> false - don't use parity bit
         * <br /> null - error.
         */
		function _get_use_parity_from_string(s_string){
            return _get_enable_track_from_string(s_string);
        }

        /**
         * @private
         * @function _get_use_error_correct_from_string
         * @param {string} s_string - "enable" or "disable"
         * @returns {(null|boolean)} true - use error correction.
         * <br /> false - don't use error correction.
         * <br /> null - error.
         */
		function _get_use_error_correct_from_string(s_string){
            return _get_enable_track_from_string(s_string);
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
         * @function _get_hid_key_pair_hex_string_from_string
         * @param {string} s_string - "xml tag string"
         * @returns {(null|string)} hex string format.( included length in front. )
         * <br /> null - error.
         */
        function _get_hid_key_pair_hex_string_from_string(s_string){

            var s_hex_result = null;
            var b_all_zero = true;
    
            do{
                if( typeof s_string !== 'string'){
                    continue;
                }
    
                var s_src = s_string;
                s_src = s_src.trim();
    
                if( s_src.length === 0 ){
                    s_hex_result = "000000000000000000000000000000";//15 byets 
                    continue;
                }
    
                var b_error = false;
    
                var s_token = "";
                var array_s_open_close = [];
                var array_s_token = [];
                var s_char = "";
    
                do{
                    s_char = s_src.slice(0,1);
                    s_src = s_src.substring(1);
                    s_src = s_src.trim();//remove space
    
                    do{
                        if( s_char === "[" ){
                            if( array_s_open_close.length % 2 === 0 ){
                                s_token = "";
                                array_s_open_close.push(s_char);
                                continue;
                            }
                            s_token = s_token + s_char;//add '['
                            continue;
                        }
                        if( array_s_open_close.length % 2 != 1 ){
                            b_error = true;
                            continue;
                        }
                        if( array_s_open_close[array_s_open_close.length-1] !== "["){
                            b_error = true;
                            continue;
                        }
                        if( s_char === "]" ){
                            if( s_src.length === 0 ){
                                array_s_open_close.push(s_char);
                                array_s_token.push(s_token);
                                continue;
                            }
                            if( s_src.slice(0,1)==="["){
                                array_s_open_close.push(s_char);
                                array_s_token.push(s_token);
                                continue;
                            }
                        }
                        //
                        s_token = s_token + s_char;
                    }while(false);
    
                    if( b_error ){
                        break;//exit while
                    }
                }while(s_src.length > 0);
    
                if( b_error === true ){
                    continue;
                }
                // array_s_token have item that is removed spaces. and seperated '[ ]'
    
                if( array_s_token.length === 0 ){
                    continue;
                }
                if(array_s_token.length %2 !== 0 ){
                    continue;
                }
    
                var array_s_mod = [];
                var array_s_key = [];
                
                for( var i = 0; i<array_s_token.length; i++ ){
                    if( i%2 === 0 ){
                        array_s_mod.push(array_s_token[i]);
                    }
                    else{
                        array_s_key.push(array_s_token[i]);
                    }
                    if( array_s_token[i] !== "00" && array_s_token[i].length > 0 ){
                        b_all_zero = false;
                    }
                }//end for
                //
                var s_hid_modifier_code_hex = null;
                var s_hid_key_code_hex = null;

                s_hex_result = "";
                for( var i = 0; i<array_s_mod.length; i++ ){
                    s_hid_modifier_code_hex = _get_hid_modifier_code_hex_string_by_key_symbol(array_s_mod[i]);
                    if( s_hid_modifier_code_hex === null ){
                        b_error = true;
                        break;//exit for
                    }
                    s_hid_key_code_hex = _get_hid_key_code_hex_string_by_key_symbol(array_s_key[i]);
                    if( s_hid_key_code_hex === null ){
                        b_error = true;
                        break;//exit for
                    }
                    s_hex_result += s_hid_modifier_code_hex;
                    s_hex_result += s_hid_key_code_hex;                    
                }//end for
    
                if( b_error ){
                    s_hex_result = null;
                }
    
                var s_len = array_s_token.length.toString(16);
                if( s_len.length %2 !== 0 ){
                    s_len = "0" + s_len;
                }
                if( b_all_zero ){
                    s_hex_result = "000000000000000000000000000000";//15 bytes
                }
                else{
                    s_hex_result = s_len + s_hex_result;
                }

            }while(false);
            
            return s_hex_result;
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
    
        /**
         * @private
         * @function _get_parity_type_from_string
         * @param {string} s_string - "odd"or "even"
         * @returns {number} 0 - even parity.
         * <br /> 1 - odd parity.
         * <br /> negative value is error.
         */
		function _get_parity_type_from_string(s_string){
			var n_value = -1;

			do {
				if (typeof s_string !== 'string'){
                    continue;
                }
                if( s_string === "even"){
                    n_value = _type_parity.parity_even;
                    continue;
                }
                if( s_string === "odd"){
                    n_value = _type_parity.parity_odd;
                    continue;
                }
 			} while (false);
			return n_value;
        }
        
        /**
         * @private
         * @function _get_error_correct_type_from_string
         * @param {string} s_string - "lrc", "invlrc" or "crc"
         * @returns {number} 0 - LRC.
         * <br /> 1 - inversion LRC.
         * <br /> 2 - CRC.
         * <br /> negative value is error.
         */
		function _get_error_correct_type_from_string(s_string){
			var n_value = -1;

			do {
				if (typeof s_string !== 'string'){
                    continue;
                }
                if( s_string === "lrc"){
                    n_value = _type_error_correct.error_correct_lrc;
                    continue;
                }
                if( s_string === "invlrc"){
                    n_value = _type_error_correct.error_correct_inv_lrc;
                    continue;
                }
                if( s_string === "crc"){
                    n_value = _type_error_correct.error_correct_crc;
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
         * @function _generate_get_indicate_error_condition
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_indicate_error_condition(queue_s_tx){
            var n_offset = _type_system_offset.SYS_OFFSET_INDICATE_ERROR_CONDITION;
            var n_size = _type_system_size.SYS_SIZE_INDICATE_ERROR_CONDITION;
            return _generate_config_get(queue_s_tx,n_offset,n_size);
        }

        /**
         * @private
         * @function _generate_get_ignore_iso1
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_ignore_iso1(queue_s_tx){
            var n_offset = _type_system_offset.SYS_OFFSET_IGNORE_ISO1;
            var n_size = _type_system_size.SYS_SIZE_IGNORE_ISO1;
            return _generate_config_get(queue_s_tx,n_offset,n_size);
        }

        /**
         * @private
         * @function _generate_get_ignore_iso3
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_ignore_iso3(queue_s_tx){
            var n_offset = _type_system_offset.SYS_OFFSET_IGNORE_ISO3;
            var n_size = _type_system_size.SYS_SIZE_IGNORE_ISO3;
            return _generate_config_get(queue_s_tx,n_offset,n_size);
        }

        /**
         * @private
         * @function _generate_get_remove_colon
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_remove_colon(queue_s_tx){
            var n_offset = _type_system_offset. SYS_OFFSET_REMOVE_COLON;
            var n_size = _type_system_size. SYS_SIZE_REMOVE_COLON;
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
         * @param {number} n_track track index 0~2
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
         * @param {number} n_track track index 0~2
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
         * @function _generate_get_number_combi
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @param {number} n_track track index 0~2
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_number_combi(queue_s_tx,n_track){
            var b_result = false;
            var n_offset = 0;
            var n_size = 0;

            switch(n_track){
                case 0:
                    n_offset = _type_system_offset.SYS_OFFSET_COMBINATION[n_track];
                    n_size = _type_system_size.SYS_SIZE_COMBINATION[n_track];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 1:
                    n_offset = _type_system_offset.SYS_OFFSET_COMBINATION[n_track];
                    n_size = _type_system_size.SYS_SIZE_COMBINATION[n_track];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 2:
                    n_offset = _type_system_offset.SYS_OFFSET_COMBINATION[n_track];
                    n_size = _type_system_size.SYS_SIZE_COMBINATION[n_track];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                default:
                    break;
            }//end switch
            return b_result;      
        }

        /**
         * @private
         * @function _generate_get_max_size
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @param {number} n_track track index 0~2
         * @param {number} n_combi combination index 0~2
         * @return {boolean} true(success) or false(failure).
        */
       function _generate_get_max_size(queue_s_tx,n_track,n_combi){
            var b_result = false;
            if(n_combi>2 || n_combi<0 ){
                return b_result;
            }
            var n_offset = 0;
            var n_size = 0;

            switch(n_track){
                case 0:
                    n_offset = _type_system_offset.SYS_OFFSET_MAX_SIZE[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_MAX_SIZE[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 1:
                    n_offset = _type_system_offset.SYS_OFFSET_MAX_SIZE[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_MAX_SIZE[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 2:
                    n_offset = _type_system_offset.SYS_OFFSET_MAX_SIZE[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_MAX_SIZE[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                default:
                    break;
            }//end switch
            return b_result;      
        }      
        
        /**
         * @private
         * @function _generate_get_bit_size
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @param {number} n_track track index 0~2
         * @param {number} n_combi combination index 0~2
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_bit_size(queue_s_tx,n_track,n_combi){
            var b_result = false;
            if(n_combi>2 || n_combi<0 ){
                return b_result;
            }
            var n_offset = 0;
            var n_size = 0;

            switch(n_track){
                case 0:
                    n_offset = _type_system_offset.SYS_OFFSET_BIT_SIZE[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_BIT_SIZE[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 1:
                    n_offset = _type_system_offset.SYS_OFFSET_BIT_SIZE[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_BIT_SIZE[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 2:
                    n_offset = _type_system_offset.SYS_OFFSET_BIT_SIZE[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_BIT_SIZE[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                default:
                    break;
            }//end switch
            return b_result;      
        }   
        
        /**
         * @private
         * @function _generate_get_data_mask
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @param {number} n_track track index 0~2
         * @param {number} n_combi combination index 0~2
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_data_mask(queue_s_tx,n_track,n_combi){
            var b_result = false;
            if(n_combi>2 || n_combi<0 ){
                return b_result;
            }
            var n_offset = 0;
            var n_size = 0;

            switch(n_track){
                case 0:
                    n_offset = _type_system_offset.SYS_OFFSET_DATA_MASK[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_DATA_MASK[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 1:
                    n_offset = _type_system_offset.SYS_OFFSET_DATA_MASK[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_DATA_MASK[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 2:
                    n_offset = _type_system_offset.SYS_OFFSET_DATA_MASK[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_DATA_MASK[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                default:
                    break;
            }//end switch
            return b_result;      
        }   

        /**
         * @private
         * @function _generate_get_use_parity
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @param {number} n_track track index 0~2
         * @param {number} n_combi combination index 0~2
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_use_parity(queue_s_tx,n_track,n_combi){
            var b_result = false;
            if(n_combi>2 || n_combi<0 ){
                return b_result;
            }
            var n_offset = 0;
            var n_size = 0;

            switch(n_track){
                case 0:
                    n_offset = _type_system_offset.SYS_OFFSET_USE_PARITY[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_USE_PARITY[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 1:
                    n_offset = _type_system_offset.SYS_OFFSET_USE_PARITY[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_USE_PARITY[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 2:
                    n_offset = _type_system_offset.SYS_OFFSET_USE_PARITY[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_USE_PARITY[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                default:
                    break;
            }//end switch
            return b_result;      
        }   

        /**
         * @private
         * @function _generate_get_parity_type
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @param {number} n_track track index 0~2
         * @param {number} n_combi combination index 0~2
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_parity_type(queue_s_tx,n_track,n_combi){
            var b_result = false;
            if(n_combi>2 || n_combi<0 ){
                return b_result;
            }
            var n_offset = 0;
            var n_size = 0;

            switch(n_track){
                case 0:
                    n_offset = _type_system_offset.SYS_OFFSET_PARITY_TYPE[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_PARITY_TYPE[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 1:
                    n_offset = _type_system_offset.SYS_OFFSET_PARITY_TYPE[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_PARITY_TYPE[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 2:
                    n_offset = _type_system_offset.SYS_OFFSET_PARITY_TYPE[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_PARITY_TYPE[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                default:
                    break;
            }//end switch
            return b_result;      
        }   
    
        /**
         * @private
         * @function _generate_get_stxl
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @param {number} n_track track index 0~2
         * @param {number} n_combi combination index 0~2
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_stxl(queue_s_tx,n_track,n_combi){
            var b_result = false;
            if(n_combi>2 || n_combi<0 ){
                return b_result;
            }
            var n_offset = 0;
            var n_size = 0;

            switch(n_track){
                case 0:
                    n_offset = _type_system_offset.SYS_OFFSET_STXL[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_STXL[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 1:
                    n_offset = _type_system_offset.SYS_OFFSET_STXL[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_STXL[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 2:
                    n_offset = _type_system_offset.SYS_OFFSET_STXL[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_STXL[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                default:
                    break;
            }//end switch
            return b_result;      
        }   

        /**
         * @private
         * @function _generate_get_etxl
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @param {number} n_track track index 0~2
         * @param {number} n_combi combination index 0~2
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_etxl(queue_s_tx,n_track,n_combi){
            var b_result = false;
            if(n_combi>2 || n_combi<0 ){
                return b_result;
            }
            var n_offset = 0;
            var n_size = 0;

            switch(n_track){
                case 0:
                    n_offset = _type_system_offset.SYS_OFFSET_ETXL[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_ETXL[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 1:
                    n_offset = _type_system_offset.SYS_OFFSET_ETXL[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_ETXL[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 2:
                    n_offset = _type_system_offset.SYS_OFFSET_ETXL[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_ETXL[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                default:
                    break;
            }//end switch
            return b_result;      
        }   

        /**
         * @private
         * @function _generate_get_use_error_correct
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @param {number} n_track track index 0~2
         * @param {number} n_combi combination index 0~2
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_use_error_correct(queue_s_tx,n_track,n_combi){
            var b_result = false;
            if(n_combi>2 || n_combi<0 ){
                return b_result;
            }
            var n_offset = 0;
            var n_size = 0;

            switch(n_track){
                case 0:
                    n_offset = _type_system_offset.SYS_OFFSET_USE_ERROR_CORRECT[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_USE_ERROR_CORRECT[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 1:
                    n_offset = _type_system_offset.SYS_OFFSET_USE_ERROR_CORRECT[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_USE_ERROR_CORRECT[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 2:
                    n_offset = _type_system_offset.SYS_OFFSET_USE_ERROR_CORRECT[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_USE_ERROR_CORRECT[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                default:
                    break;
            }//end switch
            return b_result;      
        }   

        /**
         * @private
         * @function _generate_get_ecm_type
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @param {number} n_track track index 0~2
         * @param {number} n_combi combination index 0~2
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_ecm_type(queue_s_tx,n_track,n_combi){
            var b_result = false;
            if(n_combi>2 || n_combi<0 ){
                return b_result;
            }
            var n_offset = 0;
            var n_size = 0;

            switch(n_track){
                case 0:
                    n_offset = _type_system_offset.SYS_OFFSET_ECM_TYPE[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_ECM_TYPE[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 1:
                    n_offset = _type_system_offset.SYS_OFFSET_ECM_TYPE[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_ECM_TYPE[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 2:
                    n_offset = _type_system_offset.SYS_OFFSET_ECM_TYPE[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_ECM_TYPE[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                default:
                    break;
            }//end switch
            return b_result;      
        }   

        /**
         * @private
         * @function _generate_get_add_value
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @param {number} n_track track index 0~2
         * @param {number} n_combi combination index 0~2
         * @return {boolean} true(success) or false(failure).
        */
        function _generate_get_add_value(queue_s_tx,n_track,n_combi){
            var b_result = false;
            if(n_combi>2 || n_combi<0 ){
                return b_result;
            }
            var n_offset = 0;
            var n_size = 0;

            switch(n_track){
                case 0:
                    n_offset = _type_system_offset.SYS_OFFSET_ADD_VALUE[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_ADD_VALUE[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 1:
                    n_offset = _type_system_offset.SYS_OFFSET_ADD_VALUE[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_ADD_VALUE[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 2:
                    n_offset = _type_system_offset.SYS_OFFSET_ADD_VALUE[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_ADD_VALUE[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                default:
                    break;
            }//end switch
            return b_result;      
        }   
    
        /**
         * @private
         * @function _generate_get_private_prefix
         * @param {string[]} queue_s_tx generated request will be saved in this queue( array type ).
         * @param {number} n_track track index 0~2
         * @param {number} n_combi combination index 0~2
         * @return {boolean} true(success) or false(failure).
        */        
        function _generate_get_private_prefix(queue_s_tx,n_track,n_combi){
            var b_result = false;
            var n_offset = 0;
            var n_size = 0;

            switch(n_track){
                case 0:
                    n_offset = _type_system_offset.SYS_OFFSET_P_PRE[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_P_PRE[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 1:
                    n_offset = _type_system_offset.SYS_OFFSET_P_PRE[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_P_PRE[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 2:
                    n_offset = _type_system_offset.SYS_OFFSET_P_PRE[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_P_PRE[n_track][n_combi];
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
         * @param {number} n_track track index 0~2
         * @param {number} n_combi combination index 0~2
         * @return {boolean} true(success) or false(failure).
        */        
        function _generate_get_private_postfix(queue_s_tx,n_track,n_combi){
            var b_result = false;
            var n_offset = 0;
            var n_size = 0;

            switch(n_track){
                case 0:
                    n_offset = _type_system_offset.SYS_OFFSET_P_POST[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_P_POST[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 1:
                    n_offset = _type_system_offset.SYS_OFFSET_P_POST[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_P_POST[n_track][n_combi];
                    b_result = _generate_config_get(queue_s_tx,n_offset,n_size);
                    break;
                case 2:
                    n_offset = _type_system_offset.SYS_OFFSET_P_POST[n_track][n_combi];
                    n_size = _type_system_size.SYS_SIZE_P_POST[n_track][n_combi];
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
         * @function _generate_set_indicate_error_condition
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number[]} cblank 4 int array.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_indicate_error_condition(queue_s_tx,cblank){
            var n_offset = _type_system_offset.SYS_OFFSET_INDICATE_ERROR_CONDITION;
            var n_size = _type_system_size.SYS_SIZE_INDICATE_ERROR_CONDITION;
            var s_data = "";

            for( var i = 0; i<4; i++ ){
                s_data = s_data + elpusk.util.get_byte_hex_string_from_number(cblank[i]);
            }//end for

            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_ignore_iso1
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number[]} cblank 4 int array.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_ignore_iso1(queue_s_tx,cblank){
            return _generate_set_indicate_error_condition(queue_s_tx,cblank);
        }

        /**
         * @private
         * @function _generate_set_ignore_iso3
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number[]} cblank 4 int array.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_ignore_iso3(queue_s_tx,cblank){
            return _generate_set_indicate_error_condition(queue_s_tx,cblank);
        }

        /**
         * @private
         * @function _generate_set_remove_colon
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number[]} cblank 4 int array.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_remove_colon(queue_s_tx,cblank){
            return _generate_set_indicate_error_condition(queue_s_tx,cblank);
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
        //
        /**
         * @private
         * @function _generate_set_number_combi
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi_number the number of combination( 1~3 )
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_number_combi(queue_s_tx,n_track,n_combi_number){
            var n_offset = _type_system_offset.SYS_OFFSET_COMBINATION[n_track];
            var n_size = _type_system_size.SYS_SIZE_COMBINATION[n_track];
            var s_data = elpusk.util.get_byte_hex_string_from_number(n_combi_number);
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_max_size
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination( 0~2 )
         * @param {number} n_max_size the maximum data size.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_max_size(queue_s_tx,n_track,n_combi,n_max_size){
            var n_offset = _type_system_offset.SYS_OFFSET_MAX_SIZE[n_track][n_combi];
            var n_size = _type_system_size.SYS_SIZE_MAX_SIZE[n_track][n_combi];
            var s_data = elpusk.util.get_byte_hex_string_from_number(n_max_size);
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_bit_size
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination( 0~2 )
         * @param {number} n_bit_size the bit size of one data.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_bit_size(queue_s_tx,n_track,n_combi,n_bit_size){
            var n_offset = _type_system_offset.SYS_OFFSET_BIT_SIZE[n_track][n_combi];
            var n_size = _type_system_size.SYS_SIZE_BIT_SIZE[n_track][n_combi];
            var s_data = elpusk.util.get_byte_hex_string_from_number(n_bit_size);
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_data_mask
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination( 0~2 )
         * @param {number} c_data_mask the mask pattern of one data.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_data_mask(queue_s_tx,n_track,n_combi,c_data_mask){
            var n_offset = _type_system_offset.SYS_OFFSET_DATA_MASK[n_track][n_combi];
            var n_size = _type_system_size.SYS_SIZE_DATA_MASK[n_track][n_combi];
            var s_data = elpusk.util.get_byte_hex_string_from_number(c_data_mask);
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_use_parity
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination( 0~2 )
         * @param {boolean} b_enable whether or not use parity.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_use_parity(queue_s_tx,n_track,n_combi,b_enable){
            var n_offset = _type_system_offset.SYS_OFFSET_USE_PARITY[n_track][n_combi];
            var n_size = _type_system_size.SYS_SIZE_USE_PARITY[n_track][n_combi];
            var s_data = "00";
            if(b_enable){
                s_data = elpusk.util.get_byte_hex_string_from_number(1);
            }
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        
        /**
         * @private
         * @function _generate_set_parity_type
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination( 0~2 )
         * @param {number} n_parity_type parity type(0~1)
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_parity_type(queue_s_tx,n_track,n_combi,n_parity_type){
            var n_offset = _type_system_offset.SYS_OFFSET_PARITY_TYPE[n_track][n_combi];
            var n_size = _type_system_size.SYS_SIZE_PARITY_TYPE[n_track][n_combi];
            var s_data = elpusk.util.get_byte_hex_string_from_number(n_parity_type);
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_stxl
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination( 0~2 )
         * @param {number} c_stxl start sentinel pattern.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_stxl(queue_s_tx,n_track,n_combi,c_stxl){
            var n_offset = _type_system_offset.SYS_OFFSET_STXL[n_track][n_combi];
            var n_size = _type_system_size.SYS_SIZE_STXL[n_track][n_combi];
            var s_data = elpusk.util.get_byte_hex_string_from_number(c_stxl);
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        
        /**
         * @private
         * @function _generate_set_etxl
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination( 0~2 )
         * @param {number} c_etxl end sentinel pattern.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_etxl(queue_s_tx,n_track,n_combi,c_etxl){
            var n_offset = _type_system_offset.SYS_OFFSET_ETXL[n_track][n_combi];
            var n_size = _type_system_size.SYS_SIZE_ETXL[n_track][n_combi];
            var s_data = elpusk.util.get_byte_hex_string_from_number(c_etxl);
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_use_error_correct
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination( 0~2 )
         * @param {boolean} b_enable whether or not error correction.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_use_error_correct(queue_s_tx,n_track,n_combi,b_enable){
            var n_offset = _type_system_offset.SYS_OFFSET_USE_ERROR_CORRECT[n_track][n_combi];
            var n_size = _type_system_size.SYS_SIZE_USE_ERROR_CORRECT[n_track][n_combi];
            var s_data = "00";
            if(b_enable){
                s_data = elpusk.util.get_byte_hex_string_from_number(1);
            }
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_ecm_type
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination( 0~2 )
         * @param {number} n_ecm_type error correction type
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_ecm_type(queue_s_tx,n_track,n_combi,n_ecm_type){
            var n_offset = _type_system_offset.SYS_OFFSET_ECM_TYPE[n_track][n_combi];
            var n_size = _type_system_size.SYS_SIZE_ECM_TYPE[n_track][n_combi];
            var s_data = elpusk.util.get_byte_hex_string_from_number(n_ecm_type);
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_add_value
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination( 0~2 )
         * @param {number} c_add for converting ASCII code,  added value to each data.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_add_value(queue_s_tx,n_track,n_combi,c_add){
            var n_offset = _type_system_offset.SYS_OFFSET_ADD_VALUE[n_track][n_combi];
            var n_size = _type_system_size.SYS_SIZE_ADD_VALUE[n_track][n_combi];
            var s_data = elpusk.util.get_byte_hex_string_from_number(c_add);
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_data);
        }

        /**
         * @private
         * @function _generate_set_private_prefix
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination( 0~2 )
         * @param {string} s_tag setting data.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_private_prefix(queue_s_tx,n_track,n_combi,s_tag){
            var n_offset = _type_system_offset.SYS_OFFSET_P_PRE[n_track][n_combi];
            var n_size = _type_system_size.SYS_SIZE_P_PRE[n_track][n_combi];
            return _generate_config_set(queue_s_tx,n_offset,n_size,s_tag);
        }

        /**
         * @private
         * @function _generate_set_private_postfix
         * @param {string[]} queue_s_tx  generated request will be saved in this queue( array type ).
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination( 0~2 )
         * @param {string} s_tag setting data.
         * @returns {boolean} true(success) or false(failure).
         */        
        function _generate_set_private_postfix(queue_s_tx,n_track,n_combi,s_tag){
            var n_offset = _type_system_offset.SYS_OFFSET_P_POST[n_track][n_combi];
            var n_size = _type_system_size.SYS_SIZE_P_POST[n_track][n_combi];
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
         * @private
         * @function _get_tag_by_symbol
         * @param {number} n_language language index number 0~10. type is _type_keyboard_language_index.
         * @param {string} s_len_tag_hex this string is received from device by hex string format.
         * @returns {string | null} string format of symbol of tag.
         * <br /> error return null.
         */
        function _get_tag_by_symbol(n_language,s_len_tag_hex){
            var s_symbols = null;

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

                s_symbols = "";

                var s_one_byte = "";
                var n_len = 0;
                var n_tag = [];

                //change hex string -> byte array.
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
                        s_symbols = s_symbols
                        + String.fromCharCode(n_tag[i+1]);
                        continue;
                    }
                    //hid keyboard code.
                    s_symbols = s_symbols 
                    + "[" + _get_key_symbol_string_by_hid_modifier_code_number(n_tag[i]) + "]"
                    + "[" + _get_key_symbol_string_by_hid_key_code_number(n_tag[i+1]) + "]"
                }//end for i

            }while(false);
            return s_symbols;
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

            this._b_config_mode = false;
            this._b_opos_mode = false;
            
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
    
            this._n_number_combination = [1,1,1];
            this._n_max_size = [[0,0,0],[0,0,0],[0,0,0]];
            this._n_bit_size = [[0,0,0],[0,0,0],[0,0,0]];
            this._c_data_mask = [[0,0,0],[0,0,0],[0,0,0]];
            this._b_use_parity = [[true,true,true],[true,true,true],[true,true,true]];
            this._n_parity_type = [[0,0,0],[0,0,0],[0,0,0]];
            this._c_stxl = [[0,0,0],[0,0,0],[0,0,0]];
            this._c_etxl = [[0,0,0],[0,0,0],[0,0,0]];
            this._b_use_ecm = [[true,true,true],[true,true,true],[true,true,true]];
            this._n_ecm_type = [[0,0,0],[0,0,0],[0,0,0]];
            this._n_add_value = [[0,0,0],[0,0,0],[0,0,0]];

            this._s_private_prefix = [[null,null,null],[null,null,null],[null,null,null]];//you must include the length in front of this each array.
            this._s_private_postfix = [[null,null,null],[null,null,null],[null,null,null]];//you must include the length in front of this each array.
    
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
            
            // reading operation
            this._array_s_card_data = ["","",""];//iso123 card data ascii code string.
            this._array_n_card_error_code = [0,0,0];//iso123 rtrack error code. 0 is none zeeor
        };

        _elpusk.device.usb.hid.lpu237.prototype = Object.create(elpusk.device.usb.hid.prototype);
        _elpusk.device.usb.hid.lpu237.prototype.constructor = _elpusk.device.usb.hid.lpu237;

        /////////////////////////////////////////////////////////////////////
        // getter
        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.is_config_mode
         * @returns {boolean} true - the currrent device is config mode.
         * <br /> false - the currrent device is none config mode..
         */
        _elpusk.device.usb.hid.lpu237.prototype.is_config_mode = function(){
            return  this._b_config_mode;
        }
        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.is_opos_mode
         * @returns {boolean} true - the currrent device is opos mode.( a card data is sent by vendor-defined HID interface )
         * <br /> false - the currrent device is none opos mode.
         */
        _elpusk.device.usb.hid.lpu237.prototype.is_opos_mode = function(){
            return  this._b_opos_mode;
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_msr_data
         * @param {number} n_track iso track number 0~2.
         * @returns {null|string} card data.
         * <br /> null - error.
         */
        _elpusk.device.usb.hid.lpu237.prototype.get_msr_data = function(n_track){
            var s_data = null;

            do{
                if( typeof n_track !== 'number'){
                    continue;
                }
                if( n_track < 0 ){
                    continue;
                }
                if( n_track >= _const_the_number_of_track ){
                    continue;
                }
                if(this._array_n_card_error_code[n_track] !== 0 ){
                    continue;//track has error.
                }
                //
                s_data = "";
                s_data = this._array_s_card_data[n_track];
            }while(false);
            return s_data;
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_msr_error_code
         * @param {number} n_track iso track number 0~2.
         * @returns {number|null} error code, 0 - none error.
         * <br /> null - abused function.
         */
        _elpusk.device.usb.hid.lpu237.prototype.get_msr_error_code = function(n_track){
            var n_data = null;

            do{
                if( typeof n_track !== 'number'){
                    continue;
                }
                if( n_track < 0 ){
                    continue;
                }
                if( n_track >= _const_the_number_of_track ){
                    continue;
                }
                n_data = this._array_n_card_error_code[n_track];
            }while(false);
            return n_data;
        }

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
         * @function elpusk.device.usb.hid.lpu237.get_indicate_success_when_any_not_error
         * @returns {boolean} true - indicate success when a track don't have error.
         * <br /> false - indicate success when all track don't have error.
         */
		_elpusk.device.usb.hid.lpu237.prototype.get_indicate_success_when_any_not_error = function(){
            if( this._c_blank[1] & 0x01 ){
                return true;
            }
            else{
                return false;
            }
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_ignore_iso1
         * @returns {boolean} true - If 1 & 2 track data is equal, send 2 track data only.
         * <br /> false - else
         */
		_elpusk.device.usb.hid.lpu237.prototype.get_ignore_iso1 = function(){
            if( this._c_blank[1] & 0x02 ){
                return true;
            }
            else{
                return false;
            }
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_ignore_iso3
         * @returns {boolean} true - If 2 & 3 track data is equal, send 2 track data only.
         * <br /> false - else
         */
		_elpusk.device.usb.hid.lpu237.prototype.get_ignore_iso3 = function(){
            if( this._c_blank[1] & 0x04 ){
                return true;
            }
            else{
                return false;
            }
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_remove_colon
         * @returns {boolean} true - If a track ETXL is 0xe0 and the first data is ASCII ':', then track's ':' isn't sent.
         * <br /> false - else
         */
		_elpusk.device.usb.hid.lpu237.prototype.get_remove_colon = function(){
            if( this._c_blank[1] & 0x08 ){
                return true;
            }
            else{
                return false;
            }
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
         * @function elpusk.device.usb.hid.lpu237.get_number_combination
         * @param {number} n_track msr track number 0~2
         * @returns {number} the number of combination.
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_number_combination = function (n_track){ 
            var n_combi_number = 0;
            do{
                if( typeof n_track !== 'number'){
                    continue;
                }
                if( !Array.isArray(this._n_number_combination ) ){
                    continue;
                }
                if(this._n_number_combination.length !== _const_the_number_of_track ){
                    continue;
                }

                n_combi_number = this._n_number_combination [n_track];
            }while(false);
            return n_combi_number;
		}

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_max_size
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination. 0~2
         * @returns {number} the maximum data size at a combination of a track.
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_max_size = function (n_track,n_combi){ 
            var n_data = 0;
            do{
                if( typeof n_track !== 'number'){
                    continue;
                }
                if( !Array.isArray(this._n_max_size ) ){
                    continue;
                }
                if(this._n_max_size.length !== _const_the_number_of_track ){
                    continue;
                }

                n_data = this._n_max_size [n_track][n_combi];
            }while(false);
            return n_data;
		}

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_bit_size
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination. 0~2
         * @returns {number} the bit size at one data.
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_bit_size = function (n_track,n_combi){ 
            var n_data = 0;
            do{
                if( typeof n_track !== 'number'){
                    continue;
                }
                if( !Array.isArray(this._n_bit_size ) ){
                    continue;
                }
                if(this._n_bit_size.length !== _const_the_number_of_track ){
                    continue;
                }

                n_data = this._n_bit_size [n_track][n_combi];
            }while(false);
            return n_data;
		}

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_data_mask
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination. 0~2
         * @returns {number} the mask pattern at one data.
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_data_mask = function (n_track,n_combi){ 
            var n_data = 0;
            do{
                if( typeof n_track !== 'number'){
                    continue;
                }
                if( !Array.isArray(this._c_data_mask ) ){
                    continue;
                }
                if(this._c_data_mask.length !== _const_the_number_of_track ){
                    continue;
                }

                n_data = this._c_data_mask [n_track][n_combi];
            }while(false);
            return n_data;
		}

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_use_parity
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination. 0~2
         * @returns {boolean} true - use parity
         * <br /> false - don't use parity.
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_use_parity = function (n_track,n_combi){ 
            var b_data = false;
            do{
                if( typeof n_track !== 'number'){
                    continue;
                }
                if( !Array.isArray(this._b_use_parity ) ){
                    continue;
                }
                if(this._b_use_parity.length !== _const_the_number_of_track ){
                    continue;
                }

                b_data = this._b_use_parity [n_track][n_combi];
            }while(false);
            return b_data;
		}

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_parity_type
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination. 0~2
         * @returns {number} parity type 0 - even, 1- odd.
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_parity_type = function (n_track,n_combi){ 
            var n_data = 0;
            do{
                if( typeof n_track !== 'number'){
                    continue;
                }
                if( !Array.isArray(this._n_parity_type ) ){
                    continue;
                }
                if(this._n_parity_type.length !== _const_the_number_of_track ){
                    continue;
                }

                n_data = this._n_parity_type [n_track][n_combi];
            }while(false);
            return n_data;
		}

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_stxl
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination. 0~2
         * @returns {number} start sentinel pattern. left arrangement.
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_stxl = function (n_track,n_combi){ 
            var n_data = 0;
            do{
                if( typeof n_track !== 'number'){
                    continue;
                }
                if( !Array.isArray(this._c_stxl ) ){
                    continue;
                }
                if(this._c_stxl.length !== _const_the_number_of_track ){
                    continue;
                }

                n_data = this._c_stxl [n_track][n_combi];
            }while(false);
            return n_data;
		}

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_etxl
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination. 0~2
         * @returns {number} end sentinel pattern. left arrangement.
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_etxl = function (n_track,n_combi){ 
            var n_data = 0;
            do{
                if( typeof n_track !== 'number'){
                    continue;
                }
                if( !Array.isArray(this._c_etxl ) ){
                    continue;
                }
                if(this._c_etxl.length !== _const_the_number_of_track ){
                    continue;
                }

                n_data = this._c_etxl [n_track][n_combi];
            }while(false);
            return n_data;
		}

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_use_ecm
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination. 0~2
         * @returns {boolean} true - use error correction
         * <br /> false - don't use error correction.
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_use_ecm = function (n_track,n_combi){ 
            var b_data = false;
            do{
                if( typeof n_track !== 'number'){
                    continue;
                }
                if( !Array.isArray(this._b_use_ecm ) ){
                    continue;
                }
                if(this._b_use_ecm.length !== _const_the_number_of_track ){
                    continue;
                }

                b_data = this._b_use_ecm [n_track][n_combi];
            }while(false);
            return b_data;
		}

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_ecm_type
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination. 0~2
         * @returns {number} error correction type 0-LRC, 1-inversion LRC, 2-CRC
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_ecm_type = function (n_track,n_combi){ 
            var n_data = 0;
            do{
                if( typeof n_track !== 'number'){
                    continue;
                }
                if( !Array.isArray(this._n_ecm_type ) ){
                    continue;
                }
                if(this._n_ecm_type.length !== _const_the_number_of_track ){
                    continue;
                }

                n_data = this._n_ecm_type [n_track][n_combi];
            }while(false);
            return n_data;
		}

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_add_value
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination. 0~2
         * @returns {number} added value that convert to ASCII code.
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_add_value = function (n_track,n_combi){ 
            var n_data = 0;
            do{
                if( typeof n_track !== 'number'){
                    continue;
                }
                if( !Array.isArray(this._n_add_value ) ){
                    continue;
                }
                if(this._n_add_value.length !== _const_the_number_of_track ){
                    continue;
                }

                n_data = this._n_add_value [n_track][n_combi];
            }while(false);
            return n_data;
		}

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_private_prefix
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination. 0~2
         * @returns {string} hex string or null
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_private_prefix = function(n_track,n_combi){
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
                s_value = this._s_private_prefix[n_track][n_combi];
            }while(false);
            return s_value; 
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_private_postfix
         * @param {number} n_track msr track number 0~2
         * @param {number} n_combi the index of combination. 0~2
         * @returns {string} hex string or null
         */        
		_elpusk.device.usb.hid.lpu237.prototype.get_private_postfix = function(n_track,n_combi){ 
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
                s_value = this._s_private_postfix[n_track][n_combi];
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
                if( n_type < _type_generated_tx_type.gt_read_uid ){//minmum
                    continue;
                }
                if( n_type > _type_generated_tx_type.gt_set_remove_colon ){//max
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
                    case _type_generated_tx_type.gt_get_indicate_error_condition:
                        s_description = "get indication error condition."; break;
                    case _type_generated_tx_type.gt_get_ignore_iso1:
                        s_description = "get_ignore_iso1."; break;
                    case _type_generated_tx_type.gt_get_ignore_iso3:
                        s_description = "get_ignore_iso3."; break;
                    case _type_generated_tx_type.gt_get_remove_colon:
                        s_description = "get_remove_colon."; break;
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
                    //
                    case _type_generated_tx_type.gt_get_iso1_number_combi:
                        s_description = "get_iso1_number_combi"; break;
                    case _type_generated_tx_type.gt_get_iso2_number_combi:
                        s_description = "get_iso2_number_combi"; break;
                    case _type_generated_tx_type.gt_get_iso3_number_combi:
                        s_description = "get_iso3_number_combi"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi0_MaxSize:
                         s_description = "get_iso1_Combi0_MaxSize"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi1_MaxSize :
                         s_description = "get_iso1_Combi1_MaxSize"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi2_MaxSize :
                         s_description = "get_iso1_Combi2_MaxSize"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi0_MaxSize :
                         s_description = "get_iso2_Combi0_MaxSize"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi1_MaxSize :
                         s_description = "get_iso2_Combi1_MaxSize"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi2_MaxSize :
                         s_description = "get_iso2_Combi2_MaxSize"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi0_MaxSize :
                         s_description = "get_iso3_Combi0_MaxSize"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi1_MaxSize :
                         s_description = "get_iso3_Combi1_MaxSize"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi2_MaxSize :
                         s_description = "get_iso3_Combi2_MaxSize"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi0_BitSize :
                         s_description = "get_iso1_Combi0_BitSize"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi1_BitSize :
                         s_description = "get_iso1_Combi1_BitSize"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi2_BitSize :
                         s_description = "get_iso1_Combi2_BitSize"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi0_BitSize :
                         s_description = "get_iso2_Combi0_BitSize"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi1_BitSize :
                         s_description = "get_iso2_Combi1_BitSize"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi2_BitSize :
                         s_description = "get_iso2_Combi2_BitSize"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi0_BitSize :
                         s_description = "get_iso3_Combi0_BitSize"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi1_BitSize :
                         s_description = "get_iso3_Combi1_BitSize"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi2_BitSize :
                         s_description = "get_iso3_Combi2_BitSize"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi0_DataMask :
                         s_description = "get_iso1_Combi0_DataMask"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi1_DataMask :
                         s_description = "get_iso1_Combi1_DataMask"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi2_DataMask :
                         s_description = "get_iso1_Combi2_DataMask"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi0_DataMask :
                         s_description = "get_iso2_Combi0_DataMask"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi1_DataMask :
                         s_description = "get_iso2_Combi1_DataMask"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi2_DataMask :
                         s_description = "get_iso2_Combi2_DataMask"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi0_DataMask :
                         s_description = "get_iso3_Combi0_DataMask"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi1_DataMask :
                         s_description = "get_iso3_Combi1_DataMask"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi2_DataMask :
                         s_description = "get_iso3_Combi2_DataMask"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi0_UseParity :
                         s_description = "get_iso1_Combi0_UseParity"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi1_UseParity :
                         s_description = "get_iso1_Combi1_UseParity"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi2_UseParity :
                         s_description = "get_iso1_Combi2_UseParity"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi0_UseParity :
                         s_description = "get_iso2_Combi0_UseParity"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi1_UseParity :
                         s_description = "get_iso2_Combi1_UseParity"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi2_UseParity :
                         s_description = "get_iso2_Combi2_UseParity"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi0_UseParity :
                         s_description = "get_iso3_Combi0_UseParity"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi1_UseParity :
                         s_description = "get_iso3_Combi1_UseParity"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi2_UseParity :
                         s_description = "get_iso3_Combi2_UseParity"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi0_ParityType :
                         s_description = "get_iso1_Combi0_ParityType"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi1_ParityType :
                         s_description = "get_iso1_Combi1_ParityType"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi2_ParityType :
                         s_description = "get_iso1_Combi2_ParityType"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi0_ParityType :
                         s_description = "get_iso2_Combi0_ParityType"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi1_ParityType :
                         s_description = "get_iso2_Combi1_ParityType"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi2_ParityType :
                         s_description = "get_iso2_Combi2_ParityType"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi0_ParityType :
                         s_description = "get_iso3_Combi0_ParityType"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi1_ParityType :
                         s_description = "get_iso3_Combi1_ParityType"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi2_ParityType :
                         s_description = "get_iso3_Combi2_ParityType"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi0_STX_L :
                         s_description = "get_iso1_Combi0_STX_L"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi1_STX_L :
                         s_description = "get_iso1_Combi1_STX_L"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi2_STX_L :
                         s_description = "get_iso1_Combi2_STX_L"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi0_STX_L :
                         s_description = "get_iso2_Combi0_STX_L"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi1_STX_L :
                         s_description = "get_iso2_Combi1_STX_L"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi2_STX_L :
                         s_description = "get_iso2_Combi2_STX_L"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi0_STX_L :
                         s_description = "get_iso3_Combi0_STX_L"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi1_STX_L :
                         s_description = "get_iso3_Combi1_STX_L"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi2_STX_L :
                         s_description = "get_iso3_Combi2_STX_L"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi0_ETX_L :
                         s_description = "get_iso1_Combi0_ETX_L"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi1_ETX_L :
                         s_description = "get_iso1_Combi1_ETX_L"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi2_ETX_L :
                         s_description = "get_iso1_Combi2_ETX_L"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi0_ETX_L :
                         s_description = "get_iso2_Combi0_ETX_L"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi1_ETX_L :
                         s_description = "get_iso2_Combi1_ETX_L"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi2_ETX_L :
                         s_description = "get_iso2_Combi2_ETX_L"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi0_ETX_L :
                         s_description = "get_iso3_Combi0_ETX_L"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi1_ETX_L :
                         s_description = "get_iso3_Combi1_ETX_L"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi2_ETX_L :
                         s_description = "get_iso3_Combi2_ETX_L"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi0_UseErrorCorrect :
                         s_description = "get_iso1_Combi0_UseErrorCorrect"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi1_UseErrorCorrect :
                         s_description = "get_iso1_Combi1_UseErrorCorrect"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi2_UseErrorCorrect :
                         s_description = "get_iso1_Combi2_UseErrorCorrect"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi0_UseErrorCorrect :
                         s_description = "get_iso2_Combi0_UseErrorCorrect"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi1_UseErrorCorrect :
                         s_description = "get_iso2_Combi1_UseErrorCorrect"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi2_UseErrorCorrect :
                         s_description = "get_iso2_Combi2_UseErrorCorrect"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi0_UseErrorCorrect :
                         s_description = "get_iso3_Combi0_UseErrorCorrect"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi1_UseErrorCorrect :
                         s_description = "get_iso3_Combi1_UseErrorCorrect"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi2_UseErrorCorrect :
                         s_description = "get_iso3_Combi2_UseErrorCorrect"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi0_ECMType :
                         s_description = "get_iso1_Combi0_ECMType"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi1_ECMType :
                         s_description = "get_iso1_Combi1_ECMType"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi2_ECMType :
                         s_description = "get_iso1_Combi2_ECMType"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi0_ECMType :
                         s_description = "get_iso2_Combi0_ECMType"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi1_ECMType :
                         s_description = "get_iso2_Combi1_ECMType"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi2_ECMType :
                         s_description = "get_iso2_Combi2_ECMType"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi0_ECMType :
                         s_description = "get_iso3_Combi0_ECMType"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi1_ECMType :
                         s_description = "get_iso3_Combi1_ECMType"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi2_ECMType :
                         s_description = "get_iso3_Combi2_ECMType"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi0_AddValue :
                         s_description = "get_iso1_Combi0_AddValue"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi1_AddValue :
                         s_description = "get_iso1_Combi1_AddValue"; break;
                    case _type_generated_tx_type.gt_get_iso1_Combi2_AddValue :
                         s_description = "get_iso1_Combi2_AddValue"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi0_AddValue :
                         s_description = "get_iso2_Combi0_AddValue"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi1_AddValue :
                         s_description = "get_iso2_Combi1_AddValue"; break;
                    case _type_generated_tx_type.gt_get_iso2_Combi2_AddValue :
                         s_description = "get_iso2_Combi2_AddValue"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi0_AddValue :
                         s_description = "get_iso3_Combi0_AddValue"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi1_AddValue :
                         s_description = "get_iso3_Combi1_AddValue"; break;
                    case _type_generated_tx_type.gt_get_iso3_Combi2_AddValue :
                         s_description = "get_iso3_Combi2_AddValue"; break;
                        //
                    case _type_generated_tx_type.gt_get_private_prefix10:
                        s_description = "get private prefix10"; break;
                    case _type_generated_tx_type.gt_get_private_prefix11:
                        s_description = "get private prefix11"; break;
                    case _type_generated_tx_type.gt_get_private_prefix12:
                        s_description = "get private prefix12"; break;
            
                    case _type_generated_tx_type.gt_get_private_prefix20:
                        s_description = "get private prefix20"; break;
                    case _type_generated_tx_type.gt_get_private_prefix21:
                        s_description = "get private prefix21"; break;
                    case _type_generated_tx_type.gt_get_private_prefix22:
                        s_description = "get private prefix22"; break;
            
                    case _type_generated_tx_type.gt_get_private_prefix30:
                        s_description = "get private prefix30"; break;
                    case _type_generated_tx_type.gt_get_private_prefix31:
                        s_description = "get private prefix31"; break;
                    case _type_generated_tx_type.gt_get_private_prefix32:
                        s_description = "get private prefix32"; break;
            
                    case _type_generated_tx_type.gt_get_private_postfix10:
                        s_description = "get private posfix10"; break;
                    case _type_generated_tx_type.gt_get_private_postfix11:
                        s_description = "get private posfix11"; break;
                    case _type_generated_tx_type.gt_get_private_postfix12:
                        s_description = "get private posfix12"; break;
            
                    case _type_generated_tx_type.gt_get_private_postfix20:
                        s_description = "get private posfix20"; break;
                    case _type_generated_tx_type.gt_get_private_postfix21:
                        s_description = "get private posfix21"; break;
                    case _type_generated_tx_type.gt_get_private_postfix22:
                        s_description = "get private posfix22"; break;
            
                    case _type_generated_tx_type.gt_get_private_postfix30:
                        s_description = "get private posfix30"; break;
                    case _type_generated_tx_type.gt_get_private_postfix31:
                        s_description = "get private posfix31"; break;
                    case _type_generated_tx_type.gt_get_private_postfix32:
                        s_description = "get private posfix32"; break;
            
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
                    case _type_generated_tx_type.gt_set_indicate_error_condition:
                        s_description = "set_indicate_error_condition"; break;
                    //
                    case _type_generated_tx_type.gt_set_ignore_iso1:
                        s_description = "set_ignore_iso1."; break;
                    case _type_generated_tx_type.gt_set_ignore_iso3:
                        s_description = "set_ignore_iso3."; break;
                    case _type_generated_tx_type.gt_set_remove_colon:
                        s_description = "set_remove_colon."; break;

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
                    //
                    case _type_generated_tx_type.gt_set_iso1_number_combi:
                        s_description = "set_iso1_number_combi"; break;
                    case _type_generated_tx_type.gt_set_iso2_number_combi:
                        s_description = "set_iso2_number_combi"; break;
                    case _type_generated_tx_type.gt_set_iso3_number_combi:
                        s_description = "set_iso3_number_combi"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi0_MaxSize:
                         s_description = "set_iso1_Combi0_MaxSize"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi1_MaxSize :
                         s_description = "set_iso1_Combi1_MaxSize"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi2_MaxSize :
                         s_description = "set_iso1_Combi2_MaxSize"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi0_MaxSize :
                         s_description = "set_iso2_Combi0_MaxSize"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi1_MaxSize :
                         s_description = "set_iso2_Combi1_MaxSize"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi2_MaxSize :
                         s_description = "set_iso2_Combi2_MaxSize"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi0_MaxSize :
                         s_description = "set_iso3_Combi0_MaxSize"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi1_MaxSize :
                         s_description = "set_iso3_Combi1_MaxSize"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi2_MaxSize :
                         s_description = "set_iso3_Combi2_MaxSize"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi0_BitSize :
                         s_description = "set_iso1_Combi0_BitSize"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi1_BitSize :
                         s_description = "set_iso1_Combi1_BitSize"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi2_BitSize :
                         s_description = "set_iso1_Combi2_BitSize"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi0_BitSize :
                         s_description = "set_iso2_Combi0_BitSize"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi1_BitSize :
                         s_description = "set_iso2_Combi1_BitSize"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi2_BitSize :
                         s_description = "set_iso2_Combi2_BitSize"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi0_BitSize :
                         s_description = "set_iso3_Combi0_BitSize"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi1_BitSize :
                         s_description = "set_iso3_Combi1_BitSize"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi2_BitSize :
                         s_description = "set_iso3_Combi2_BitSize"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi0_DataMask :
                         s_description = "set_iso1_Combi0_DataMask"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi1_DataMask :
                         s_description = "set_iso1_Combi1_DataMask"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi2_DataMask :
                         s_description = "set_iso1_Combi2_DataMask"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi0_DataMask :
                         s_description = "set_iso2_Combi0_DataMask"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi1_DataMask :
                         s_description = "set_iso2_Combi1_DataMask"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi2_DataMask :
                         s_description = "set_iso2_Combi2_DataMask"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi0_DataMask :
                         s_description = "set_iso3_Combi0_DataMask"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi1_DataMask :
                         s_description = "set_iso3_Combi1_DataMask"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi2_DataMask :
                         s_description = "set_iso3_Combi2_DataMask"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi0_UseParity :
                         s_description = "set_iso1_Combi0_UseParity"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi1_UseParity :
                         s_description = "set_iso1_Combi1_UseParity"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi2_UseParity :
                         s_description = "set_iso1_Combi2_UseParity"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi0_UseParity :
                         s_description = "set_iso2_Combi0_UseParity"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi1_UseParity :
                         s_description = "set_iso2_Combi1_UseParity"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi2_UseParity :
                         s_description = "set_iso2_Combi2_UseParity"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi0_UseParity :
                         s_description = "set_iso3_Combi0_UseParity"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi1_UseParity :
                         s_description = "set_iso3_Combi1_UseParity"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi2_UseParity :
                         s_description = "set_iso3_Combi2_UseParity"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi0_ParityType :
                         s_description = "set_iso1_Combi0_ParityType"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi1_ParityType :
                         s_description = "set_iso1_Combi1_ParityType"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi2_ParityType :
                         s_description = "set_iso1_Combi2_ParityType"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi0_ParityType :
                         s_description = "set_iso2_Combi0_ParityType"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi1_ParityType :
                         s_description = "set_iso2_Combi1_ParityType"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi2_ParityType :
                         s_description = "set_iso2_Combi2_ParityType"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi0_ParityType :
                         s_description = "set_iso3_Combi0_ParityType"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi1_ParityType :
                         s_description = "set_iso3_Combi1_ParityType"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi2_ParityType :
                         s_description = "set_iso3_Combi2_ParityType"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi0_STX_L :
                         s_description = "set_iso1_Combi0_STX_L"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi1_STX_L :
                         s_description = "set_iso1_Combi1_STX_L"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi2_STX_L :
                         s_description = "set_iso1_Combi2_STX_L"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi0_STX_L :
                         s_description = "set_iso2_Combi0_STX_L"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi1_STX_L :
                         s_description = "set_iso2_Combi1_STX_L"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi2_STX_L :
                         s_description = "set_iso2_Combi2_STX_L"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi0_STX_L :
                         s_description = "set_iso3_Combi0_STX_L"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi1_STX_L :
                         s_description = "set_iso3_Combi1_STX_L"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi2_STX_L :
                         s_description = "set_iso3_Combi2_STX_L"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi0_ETX_L :
                         s_description = "set_iso1_Combi0_ETX_L"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi1_ETX_L :
                         s_description = "set_iso1_Combi1_ETX_L"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi2_ETX_L :
                         s_description = "set_iso1_Combi2_ETX_L"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi0_ETX_L :
                         s_description = "set_iso2_Combi0_ETX_L"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi1_ETX_L :
                         s_description = "set_iso2_Combi1_ETX_L"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi2_ETX_L :
                         s_description = "set_iso2_Combi2_ETX_L"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi0_ETX_L :
                         s_description = "set_iso3_Combi0_ETX_L"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi1_ETX_L :
                         s_description = "set_iso3_Combi1_ETX_L"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi2_ETX_L :
                         s_description = "set_iso3_Combi2_ETX_L"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi0_UseErrorCorrect :
                         s_description = "set_iso1_Combi0_UseErrorCorrect"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi1_UseErrorCorrect :
                         s_description = "set_iso1_Combi1_UseErrorCorrect"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi2_UseErrorCorrect :
                         s_description = "set_iso1_Combi2_UseErrorCorrect"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi0_UseErrorCorrect :
                         s_description = "set_iso2_Combi0_UseErrorCorrect"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi1_UseErrorCorrect :
                         s_description = "set_iso2_Combi1_UseErrorCorrect"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi2_UseErrorCorrect :
                         s_description = "set_iso2_Combi2_UseErrorCorrect"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi0_UseErrorCorrect :
                         s_description = "set_iso3_Combi0_UseErrorCorrect"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi1_UseErrorCorrect :
                         s_description = "set_iso3_Combi1_UseErrorCorrect"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi2_UseErrorCorrect :
                         s_description = "set_iso3_Combi2_UseErrorCorrect"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi0_ECMType :
                         s_description = "set_iso1_Combi0_ECMType"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi1_ECMType :
                         s_description = "set_iso1_Combi1_ECMType"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi2_ECMType :
                         s_description = "set_iso1_Combi2_ECMType"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi0_ECMType :
                         s_description = "set_iso2_Combi0_ECMType"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi1_ECMType :
                         s_description = "set_iso2_Combi1_ECMType"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi2_ECMType :
                         s_description = "set_iso2_Combi2_ECMType"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi0_ECMType :
                         s_description = "set_iso3_Combi0_ECMType"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi1_ECMType :
                         s_description = "set_iso3_Combi1_ECMType"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi2_ECMType :
                         s_description = "set_iso3_Combi2_ECMType"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi0_AddValue :
                         s_description = "set_iso1_Combi0_AddValue"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi1_AddValue :
                         s_description = "set_iso1_Combi1_AddValue"; break;
                    case _type_generated_tx_type.gt_set_iso1_Combi2_AddValue :
                         s_description = "set_iso1_Combi2_AddValue"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi0_AddValue :
                         s_description = "set_iso2_Combi0_AddValue"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi1_AddValue :
                         s_description = "set_iso2_Combi1_AddValue"; break;
                    case _type_generated_tx_type.gt_set_iso2_Combi2_AddValue :
                         s_description = "set_iso2_Combi2_AddValue"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi0_AddValue :
                         s_description = "set_iso3_Combi0_AddValue"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi1_AddValue :
                         s_description = "set_iso3_Combi1_AddValue"; break;
                    case _type_generated_tx_type.gt_set_iso3_Combi2_AddValue :
                         s_description = "set_iso3_Combi2_AddValue"; break;
                    //
                    case _type_generated_tx_type.gt_set_private_prefix10:
                        s_description = "set private prefix10"; break;
                    case _type_generated_tx_type.gt_set_private_prefix11:
                        s_description = "set private prefix11"; break;
                    case _type_generated_tx_type.gt_set_private_prefix12:
                        s_description = "set private prefix12"; break;
            
                    case _type_generated_tx_type.gt_set_private_prefix20:
                        s_description = "set private prefix20"; break;
                    case _type_generated_tx_type.gt_set_private_prefix21:
                        s_description = "set private prefix21"; break;
                    case _type_generated_tx_type.gt_set_private_prefix22:
                        s_description = "set private prefix22"; break;
            
                    case _type_generated_tx_type.gt_set_private_prefix30:
                        s_description = "set private prefix30"; break;
                    case _type_generated_tx_type.gt_set_private_prefix31:
                        s_description = "set private prefix31"; break;
                    case _type_generated_tx_type.gt_set_private_prefix32:
                        s_description = "set private prefix32"; break;
            
                    case _type_generated_tx_type.gt_set_private_postfix10:
                        s_description = "set private posfix10"; break;
                    case _type_generated_tx_type.gt_set_private_postfix11:
                        s_description = "set private posfix11"; break;
                    case _type_generated_tx_type.gt_set_private_postfix12:
                        s_description = "set private posfix12"; break;
            
                    case _type_generated_tx_type.gt_set_private_postfix20:
                        s_description = "set private posfix20"; break;
                    case _type_generated_tx_type.gt_set_private_postfix21:
                        s_description = "set private posfix21"; break;
                    case _type_generated_tx_type.gt_set_private_postfix22:
                        s_description = "set private posfix22"; break;
            
                    case _type_generated_tx_type.gt_set_private_postfix30:
                        s_description = "set private posfix30"; break;
                    case _type_generated_tx_type.gt_set_private_postfix31:
                        s_description = "set private posfix31"; break;
                    case _type_generated_tx_type.gt_set_private_postfix32:
                        s_description = "set private posfix32"; break;
                    //
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
                        this._deque_generated_tx.push( _type_generated_tx_type.gt_get_zeros7_times_ibutton );
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
                    if( !_generate_get_private_prefix(this._dequeu_s_tx,i,0) ){ b_result = false; break;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_get_private_prefix10
                        +i*_const_the_number_of_combination );
                    //
                    if( !_generate_get_private_postfix(this._dequeu_s_tx,i,0) ){ b_result = false; break;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_get_private_postfix10
                        +i*_const_the_number_of_combination );

                }//end for
                if( !b_result ){
                    continue;
                }
                b_result = false;

                if( !_generate_get_global_prefix(this._dequeu_s_tx) ){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_get_global_prefix );
        
                if( !_generate_get_global_postfix(this._dequeu_s_tx) ){continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_get_global_postfix );

                //
                var b_run_combination = false;
                if( _first_version_greater_then_second_version( this._version,[5,12,0,0]) ){
                    b_run_combination = true;//support from ganymede v5.13
                }
                if( _first_version_greater_then_second_version( [4,0,0,0],this._version) ){
                    //callisto
                    if( _first_version_greater_then_second_version( this._version,[3,20,0,0]) ){
                        b_run_combination = true;//support from callisto v3.21
                    }
                }

                if( b_run_combination ){
                    
                    if( !_generate_get_indicate_error_condition(this._dequeu_s_tx) ){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_get_indicate_error_condition );

                    if( !_generate_get_ignore_iso1(this._dequeu_s_tx) ){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_get_ignore_iso1 );

                    if( !_generate_get_ignore_iso3(this._dequeu_s_tx) ){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_get_ignore_iso3 );

                    if( !_generate_get_remove_colon(this._dequeu_s_tx) ){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_get_remove_colon );
                    //
                    var ii=0;
                    var jj=0;
                    for( ii = 0; ii<_const_the_number_of_track; ii++){
                        if( !_generate_get_number_combi(this._dequeu_s_tx,ii) ){break;}
                        this._deque_generated_tx.push( _type_generated_tx_type.gt_get_iso1_number_combi+ii );

                        for( jj = 0; jj<_const_the_number_of_combination; jj++){
                            if( !_generate_get_max_size(this._dequeu_s_tx,ii,jj) ){break;}
                            this._deque_generated_tx.push( _type_generated_tx_type.gt_get_iso1_Combi0_MaxSize
                                +ii*_const_the_number_of_combination+jj );

                            if( !_generate_get_bit_size(this._dequeu_s_tx,ii,jj) ){break;}
                            this._deque_generated_tx.push( _type_generated_tx_type.gt_get_iso1_Combi0_BitSize
                                +ii*_const_the_number_of_combination+jj );
                            if( !_generate_get_data_mask(this._dequeu_s_tx,ii,jj) ){break;}
                            this._deque_generated_tx.push( _type_generated_tx_type.gt_get_iso1_Combi0_DataMask
                                +ii*_const_the_number_of_combination+jj );
                            if( !_generate_get_use_parity(this._dequeu_s_tx,ii,jj) ){break;}
                            this._deque_generated_tx.push( _type_generated_tx_type.gt_get_iso1_Combi0_UseParity
                                +ii*_const_the_number_of_combination+jj );
                            if( !_generate_get_parity_type(this._dequeu_s_tx,ii,jj) ){break;}
                            this._deque_generated_tx.push( _type_generated_tx_type.gt_get_iso1_Combi0_ParityType
                                +ii*_const_the_number_of_combination+jj );
                            if( !_generate_get_stxl(this._dequeu_s_tx,ii,jj) ){break;}
                            this._deque_generated_tx.push( _type_generated_tx_type.gt_get_iso1_Combi0_STX_L
                                +ii*_const_the_number_of_combination+jj );
                            if( !_generate_get_etxl(this._dequeu_s_tx,ii,jj) ){break;}
                            this._deque_generated_tx.push( _type_generated_tx_type.gt_get_iso1_Combi0_ETX_L
                                +ii*_const_the_number_of_combination+jj );
                            if( !_generate_get_use_error_correct(this._dequeu_s_tx,ii,jj) ){break;}
                            this._deque_generated_tx.push( _type_generated_tx_type.gt_get_iso1_Combi0_UseErrorCorrect
                                +ii*_const_the_number_of_combination+jj );
                            if( !_generate_get_ecm_type(this._dequeu_s_tx,ii,jj) ){break;}
                            this._deque_generated_tx.push( _type_generated_tx_type.gt_get_iso1_Combi0_ECMType
                                +ii*_const_the_number_of_combination+jj );
                            if( !_generate_get_add_value(this._dequeu_s_tx,ii,jj) ){break;}
                            this._deque_generated_tx.push( _type_generated_tx_type.gt_get_iso1_Combi0_AddValue
                                +ii*_const_the_number_of_combination+jj );
                            if( jj > 0 ){
                                if( !_generate_get_private_prefix(this._dequeu_s_tx,ii,jj) ){ break;}
                                this._deque_generated_tx.push( _type_generated_tx_type.gt_get_private_prefix10
                                    +ii*_const_the_number_of_combination+jj );
                                //
                                if( !_generate_get_private_postfix(this._dequeu_s_tx,ii,jj) ){ break;}
                                this._deque_generated_tx.push( _type_generated_tx_type.gt_get_private_postfix10
                                    +ii*_const_the_number_of_combination+jj );
                            }
            
                        }//end for j

                        if(jj<_const_the_number_of_combination ){
                            break;//error
                        }
                    }//end for i

                    if( ii<_const_the_number_of_track || jj<_const_the_number_of_combination){
                        continue;//error
                    }
                }
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
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_PrivatePrefix10 ) >= 0 ){
                    if (!_generate_set_private_prefix(this._dequeu_s_tx,_type_msr_track_Numer.iso1_track,0,this._s_private_prefix[_type_msr_track_Numer.iso1_track][0] )){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_private_prefix10 );
                }

                // . private postfix 1
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_PrivatePostfix10 ) >= 0 ){
                    if (!_generate_set_private_postfix(this._dequeu_s_tx,_type_msr_track_Numer.iso1_track,0,this._s_private_postfix[_type_msr_track_Numer.iso1_track][0] )){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_private_postfix10 );
                }

                // . private prefix 2
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_PrivatePrefix20 ) >= 0 ){
                    if (!_generate_set_private_prefix(this._dequeu_s_tx,_type_msr_track_Numer.iso2_track,0,this._s_private_prefix[_type_msr_track_Numer.iso2_track][0] )){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_private_prefix20 );
                }
                
                // . private postfix 2
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_PrivatePostfix20 ) >= 0 ){
                    if (!_generate_set_private_postfix(this._dequeu_s_tx,_type_msr_track_Numer.iso2_track,0,this._s_private_postfix[_type_msr_track_Numer.iso2_track][0])){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_private_postfix20 );
                }

                // . private prefix 3
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_PrivatePrefix30 ) >= 0 ){
                    if (!_generate_set_private_prefix(this._dequeu_s_tx,_type_msr_track_Numer.iso3_track,0,this._s_private_prefix[_type_msr_track_Numer.iso3_track][0])){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_private_prefix30 );
                }
                // . private postfix 3
                if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_PrivatePostfix30 ) >= 0 ){
                    if (!_generate_set_private_postfix(this._dequeu_s_tx,_type_msr_track_Numer.iso3_track,0,this._s_private_postfix[_type_msr_track_Numer.iso3_track][0])){continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_set_private_postfix30 );
                }

                var b_run_combination = false;
                if( _first_version_greater_then_second_version( this._version,[5,12,0,0]) ){
                    b_run_combination = true;//support from ganymede v5.13
                }
                if( _first_version_greater_then_second_version( [4,0,0,0],this._version) ){
                    //callisto
                    if( _first_version_greater_then_second_version( this._version,[3,20,0,0]) ){
                        b_run_combination = true;//support from callisto v3.21
                    }
                }

                if( b_run_combination ){
                    //.cp_IndicateErrorCondition
                    if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_IndicateErrorCondition ) >= 0 ){
                        if (!_generate_set_indicate_error_condition(this._dequeu_s_tx,this._c_blank)){continue;}
                        this._deque_generated_tx.push( _type_generated_tx_type.gt_set_indicate_error_condition );
                    }
                    if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_EnableIgnoreISO1 ) >= 0 ){
                        if (!_generate_set_ignore_iso1(this._dequeu_s_tx,this._c_blank)){continue;}
                        this._deque_generated_tx.push( _type_generated_tx_type.gt_set_ignore_iso1 );
                    }
                    if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_EnableIgnoreISO3 ) >= 0 ){
                        if (!_generate_set_ignore_iso3(this._dequeu_s_tx,this._c_blank)){continue;}
                        this._deque_generated_tx.push( _type_generated_tx_type.gt_set_ignore_iso3 );
                    }
                    if( elpusk.util.find_from_set( this._set_change_parameter, _type_change_parameter.cp_EnableRemoveColon ) >= 0 ){
                        if (!_generate_set_remove_colon(this._dequeu_s_tx,this._c_blank)){continue;}
                        this._deque_generated_tx.push( _type_generated_tx_type.gt_set_remove_colon );
                    }
                    
                    var ii = 0, jj = 0;
                    for( ii =0; ii<_const_the_number_of_track; ii++ ){
                        //.cp_ISO1_NumberCombi~cp_ISO3_NumberCombi
                        if( elpusk.util.find_from_set( this._set_change_parameter, 
                            _type_change_parameter.cp_ISO1_NumberCombi+ii ) >= 0 ){
                                
                            if (!_generate_set_number_combi(this._dequeu_s_tx,ii,
                                this._n_number_combination[ii])){break;}
                            this._deque_generated_tx.push( 
                                _type_generated_tx_type.gt_set_iso1_number_combi+ii 
                                );
                        }
    
                        for( jj=0; jj<_const_the_number_of_combination; jj++ ){
                            //.cp_ISO1_Combi0_MaxSize~cp_ISO3_Combi2_MaxSize
                            if( elpusk.util.find_from_set( this._set_change_parameter, 
                                _type_change_parameter.cp_ISO1_Combi0_MaxSize
                                +ii*_const_the_number_of_combination+jj ) >= 0 ){
                                    
                                if (!_generate_set_max_size(this._dequeu_s_tx,ii,jj,
                                    this._n_max_size[ii][jj])){break;}
                                this._deque_generated_tx.push( 
                                    _type_generated_tx_type.gt_set_iso1_Combi0_MaxSize
                                    +ii*_const_the_number_of_combination+jj
                                    );
                            }
                            //.cp_ISO1_Combi0_BitSize ~cp_ISO3_Combi2_BitSize 
                            if( elpusk.util.find_from_set( this._set_change_parameter, 
                                _type_change_parameter.cp_ISO1_Combi0_BitSize 
                                +ii*_const_the_number_of_combination+jj ) >= 0 ){
                                    
                                if (!_generate_set_bit_size(this._dequeu_s_tx,ii,jj,
                                    this._n_bit_size[ii][jj])){break;}
                                this._deque_generated_tx.push( 
                                    _type_generated_tx_type.gt_set_iso1_Combi0_BitSize
                                    +ii*_const_the_number_of_combination+jj
                                    );
                            }
                            //.cp_ISO1_Combi0_DataMask ~cp_ISO3_Combi2_DataMask 
                            if( elpusk.util.find_from_set( this._set_change_parameter, 
                                _type_change_parameter.cp_ISO1_Combi0_DataMask 
                                +ii*_const_the_number_of_combination+jj ) >= 0 ){
                                    
                                if (!_generate_set_data_mask(this._dequeu_s_tx,ii,jj,
                                    this._c_data_mask[ii][jj])){break;}
                                this._deque_generated_tx.push( 
                                    _type_generated_tx_type.gt_set_iso1_Combi0_DataMask
                                    +ii*_const_the_number_of_combination+jj
                                    );
                            }
                            //cp_ISO1_Combi0_UseParity ~cp_ISO3_Combi2_UseParity
                            if( elpusk.util.find_from_set( this._set_change_parameter, 
                                _type_change_parameter.cp_ISO1_Combi0_UseParity 
                                +ii*_const_the_number_of_combination+jj ) >= 0 ){
                                    
                                if (!_generate_set_use_parity(this._dequeu_s_tx,ii,jj,
                                    this._b_use_parity[ii][jj])){break;}
                                this._deque_generated_tx.push( 
                                    _type_generated_tx_type.gt_set_iso1_Combi0_UseParity
                                    +ii*_const_the_number_of_combination+jj
                                    );
                            }
                            //cp_ISO1_Combi0_ParityType ~cp_ISO3_Combi2_ParityType
                            if( elpusk.util.find_from_set( this._set_change_parameter, 
                                _type_change_parameter.cp_ISO1_Combi0_ParityType 
                                +ii*_const_the_number_of_combination+jj ) >= 0 ){
                                    
                                if (!_generate_set_parity_type(this._dequeu_s_tx,ii,jj,
                                    this._n_parity_type[ii][jj])){break;}
                                this._deque_generated_tx.push( 
                                    _type_generated_tx_type.gt_set_iso1_Combi0_ParityType
                                    +ii*_const_the_number_of_combination+jj
                                    );
                            }
                            //cp_ISO1_Combi0_STX_L ~cp_ISO3_Combi2_STX_L
                            if( elpusk.util.find_from_set( this._set_change_parameter, 
                                _type_change_parameter.cp_ISO1_Combi0_STX_L 
                                +ii*_const_the_number_of_combination+jj ) >= 0 ){
                                    
                                if (!_generate_set_stxl(this._dequeu_s_tx,ii,jj,
                                    this._c_stxl[ii][jj])){break;}
                                this._deque_generated_tx.push( 
                                    _type_generated_tx_type.gt_set_iso1_Combi0_STX_L
                                    +ii*_const_the_number_of_combination+jj
                                    );
                            }
                            //cp_ISO1_Combi0_ETX_L ~cp_ISO3_Combi2_ETX_L
                            if( elpusk.util.find_from_set( this._set_change_parameter, 
                                _type_change_parameter.cp_ISO1_Combi0_ETX_L 
                                +ii*_const_the_number_of_combination+jj ) >= 0 ){
                                    
                                if (!_generate_set_etxl(this._dequeu_s_tx,ii,jj,
                                    this._c_etxl[ii][jj])){break;}
                                this._deque_generated_tx.push( 
                                    _type_generated_tx_type.gt_set_iso1_Combi0_ETX_L
                                    +ii*_const_the_number_of_combination+jj
                                    );
                            }
                            //cp_ISO1_Combi0_UseErrorCorrect ~cp_ISO3_Combi2_UseErrorCorrect
                            
                            if( elpusk.util.find_from_set( this._set_change_parameter, 
                                _type_change_parameter.cp_ISO1_Combi0_UseErrorCorrect 
                                +ii*_const_the_number_of_combination+jj ) >= 0 ){
                                    
                                if (!_generate_set_use_error_correct(this._dequeu_s_tx,ii,jj,
                                    this._b_use_ecm[ii][jj])){break;}
                                this._deque_generated_tx.push( 
                                    _type_generated_tx_type.gt_set_iso1_Combi0_UseErrorCorrect
                                    +ii*_const_the_number_of_combination+jj
                                    );
                            }
                            
                            //cp_ISO1_Combi0_ECMType ~cp_ISO3_Combi2_ECMType
                            if( elpusk.util.find_from_set( this._set_change_parameter, 
                                _type_change_parameter.cp_ISO1_Combi0_ECMType 
                                +ii*_const_the_number_of_combination+jj ) >= 0 ){
                                    
                                if (!_generate_set_ecm_type(this._dequeu_s_tx,ii,jj,
                                    this._n_ecm_type[ii][jj])){break;}
                                this._deque_generated_tx.push( 
                                    _type_generated_tx_type.gt_set_iso1_Combi0_ECMType
                                    +ii*_const_the_number_of_combination+jj
                                    );
                            }
                            //cp_ISO1_Combi0_AddValue ~cp_ISO3_Combi2_AddValue
                            if( elpusk.util.find_from_set( this._set_change_parameter, 
                                _type_change_parameter.cp_ISO1_Combi0_AddValue 
                                +ii*_const_the_number_of_combination+jj ) >= 0 ){
                                    
                                if (!_generate_set_add_value(this._dequeu_s_tx,ii,jj,
                                    this._n_add_value[ii][jj])){break;}
                                this._deque_generated_tx.push( 
                                    _type_generated_tx_type.gt_set_iso1_Combi0_AddValue
                                    +ii*_const_the_number_of_combination+jj
                                    );
                            }

                            if( jj > 0 ){
                                //cp_PrivatePrefix11~cp_PrivatePrefix22
                                if( elpusk.util.find_from_set( this._set_change_parameter, 
                                    _type_change_parameter.cp_PrivatePrefix10 
                                    +ii*_const_the_number_of_combination+jj ) >= 0 ){
                                        
                                    if (!_generate_set_private_prefix(this._dequeu_s_tx,ii,jj,
                                        this._s_private_prefix[ii][jj])){break;}
                                    this._deque_generated_tx.push( 
                                        _type_generated_tx_type.gt_set_private_prefix10
                                        +ii*_const_the_number_of_combination+jj
                                        );
                                }
                                //cp_PrivatePostfix11~cp_PrivatePostfix22
                                if( elpusk.util.find_from_set( this._set_change_parameter, 
                                    _type_change_parameter.cp_PrivatePostfix10 
                                    +ii*_const_the_number_of_combination+jj ) >= 0 ){
                                        
                                    if (!_generate_set_private_postfix(this._dequeu_s_tx,ii,jj,
                                        this._s_private_postfix[ii][jj])){break;}
                                    this._deque_generated_tx.push( 
                                        _type_generated_tx_type.gt_set_private_postfix10
                                        +ii*_const_the_number_of_combination+jj
                                        );
                                }
                            }
                        }//end for jj
                        if( jj < _const_the_number_of_combination){
                            break;//error condition
                        }
                    }//end for ii

                    if( ii<_const_the_number_of_track || jj < _const_the_number_of_combination){
                        continue;//error
                    }
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

            return this._deque_generated_tx.length;   
       }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.generate_enable_read
         * @param {boolean} b_enable true - generates enable read requst.
         * <br /> false - generates disable read requst.
         * @return {number} the number of generated requests. may be 1.
         * <br /> 0 - error
        */
        _elpusk.device.usb.hid.lpu237.prototype.generate_enable_read = function( b_enable ){
            var b_result = false;

            do{
                if( typeof b_enable !== 'boolean'){
                    continue;
                }

                if( b_enable ){
                    if(!_generate_enter_opos_mode(this._dequeu_s_tx) ){ continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_enter_opos );
                }
                else{
                    if(!_generate_leave_opos_mode(this._dequeu_s_tx) ){ continue;}
                    this._deque_generated_tx.push( _type_generated_tx_type.gt_leave_opos );
                }
                //
                b_result = true;
            }while (false);

            if( !b_result ){
                this._dequeu_s_tx.length = 0;
                this._deque_generated_tx.length = 0;
            }

            return this._deque_generated_tx.length;         
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.generate_run_bootloader
         * @return {number} the number of generated requests. may be 1.
         * <br /> 0 - error
        */
        _elpusk.device.usb.hid.lpu237.prototype.generate_run_bootloader = function(){
            var b_result = false;

            do{
                if(!_generate_enter_config_mode(this._dequeu_s_tx) ){ continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_enter_config );

                if(!_generate_run_boot_loader(this._dequeu_s_tx) ){ continue;}
                this._deque_generated_tx.push( _type_generated_tx_type.gt_goto_boot );
                //
                b_result = true;
            }while (false);

            if( !b_result ){
                this._dequeu_s_tx.length = 0;
                this._deque_generated_tx.length = 0;
            }

            return this._deque_generated_tx.length;         
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
                case _type_generated_tx_type.gt_enter_config:
                    b_result = _is_success_response(s_response);
                    if( b_result ){
                        this._b_config_mode = true;
                    }
                    break;
                case _type_generated_tx_type.gt_leave_config:
                    b_result = _is_success_response(s_response);
                    if( b_result ){
                        this._b_config_mode = false;
                    }
                    break;
                case _type_generated_tx_type.gt_enter_opos:
                    b_result = _is_success_response(s_response);
                    if( b_result ){
                        this._b_opos_mode = true;
                    }
                    break;
                case _type_generated_tx_type.gt_leave_opos:
                    b_result = _is_success_response(s_response);
                    if( b_result ){
                        this._b_opos_mode = false;
                    }
                    break;        
                case _type_generated_tx_type.gt_change_authkey:
                case _type_generated_tx_type.gt_change_status:
                case _type_generated_tx_type.gt_change_sn:
                case _type_generated_tx_type.gt_apply:
                case _type_generated_tx_type.gt_goto_boot:
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
                case _type_generated_tx_type.gt_get_indicate_error_condition:
                    b_value = _get_indicate_error_condition_from_response(s_response);
                    if( b_value !== null ){   
                        if( b_value ){
                            this._c_blank[1] = this._c_blank[1] & 0xfe;
                        }
                        else{
                            this._c_blank[1] = this._c_blank[1] | 0x01;
                        }
                        b_result = true;
                    }
                    break;

                case _type_generated_tx_type.gt_get_ignore_iso1:
                    b_value = _get_ignore_iso1_from_response(s_response);
                    if( b_value !== null ){   
                        if( b_value ){
                            this._c_blank[1] = this._c_blank[1] | 0x02;
                        }
                        else{
                            this._c_blank[1] = this._c_blank[1] & 0xfd;
                        }
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_ignore_iso3:
                    b_value = _get_ignore_iso3_from_response(s_response);
                    if( b_value !== null ){   
                        if( b_value ){
                            this._c_blank[1] = this._c_blank[1] | 0x04;
                        }
                        else{
                            this._c_blank[1] = this._c_blank[1] & 0xfb;
                        }
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_remove_colon:
                    b_value = _get_remove_colon_from_response(s_response);
                    if( b_value !== null ){   
                        if( b_value ){
                            this._c_blank[1] = this._c_blank[1] | 0x08;
                        }
                        else{
                            this._c_blank[1] = this._c_blank[1] & 0xf7;
                        }
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
                    //
                case _type_generated_tx_type.gt_get_iso1_number_combi :
                case _type_generated_tx_type.gt_get_iso2_number_combi :
                case _type_generated_tx_type.gt_get_iso3_number_combi :
                    n_value = _get_number_combi_from_response(s_response,n_generated_tx-_type_generated_tx_type.gt_get_iso1_number_combi);
                    if( n_value >= 0 ){
                        this._n_number_combination[n_generated_tx-_type_generated_tx_type.gt_get_iso1_number_combi] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso1_Combi0_MaxSize :
                case _type_generated_tx_type.gt_get_iso1_Combi1_MaxSize :
                case _type_generated_tx_type.gt_get_iso1_Combi2_MaxSize :
                    n_value = _get_max_size_from_response(
                        s_response
                        ,_type_msr_track_Numer.iso1_track
                        ,n_generated_tx-_type_generated_tx_type.gt_get_iso1_Combi0_MaxSize);
                    if( n_value >= 0 ){
                        this._n_max_size[_type_msr_track_Numer.iso1_track][n_generated_tx-_type_generated_tx_type.gt_get_iso1_Combi0_MaxSize] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso2_Combi0_MaxSize :
                case _type_generated_tx_type.gt_get_iso2_Combi1_MaxSize :
                case _type_generated_tx_type.gt_get_iso2_Combi2_MaxSize :
                    n_value = _get_max_size_from_response(
                        s_response
                        ,_type_msr_track_Numer.iso2_track
                        ,n_generated_tx-_type_generated_tx_type.gt_get_iso2_Combi0_MaxSize);
                    if( n_value >= 0 ){
                        this._n_max_size[_type_msr_track_Numer.iso2_track][n_generated_tx-_type_generated_tx_type.gt_get_iso2_Combi0_MaxSize] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso3_Combi0_MaxSize :
                case _type_generated_tx_type.gt_get_iso3_Combi1_MaxSize :
                case _type_generated_tx_type.gt_get_iso3_Combi2_MaxSize :
                    n_value = _get_max_size_from_response(
                        s_response
                        ,_type_msr_track_Numer.iso3_track
                        ,n_generated_tx-_type_generated_tx_type.gt_get_iso3_Combi0_MaxSize);
                    if( n_value >= 0 ){
                        this._n_max_size[_type_msr_track_Numer.iso3_track][n_generated_tx-_type_generated_tx_type.gt_get_iso3_Combi0_MaxSize] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso1_Combi0_BitSize :
                case _type_generated_tx_type.gt_get_iso1_Combi1_BitSize :
                case _type_generated_tx_type.gt_get_iso1_Combi2_BitSize :
                    n_value = _get_bit_size_from_response(
                        s_response
                        ,_type_msr_track_Numer.iso1_track
                        ,n_generated_tx-_type_generated_tx_type.gt_get_iso1_Combi0_BitSize);
                    if( n_value >= 0 ){
                        this._n_bit_size[_type_msr_track_Numer.iso1_track][n_generated_tx-_type_generated_tx_type.gt_get_iso1_Combi0_BitSize] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso2_Combi0_BitSize :
                case _type_generated_tx_type.gt_get_iso2_Combi1_BitSize :
                case _type_generated_tx_type.gt_get_iso2_Combi2_BitSize :
                    n_value = _get_bit_size_from_response(
                        s_response
                        ,_type_msr_track_Numer.iso2_track
                        ,n_generated_tx-_type_generated_tx_type.gt_get_iso2_Combi0_BitSize);
                    if( n_value >= 0 ){
                        this._n_bit_size[_type_msr_track_Numer.iso2_track][n_generated_tx-_type_generated_tx_type.gt_get_iso2_Combi0_BitSize] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso3_Combi0_BitSize :
                case _type_generated_tx_type.gt_get_iso3_Combi1_BitSize :
                case _type_generated_tx_type.gt_get_iso3_Combi2_BitSize :
                    n_value = _get_bit_size_from_response(
                        s_response
                        ,_type_msr_track_Numer.iso3_track
                        ,n_generated_tx-_type_generated_tx_type.gt_get_iso3_Combi0_BitSize);
                    if( n_value >= 0 ){
                        this._n_bit_size[_type_msr_track_Numer.iso3_track][n_generated_tx-_type_generated_tx_type.gt_get_iso3_Combi0_BitSize] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso1_Combi0_DataMask :
                case _type_generated_tx_type.gt_get_iso1_Combi1_DataMask :
                case _type_generated_tx_type.gt_get_iso1_Combi2_DataMask :
                    n_value = _get_data_mask_from_response(
                        s_response
                        ,_type_msr_track_Numer.iso1_track
                        ,n_generated_tx-_type_generated_tx_type.gt_get_iso1_Combi0_DataMask);
                    if( n_value >= 0 ){
                        this._c_data_mask[_type_msr_track_Numer.iso1_track][n_generated_tx-_type_generated_tx_type.gt_get_iso1_Combi0_DataMask] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso2_Combi0_DataMask :
                case _type_generated_tx_type.gt_get_iso2_Combi1_DataMask :
                case _type_generated_tx_type.gt_get_iso2_Combi2_DataMask :
                    n_value = _get_data_mask_from_response(
                        s_response
                        ,_type_msr_track_Numer.iso2_track
                        ,n_generated_tx-_type_generated_tx_type.gt_get_iso2_Combi0_DataMask);
                    if( n_value >= 0 ){
                        this._c_data_mask[_type_msr_track_Numer.iso2_track][n_generated_tx-_type_generated_tx_type.gt_get_iso2_Combi0_DataMask] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso3_Combi0_DataMask :
                case _type_generated_tx_type.gt_get_iso3_Combi1_DataMask :
                case _type_generated_tx_type.gt_get_iso3_Combi2_DataMask :
                    n_value = _get_data_mask_from_response(
                        s_response
                        ,_type_msr_track_Numer.iso3_track
                        ,n_generated_tx-_type_generated_tx_type.gt_get_iso3_Combi0_DataMask);
                    if( n_value >= 0 ){
                        this._c_data_mask[_type_msr_track_Numer.iso3_track][n_generated_tx-_type_generated_tx_type.gt_get_iso3_Combi0_DataMask] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso1_Combi0_UseParity :// this._b_use_parity
                case _type_generated_tx_type.gt_get_iso1_Combi1_UseParity :
                case _type_generated_tx_type.gt_get_iso1_Combi2_UseParity :
                    b_value = _get_use_parity_from_response(s_response,_type_msr_track_Numer.iso1_track,n_generated_tx-_type_generated_tx_type.gt_get_iso1_Combi0_UseParity);
                    if( b_value !== null ){
                        this._b_use_parity[_type_msr_track_Numer.iso1_track][n_generated_tx-_type_generated_tx_type.gt_get_iso1_Combi0_UseParity] = b_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso2_Combi0_UseParity :
                case _type_generated_tx_type.gt_get_iso2_Combi1_UseParity :
                case _type_generated_tx_type.gt_get_iso2_Combi2_UseParity :
                    b_value = _get_use_parity_from_response(s_response,_type_msr_track_Numer.iso2_track,n_generated_tx-_type_generated_tx_type.gt_get_iso2_Combi0_UseParity);
                    if( b_value !== null ){
                        this._b_use_parity[_type_msr_track_Numer.iso2_track][n_generated_tx-_type_generated_tx_type.gt_get_iso2_Combi0_UseParity] = b_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso3_Combi0_UseParity :
                case _type_generated_tx_type.gt_get_iso3_Combi1_UseParity :
                case _type_generated_tx_type.gt_get_iso3_Combi2_UseParity :
                    b_value = _get_use_parity_from_response(s_response,_type_msr_track_Numer.iso3_track,n_generated_tx-_type_generated_tx_type.gt_get_iso3_Combi0_UseParity);
                    if( b_value !== null ){
                        this._b_use_parity[_type_msr_track_Numer.iso3_track][n_generated_tx-_type_generated_tx_type.gt_get_iso3_Combi0_UseParity] = b_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso1_Combi0_ParityType ://this._n_parity_type
                case _type_generated_tx_type.gt_get_iso1_Combi1_ParityType :
                case _type_generated_tx_type.gt_get_iso1_Combi2_ParityType :
                    n_value = _get_parity_type_from_response(s_response,_type_msr_track_Numer.iso1_track,n_generated_tx-_type_generated_tx_type.gt_get_iso1_Combi0_ParityType);
                    if( n_value >= 0 ){
                        this._n_parity_type[_type_msr_track_Numer.iso1_track][n_generated_tx-_type_generated_tx_type.gt_get_iso1_Combi0_ParityType] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso2_Combi0_ParityType :
                case _type_generated_tx_type.gt_get_iso2_Combi1_ParityType :
                case _type_generated_tx_type.gt_get_iso2_Combi2_ParityType :
                    n_value = _get_parity_type_from_response(s_response,_type_msr_track_Numer.iso2_track,n_generated_tx-_type_generated_tx_type.gt_get_iso2_Combi0_ParityType);
                    if( n_value >= 0 ){
                        this._n_parity_type[_type_msr_track_Numer.iso2_track][n_generated_tx-_type_generated_tx_type.gt_get_iso2_Combi0_ParityType] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso3_Combi0_ParityType :
                case _type_generated_tx_type.gt_get_iso3_Combi1_ParityType :
                case _type_generated_tx_type.gt_get_iso3_Combi2_ParityType :
                    n_value = _get_parity_type_from_response(s_response,_type_msr_track_Numer.iso3_track,n_generated_tx-_type_generated_tx_type.gt_get_iso3_Combi0_ParityType);
                    if( n_value >= 0 ){
                        this._n_parity_type[_type_msr_track_Numer.iso3_track][n_generated_tx-_type_generated_tx_type.gt_get_iso3_Combi0_ParityType] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso1_Combi0_STX_L ://this._c_stxl
                case _type_generated_tx_type.gt_get_iso1_Combi1_STX_L :
                case _type_generated_tx_type.gt_get_iso1_Combi2_STX_L :
                    n_value = _get_stxl_from_response(s_response,_type_msr_track_Numer.iso1_track,n_generated_tx-_type_generated_tx_type.gt_get_iso1_Combi0_STX_L);
                    if( n_value >= 0 ){
                        this._c_stxl[_type_msr_track_Numer.iso1_track][n_generated_tx-_type_generated_tx_type.gt_get_iso1_Combi0_STX_L] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso2_Combi0_STX_L :
                case _type_generated_tx_type.gt_get_iso2_Combi1_STX_L :
                case _type_generated_tx_type.gt_get_iso2_Combi2_STX_L :
                    n_value = _get_stxl_from_response(s_response,_type_msr_track_Numer.iso2_track,n_generated_tx-_type_generated_tx_type.gt_get_iso2_Combi0_STX_L);
                    if( n_value >= 0 ){
                        this._c_stxl[_type_msr_track_Numer.iso2_track][n_generated_tx-_type_generated_tx_type.gt_get_iso2_Combi0_STX_L] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso3_Combi0_STX_L :
                case _type_generated_tx_type.gt_get_iso3_Combi1_STX_L :
                case _type_generated_tx_type.gt_get_iso3_Combi2_STX_L :
                    n_value = _get_stxl_from_response(s_response,_type_msr_track_Numer.iso3_track,n_generated_tx-_type_generated_tx_type.gt_get_iso3_Combi0_STX_L);
                    if( n_value >= 0 ){
                        this._c_stxl[_type_msr_track_Numer.iso3_track][n_generated_tx-_type_generated_tx_type.gt_get_iso3_Combi0_STX_L] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso1_Combi0_ETX_L ://this._c_etxl
                case _type_generated_tx_type.gt_get_iso1_Combi1_ETX_L :
                case _type_generated_tx_type.gt_get_iso1_Combi2_ETX_L :
                    n_value = _get_etxl_from_response(s_response,_type_msr_track_Numer.iso1_track,n_generated_tx-_type_generated_tx_type.gt_get_iso1_Combi0_ETX_L);
                    if( n_value >= 0 ){
                        this._c_etxl[_type_msr_track_Numer.iso1_track][n_generated_tx-_type_generated_tx_type.gt_get_iso1_Combi0_ETX_L] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso2_Combi0_ETX_L :
                case _type_generated_tx_type.gt_get_iso2_Combi1_ETX_L :
                case _type_generated_tx_type.gt_get_iso2_Combi2_ETX_L :
                    n_value = _get_etxl_from_response(s_response,_type_msr_track_Numer.iso2_track,n_generated_tx-_type_generated_tx_type.gt_get_iso2_Combi0_ETX_L);
                    if( n_value >= 0 ){
                        this._c_etxl[_type_msr_track_Numer.iso2_track][n_generated_tx-_type_generated_tx_type.gt_get_iso2_Combi0_ETX_L] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso3_Combi0_ETX_L :
                case _type_generated_tx_type.gt_get_iso3_Combi1_ETX_L :
                case _type_generated_tx_type.gt_get_iso3_Combi2_ETX_L :
                    n_value = _get_etxl_from_response(s_response,_type_msr_track_Numer.iso3_track,n_generated_tx-_type_generated_tx_type.gt_get_iso3_Combi0_ETX_L);
                    if( n_value >= 0 ){
                        this._c_etxl[_type_msr_track_Numer.iso3_track][n_generated_tx-_type_generated_tx_type.gt_get_iso3_Combi0_ETX_L] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso1_Combi0_UseErrorCorrect ://this._b_use_ecm
                case _type_generated_tx_type.gt_get_iso1_Combi1_UseErrorCorrect :
                case _type_generated_tx_type.gt_get_iso1_Combi2_UseErrorCorrect :
                    b_value = _get_use_error_correct_from_response(s_response,_type_msr_track_Numer.iso1_track,n_generated_tx-_type_generated_tx_type.gt_get_iso1_Combi0_UseErrorCorrect);
                    if( b_value !== null ){
                        this._b_use_ecm[_type_msr_track_Numer.iso1_track][n_generated_tx-_type_generated_tx_type.gt_get_iso1_Combi0_UseErrorCorrect] = b_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso2_Combi0_UseErrorCorrect :
                case _type_generated_tx_type.gt_get_iso2_Combi1_UseErrorCorrect :
                case _type_generated_tx_type.gt_get_iso2_Combi2_UseErrorCorrect :
                    b_value = _get_use_error_correct_from_response(s_response,_type_msr_track_Numer.iso2_track,n_generated_tx-_type_generated_tx_type.gt_get_iso2_Combi0_UseErrorCorrect);
                    if( b_value !== null ){
                        this._b_use_ecm[_type_msr_track_Numer.iso2_track][n_generated_tx-_type_generated_tx_type.gt_get_iso2_Combi0_UseErrorCorrect] = b_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso3_Combi0_UseErrorCorrect :
                case _type_generated_tx_type.gt_get_iso3_Combi1_UseErrorCorrect :
                case _type_generated_tx_type.gt_get_iso3_Combi2_UseErrorCorrect :
                    b_value = _get_use_error_correct_from_response(s_response,_type_msr_track_Numer.iso3_track,n_generated_tx-_type_generated_tx_type.gt_get_iso3_Combi0_UseErrorCorrect);
                    if( b_value !== null ){
                        this._b_use_ecm[_type_msr_track_Numer.iso3_track][n_generated_tx-_type_generated_tx_type.gt_get_iso3_Combi0_UseErrorCorrect] = b_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso1_Combi0_ECMType ://this._n_ecm_type
                case _type_generated_tx_type.gt_get_iso1_Combi1_ECMType :
                case _type_generated_tx_type.gt_get_iso1_Combi2_ECMType :
                    n_value = _get_ecm_type_from_response(s_response,_type_msr_track_Numer.iso1_track,n_generated_tx-_type_generated_tx_type.gt_get_iso1_Combi0_ECMType);
                    if( n_value >= 0 ){
                        this._n_ecm_type[_type_msr_track_Numer.iso1_track][n_generated_tx-_type_generated_tx_type.gt_get_iso1_Combi0_ECMType] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso2_Combi0_ECMType :
                case _type_generated_tx_type.gt_get_iso2_Combi1_ECMType :
                case _type_generated_tx_type.gt_get_iso2_Combi2_ECMType :
                    n_value = _get_ecm_type_from_response(s_response,_type_msr_track_Numer.iso2_track,n_generated_tx-_type_generated_tx_type.gt_get_iso2_Combi0_ECMType);
                    if( n_value >= 0 ){
                        this._n_ecm_type[_type_msr_track_Numer.iso2_track][n_generated_tx-_type_generated_tx_type.gt_get_iso2_Combi0_ECMType] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso3_Combi0_ECMType :
                case _type_generated_tx_type.gt_get_iso3_Combi1_ECMType :
                case _type_generated_tx_type.gt_get_iso3_Combi2_ECMType :
                    n_value = _get_ecm_type_from_response(s_response,_type_msr_track_Numer.iso3_track,n_generated_tx-_type_generated_tx_type.gt_get_iso3_Combi0_ECMType);
                    if( n_value >= 0 ){
                        this._n_ecm_type[_type_msr_track_Numer.iso3_track][n_generated_tx-_type_generated_tx_type.gt_get_iso3_Combi0_ECMType] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso1_Combi0_AddValue ://this._n_add_value
                case _type_generated_tx_type.gt_get_iso1_Combi1_AddValue :
                case _type_generated_tx_type.gt_get_iso1_Combi2_AddValue :
                    n_value = _get_add_value_from_response(s_response,_type_msr_track_Numer.iso1_track,n_generated_tx-_type_generated_tx_type.gt_get_iso1_Combi0_AddValue);
                    if( n_value >= 0 ){
                        this._n_add_value[_type_msr_track_Numer.iso1_track][n_generated_tx-_type_generated_tx_type.gt_get_iso1_Combi0_AddValue] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso2_Combi0_AddValue :
                case _type_generated_tx_type.gt_get_iso2_Combi1_AddValue :
                case _type_generated_tx_type.gt_get_iso2_Combi2_AddValue :
                    n_value = _get_add_value_from_response(s_response,_type_msr_track_Numer.iso2_track,n_generated_tx-_type_generated_tx_type.gt_get_iso2_Combi0_AddValue);
                    if( n_value >= 0 ){
                        this._n_add_value[_type_msr_track_Numer.iso2_track][n_generated_tx-_type_generated_tx_type.gt_get_iso2_Combi0_AddValue] = n_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_iso3_Combi0_AddValue :
                case _type_generated_tx_type.gt_get_iso3_Combi1_AddValue :
                case _type_generated_tx_type.gt_get_iso3_Combi2_AddValue :
                    n_value = _get_add_value_from_response(s_response,_type_msr_track_Numer.iso3_track,n_generated_tx-_type_generated_tx_type.gt_get_iso3_Combi0_AddValue);
                    if( n_value >= 0 ){
                        this._n_add_value[_type_msr_track_Numer.iso3_track][n_generated_tx-_type_generated_tx_type.gt_get_iso3_Combi0_AddValue] = n_value;
                        b_result = true;
                    }
                    break;
                    //
                case _type_generated_tx_type.gt_get_private_prefix10:
                case _type_generated_tx_type.gt_get_private_prefix11:
                case _type_generated_tx_type.gt_get_private_prefix12:
                    s_value = _get_private_prefix_from_response(s_response,_type_msr_track_Numer.iso1_track,n_generated_tx-_type_generated_tx_type.gt_get_private_prefix10);
                    if( s_value !== null ){
                        this._s_private_prefix[_type_msr_track_Numer.iso1_track][n_generated_tx-_type_generated_tx_type.gt_get_private_prefix10] = s_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_private_prefix20:
                case _type_generated_tx_type.gt_get_private_prefix21:
                case _type_generated_tx_type.gt_get_private_prefix22:
                    s_value = _get_private_prefix_from_response(s_response,_type_msr_track_Numer.iso2_track,n_generated_tx-_type_generated_tx_type.gt_get_private_prefix20);
                    if( s_value !== null ){
                        this._s_private_prefix[_type_msr_track_Numer.iso2_track][n_generated_tx-_type_generated_tx_type.gt_get_private_prefix20] = s_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_private_prefix30:
                case _type_generated_tx_type.gt_get_private_prefix31:
                case _type_generated_tx_type.gt_get_private_prefix32:
                    s_value = _get_private_prefix_from_response(s_response,_type_msr_track_Numer.iso3_track,n_generated_tx-_type_generated_tx_type.gt_get_private_prefix30);
                    if( s_value !== null ){
                        this._s_private_prefix[_type_msr_track_Numer.iso3_track][n_generated_tx-_type_generated_tx_type.gt_get_private_prefix30] = s_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_private_postfix10:
                case _type_generated_tx_type.gt_get_private_postfix11:
                case _type_generated_tx_type.gt_get_private_postfix12:
                    s_value = _get_private_postfix_from_response(s_response,_type_msr_track_Numer.iso1_track,n_generated_tx-_type_generated_tx_type.gt_get_private_postfix10);
                    if( s_value !== null ){
                        this._s_private_postfix[_type_msr_track_Numer.iso1_track][n_generated_tx-_type_generated_tx_type.gt_get_private_postfix10] = s_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_private_postfix20:
                case _type_generated_tx_type.gt_get_private_postfix21:
                case _type_generated_tx_type.gt_get_private_postfix22:
                    s_value = _get_private_postfix_from_response(s_response,_type_msr_track_Numer.iso2_track,n_generated_tx-_type_generated_tx_type.gt_get_private_postfix20);
                    if( s_value !== null ){
                        this._s_private_postfix[_type_msr_track_Numer.iso2_track][n_generated_tx-_type_generated_tx_type.gt_get_private_postfix20] = s_value;
                        b_result = true;
                    }
                    break;
                case _type_generated_tx_type.gt_get_private_postfix30:
                case _type_generated_tx_type.gt_get_private_postfix31:
                case _type_generated_tx_type.gt_get_private_postfix32:
                    s_value = _get_private_postfix_from_response(s_response,_type_msr_track_Numer.iso3_track,n_generated_tx-_type_generated_tx_type.gt_get_private_postfix30);
                    if( s_value !== null ){
                        this._s_private_postfix[_type_msr_track_Numer.iso3_track][n_generated_tx-_type_generated_tx_type.gt_get_private_postfix30] = s_value;
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
                case _type_generated_tx_type.gt_set_indicate_error_condition:
                case _type_generated_tx_type.gt_set_ignore_iso1:
                case _type_generated_tx_type.gt_set_ignore_iso3:
                case _type_generated_tx_type.gt_set_remove_colon:
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
                    //
                case _type_generated_tx_type.gt_set_iso1_number_combi :
                case _type_generated_tx_type.gt_set_iso2_number_combi :
                case _type_generated_tx_type.gt_set_iso3_number_combi :
                case _type_generated_tx_type.gt_set_iso1_Combi0_MaxSize :
                case _type_generated_tx_type.gt_set_iso1_Combi1_MaxSize :
                case _type_generated_tx_type.gt_set_iso1_Combi2_MaxSize :
                case _type_generated_tx_type.gt_set_iso2_Combi0_MaxSize :
                case _type_generated_tx_type.gt_set_iso2_Combi1_MaxSize :
                case _type_generated_tx_type.gt_set_iso2_Combi2_MaxSize :
                case _type_generated_tx_type.gt_set_iso3_Combi0_MaxSize :
                case _type_generated_tx_type.gt_set_iso3_Combi1_MaxSize :
                case _type_generated_tx_type.gt_set_iso3_Combi2_MaxSize :
                case _type_generated_tx_type.gt_set_iso1_Combi0_BitSize :
                case _type_generated_tx_type.gt_set_iso1_Combi1_BitSize :
                case _type_generated_tx_type.gt_set_iso1_Combi2_BitSize :
                case _type_generated_tx_type.gt_set_iso2_Combi0_BitSize :
                case _type_generated_tx_type.gt_set_iso2_Combi1_BitSize :
                case _type_generated_tx_type.gt_set_iso2_Combi2_BitSize :
                case _type_generated_tx_type.gt_set_iso3_Combi0_BitSize :
                case _type_generated_tx_type.gt_set_iso3_Combi1_BitSize :
                case _type_generated_tx_type.gt_set_iso3_Combi2_BitSize :
                case _type_generated_tx_type.gt_set_iso1_Combi0_DataMask :
                case _type_generated_tx_type.gt_set_iso1_Combi1_DataMask :
                case _type_generated_tx_type.gt_set_iso1_Combi2_DataMask :
                case _type_generated_tx_type.gt_set_iso2_Combi0_DataMask :
                case _type_generated_tx_type.gt_set_iso2_Combi1_DataMask :
                case _type_generated_tx_type.gt_set_iso2_Combi2_DataMask :
                case _type_generated_tx_type.gt_set_iso3_Combi0_DataMask :
                case _type_generated_tx_type.gt_set_iso3_Combi1_DataMask :
                case _type_generated_tx_type.gt_set_iso3_Combi2_DataMask :
                case _type_generated_tx_type.gt_set_iso1_Combi0_UseParity :// this._b_use_parity
                case _type_generated_tx_type.gt_set_iso1_Combi1_UseParity :
                case _type_generated_tx_type.gt_set_iso1_Combi2_UseParity :
                case _type_generated_tx_type.gt_set_iso2_Combi0_UseParity :
                case _type_generated_tx_type.gt_set_iso2_Combi1_UseParity :
                case _type_generated_tx_type.gt_set_iso2_Combi2_UseParity :
                case _type_generated_tx_type.gt_set_iso3_Combi0_UseParity :
                case _type_generated_tx_type.gt_set_iso3_Combi1_UseParity :
                case _type_generated_tx_type.gt_set_iso3_Combi2_UseParity :
                case _type_generated_tx_type.gt_set_iso1_Combi0_ParityType ://this._n_parity_type
                case _type_generated_tx_type.gt_set_iso1_Combi1_ParityType :
                case _type_generated_tx_type.gt_set_iso1_Combi2_ParityType :
                case _type_generated_tx_type.gt_set_iso2_Combi0_ParityType :
                case _type_generated_tx_type.gt_set_iso2_Combi1_ParityType :
                case _type_generated_tx_type.gt_set_iso2_Combi2_ParityType :
                case _type_generated_tx_type.gt_set_iso3_Combi0_ParityType :
                case _type_generated_tx_type.gt_set_iso3_Combi1_ParityType :
                case _type_generated_tx_type.gt_set_iso3_Combi2_ParityType :
                case _type_generated_tx_type.gt_set_iso1_Combi0_STX_L ://this._c_stxl
                case _type_generated_tx_type.gt_set_iso1_Combi1_STX_L :
                case _type_generated_tx_type.gt_set_iso1_Combi2_STX_L :
                case _type_generated_tx_type.gt_set_iso2_Combi0_STX_L :
                case _type_generated_tx_type.gt_set_iso2_Combi1_STX_L :
                case _type_generated_tx_type.gt_set_iso2_Combi2_STX_L :
                case _type_generated_tx_type.gt_set_iso3_Combi0_STX_L :
                case _type_generated_tx_type.gt_set_iso3_Combi1_STX_L :
                case _type_generated_tx_type.gt_set_iso3_Combi2_STX_L :
                case _type_generated_tx_type.gt_set_iso1_Combi0_ETX_L ://this._c_etxl
                case _type_generated_tx_type.gt_set_iso1_Combi1_ETX_L :
                case _type_generated_tx_type.gt_set_iso1_Combi2_ETX_L :
                case _type_generated_tx_type.gt_set_iso2_Combi0_ETX_L :
                case _type_generated_tx_type.gt_set_iso2_Combi1_ETX_L :
                case _type_generated_tx_type.gt_set_iso2_Combi2_ETX_L :
                case _type_generated_tx_type.gt_set_iso3_Combi0_ETX_L :
                case _type_generated_tx_type.gt_set_iso3_Combi1_ETX_L :
                case _type_generated_tx_type.gt_set_iso3_Combi2_ETX_L :
                case _type_generated_tx_type.gt_set_iso1_Combi0_UseErrorCorrect ://this._b_use_ecm
                case _type_generated_tx_type.gt_set_iso1_Combi1_UseErrorCorrect :
                case _type_generated_tx_type.gt_set_iso1_Combi2_UseErrorCorrect :
                case _type_generated_tx_type.gt_set_iso2_Combi0_UseErrorCorrect :
                case _type_generated_tx_type.gt_set_iso2_Combi1_UseErrorCorrect :
                case _type_generated_tx_type.gt_set_iso2_Combi2_UseErrorCorrect :
                case _type_generated_tx_type.gt_set_iso3_Combi0_UseErrorCorrect :
                case _type_generated_tx_type.gt_set_iso3_Combi1_UseErrorCorrect :
                case _type_generated_tx_type.gt_set_iso3_Combi2_UseErrorCorrect :
                case _type_generated_tx_type.gt_set_iso1_Combi0_ECMType ://this._n_ecm_type
                case _type_generated_tx_type.gt_set_iso1_Combi1_ECMType :
                case _type_generated_tx_type.gt_set_iso1_Combi2_ECMType :
                case _type_generated_tx_type.gt_set_iso2_Combi0_ECMType :
                case _type_generated_tx_type.gt_set_iso2_Combi1_ECMType :
                case _type_generated_tx_type.gt_set_iso2_Combi2_ECMType :
                case _type_generated_tx_type.gt_set_iso3_Combi0_ECMType :
                case _type_generated_tx_type.gt_set_iso3_Combi1_ECMType :
                case _type_generated_tx_type.gt_set_iso3_Combi2_ECMType :
                case _type_generated_tx_type.gt_set_iso1_Combi0_AddValue ://this._n_add_value
                case _type_generated_tx_type.gt_set_iso1_Combi1_AddValue :
                case _type_generated_tx_type.gt_set_iso1_Combi2_AddValue :
                case _type_generated_tx_type.gt_set_iso2_Combi0_AddValue :
                case _type_generated_tx_type.gt_set_iso2_Combi1_AddValue :
                case _type_generated_tx_type.gt_set_iso2_Combi2_AddValue :
                case _type_generated_tx_type.gt_set_iso3_Combi0_AddValue :
                case _type_generated_tx_type.gt_set_iso3_Combi1_AddValue :
                case _type_generated_tx_type.gt_set_iso3_Combi2_AddValue :
                    //
                case _type_generated_tx_type.gt_set_private_prefix10:
                case _type_generated_tx_type.gt_set_private_prefix11:
                case _type_generated_tx_type.gt_set_private_prefix12:                    
                case _type_generated_tx_type.gt_set_private_prefix20:
                case _type_generated_tx_type.gt_set_private_prefix21:
                case _type_generated_tx_type.gt_set_private_prefix22:
                case _type_generated_tx_type.gt_set_private_prefix30:
                case _type_generated_tx_type.gt_set_private_prefix31:
                case _type_generated_tx_type.gt_set_private_prefix32:
                case _type_generated_tx_type.gt_set_private_postfix10:
                case _type_generated_tx_type.gt_set_private_postfix11:
                case _type_generated_tx_type.gt_set_private_postfix12:
                case _type_generated_tx_type.gt_set_private_postfix20:
                case _type_generated_tx_type.gt_set_private_postfix21:
                case _type_generated_tx_type.gt_set_private_postfix22:
                case _type_generated_tx_type.gt_set_private_postfix30:
                case _type_generated_tx_type.gt_set_private_postfix31:
                case _type_generated_tx_type.gt_set_private_postfix32:
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
         * @public this function may be deleted. -_-;;
         * @function elpusk.device.usb.hid.lpu237.update_firmware
         * @param {File} file_rom rom file contains a firmware.
         * @return {Promise} processing result.
         * @description send a rom file data to server.
         */
        _elpusk.device.usb.hid.lpu237.prototype.update_firmware = function(file_rom){

            var this_device = this;

            return new Promise(function (resolve, reject) {

                do{
                    /*
                    if( typeof file_rom !== 'object'){
                        reject(_get_error_object('en_e_parameter'));
                        continue;
                    }
                    */
                    //
                    var reader = new FileReader();

                    reader._device = this_device;
                    
                    reader.onload = function(evt) {
                        var array_data = evt.target.result;
                        var b_result = false;
                        var s_hex="";
                        var s_hex_total="";
                        do{
                            var bytes  = new Uint8Array(array_data);

                            var length = bytes.byteLength;
                            for (var i = 0; i < length; i++) {
                                s_hex = bytes[i].toString(16);
                                if( s_hex.length == 1){
                                    s_hex = "0"+s_hex;
                                }
                                s_hex_total += s_hex;
                            }

                            b_result = true;
                        }while(false);

                        if( b_result ){
                            resolve(true);
                        }
                        else{//error
                            reject(_get_error_object('en_e_parameter'));
                        }
                        //
                        
                    };// the end of onload event handler.
                    //
                    reader.readAsArrayBuffer(file_rom);
    
                }while(false);
                
            });//the end of Promise definition.
        }   

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.save_to_sessionStorage
         * @description the data of this object instance save to sessionStorage.
         */
        _elpusk.device.usb.hid.lpu237.prototype.save_to_sessionStorage = function(){
            var s_key_p = "{EB7BECC9-E37D-4F41-BDBF-104D5AD624E6}";
            var ss = window.sessionStorage;

            ss.setItem(s_key_p+'_b_global_pre_postfix_send_condition',JSON.stringify(this._b_global_pre_postfix_send_condition));
    
            ///////////////////////////////
            //device parameters
            ss.setItem(s_key_p+'_n_interface',JSON.stringify(this._n_interface));
            ss.setItem(s_key_p+'_dw_buzzer_frequency',JSON.stringify(this._dw_buzzer_frequency));
            ss.setItem(s_key_p+'_dw_boot_run_time',JSON.stringify(this._dw_boot_run_time));
            ss.setItem(s_key_p+'_n_language_index',JSON.stringify(this._n_language_index));
    
            ss.setItem(s_key_p+'_b_enable_iso',JSON.stringify(this._b_enable_iso));
    
            ss.setItem(s_key_p+'_n_direction',JSON.stringify(this._n_direction));
    
            ss.setItem(s_key_p+'_s_global_prefix',JSON.stringify(this._s_global_prefix));
            ss.setItem(s_key_p+'_s_global_postfix',JSON.stringify(this._s_global_postfix));
    
            ss.setItem(s_key_p+'_n_number_combination',JSON.stringify(this._n_number_combination ));
            ss.setItem(s_key_p+'_n_max_size',JSON.stringify(this._n_max_size));
            ss.setItem(s_key_p+'_n_bit_size',JSON.stringify(this._n_bit_size));
            ss.setItem(s_key_p+'_c_data_mask',JSON.stringify(this._c_data_mask));
            ss.setItem(s_key_p+'_b_use_parity',JSON.stringify(this._b_use_parity));
            ss.setItem(s_key_p+'_n_parity_type',JSON.stringify(this._n_parity_type));
            ss.setItem(s_key_p+'_c_stxl',JSON.stringify(this._c_stxl));
            ss.setItem(s_key_p+'_c_etxl',JSON.stringify(this._c_etxl));
            ss.setItem(s_key_p+'_b_use_ecm',JSON.stringify(this._b_use_ecm));
            ss.setItem(s_key_p+'_n_ecm_type',JSON.stringify(this._n_ecm_type));
            ss.setItem(s_key_p+'_n_add_value',JSON.stringify(this._n_add_value));

            ss.setItem(s_key_p+'_s_private_prefix',JSON.stringify(this._s_private_prefix));
            ss.setItem(s_key_p+'_s_private_postfix',JSON.stringify(this._s_private_postfix));

            //i-button
            ss.setItem(s_key_p+'_s_prefix_ibutton',JSON.stringify(this._s_prefix_ibutton));
            ss.setItem(s_key_p+'_s_postfix_ibutton',JSON.stringify(this._s_postfix_ibutton));

            ss.setItem(s_key_p+'_n_ibutton_mode',JSON.stringify(this._n_ibutton_mode));
            ss.setItem(s_key_p+'_c_blank',JSON.stringify(this._c_blank));

            //rs232
            ss.setItem(s_key_p+'_s_prefix_uart',JSON.stringify(this._s_prefix_uart));
            ss.setItem(s_key_p+'_s_postfix_uart',JSON.stringify(this._s_postfix_uart));
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.set_from_sessionStorage
         * @description the data of this object instance load from sessionStorage.
         */
        _elpusk.device.usb.hid.lpu237.prototype.set_from_sessionStorage = function(){
            var s_key_p = "{EB7BECC9-E37D-4F41-BDBF-104D5AD624E6}";
            var ss = window.sessionStorage;
            
            this._b_global_pre_postfix_send_condition = JSON.parse(ss.getItem(s_key_p+'_b_global_pre_postfix_send_condition'));
    
            ///////////////////////////////
            //device parameters
            this._n_interface = JSON.parse(ss.getItem(s_key_p+'_n_interface'));
            this._dw_buzzer_frequency = JSON.parse(ss.getItem(s_key_p+'_dw_buzzer_frequency'));
            this._dw_boot_run_time = JSON.parse(ss.getItem(s_key_p+'_dw_boot_run_time'));
            this._n_language_index = JSON.parse(ss.getItem(s_key_p+'_n_language_index'));
            this._b_enable_iso = JSON.parse(ss.getItem(s_key_p+'_b_enable_iso'));
            this._n_direction = JSON.parse(ss.getItem(s_key_p+'_n_direction'));
            this._s_global_prefix = JSON.parse(ss.getItem(s_key_p+'_s_global_prefix'));
            this._s_global_postfix = JSON.parse(ss.getItem(s_key_p+'_s_global_postfix'));
            this._n_number_combination = JSON.parse(ss.getItem(s_key_p+'_n_number_combination'));
            this._n_max_size = JSON.parse(ss.getItem(s_key_p+'_n_max_size'));
            this._n_bit_size = JSON.parse(ss.getItem(s_key_p+'_n_bit_size'));
            this._c_data_mask = JSON.parse(ss.getItem(s_key_p+'_c_data_mask'));
            this._b_use_parity = JSON.parse(ss.getItem(s_key_p+'_b_use_parity'));
            this._n_parity_type = JSON.parse(ss.getItem(s_key_p+'_n_parity_type'));
            this._c_stxl = JSON.parse(ss.getItem(s_key_p+'_c_stxl'));
            this._c_etxl = JSON.parse(ss.getItem(s_key_p+'_c_etxl'));
            this._b_use_ecm = JSON.parse(ss.getItem(s_key_p+'_b_use_ecm'));
            this._n_ecm_type = JSON.parse(ss.getItem(s_key_p+'_n_ecm_type'));
            this._n_add_value = JSON.parse(ss.getItem(s_key_p+'_n_add_value'));
            this._s_private_prefix = JSON.parse(ss.getItem(s_key_p+'_s_private_prefix'));
            this._s_private_postfix = JSON.parse(ss.getItem(s_key_p+'_s_private_postfix'));
            this._s_prefix_ibutton = JSON.parse(ss.getItem(s_key_p+'_s_prefix_ibutton'));
            this._s_postfix_ibutton = JSON.parse(ss.getItem(s_key_p+'_s_postfix_ibutton'));
            this._n_ibutton_mode = JSON.parse(ss.getItem(s_key_p+'_n_ibutton_mode'));
            this._c_blank = JSON.parse(ss.getItem(s_key_p+'_c_blank'));
            this._s_prefix_uart = JSON.parse(ss.getItem(s_key_p+'_s_prefix_uart'));
            this._s_postfix_uart = JSON.parse(ss.getItem(s_key_p+'_s_postfix_uart'));
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
                        var b_indicate_all_success_is_success = null;
                        var b_ignore_iso1 = null;
                        var b_ignore_iso3 = null;
                        var b_remove_colon = null;
                        var n_ibutton = null;
                        var n_direction = null;
                        var s_gpre = null;
                        var s_gpost = null;

                        var n_combination = [null,null,null];
                        var n_max_size = [[null,null,null],[null,null,null],[null,null,null]];
                        var n_bit_size = [[null,null,null],[null,null,null],[null,null,null]];
                        var n_data_mask = [[null,null,null],[null,null,null],[null,null,null]];
                        var b_use_parity = [[null,null,null],[null,null,null],[null,null,null]];
                        var n_parity_type = [[null,null,null],[null,null,null],[null,null,null]];
                        var n_stxl = [[null,null,null],[null,null,null],[null,null,null]];
                        var n_etxl = [[null,null,null],[null,null,null],[null,null,null]];
                        var b_use_error_correct = [[null,null,null],[null,null,null],[null,null,null]];
                        var n_error_correct_type = [[null,null,null],[null,null,null],[null,null,null]];
                        var n_add_value = [[null,null,null],[null,null,null],[null,null,null]];

                        var s_ppretag = [[null,null,null],[null,null,null],[null,null,null]];
                        var s_pposttag = [[null,null,null],[null,null,null],[null,null,null]];
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
                                // indication attribute
                                s_attr_name = "indication";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    b_indicate_all_success_is_success = _get_indicate_error_condition_from_string(s_attr);
                                    if( b_indicate_all_success_is_success === null ){
                                        continue;
                                    }
                                }

                                // ignore1 attribute
                                s_attr_name = "ignore1";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    b_ignore_iso1 = _get_enable_track_from_string(s_attr);
                                    if( b_ignore_iso1 === null ){
                                        continue;
                                    }
                                }
                                // ignore3 attribute
                                s_attr_name = "ignore3";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    b_ignore_iso3 = _get_enable_track_from_string(s_attr);
                                    if( b_ignore_iso3 === null ){
                                        continue;
                                    }
                                }
                                // rm_colon attribute
                                s_attr_name = "rm_colon";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    b_remove_colon = _get_enable_track_from_string(s_attr);
                                    if( b_remove_colon === null ){
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
                                    s_gpre = _get_hid_key_pair_hex_string_from_string(s_attr);
                                    if( s_gpre === null ){
                                        continue;
                                    }
                                }
                                // postfix attribute
                                s_attr_name = "postfix";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    s_gpost = _get_hid_key_pair_hex_string_from_string(s_attr);
                                    if( s_gpost === null ){
                                        continue;
                                    }
                                }
                            }//the end of global element.

                            //iso1~iso3 element
                            var n_track = 0;
                            var s_track = "iso";
                            for( n_track = 0; n_track<_const_the_number_of_track; n_track ++ ){
                                s_track = "iso" + String(n_track+1);
                                array_ele = xml_doc.getElementsByTagName(s_track);
                                if(array_ele.length>0 ){
                                    ele =  array_ele[0];

                                    // prefix attribute
                                    s_attr_name = "prefix";
                                    if( ele.hasAttribute(s_attr_name)){
                                        s_attr = ele.getAttribute(s_attr_name);
                                        s_ppretag[0][0] = _get_hid_key_pair_hex_string_from_string(s_attr);
                                        if( s_ppretag[0][0] === null ){
                                            continue;
                                        }
                                    }
                                    // postfix attribute
                                    s_attr_name = "postfix";
                                    if( ele.hasAttribute(s_attr_name)){
                                        s_attr = ele.getAttribute(s_attr_name);
                                        s_pposttag[0][0] = _get_hid_key_pair_hex_string_from_string(s_attr);
                                        if( s_pposttag[0][0] === null ){
                                            continue;
                                        }
                                    }
                                    ////////////////////////////////////////////////////
                                    //
                                    s_attr_name = "combination";
                                    if( ele.hasAttribute(s_attr_name)){
                                        s_attr = ele.getAttribute(s_attr_name);
                                        n_combination[n_track] = parseInt(s_attr,10);
                                        if( isNaN(n_combination[n_track])  ){
                                            n_combination[n_track] = null;
                                            continue;
                                        }
                                    }

                                    var i;
                                    for( i = 0; i<_const_the_number_of_combination; i++ ){
                                        s_attr_name = "max_size";
                                        s_attr_name += String(i);
                                        if( ele.hasAttribute(s_attr_name)){
                                            s_attr = ele.getAttribute(s_attr_name);
                                            n_max_size[n_track][i] = parseInt(s_attr,10);
                                            if( isNaN(n_max_size[n_track][i])  ){
                                                n_max_size[n_track][i] = null;
                                                break;//exit for
                                            }
                                        }
                                        //
                                        s_attr_name = "bit_size";
                                        s_attr_name += String(i);
                                        if( ele.hasAttribute(s_attr_name)){
                                            s_attr = ele.getAttribute(s_attr_name);
                                            n_bit_size[n_track][i] = parseInt(s_attr,10);
                                            if( isNaN(n_bit_size[n_track][i])  ){
                                                n_bit_size[n_track][i] = null;
                                                break;//exit for
                                            }
                                        }
                                        //
                                        s_attr_name = "data_mask";
                                        s_attr_name += String(i);
                                        if( ele.hasAttribute(s_attr_name)){
                                            s_attr = ele.getAttribute(s_attr_name);
                                            n_data_mask[n_track][i] = parseInt(s_attr,16);
                                            if( isNaN(n_data_mask[n_track][i])  ){
                                                n_data_mask[n_track][i] = null;
                                                break;//exit for
                                            }
                                        }
                                        //
                                        s_attr_name = "use_parity";
                                        s_attr_name += String(i);
                                        if( ele.hasAttribute(s_attr_name)){
                                            s_attr = ele.getAttribute(s_attr_name);
                                            b_use_parity[n_track][i] = _get_enable_track_from_string(s_attr);
                                            if( b_use_parity[n_track][i]===null  ){
                                                break;//exit for
                                            }
                                        }
                                        //
                                        s_attr_name = "parity_type";
                                        s_attr_name += String(i);
                                        if( ele.hasAttribute(s_attr_name)){
                                            s_attr = ele.getAttribute(s_attr_name);
                                            n_parity_type[n_track][i] = _get_parity_type_from_string(s_attr);
                                            if( n_parity_type[n_track][i]<0  ){
                                                n_parity_type[n_track][i] = null;
                                                break;//exit for
                                            }
                                        }
                                        //
                                        s_attr_name = "stxl";
                                        s_attr_name += String(i);
                                        if( ele.hasAttribute(s_attr_name)){
                                            s_attr = ele.getAttribute(s_attr_name);
                                            n_stxl[n_track][i] = parseInt(s_attr,16);
                                            if( isNaN(n_stxl[n_track][i])  ){
                                                n_stxl[n_track][i] = null;
                                                break;//exit for
                                            }
                                        }
                                        //
                                        s_attr_name = "etxl";
                                        s_attr_name += String(i);
                                        if( ele.hasAttribute(s_attr_name)){
                                            s_attr = ele.getAttribute(s_attr_name);
                                            n_etxl[n_track][i] = parseInt(s_attr,16);
                                            if( isNaN(n_etxl[n_track][i])  ){
                                                n_etxl[n_track][i] = null;
                                                break;//exit for
                                            }
                                        }
                                        //
                                        s_attr_name = "use_error_correct";
                                        s_attr_name += String(i);
                                        if( ele.hasAttribute(s_attr_name)){
                                            s_attr = ele.getAttribute(s_attr_name);
                                            b_use_error_correct[n_track][i] = _get_enable_track_from_string(s_attr);
                                            if( b_use_error_correct[n_track][i]===null  ){
                                                break;//exit for
                                            }
                                        }
                                        //
                                        s_attr_name = "error_correct_type";
                                        s_attr_name += String(i);
                                        if( ele.hasAttribute(s_attr_name)){
                                            s_attr = ele.getAttribute(s_attr_name);
                                            n_error_correct_type[n_track][i] = _get_error_correct_type_from_string(s_attr);
                                            if( n_error_correct_type[n_track][i]<0  ){
                                                n_error_correct_type[n_track][i] = null;
                                                break;//exit for
                                            }
                                        }
                                        //
                                        s_attr_name = "add_value";
                                        s_attr_name += String(i);
                                        if( ele.hasAttribute(s_attr_name)){
                                            s_attr = ele.getAttribute(s_attr_name);
                                            n_add_value[n_track][i] = parseInt(s_attr,10);
                                            if( isNaN(n_add_value[n_track][i])  ){
                                                n_add_value[n_track][i] = null;
                                                break;//exit for
                                            }
                                        }
                                        // new prefix attribute
                                        s_attr_name = "prefix";
                                        s_attr_name += String(i);
                                        if( ele.hasAttribute(s_attr_name)){
                                            s_attr = ele.getAttribute(s_attr_name);
                                            s_ppretag[n_track][i] = _get_hid_key_pair_hex_string_from_string(s_attr);
                                            if( s_ppretag[n_track][i] === null ){
                                                break;//exit for
                                            }
                                        }
                                        // new postfix attribute
                                        s_attr_name = "postfix";
                                        s_attr_name += String(i);
                                        if( ele.hasAttribute(s_attr_name)){
                                            s_attr = ele.getAttribute(s_attr_name);
                                            s_pposttag[n_track][i] = _get_hid_key_pair_hex_string_from_string(s_attr);
                                            if( s_pposttag[n_track][i] === null ){
                                                break;//exit for
                                            }
                                        }
                                    }//end for

                                    if( i<_const_the_number_of_combination ){
                                        continue;//error
                                    }
                                }//the end of iso1~3 element.
                            }//end for n_track

                            //ibutton element
                            array_ele = xml_doc.getElementsByTagName("ibutton");
                            if(array_ele.length>0 ){
                                ele =  array_ele[0];
                                
                                // prefix attribute
                                s_attr_name = "prefix";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    s_ipre = _get_hid_key_pair_hex_string_from_string(s_attr);
                                    if( s_ipre === null ){
                                        continue;
                                    }
                                }
                                // postfix attribute
                                s_attr_name = "postfix";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    s_ipost = _get_hid_key_pair_hex_string_from_string(s_attr);
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
                                    s_upre = _get_hid_key_pair_hex_string_from_string(s_attr);
                                    if( s_upre === null ){
                                        continue;
                                    }
                                }
                                // postfix attribute
                                s_attr_name = "postfix";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    s_upost = _get_hid_key_pair_hex_string_from_string(s_attr);
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
                                    s_upre = _get_hid_key_pair_hex_string_from_string(s_attr);
                                    if( s_upre === null ){
                                        continue;
                                    }
                                }
                                // postfix attribute
                                s_attr_name = "postfix";
                                if( ele.hasAttribute(s_attr_name)){
                                    s_attr = ele.getAttribute(s_attr_name);
                                    s_upost = _get_hid_key_pair_hex_string_from_string(s_attr);
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
                            if( b_indicate_all_success_is_success !== null ){
                                var b_indicate_set= true;
                                if( !(this._device._c_blank[1]&0x01) ){
                                    b_indicate_set = false;
                                }
                                if( b_indicate_all_success_is_success && b_indicate_set ){
                                    elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_IndicateErrorCondition );
                                    this._device._c_blank[1] =  this._device._c_blank[1] & 0xfe;
                                }
                                else if( !b_indicate_all_success_is_success && !b_indicate_set ){
                                    elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_IndicateErrorCondition );
                                    this._device._c_blank[1] =  this._device._c_blank[1] | 0x01;
                                }
                            }
                            if( b_ignore_iso1 !== null){
                                var b_ignore_iso1_cur = false;
                                if( this._device._c_blank[1]&0x02 ){
                                    b_ignore_iso1_cur = true;
                                }
                                if( b_ignore_iso1 && !b_ignore_iso1_cur ){
                                    elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_EnableIgnoreISO1 );
                                    this._device._c_blank[1] =  this._device._c_blank[1] | 0x02;
                                }
                                else if( !b_ignore_iso1 && b_ignore_iso1_cur ){
                                    elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_EnableIgnoreISO1 );
                                    this._device._c_blank[1] =  this._device._c_blank[1] & 0xfd;
                                }
                            }
                            if( b_ignore_iso3 !== null){
                                var b_ignore_iso3_cur = false;
                                if( this._device._c_blank[1]&0x04 ){
                                    b_ignore_iso3_cur = true;
                                }
                                if( b_ignore_iso3 && !b_ignore_iso3_cur ){
                                    elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_EnableIgnoreISO3 );
                                    this._device._c_blank[1] =  this._device._c_blank[1] | 0x04;
                                }
                                else if( !b_ignore_iso3 && b_ignore_iso3_cur ){
                                    elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_EnableIgnoreISO3 );
                                    this._device._c_blank[1] =  this._device._c_blank[1] & 0xfb;
                                }
                            }
                            if( b_remove_colon !== null){
                                var b_remove_colon_cur = false;
                                if( this._device._c_blank[1]&0x08 ){
                                    b_remove_colon_cur = true;
                                }
                                if( b_remove_colon && !b_remove_colon_cur ){
                                    elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_EnableRemoveColon );
                                    this._device._c_blank[1] =  this._device._c_blank[1] | 0x08;
                                }
                                else if( !b_remove_colon && b_remove_colon_cur ){
                                    elpusk.util.insert_to_set ( this._device._set_change_parameter, _type_change_parameter.cp_EnableRemoveColon );
                                    this._device._c_blank[1] =  this._device._c_blank[1] & 0xf7;
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

                            for( var i = 0; i<_const_the_number_of_track; i++ ){
                                if( n_combination[i] !== null ){
                                    if( this._device._n_number_combination[i] !== n_combination[i]){
                                        elpusk.util.insert_to_set ( this._device._set_change_parameter
                                            , _type_change_parameter.cp_ISO1_NumberCombi+i );
                                        this._device._n_number_combination[i] = n_combination[i];
                                    }
                                }

                                if( array_b_enable_track[i] !== null ){
                                    if( this._device._b_enable_iso[i]  !== array_b_enable_track[i] ){
                                        elpusk.util.insert_to_set ( this._device._set_change_parameter
                                            , _type_change_parameter.cp_EnableISO1+i );
                                        this._device._b_enable_iso[i]  = array_b_enable_track[i];
                                    }
                                }
                                //
                                for( var j=0; j<_const_the_number_of_combination; j++ ){
                                    if( n_max_size[i][j] !== null){
                                        if(this._device._n_max_size[i][j] !== n_max_size[i][j]){
                                            elpusk.util.insert_to_set ( this._device._set_change_parameter
                                                , _type_change_parameter.cp_ISO1_Combi0_MaxSize + i*_const_the_number_of_combination + j );
                                            this._device._n_max_size[i][j] = n_max_size[i][j];
                                        }
                                    }
                                    if( n_bit_size[i][j] !== null){
                                        if(this._device._n_bit_size[i][j] !== n_bit_size[i][j]){
                                            elpusk.util.insert_to_set ( this._device._set_change_parameter
                                                , _type_change_parameter.cp_ISO1_Combi0_BitSize + i*_const_the_number_of_combination + j );
                                            this._device._n_bit_size[i][j] = n_bit_size[i][j];
                                        }
                                    }
                                    if( n_data_mask[i][j] !== null){
                                        if(this._device._c_data_mask[i][j] !== n_data_mask[i][j]){
                                            elpusk.util.insert_to_set ( this._device._set_change_parameter
                                                , _type_change_parameter.cp_ISO1_Combi0_DataMask + i*_const_the_number_of_combination + j );
                                            this._device._c_data_mask[i][j] = n_data_mask[i][j];
                                        }
                                    }
                                    if( b_use_parity[i][j] !== null){
                                        if(this._device._b_use_parity[i][j] !== b_use_parity[i][j]){
                                            elpusk.util.insert_to_set ( this._device._set_change_parameter
                                                , _type_change_parameter.cp_ISO1_Combi0_UseParity + i*_const_the_number_of_combination + j );
                                            this._device._b_use_parity[i][j] = b_use_parity[i][j];
                                        }
                                    }
                                    if( n_parity_type[i][j] !== null){
                                        if(this._device._n_parity_type[i][j] !== n_parity_type[i][j]){
                                            elpusk.util.insert_to_set ( this._device._set_change_parameter
                                                , _type_change_parameter.cp_ISO1_Combi0_ParityType + i*_const_the_number_of_combination + j );
                                            this._device._n_parity_type[i][j] = n_parity_type[i][j];
                                        }
                                    }
                                    if( n_stxl[i][j] !== null){
                                        if(this._device._c_stxl[i][j] !== n_stxl[i][j]){
                                            elpusk.util.insert_to_set ( this._device._set_change_parameter
                                                , _type_change_parameter.cp_ISO1_Combi0_STX_L + i*_const_the_number_of_combination + j );
                                            this._device._c_stxl[i][j] = n_stxl[i][j];
                                        }
                                    }
                                    if( n_etxl[i][j] !== null){
                                        if(this._device._c_etxl[i][j] !== n_etxl[i][j]){
                                            elpusk.util.insert_to_set ( this._device._set_change_parameter
                                                , _type_change_parameter.cp_ISO1_Combi0_ETX_L + i*_const_the_number_of_combination + j );
                                            this._device._c_etxl[i][j] = n_etxl[i][j];
                                        }
                                    }
                                    if( b_use_error_correct[i][j] !== null){
                                        if(this._device._b_use_ecm[i][j] !== b_use_error_correct[i][j]){
                                            elpusk.util.insert_to_set ( this._device._set_change_parameter
                                                , _type_change_parameter.cp_ISO1_Combi0_UseErrorCorrect + i*_const_the_number_of_combination + j );
                                            this._device._b_use_ecm[i][j] = b_use_error_correct[i][j];
                                        }
                                    }
                                    if( n_error_correct_type[i][j] !== null){
                                        if(this._device._n_ecm_type[i][j] !== n_error_correct_type[i][j]){
                                            elpusk.util.insert_to_set ( this._device._set_change_parameter
                                                , _type_change_parameter.cp_ISO1_Combi0_ECMType + i*_const_the_number_of_combination + j );
                                            this._device._n_ecm_type[i][j] = n_error_correct_type[i][j];
                                        }
                                    }
                                    if( n_add_value[i][j] !== null){
                                        if(this._device._n_add_value[i][j] !== n_add_value[i][j]){
                                            elpusk.util.insert_to_set ( this._device._set_change_parameter
                                                , _type_change_parameter.cp_ISO1_Combi0_AddValue + i*_const_the_number_of_combination + j );
                                            this._device._n_add_value[i][j] = n_add_value[i][j];
                                        }
                                    }
                                    if( s_ppretag[i][j] !== null ){
                                        if(!_is_equal_tag(this._device._s_private_prefix[i][j],s_ppretag[i][j])){
                                            elpusk.util.insert_to_set ( this._device._set_change_parameter
                                                , _type_change_parameter.cp_PrivatePrefix10 + i*_const_the_number_of_combination + j );
                                            this._device._s_private_prefix[i][j] = s_ppretag[i][j];
                                        }
                                    }
                                    if( s_pposttag[i][j] !== null ){
                                        if( !_is_equal_tag(this._device._s_private_postfix[i][j],s_pposttag[i][j]) ){
                                            elpusk.util.insert_to_set ( this._device._set_change_parameter
                                                , _type_change_parameter.cp_PrivatePostfix10 + i*_const_the_number_of_combination + j );
                                            this._device._s_private_postfix[i][j] = s_pposttag[i][j];
                                        }
                                    }
                                }//end for j
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
         * @function elpusk.device.usb.hid.lpu237.reset_msr_data
         * @param {number} n_track iso track number 0~2.
         * @description reset buffer that contains a card data.
         */
        _elpusk.device.usb.hid.lpu237.prototype.reset_msr_data = function(n_track){

            do{
                if( typeof n_track === 'undefined'){
                    for( var i = 0; i<this._array_s_card_data.length; i++ ){
                        this._array_s_card_data[i] = "";
                        this._array_n_card_error_code[i] = 0;
                    }//end for
                }
                if( typeof n_track !== 'number'){
                    continue;
                }
                if( n_track < 0 ){
                    continue;
                }
                if( n_track >= _const_the_number_of_track ){
                    continue;
                }
                this._array_s_card_data[n_track] = "";
                this._array_n_card_error_code[n_track] = 0;
            }while(false);
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.set_msr_data_from_rx
         * @param {string} s_rx - lpu237 protocol packet.( = websocket's protocol's data field)
         * @return {boolean} processing result
         * @description analysis and save from response.
        */
        _elpusk.device.usb.hid.lpu237.prototype.set_msr_data_from_rx = function(s_rx){
            var b_result  =false;
            do{
                if( typeof s_rx !== 'string'){
                    continue;
                }
                if( s_rx.length%2 !== 0 ){
                    continue;
                }
                if( s_rx.length < 2*3 ){
                    continue;
                }

                var s_src = s_rx;
                var s_char = "";

                var n_len = [0,0,0];
                var n_len_error = 0;

                for( var i=0; i<_const_the_number_of_track; i++ ){
                    this._array_s_card_data[i] = "";//reset card data buffer.
                    this._array_n_card_error_code[i] = 0;//reset card data error code.

                    s_char = s_src.slice(0,2);
                    s_src = s_src.substring(2);

                    n_len_error = parseInt(s_char,16);
                    if( n_len_error >127){
                        this._array_n_card_error_code[i] = n_len_error - 256;//save error code.
                    }
                    else{
                        n_len[i] = n_len_error;//save data length
                    }
                }//end for

                var n_data = 0;
                var s_op = "";
                var n_op = 0;
                for( var i=0; i<_const_the_number_of_track; i++ ){
                    if( n_len[i] <= 0){
                        continue;
                    }
                    s_op = s_src.slice(0,n_len[i]*2);
                    s_src = s_src.substring(n_len[i]*2);
                    //
                    n_op = s_op.length;
                    for( var j = 0; j<n_op/2; j++ ){
                        if( i===0){
                            n_data = parseInt(s_op.slice(0,2),16) + 0x20;
                        }
                        else{
                            n_data = parseInt(s_op.slice(0,2),16) + 0x30;
                        }
                        this._array_s_card_data[i] += String.fromCharCode(n_data);
                        s_op = s_op.substring(2);
                    }//end for j
                }//end for i
                
                b_result = true;
            }while(false);
            return b_result;
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
                if(this._c_blank[1]&0x01){
                    s_description = s_description + "indication error condition : If any track is not error, it is success.\n";
                }
                else{
                    s_description = s_description + "indication error condition : If all track are not error, it is success.\n";
                }
                s_description = s_description 
                +"c_blank : 0x" + this._c_blank[0].toString(16)
                +": 0x" + this._c_blank[1].toString(16)
                +": 0x" + this._c_blank[2].toString(16)
                +": 0x" + this._c_blank[0].toString(16)
                +"\n";
                //////////////////////
                if(this._c_blank[1]&0x02){
                    s_description = s_description + "Ignore ISO1 : If 1 & 2 track data is equal, send 2 track data only.\n";
                }
                else{
                    s_description = s_description + "Ignore ISO1 : not ignore iso1 track.\n";
                }
                if(this._c_blank[1]&0x04){
                    s_description = s_description + "Ignore ISO3 : If 2 & 3 track data is equal, send 2 track data only.\n";
                }
                else{
                    s_description = s_description + "Ignore ISO3 : not ignore iso3 track\n";
                }
                if(this._c_blank[1]&0x08){
                    s_description = s_description + "remove colon : If a track ETXL is 0xe0 and the first data is ASCII ':',then track's ':' isn't sent.\n";
                }
                else{
                    s_description = s_description + "remove colon : not remove colon.\n";
                }

                s_description = s_description + "MSR global prefixs : " + this._s_global_prefix + "\n";
                s_description = s_description + "MSR global postfixs : " + this._s_global_postfix + "\n";

                s_description = s_description + "i-button prefixs : " + this._s_prefix_ibutton + "\n";
                s_description = s_description + "i-button postfixs : " + this._s_postfix_ibutton + "\n";

                s_description = s_description + "Uart prefixs : " + this._s_prefix_uart + "\n";
                s_description = s_description + "Uart postfixs : " + this._s_postfix_uart + "\n";

                for( var i = 0; i<_const_the_number_of_track; i++ ){
                    s_description = s_description + "==================================================\n";
                    s_description = s_description + ".......ISO track " + String(i+1) + " Information.\n";
                    if( this._b_enable_iso[i] ){
                        s_description = s_description + "MSR enabled track " + String(i+1) + " : enabled.\n";
                    }
                    else{
                        s_description = s_description + "MSR enabled track " + String(i+1) + " : disabled.\n";
                    }

                    s_description = s_description + "MSR reading direction track " + String(i+1) + " : " + _get_direction_string( this._n_direction[i]) + "\n";

                    s_description = s_description + "the number of combination track " + String(i+1) + " : " + String(this._n_number_combination[i]) + "\n";
        
                    for( var j = 0; j<_const_the_number_of_combination; j++ ){
                        s_description = s_description + "------------------------------\n";
                        s_description = s_description + ".......combination " + String(j) + " Information.\n";
    
                        s_description = s_description + "max size of track " + String(i+1) + "combination"+ String(j) +" : " + String(this._n_max_size[i][j]) + "\n";
                        s_description = s_description + "one bit size of track " + String(i+1) + "combination"+ String(j) +" : " + String(this._n_bit_size[i][j]) + "\n";
                        s_description = s_description + "data mask of track " + String(i+1) + "combination"+ String(j) +" : 0x" + this._c_data_mask[i][j].toString(16) + "\n";

                        if( this._b_use_parity[i][j] ){
                            s_description = s_description + "parity bit of track " + String(i+1) + "combination"+ String(j) +" : enabled.\n";
                        }
                        else{
                            s_description = s_description + "parity bit of track " + String(i+1) + "combination"+ String(j) +" : disabled.\n";
                        }
                        s_description = s_description + "parity bit type of track " + String(i+1) + "combination"+ String(j) +" : " + _get_parity_type_string(this._n_parity_type[i][j]) + "\n";

                        s_description = s_description + "STX pattern of track " + String(i+1) + "combination"+ String(j) +" : 0x" + this._c_stxl[i][j].toString(16) + "\n";
                        s_description = s_description + "ETX pattern of track " + String(i+1) + "combination"+ String(j) +" : 0x" + this._c_etxl[i][j].toString(16) + "\n";

                        if( this._b_use_ecm[i][j] ){
                            s_description = s_description + "ecm of track " + String(i+1) + "combination"+ String(j) +" : enabled.\n";
                        }
                        else{
                            s_description = s_description + "ecm of track " + String(i+1) + "combination"+ String(j) +" : disabled.\n";
                        }

                        s_description = s_description + "ecm type of track " + String(i+1) + "combination"+ String(j) +" : " + _get_error_correct_type_string(this._n_ecm_type[i][j]) + "\n";
                        s_description = s_description + "for converting to ASCII,add value of track " + String(i+1) + "combination"+ String(j) +" : " + String(this._n_add_value[i][j]) + "\n";

                        s_description = s_description + "MSR private prefix track " + String(i+1) + "combination"+ String(j) +" : " + this._s_private_prefix[i][j] + "\n";
                        s_description = s_description + "MSR private postfix track "+ String(i+1) + "combination"+ String(j) +" : " + this._s_private_postfix[i][j] + "\n";
                    }//end for j
                }//end for

           }while(false);
           return s_description;
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_string_html_table
         * @param {string} s_section can be null , "system", "iso1", "iso2" or "iso3". another value is null
         * @return {string} the system parameters
         * @description return the string of system parameters. 
         * <br /> this string is html-table format."\n".
        */
       _elpusk.device.usb.hid.lpu237.prototype.get_string_html_table = function(s_section){
            var s_description = "";
            var as_name = [];
            var as_value = [];
            var n_count = 0;

            var as_n = [];
            var as_v = [];

            var b_system = true;
            var b_iso = [true,true,true];

            if( s_section === "system"){
                b_iso[0] = b_iso[1] = b_iso[2] = false;
            }
            else if( s_section === "iso1"){
                b_system = false;
                b_iso[1] = b_iso[2] = false;
            }
            else if( s_section === "iso2"){
                b_system = false;
                b_iso[0] = b_iso[2] = false;
            }
            else if( s_section === "iso3"){
                b_system = false;
                b_iso[0] = b_iso[1] = false;
            }

            do{
                var ver = [0,0,0,0];
                var n_value = 0;
                //
                n_count = 0;
                if( b_system ){
                    as_name[n_count] = "System name";
                    as_value[n_count] = this._s_name;
                    //
                    ++n_count;
                    as_name[n_count] = "System version";
                    as_value[n_count] = _get_version_string(this._version);
                    //
                    ++n_count;
                    as_name[n_count] = "System UID";
                    as_value[n_count] = this._s_uid;
                    //
                    ++n_count;
                    as_name[n_count] = "Used bootloader";
                    if( this._b_is_hid_boot ){
                        as_value[n_count] = "Hid";
                    }
                    else{
                        as_value[n_count] = "MSD";
                    }
                    //
                    ++n_count;
                    as_name[n_count] = "System interface";
                    as_value[n_count] = _get_system_inferface_string(this._n_interface);
                    //
                    ++n_count;
                    as_name[n_count] = "Language";
                    as_value[n_count] = _get_keyboard_language_index_string(this._n_language_index);
                    //
                    ++n_count;
                    as_name[n_count] = "Manufacture";
                    as_value[n_count] = _get_manufacturer_string( this._n_manufacture );
                    //
                    ++n_count;
                    as_name[n_count] = "MSD bootloader running time";
                    as_value[n_count] = String(this._dw_boot_run_time);
                    //
                    ++n_count;
                    as_name[n_count] = "Buzzer frequency";
                    as_value[n_count] = String(this._dw_buzzer_frequency);
                    //
                    ++n_count;
                    as_name[n_count] = "The supported functions";
                    as_value[n_count] = _get_function_string(this._n_device_function);
                    //
                    ++n_count;
                    as_name[n_count] = "i-Button mode";
                    as_value[n_count] = _get_ibutton_mode_string(this._n_ibutton_mode);
                    //
                    ++n_count;
                    as_name[n_count] = "blank data";
                    as_value[n_count] = "0x" + this._c_blank[0].toString(16)
                    +" : 0x" + this._c_blank[1].toString(16)
                    +" : 0x" + this._c_blank[2].toString(16)
                    +" : 0x" + this._c_blank[0].toString(16);
                    //
                    ++n_count;
                    as_name[n_count] = "MSR global pre/postfixs sending condition";
                    if(this._b_global_pre_postfix_send_condition){
                        as_value[n_count] = "send when all track have not a error.";
                    }
                    else{
                        as_value[n_count] = "send when any track isn't error.";
                    }
                    //
                    ++n_count;
                    as_name[n_count] = "indication error condition";
                    if(this._c_blank[1]&0x01){
                        as_value[n_count] = "If any track is not error, it is success.";
                    }
                    else{
                        as_value[n_count] = "If all track are not error, it is success.";
                    }
                    //
                    ++n_count;
                    as_name[n_count] = "Ignore ISO1";
                    if(this._c_blank[1]&0x02){
                        as_value[n_count] = "If 1 & 2 track data is equal, send 2 track data only.";
                    }
                    else{
                        as_value[n_count] = "Ignore ISO1 : not ignore iso1 track.";
                    }
                    //
                    ++n_count;
                    as_name[n_count] = "Ignore ISO3";
                    if(this._c_blank[1]&0x04){
                        as_value[n_count] = "If 3 & 2 track data is equal, send 2 track data only.";
                    }
                    else{
                        as_value[n_count] = "Ignore ISO3 : not ignore iso3 track.";
                    }
                    //
                    ++n_count;
                    as_name[n_count] = "remove colon";
                    if(this._c_blank[1]&0x08){
                        as_value[n_count] = "If a track ETXL is 0xe0 and the first data is ASCII ':',then track's ':' isn't sent.";
                    }
                    else{
                        as_value[n_count] = "remove colon : not remove colon.";
                    }
                    //
                    ++n_count;
                    as_name[n_count] = "MSR global prefixs";
                    as_value[n_count] = this._s_global_prefix;
                    as_value[n_count] += "<br/>";
                    as_value[n_count] += _get_tag_by_symbol(this._n_language_index,this._s_global_prefix);
                    //
                    ++n_count;
                    as_name[n_count] = "MSR global postfixs";
                    as_value[n_count] = this._s_global_postfix;
                    as_value[n_count] += "<br/>";
                    as_value[n_count] += _get_tag_by_symbol(this._n_language_index,this._s_global_postfix);
                    //
                    ++n_count;
                    as_name[n_count] = "i-button prefixs";
                    as_value[n_count] = this._s_prefix_ibutton;
                    as_value[n_count] += "<br/>";
                    as_value[n_count] += _get_tag_by_symbol(this._n_language_index,this._s_prefix_ibutton);
                    //
                    ++n_count;
                    as_name[n_count] = "i-button postfixs";
                    as_value[n_count] = this._s_postfix_ibutton;
                    as_value[n_count] += "<br/>";
                    as_value[n_count] += _get_tag_by_symbol(this._n_language_index,this._s_postfix_ibutton);
                    //
                    ++n_count;
                    as_name[n_count] = "Uart prefixs";
                    as_value[n_count] = this._s_prefix_uart;
                    as_value[n_count] += "<br/>";
                    as_value[n_count] += _get_tag_by_symbol(this._n_language_index,this._s_prefix_uart);
                    //
                    ++n_count;
                    as_name[n_count] = "Uart postfixs";
                    as_value[n_count] = this._s_postfix_uart;
                    as_value[n_count] += "<br/>";
                    as_value[n_count] += _get_tag_by_symbol(this._n_language_index,this._s_postfix_uart);
                }//system section
                ////////////////////////////////////////////////////

                for( var i = 0; i<_const_the_number_of_track; i++ ){
                    as_n.push([]);
                    as_n[i].push("ISO track " + String(i+1) + " Information");
                    as_v.push([]);
                    as_v[i].push("ISO track " + String(i+1) + " Information");//for colspan 2
                    
                    as_n[i].push("MSR enabled track");
                    if( this._b_enable_iso[i] ){
                        as_v[i].push("enabled");
                    }
                    else{
                        as_v[i].push("disabled");
                    }
                    //
                    as_n[i].push("MSR reading direction");
                    as_v[i].push(_get_direction_string( this._n_direction[i]));
                    //
                    as_n[i].push("the number of combination");
                    as_v[i].push(String(this._n_number_combination[i]));

                    var s_tag = "";
                    for( var j = 0; j<_const_the_number_of_combination; j++ ){
                        as_n[i].push("ISO track " + String(i+1) + "combination " + String(j) + " Information");
                        as_v[i].push("ISO track " + String(i+1) + "combination " + String(j) + " Information");//for colspan 2
    
                        //
                        as_n[i].push("max size combination"+ String(j));
                        as_v[i].push(String(this._n_max_size[i][j]));
                        //
                        as_n[i].push("one bit size combination"+ String(j));
                        as_v[i].push(String(this._n_bit_size[i][j]));
                        //
                        as_n[i].push("data mask combination"+ String(j));
                        as_v[i].push("0x" + this._c_data_mask[i][j].toString(16));
                        //
                        as_n[i].push("parity bit combination"+ String(j));
                        if( this._b_use_parity[i][j] ){
                            as_v[i].push("enabled");
                        }
                        else{
                            as_v[i].push("disabled");
                        }
                        //
                        as_n[i].push("parity bit type combination"+ String(j));
                        as_v[i].push(_get_parity_type_string(this._n_parity_type[i][j]));
                        //
                        as_n[i].push("STX pattern combination"+ String(j));
                        as_v[i].push("0x" + this._c_stxl[i][j].toString(16));
                        //
                        as_n[i].push("ETX pattern combination"+ String(j));
                        as_v[i].push("0x" + this._c_etxl[i][j].toString(16));
                        //
                        as_n[i].push("ecm combination"+ String(j));
                        if( this._b_use_ecm[i][j] ){
                            as_v[i].push("enabled");
                        }
                        else{
                            as_v[i].push("disabled");
                        }
                        //
                        as_n[i].push("ecm type combination"+ String(j));
                        as_v[i].push(_get_error_correct_type_string(this._n_ecm_type[i][j]));
                        //
                        as_n[i].push("for converting to ASCII,add value combination"+ String(j));
                        as_v[i].push(String(this._n_add_value[i][j]));
                        //
                        as_n[i].push("MSR private prefix combination"+ String(j));
                        s_tag = this._s_private_prefix[i][j] 
                        + "<br/>" + _get_tag_by_symbol(this._n_language_index,this._s_private_prefix[i][j]);
                        as_v[i].push(s_tag);
                        //
                        as_n[i].push("MSR postfix prefix combination"+ String(j));
                        s_tag = this._s_private_postfix[i][j] 
                        + "<br/>" + _get_tag_by_symbol(this._n_language_index,this._s_private_postfix[i][j]);
                        as_v[i].push(s_tag);

                    }//end for j
                }//end for                
                
                /////////////////////////////////////////////////////////////////
                s_description +="<table border=1>";

                if( b_system ){
                    s_description +="<tr> <th colspan = '2' bgcolor='#E6E6E6'>";
                    s_description += "System information";
                    s_description +="</th> </tr>";
                    //
                    for( var i=0; i<as_name.length; i++ ){
                        s_description +="<tr> <td>";
                        s_description += as_name[i];
                        s_description += "</td><td>";
                        s_description += as_value[i] ;
                        s_description +="</td> </tr>";
                    }//end for
                }

                //
                for( var i=0; i<as_n.length; i++ ){
                    if( !b_iso[i] ){
                        continue;
                    }
                    for( var j=0; j<as_n[i].length; j++ ){
                        if( as_n[i][j] === as_v[i][j]){
                            s_description +="<tr> <th colspan = '2' bgcolor='#FAFAFA'>";
                            s_description += as_n[i][j];
                            s_description +="</th> </tr>";
                        }
                        else{
                            s_description +="<tr> <td>";
                            s_description += as_n[i][j];
                            s_description += "</td><td>";
                            s_description += as_v[i][j] ;
                            s_description +="</td> </tr>";
                        }
                    }//end for
                }//end for

                s_description +="</table>";

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
         * @public
         * @function is_success_enter_opos_mode
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} true - response contains good or negative good.
         * <br /> false - else case.
         */
        _elpusk.device.usb.hid.lpu237.prototype.is_success_enter_opos_mode = function(s_response){
            return _is_success_response(s_response);
        }

        /**
         * @public
         * @function is_success_leave_opos_mode
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} true - response contains good or negative good.
         * <br /> false - else case.
         */        
        _elpusk.device.usb.hid.lpu237.prototype.is_success_leave_opos_mode= function(s_response){
            return _is_success_response(s_response);
        }

        /**
         * @public
         * @function is_success_run_boot_loader
         * @param {string} s_response - lpu237 protocol packet.( = websocket's protocol's data field)
         * @returns {boolean} true - response contains good or negative good.
         * <br /> false - else case.
         */        
        _elpusk.device.usb.hid.lpu237.prototype.is_success_run_boot_loader = function(s_response){
            return _is_success_response(s_response);
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_tag_by_ascii_code
         * @param {string} s_len_tag_hex this string is received from device by hex string format.
         * @returns {number[]} ASCII code array of tag.
         */
        _elpusk.device.usb.hid.lpu237.prototype.get_tag_by_ascii_code = function(s_tag){
            return _get_tag_by_ascii_code(this._n_language_index, s_tag );
        }

        /**
         * @public
         * @function elpusk.device.usb.hid.lpu237.get_tag_by_ascii_string
         * @param {string} s_len_tag_hex this string is received from device by hex string format.
         * @returns {string[]} string format of ASCII code of tag.
         */
        _elpusk.device.usb.hid.lpu237.prototype.get_tag_by_ascii_string = function(s_tag){
            return _get_tag_by_ascii_string(this._n_language_index, s_tag );
        }

        /** 
         * @public 
         * @function get_error_message
         * @param {string} s_error_name
         * @returns {string}
         * @description get error message with error name
        */                
        _elpusk.device.usb.hid.lpu237.prototype.get_error_message = function(s_error_name){
           return _get_error_message(s_error_name);
        }

    }//the end of _elpusk.device.usb.hid.lpu237


    // the end of function
    window.elpusk = _elpusk;
}(window));