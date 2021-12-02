/**
 * 2020.11.26
 * @license MIT
 * Copyright (c) 2021 Elpusk.Co.,Ltd.
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
 * @copyright Elpusk.Co.,Ltd 2021
 * @version 1.0.0
 * @description sd_emv.dll controller of elpusk framework coffee javascript library .
 * <br /> error rules
 * <br /> * coffee framework error : generates promise reject or calls error callback function.
 * <br /> 
 * <br />  2021.11.29 - release 1.0.
 * 
 * @namespace dll_service.default.sd_emv
 */

'use strict';

(function (window, undefined) {

    var _dll_service = window.dll_service;

    if (!_dll_service) {
        console.log("error : use dll_service before this");
        return;
    }

    if (!_dll_service.default) {
        _dll_service.default = {};
    }

    if (!_dll_service.default.sd_emv) {

        /**
         * private const here.
         * as like "var _x = '';"
         * 
         */


        /**
         * private methods here.
         * as like 
         * "function x(){
         * }"
         */


        /**
         * @class sd_emv
         * @classdesc this class support the interface to "emv service dll of coffee framework".
         * @constructs dll_service.default.sd_emv
         * <br /> for creating instance.
         * <br /> var emv_terminal = new dll_service.default.sd_emv(n_session,n_slot,n_in_id, n_out_id);
         * <br /> //emv_terminal : the name of sd_emv instance.
         * <br /> //n_session : the session number.
         * <br /> //n_slot : the slot number of smart card reader( from 0 ).
         * <br /> //n_in_id : in report id
         * <br /> //n_out_id : out report id
        */
        _dll_service.default.sd_emv = function (n_session, n_slot, n_in_id, n_out_id) {
            var s_sd_dll_path = "default/sd_emv.dll";
            dll_service.call(this, n_session, s_sd_dll_path);
            /**
             * @private
             * as like "this._x = '';"
             */

            /**
             * @private
             * slot number of smart card reader.
             */
            if (typeof n_slot === 'number') {
                this._n_slot = n_slot;
            }
            else {
                this._n_slot = 0;//set default value.
            }

            if (typeof n_in_id === 'number') {
                this._n_in_id = n_in_id;
            }
            else {
                this._n_in_id = 0;//set default value.
            }
            if (typeof n_out_id === 'number') {
                this._n_out_id = n_out_id;
            }
            else {
                this._n_out_id = 0;//set default value.
            }
        };

        _dll_service.default.sd_emv.prototype = Object.create(dll_service.prototype);
        _dll_service.default.sd_emv.prototype.constructor = _dll_service.default.sd_emv;

        /**
         * pulic methods here
         * as like 
         * _dll_service.default.sd_emv.prototype = function(){
         *   .......
         * }
         */

        /**
         * @public
         * @function dll_service.default.sd_emv.get_status
         * @return {Promise} processing result.
         * @description get card status.
         */
        _dll_service.default.sd_emv.prototype.get_status = function () {

            var this_sd_dll = this;
            var ar_parameter = [
                'slot',
                this._n_slot.toString(),
                'status'
            ];

            return this.sd_execute(this._n_in_id, this._n_out_id, ar_parameter);
        }

        /**
         * @public
         * @function dll_service.default.sd_emv.power_on
         * @return {Promise} processing result.
         * @description power on icc
         */
        _dll_service.default.sd_emv.prototype.power_on = function () {

            var this_sd_dll = this;
            var ar_parameter = [
                'slot',
                this._n_slot.toString(),
                'on'
            ];

            return this.sd_execute(this._n_in_id, this._n_out_id, ar_parameter);
        }

        /**
         * @public
         * @function dll_service.default.sd_emv.power_off
         * @return {Promise} processing result.
         * @description power off icc
         */
        _dll_service.default.sd_emv.prototype.power_off = function () {

            var this_sd_dll = this;
            var ar_parameter = [
                'slot',
                this._n_slot.toString(),
                'off'
            ];

            return this.sd_execute(this._n_in_id, this._n_out_id, ar_parameter);
        }

        /**
         * @public
         * @function dll_service.default.sd_emv.terminal_on
         * @param {string} s_hex_9f35_tag_value hex string TAGT_TERMINAL_TYPE
         * @param {string} s_hex_9f1a_tag_value hex string TAGT_TERMINAL_COUNTRY_CODE
         * @param {string} s_hex_9a_tag_value hex string TAGT_TRANSACTION_DATE
         * @param {string} s_hex_9f33_tag_value hex string TAGT_TERMINAL_CAPABILITIES
         * @return {Promise} processing result.
         * @description initialize virtual emv terminal.
         */
        _dll_service.default.sd_emv.prototype.terminal_on = function (
            s_hex_9f35_tag_value,
            s_hex_9f1a_tag_value,
            s_hex_9a_tag_value,
            s_hex_9f33_tag_value
        ) {

            var this_sd_dll = this;
            var ar_parameter = [
                'on',
                this._n_slot.toString()
            ];

            ar_parameter.push('TAGT_TERMINAL_TYPE:b:' + s_hex_9f35_tag_value);
            ar_parameter.push('TAGT_TERMINAL_COUNTRY_CODE:b:' + s_hex_9f1a_tag_value);
            ar_parameter.push('TAGT_TRANSACTION_DATE:b:' + s_hex_9a_tag_value);
            ar_parameter.push('TAGT_TERMINAL_CAPABILITIES:b:' + s_hex_9f33_tag_value);

            return this.sd_execute(this._n_in_id, this._n_out_id, ar_parameter);
        }

        /**
         * @public
         * @function dll_service.default.sd_emv.terminal_off
         * @return {Promise} processing result.
         * @description deinitialize virtual emv terminal.
         */
        _dll_service.default.sd_emv.prototype.terminal_off = function () {

            var this_sd_dll = this;
            var ar_parameter = [
                'off',
                this._n_slot.toString()
            ];

            return this.sd_execute(this._n_in_id, this._n_out_id, ar_parameter);
        }

        /**
         * @public
         * @function dll_service.default.sd_emv.terminal_reset
         * @return {Promise} processing result.
         * @description reinitialize virtual emv terminal.
         */
        _dll_service.default.sd_emv.prototype.terminal_reset = function () {

            var this_sd_dll = this;
            var ar_parameter = [
                'reset',
                this._n_slot.toString()
            ];

            return this.sd_execute(this._n_in_id, this._n_out_id, ar_parameter);
        }

        /**
         * @public
         * @function dll_service.default.sd_emv.initialize_transaction
         * @param {string} s_hex_9c_tag_value hex string TAGT_TRANSACTION_TYPE
         * @param {string} s_hex_5f2a_tag_value hex string TAGT_TANSACTION_CURRENCY_CODE
         * @param {string} s_hex_5f36_tag_value hex string TAGT_TRANSACTION_CURRENCY_EXPONENT
         * @param {string} s_dec_9f02_tag_value decimal string TAGT_AMOUNT_AUTHORISED_NUMERIC
         * @param {string} s_dec_9f03_tag_value decimal string TAGT_AMOUNT_OTHER_NUMERIC
         * @return {Promise} processing result.
         * @description initialize emv transaction
         */
        _dll_service.default.sd_emv.prototype.initialize_transaction = function (
            s_hex_9c_tag_value,
            s_hex_5f2a_tag_value,
            s_hex_5f36_tag_value,
            s_dec_9f02_tag_value,
            s_dec_9f03_tag_value
        ) {

            var this_sd_dll = this;
            var ar_parameter = [
                'transaction',
                this._n_slot.toString(),
                'it'
            ];

            ar_parameter.push('TAGT_TRANSACTION_TYPE:b:' + s_hex_9c_tag_value);
            ar_parameter.push('TAGT_TANSACTION_CURRENCY_CODE:b:' + s_hex_5f2a_tag_value);
            ar_parameter.push('TAGT_TRANSACTION_CURRENCY_EXPONENT:b:' + s_hex_5f36_tag_value);
            ar_parameter.push('TAGT_AMOUNT_AUTHORISED_NUMERIC:n:' + s_dec_9f02_tag_value);
            ar_parameter.push('TAGT_AMOUNT_OTHER_NUMERIC:n:' + s_dec_9f03_tag_value);

            return this.sd_execute(this._n_in_id, this._n_out_id, ar_parameter);
        }


        /**
         * TODO more define additional parameters
         * @public 
         * @function dll_service.default.sd_emv.build_candidate_list
         * @param {string} s_use_pse '0' : don't use pse, '1' : use pase(default)
         * @return {Promise} processing result.
         * @description build candidate list.
         */
        _dll_service.default.sd_emv.prototype.build_candidate_list = function (
            s_use_pse
        ) {
            var s_pse = '1';//default 
            if (s_use_pse === '0') {
                s_pse = '0';
            }

            var this_sd_dll = this;
            var ar_parameter = [
                'transaction',
                this._n_slot.toString(),
                'bcl',
                'PSE:n:' + s_pse
            ];

            return this.sd_execute(this._n_in_id, this._n_out_id, ar_parameter);
        }

        /**
         * @public 
         * @function dll_service.default.sd_emv.select_application.
         * @param {string} s_aid hex string AID( selected by user)
         * @param {string} s_use_confirm decimal string 1 : confirm the selected aid user.
         * @return {Promise} processing result.
         * @description select application
         */
        _dll_service.default.sd_emv.prototype.select_application = function (
            s_aid,
            s_use_confirm
        ) {

            var this_sd_dll = this;
            var ar_parameter = [
                'transaction',
                this._n_slot.toString(),
                'sa'
            ];

            if (typeof s_aid === 'string') {
                ar_parameter.push('AID:b:' + s_aid);
            }
            else if (s_aid === '') {
                ar_parameter.push('AID:b:' + s_aid);
            }

            if (s_use_confirm === '1') {
                ar_parameter.push('CONFIRM:n:1');
            }
            else {
                ar_parameter.push('CONFIRM:n:0');
            }

            return this.sd_execute(this._n_in_id, this._n_out_id, ar_parameter);
        }

        /**
         * @public 
         * @function dll_service.default.sd_emv.read_data.
         * @return {Promise} processing result.
         * @description read data
         */
        _dll_service.default.sd_emv.prototype.read_data = function () {

            var this_sd_dll = this;
            var ar_parameter = [
                'transaction',
                this._n_slot.toString(),
                'ra'
            ];

            return this.sd_execute(this._n_in_id, this._n_out_id, ar_parameter);
        }

        /**
         * @public 
         * @function dll_service.default.sd_emv.offline_data_authentication
         * @return {Promise} processing result.
         * @description offline data authentication.
         */
        _dll_service.default.sd_emv.prototype.offline_data_authentication = function () {

            var this_sd_dll = this;
            var ar_parameter = [
                'transaction',
                this._n_slot.toString(),
                'oda'
            ];

            return this.sd_execute(this._n_in_id, this._n_out_id, ar_parameter);
        }

        /**
         * @public 
         * @function dll_service.default.sd_emv.processing_restrictions
         * @return {Promise} processing result.
         * @description processing restrictions. 
         */
        _dll_service.default.sd_emv.prototype.processing_restrictions = function () {

            var this_sd_dll = this;
            var ar_parameter = [
                'transaction',
                this._n_slot.toString(),
                'pr'
            ];

            return this.sd_execute(this._n_in_id, this._n_out_id, ar_parameter);
        }

        /**
         * @public 
         * @function dll_service.default.sd_emv.cardholder_verification
         * @return {Promise} processing result.
         * @description cardholder verification. 
         */
        _dll_service.default.sd_emv.prototype.cardholder_verification = function () {

            var this_sd_dll = this;
            var ar_parameter = [
                'transaction',
                this._n_slot.toString(),
                'cv'
            ];

            return this.sd_execute(this._n_in_id, this._n_out_id, ar_parameter);
        }

        /**
         * @public 
         * @function dll_service.default.sd_emv.terminal_risk_managment
         * @return {Promise} processing result.
         * @description terminal risk managment.
         */
        _dll_service.default.sd_emv.prototype.terminal_risk_managment = function () {

            var this_sd_dll = this;
            var ar_parameter = [
                'transaction',
                this._n_slot.toString(),
                'trm'
            ];

            return this.sd_execute(this._n_in_id, this._n_out_id, ar_parameter);
        }

        /**
         * @public 
         * @function dll_service.default.sd_emv.terminal_action_analysis
         * @return {Promise} processing result.
         * @description terminal action analysis. 
         */
        _dll_service.default.sd_emv.prototype.terminal_action_analysis = function () {

            var this_sd_dll = this;
            var ar_parameter = [
                'transaction',
                this._n_slot.toString(),
                'taa'
            ];

            return this.sd_execute(this._n_in_id, this._n_out_id, ar_parameter);
        }

        /**
         * @public 
         * @function dll_service.default.sd_emv.card_action_analysis
         * @return {Promise} processing result.
         * @description card_action_analysis.
         */
        _dll_service.default.sd_emv.prototype.card_action_analysis = function () {

            var this_sd_dll = this;
            var ar_parameter = [
                'transaction',
                this._n_slot.toString(),
                'caa'
            ];

            return this.sd_execute(this._n_in_id, this._n_out_id, ar_parameter);
        }

        /**
         * @public 
         * @function dll_service.default.sd_emv.go_online
         * @return {Promise} processing result.
         * @description go online.
         */
        _dll_service.default.sd_emv.prototype.go_online = function () {

            var this_sd_dll = this;
            var ar_parameter = [
                'transaction',
                this._n_slot.toString(),
                'go'
            ];

            return this.sd_execute(this._n_in_id, this._n_out_id, ar_parameter);
        }

        /**
         * @public 
         * @function dll_service.default.sd_emv.complete_transaction
         * @return {Promise} processing result.
         * @description complete transaction.
         */
        _dll_service.default.sd_emv.prototype.complete_transaction = function () {

            var this_sd_dll = this;
            var ar_parameter = [
                'transaction',
                this._n_slot.toString(),
                'ct'
            ];

            return this.sd_execute(this._n_in_id, this._n_out_id, ar_parameter);
        }

        /**
         * @public 
         * @function dll_service.default.sd_emv.end_transaction
         * @return {Promise} processing result.
         * @description end transaction.
         */
        _dll_service.default.sd_emv.prototype.end_transaction = function () {

            var this_sd_dll = this;
            var ar_parameter = [
                'transaction',
                this._n_slot.toString(),
                'et'
            ];

            return this.sd_execute(this._n_in_id, this._n_out_id, ar_parameter);
        }


    }//!_dll_service.default.sd_emv

    // the end of function
    window.dll_service = _dll_service;
}(window));