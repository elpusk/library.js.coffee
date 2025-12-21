/**
 * 2020.10.8
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
 * @copyright Elpusk.Co.,Ltd 2025
 * @version 1.7.0
 * @description lpu237 controller of elpusk framework coffee javascript library .
 * <br /> error rules
 * <br /> * coffee framework error : generates promise reject or calls error callback function.
 * <br /> * protocol error(lpu237 device protocol ) : generates promise reject or calls error callback function.
 * <br /> * card reading error : generates promise resolve or calls complete callback function.
 * <br /> * card reading success : generates promise resolve or calls complete callback function.
 * <br /> * ibutton reading error : generates promise resolve or calls complete callback function.
 * <br /> * ibutton reading success : generates promise resolve or calls complete callback function.
 * <br /> 
 * <br />  2020.5.14 - release 1.0.
 * <br />  2020.6.01 - release 1.1.
 * <br />            - add : get, set parameters progress callback function.
 * <br />  2020.6.11 - release 1.2
 * <br />            - add : read_card_from_device_with_callback function.
 * <br />            - add : cancel before enable/disable reading.
 * <br />  2020.6.12 - release 1.3
 * <br />            - add : run_bootloader_of_device_with_promise().
 * <br />  2020.10.08 -release 1.4
 *                    - support lpu237 hid bootloader.
 * <br />  2025.08.04 - release 1.5
 *                    - fix missing code.(close_with_promise() - s_rx is array )
 * 
 * <br />  2025.12.11 - relase 1.6
 *                    - support ibutton reading.
 * 
 * <br />  2025.12.15 - relase 1.7
 *                    - support shared open mode.
 * 
 * @namespace elpusk.framework.coffee.ctl_lpu237
 */

'use strict';


(function (window) {
    /**@private */
    var _elpusk = window.elpusk;

    if (!_elpusk) {
        console.log("error : use elpusk.framework.coffee before this");
        return;
    }
    if (!_elpusk.framework) {
        console.log("error : use elpusk.framework.coffee before this");
        return;
    }
    if (!_elpusk.framework.coffee) {
        console.log("error : use elpusk.framework.coffee before this");
        return;
    }
    if(_elpusk.framework.coffee.ctl_lpu237){
        return;
    }


    //////////////////////////////////////////////////////////////////////////
    //
    /**
     * @readonly
     * @enum {number}
     * @property {number} ST_UNDEFINED - Represents an undefined state, typically an initial or error state.
     * @property {number} ST_IDLE - Represents an idle state where no specific operation is in progress.
     * @property {number} ST_WAIT_RSP - Represents a state where the system is waiting for a response from the device.
     * @property {number} ST_WAIT_READ_DATA - Represents a state where the system is waiting for MSR or iButton data from an opened device.
     * @property {number} ST_WAIT_CANCEL - Represents a state where the system is waiting for a cancellation confirmation.
     */
    var _type_status = {
        ST_UNDEFINED : -1,
        ST_IDLE : 0,
        ST_WAIT_RSP : 1,
        ST_WAIT_READ_DATA : 2, // waits msr or ibutton data as opened device.
        ST_WAIT_CANCEL : 3
    };

    /**
     * map of queue of promise resolve & reject.
     * @private
     * @type {Map<number, object>}
     */
    var _map_q_para = new Map();

    /**
     * map of device status
     * @private
     * @type {Map<number, number>}
     */
    var _map_status = new Map();

    /**
     * @private
     * @function _get_status
     * @param {number} n_device_index the index value of device.
     * @return {number} _type_status type vaue.
     * @description return system status in card reading method.
     * <br /> internal use only.
     */
    function _get_status(n_device_index) {
        var st = _type_status.ST_UNDEFINED;

        do{
            if( typeof n_device_index !== 'number'){
                continue;
            }
            if( n_device_index <= 0 ){
                continue;
            }

            st = _type_status.ST_IDLE;
            if( !_map_status.has(n_device_index)){
                _map_status.set(n_device_index,st);
                continue;
            }
            st = _map_status.get(n_device_index);
        }while(false);
        return st;
    }

    /**
     * @private
     * @function _set_status
     * @param {number} n_device_index the index value of device.
     * @param {number} new_status _type_status type value.
     * @description change system status in card reading method.
     * <br /> internal use only.
     */
    function _set_status(n_device_index,new_status) {
        do{
            if( typeof n_device_index !== 'number'){
                continue;
            }
            if( n_device_index <= 0 ){
                continue;
            }
            if( typeof new_status ==='undefined'){
                continue;
            }

            switch(new_status){
                case _type_status.ST_IDLE :
                case _type_status.ST_WAIT_RSP :
                case _type_status.ST_WAIT_READ_DATA :
                case _type_status.ST_WAIT_CANCEL :
                    break;
                default:
                    continue;
            }//end switch

            _map_status.set(n_device_index,new_status);
        }while(false);
    }

    /**
     * @private
     * @function _gen_get_sysinfo_start_io
     * @param {elpusk.framework.coffee} server coffee manager server object.
     * @param {elpusk.device.usb.hid.lpu237} device target device object.
     * @param {function(number, (Array<string>|string))} cb_complete_sys_info It is called "callback function" when "get system information" is completed successfully.
     * @param {function(number, Error)} cb_error_sys_info It is called "callback function" when error is occurred.
     * @return {number} greater then zero - request is delivered to server successfully.
     * <br /> zero or negative - It is failed that request is delivered.
     * @description requests "get system information" to server by callback method.
     */
    function _gen_get_sysinfo_start_io(server, device,cb_complete_sys_info,cb_error_sys_info) {
        var n_req = 0;
        var s_request = null;

        do{
            device.clear_transaction();

            n_req = device.generate_get_system_information();
            if( n_req <= 0 ){
                continue;
            }
            s_request = device.get_tx_transaction();
            if( s_request === null ){
                n_req = 0;
                continue;
            }

            var b_result = server.device_transmit_with_callback(
                device.get_device_index(),0,0, s_request,
                cb_complete_sys_info,
                cb_error_sys_info,
                true
                );
            if( !b_result ){
                n_req = 0;
                device.clear_transaction();
                continue;
            }
        }while(false);
        return n_req;
    }

    /**
     * @private
     * @function _gen_get_para_start_io
     * @param {elpusk.framework.coffee} server coffee manager server object.
     * @param {elpusk.device.usb.hid.lpu237} device target device object.
     * @param {function(number, (Array<string>|string))} cb_complete_get_parameter It is called "callback function" when "get parameters" is completed successfully.
     * @param {function(number, Error)} cb_error_get_parameter It is called "callback function" when error is occurred.
     * @return {number} greater then zero - request is delivered to server successfully.
     * <br /> zero or negative - It is failed that request is delivered.
     * @description requests "get parameters" to server by callback method.
     */
    function _gen_get_para_start_io(server, device,cb_complete_get_parameter,cb_error_get_parameter){
        var s_request = null;
        var n_req = 0;

        do{
            device.clear_transaction();

            n_req = device.generate_get_parameters();
            if( n_req <= 0 ){
                n_req = 0;
                continue;
            }

            s_request = device.get_tx_transaction();
            if( s_request === null ){
                n_req = 0;
                continue;
            }

            var b_result = server.device_transmit_with_callback(
                device.get_device_index(),0,0, s_request,
                cb_complete_get_parameter,
                cb_error_get_parameter,
                true
                );
            if( !b_result ){
                device.clear_transaction();
                n_req = 0;
                continue;
            }
        }while(false);
        return n_req;
    }    

    /**
     * @private
     * @function _gen_set_para_start_io
     * @param {elpusk.framework.coffee} server coffee manager server object.
     * @param {elpusk.device.usb.hid.lpu237} device target device object.
     * @param {function(number, (Array<string>|string))} cb_complete_set_parameter It is called "callback function" when "set parameters" is completed successfully.
     * @param {function(number, Error)} cb_error_set_parameter It is called "callback function" when error is occurred.
     * @return {number} greater then zero - request is delivered to server successfully.
     * <br /> zero or negative - It is failed that request is delivered.
     * @description requests "set parameters" to server by callback method.
     */
    function _gen_set_para_start_io(server, device,cb_complete_set_parameter,cb_error_set_parameter){
        var s_request = null;
        var n_req = 0;

        do{
            device.clear_transaction();

            n_req = device.generate_set_parameters();
            if( n_req <= 0 ){
                continue;
            }

            s_request = device.get_tx_transaction();
            if( s_request === null ){
                n_req = 0;
                continue;
            }

            var b_result = server.device_transmit_with_callback(
                device.get_device_index(),0,0, s_request,
                cb_complete_set_parameter,
                cb_error_set_parameter,
                true
                );
            if( !b_result ){
                device.clear_transaction();
                n_req = 0;
                continue;
            }
        }while(false);
        return n_req;
    }    

    /**
     * @private
     * @function _gen_opos_start_io
     * @param {elpusk.framework.coffee} server coffee manager server object.
     * @param {elpusk.device.usb.hid.lpu237} device target device object.
     * @param {function(number, (Array<string>|string))} cb_complete_changed_opos If b_read parameter is true, It is called "callback function" when "card reading" is completed successfully.
     * <br /> If b_read parameter is false, It is called "callback function" when device accepts your request successfully.
     * @param {function(number, Error)} cb_error_changed_opos It is called "callback function" when error is occurred.
     * @param {boolean} b_read true - device waits a card reading.
     * <br /> false - device ignore a card reading.
     * @return {boolean} true - request is delivered to server successfully.
     * <br /> false - It is failed that request is delivered.
     * @description requests "card reading" to server by callback method. or
     * <br /> requests "ignore a card reading" to server by callback method.
     */
    function _gen_opos_start_io(server, device,cb_complete_changed_opos,cb_error_changed_opos,b_read){
        var b_result = false;
        var s_request = null;
        var n_req = 0;

        do{
            device.clear_transaction();

            n_req = device.generate_enable_read(b_read);
            if( n_req <= 0 ){
                continue;
            }

            s_request = device.get_tx_transaction();
            if( s_request === null ){
                continue;
            }

            b_result = server.device_transmit_with_callback(
                device.get_device_index(),0,0, s_request,
                cb_complete_changed_opos,
                cb_error_changed_opos,
                true
                );
            if( !b_result ){
                device.clear_transaction();
                continue;
            }

            b_result = true;
        }while(false);
        return b_result;
    }    

    /**
     * @private
     * @function _cancel_start_io
     * @param {elpusk.framework.coffee} server coffee manager server object.
     * @param {elpusk.device.usb.hid.lpu237} device target device object.
     * @param {function(number, (Array<string>|string))} cb_complete_cancel It is called "callback function" when device accepts your request successfully.
     * @param {function(number, Error)} cb_error_cancel It is called "callback function" when error is occurred.
     * @return {boolean} true - request is delivered to server successfully.
     * <br /> false - It is failed that request is delivered.
     * @description requests "cancel" to server by callback method.
     */
    function _cancel_start_io(server,device,cb_complete_cancel,cb_error_cancel ){
        var b_result = false;

        do{
            b_result = server.device_cancel_with_callback(
                device.get_device_index(),0,0,
                cb_complete_cancel,
                cb_error_cancel,
                true
                );
        }while(false);
        return b_result;
    }

    /**
     * @private
     * @function _gen_run_bootloader_start_io
     * @param {elpusk.framework.coffee} server coffee manager server object.
     * @param {elpusk.device.usb.hid.lpu237} device target device object.
     * @param {function(number, (Array<string>|string))} cb_complete_run_bootloader It is called "callback function" when device accepts your request successfully.
     * @param {function(number, Error)} cb_error_run_bootloader It is called "callback function" when error is occurred.
     * @return {boolean} true - request is delivered to server successfully.
     * <br /> false - It is failed that request is delivered.
     * @description requests execute the bootloader of lpu237 device.
     */
    function _gen_run_bootloader_start_io(server, device,cb_complete_run_bootloader,cb_error_run_bootloader){
        var b_result = false;
        var s_request = null;
        var n_req = 0;

        do{
            device.clear_transaction();

            n_req = device.generate_run_bootloader();
            if( n_req <= 0 ){
                continue;
            }

            s_request = device.get_tx_transaction();
            if( s_request === null ){
                continue;
            }

            b_result = server.device_transmit_with_callback(
                device.get_device_index(),0,0, s_request,
                cb_complete_run_bootloader,
                cb_error_run_bootloader,
                true
                );
            if( !b_result ){
                device.clear_transaction();
                continue;
            }

            b_result = true;
        }while(false);
        return b_result;
    }    

    /**
     * @private
     * @function _gen_ibutton_start_io
     * @param {elpusk.framework.coffee} server coffee manager server object.
     * @param {elpusk.device.usb.hid.lpu237} device target device object.
     * @param {function(number, (Array<string>|string))} cb_complete_ibutton It is called "callback function" when device accepts your request successfully.
     * @param {function(number, Error)} cb_error_ibutton It is called "callback function" when error is occurred.
     * @return {boolean} true - request is delivered to server successfully.
     * <br /> false - It is failed that request is delivered.
     * @description requests execute the bootloader of lpu237 device.
     */
    function _gen_ibutton_start_io(server, device,cb_complete_ibutton,cb_error_ibutton){
        var b_result = false;
        var s_request = null;
        var n_req = 0;

        do{
            device.clear_transaction();

            b_result = server.device_receive_with_callback(
                device.get_device_index(),
                0,
                cb_complete_ibutton,
                cb_error_ibutton,
                true
            );
            if( !b_result ){
                device.clear_transaction();
                continue;
            }

            b_result = true;
        }while(false);
        return b_result;
    }  

    /**
     * @private
     * @function _notifiy_error
     * @param {object} parameter - Object containing notification information. Expected properties:
     * @param {function(string): void} [parameter.resolve] - The promise resolve function.
     * @param {function(Error): void} [parameter.reject] - The promise reject function.
     * @param {function(number, string): void} [parameter.cb_received] - The callback for received data.
     * @param {function(number, Error): void} [parameter.cb_error] - The callback for error events.
     * @param {elpusk.device.usb.hid.lpu237} parameter.device - The device object.
     * @param {Error|undefined} event_error - Optional Error object.
     * @description Calls the error callback function or rejects the promise with the given error.
     */
    function _notifiy_error( parameter,event_error ){
        do{
            if( typeof parameter !== 'object'){
                continue;
            }

            var e = null;
            if( event_error instanceof Error){
                e = event_error;
            }
            else{
                e = new Error("error");
            }
            if( parameter.reject ){
                parameter.reject(e);
                continue;
            }
            if( parameter.cb_error ){
                parameter.cb_error( parameter.device.get_device_index(),e);
            }
        }while(false);
    }

    /**
     * @private
     * @function _notifiy_error_all
     * @param {number} n_device_index The device index.
     * @param {Error|undefined} event_error Optional Error object.
     * @description Calls the error callback function or rejects the promise for all pending operations associated with the specified device.
     */
    function _notifiy_error_all( n_device_index,event_error ){
        do{
            if( typeof n_device_index !== 'number'){
                continue;
            }
            if( !_map_q_para.has(n_device_index) ){
                continue;
            }

            var q = _map_q_para.get(n_device_index);
            if( q.length <= 0 ){
                elpusk.util.map_of_queue_delete(n_device_index);
                continue;
            }

            for( var i=0; i<q.length; i++ ){
                _notifiy_error(q[i],event_error);
            }//end for
            elpusk.util.map_of_queue_delete(n_device_index);
        }while(false);
    }

    /**
     * @private
     * @function _notifiy_error_map
     * @param {Error|undefined} event_error Optional Error object.
     * @description Calls the error callback function or rejects the promise for all pending operations across all devices in `_map_q_para`.
     */
    function _notifiy_error_map( event_error ){
        do{
            _map_q_para.forEach(
                function (value, key, map) {
                _notifiy_error_all(value);
            });
            elpusk.util.map_of_queue_clear();
        }while(false);
    }    
    /**
     * @private
     * @function _notifiy_received
     * @param {object} parameter - Object containing notification information. Expected properties:
     * @param {function(string): void} [parameter.resolve] - The promise resolve function.
     * @param {function(number, string): void} [parameter.cb_received] - The callback for received data.
     * @param {elpusk.device.usb.hid.lpu237} parameter.device - The device object.
     * @description Calls the received callback function or resolves the promise.
     */
    function _notifiy_received( parameter ){
        do{
            if( typeof parameter !== 'object'){
                continue;
            }

            if( parameter.resolve ){
                parameter.resolve("success");
                continue;
            }
            if( parameter.cb_received ){
                parameter.cb_received( parameter.device.get_device_index(),"success");
            }
        }while(false);
    }
    /**
     * @private
     * @function _is_event_rsp_good
     * @param {elpusk.device.usb.hid.lpu237} device lpu237 protocol object.
     * @param {Array<string>|string} s_rx The received data that is the data field of coffee framework. It can be an array like `["success"]` or a string for device transaction responses.
     * @returns {boolean} True if the response indicates success or a valid device transaction, false otherwise.
     * @description Checks whether the response of coffee framework is successful or indicates a valid device transaction.
     */
    function _is_event_rsp_good(device,s_rx) {
        var b_result = false;
        do{
            if( Array.isArray(s_rx)){
                if(s_rx[0]!=="success"){
                    continue;
                }
            }
            else{
                if( !device.set_rx_transaction(s_rx) ){
                    continue;
                }
                if( !device.set_from_rx() ){
                    continue;
                }
            }
            b_result = true;
        }while(false);
        return b_result;
    }
    /**
     * @private
     * @function _is_event_rsp_cancel
     * @param {Array<string>} s_rx The received data that is the data field of coffee framework. Expected to be an array where the first item is "cancel".
     * @returns {boolean} True if the response is a cancel event, false otherwise.
     * @description Checks whether the response of coffee framework is a cancel event, specifically an array whose first item is "cancel".
     */
    function _is_event_rsp_cancel(s_rx) {
        var b_result = false;
        do{
            if( !Array.isArray(s_rx) ){
                continue;
            }
            if(s_rx[0]!=="cancel"){
                continue;
            }
            b_result = true;
        }while(false);
        return b_result;
    }

    /**
     * @private
     * @function _process_rsp_event_in_idle
     * @param {number} n_device_index The device index.
     * @description Processes an occurred event in the idle status, typically for card reading scenarios, by notifying all pending operations of an error and clearing the queue.
     */
    function _process_rsp_event_in_idle(n_device_index){
        _notifiy_error_all(n_device_index);
        elpusk.util.map_of_queue_delete(_map_q_para,n_device_index);
    }

    /**
     * @private
     * @function _process_rsp_event_in_wait_rsp
     * @param {number} n_device_index The device index.
     * @param {Array<string>|string} s_rx The received data that is the data field of coffee framework.
     * @description Processes an occurred event in the waiting-response status, typically for card reading scenarios, handling successful responses or errors.
     */
    function _process_rsp_event_in_wait_rsp(n_device_index,s_rx){
        do{
            var para = elpusk.util.map_of_queue_get(_map_q_para,n_device_index);
            if( !para ){
                continue;
            }
            if( !_is_event_rsp_good(para.device,s_rx)){
                continue;
            }
            //e_rsp_good
            if(para.b_read ){
                var b_result = para.server.device_receive_with_callback(
                    n_device_index,0,
                    _cb_complete_rsp,
                    _cb_error_frame,
                    true
                );
                if( !b_result ){
                    continue;
                }
                _set_status(n_device_index,_type_status.ST_WAIT_READ_DATA);
            }
            else{
                _notifiy_received(para);
                elpusk.util.map_of_queue_delete(_map_q_para,n_device_index);
                _set_status(n_device_index,_type_status.ST_IDLE);
            }
            return;
        }while(false);

        _notifiy_error_all(n_device_index);
        elpusk.util.map_of_queue_delete(_map_q_para,n_device_index);
        _set_status(n_device_index,_type_status.ST_IDLE);
    }
    /**
     * @private
     * @function _process_rsp_event_in_wait_card
     * @param {number} n_device_index The device index.
     * @param {Array<string>|string} s_rx The received data that is the data field of coffee framework.
     * @description Processes an occurred event in the waiting-for-card-data status, typically for card reading scenarios, handling cancel events, successful card data reception, or errors.
     */
    function _process_rsp_event_in_wait_card(n_device_index,s_rx){

        do{
            if( _is_event_rsp_cancel(s_rx) ){
                //event e_rsp_cancel
                _notifiy_error(elpusk.util.map_of_queue_front(_map_q_para,n_device_index));
                _set_status(n_device_index,_type_status.ST_WAIT_CANCEL);
                return;
            }

            var para = elpusk.util.map_of_queue_get(_map_q_para,n_device_index);
            if( !para ){
                continue;
            }
            if (para.device.get_type_string() == "compositive_msr") {
                if( !para.device.set_msr_data_from_rx(s_rx) ){
                    continue;
                }
            }
            else if (para.device.get_type_string() == "compositive_ibutton") {
                if( !para.device.set_ibutton_data_from_rx(s_rx) ){
                    continue;
                }
            }
            else{
                // error. not supported device type
                continue;
            }

            //event e_rsp_card
            if( para.resolve ){
                //the end of waiting for promise type
                para = elpusk.util.map_of_queue_front(_map_q_para,n_device_index);//remove requesst from queue.
                _set_status(n_device_index,_type_status.ST_IDLE);
                _notifiy_received(para);
                return;
            }
            _notifiy_received(para);
            //re-waiting card data for callback type
            var b_result = para.server.device_receive_with_callback(
                n_device_index,0,
                _cb_complete_rsp,
                _cb_error_frame,
                true
            );
            if( !b_result ){
                continue;
            }
            return;
        }while(false);

        _notifiy_error_all(n_device_index);
        elpusk.util.map_of_queue_delete(_map_q_para,n_device_index);
        _set_status(n_device_index,_type_status.ST_IDLE);
    }
    /**
     * @private
     * @function _process_rsp_event_in_wait_cancel
     * @param {number} n_device_index The device index.
     * @param {Array<string>|string} s_rx The received data that is the data field of coffee framework.
     * @description Processes an occurred event in the waiting-for-cancel-response status, typically for card reading scenarios, handling successful cancellation or errors.
     */
    function _process_rsp_event_in_wait_cancel(n_device_index,s_rx){
        do{
            var para = elpusk.util.map_of_queue_get(_map_q_para,n_device_index);
            if( !para ){
                continue;
            }
            if( !_is_event_rsp_good(para.device,s_rx)){
                continue;
            }

            //e_rsp_good
            var b_result = false;

            if (para.device.get_type_string() == "compositive_msr") {
                //to OPOS mode
                b_result = _gen_opos_start_io(para.server, para.device, _cb_complete_rsp, _cb_error_frame, para.b_read);
                if (!b_result) {
                    continue;
                }
                _set_status(para.device.get_device_index(), _type_status.ST_WAIT_RSP);
                return;
            }
            if (para.device.get_type_string() == "compositive_ibutton") {
                if(para.b_read){
                    b_result = _gen_ibutton_start_io(para.server, para.device, _cb_complete_rsp, _cb_error_frame, para.b_read);
                    if (!b_result) {
                        continue;
                    }
                    _set_status(para.device.get_device_index(), _type_status.ST_WAIT_READ_DATA);
                }
                else{
                    _notifiy_received(para);
                    elpusk.util.map_of_queue_delete(_map_q_para,n_device_index);
                    _set_status(para.device.get_device_index(), _type_status.ST_IDLE);
                }
                return;
            }

            // error
        }while(false);

        _notifiy_error_all(n_device_index);
        elpusk.util.map_of_queue_delete(_map_q_para,n_device_index);
        _set_status(n_device_index,_type_status.ST_IDLE);
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////
    // local callback functions
    ////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * @private
     * @function _cb_complete_rsp
     * @param {number} n_device_index The device index.
     * @param {Array<string>|string} s_rx The received data that is the data field of coffee framework.
     * @description This callback function is invoked when a response is received, processing events based on the current device status in card reading scenarios.
     */
    function _cb_complete_rsp(n_device_index,s_rx ){
        //event e_rsp_good		e_rsp_error	e_rsp_cancel	e_rsp_card
        do{
            var para = elpusk.util.map_of_queue_get(_map_q_para,n_device_index);
            if( !para ){
                continue;
            }
            //
            var st = _get_status(n_device_index);
            switch(st){
                case _type_status.ST_IDLE :
                    _process_rsp_event_in_idle(n_device_index);
                    continue;
                case _type_status.ST_WAIT_RSP :
                    _process_rsp_event_in_wait_rsp(n_device_index,s_rx);
                    continue;
                case _type_status.ST_WAIT_READ_DATA :
                    _process_rsp_event_in_wait_card(n_device_index,s_rx);
                    continue;
                case _type_status.ST_WAIT_CANCEL :
                    _process_rsp_event_in_wait_cancel(n_device_index,s_rx);
                    continue;
                default:
                    break;
            }//end switch
        }while(false);
    }
    /**
     * @private
     * @function _cb_error_frame
     * @param {number} n_device_index The device index.
     * @param {Error} event_error Error object.
     * @description This callback function is invoked on a frame error, indicating a communication issue with the device. It notifies all pending operations of the error and resets the device status.
     */
    function _cb_error_frame( n_device_index,event_error ){
        //event e_frame_error
        //called by coffee framework error.
        console.log("_cb_error_frame : "+ toString(n_device_index) + event_error);
        _notifiy_error_map(event_error);
        _map_status = new Map();//reset map statu to idle
    }
    /**
     * @private
     * @function _cb_error_common
     * @param {number} n_device_index The device index.
     * @param {Error} event_error Error object.
     * @description This callback function is called when a common error occurs during a request, notifying the corresponding pending operation of the error.
     */
    function _cb_error_common( n_device_index,event_error ){
        var parameter = elpusk.util.map_of_queue_front(_map_q_para,n_device_index);
        _notifiy_error(parameter);
    };
    /**
     * @private
     * @function _cb_complete_get_parameter
     * @param {number} n_device_index The device index.
     * @param {Array<string>|string} s_rx The received data that is the data field of coffee framework.
     * @description This callback function is called when a "get parameters" request is completed, processing the received data and handling subsequent requests if necessary.
     */
    function _cb_complete_get_parameter( n_device_index,s_rx  ){
        var b_result = false;
        var parameter = elpusk.util.map_of_queue_front(_map_q_para,n_device_index);
        do{
            if( parameter === null ){
                continue;
            }
            if( !parameter.device.set_rx_transaction(s_rx) ){
                continue;
            }
            if( !parameter.device.set_from_rx() ){
                continue;
            }
            //
            if( typeof parameter.cb_progress === 'function'){
                parameter.stage_cur++;
                parameter.cb_progress(n_device_index,parameter.stage_max,parameter.stage_cur );
            }
            //
            var s_request = parameter.device.get_tx_transaction();
            if( s_request === null ){
                //compete all response
                parameter.device.clear_transaction();
                _notifiy_received(parameter);
                parameter = null;
                b_result = true;
                continue;
            }
            //io next request
            b_result = parameter.server.device_transmit_with_callback(
                parameter.device.get_device_index(),0,0, s_request,
                _cb_complete_get_parameter,
                _cb_error_common,
                true
                );
            if( !b_result ){
                continue;
            }

            b_result = true;            
        }while(false);

        if( parameter ){
            if(b_result){
                elpusk.util.map_of_queue_push(_map_q_para,n_device_index,parameter);
            }
            else{//protocol error
                parameter.device.clear_transaction();
                _notifiy_error(parameter);
            }
        }
    };
    /**
     * @private
     * @function _cb_complete_sys_info
     * @param {number} n_device_index The device index.
     * @param {Array<string>|string} s_rx The received data that is the data field of coffee framework.
     * @description This callback function is called when a "get system parameters" request is completed, subsequently triggering the process to get all other parameters.
     */
    function _cb_complete_sys_info( n_device_index,s_rx  ){
        var b_result = false;
        var n_request = 0;
        var parameter = elpusk.util.map_of_queue_front(_map_q_para,n_device_index);
        do{
            if( parameter === null ){
                continue;
            }
            if( !parameter.device.set_rx_transaction(s_rx) ){
                continue;
            }
            if( !parameter.device.set_from_rx() ){
                continue;
            }

            if( typeof parameter.cb_progress === 'function'){
                parameter.stage_cur++;
                parameter.cb_progress(n_device_index,parameter.stage_max,parameter.stage_cur );
            }

            var s_request = parameter.device.get_tx_transaction();
            if( s_request === null ){
                n_request = _gen_get_para_start_io(parameter.server,parameter.device,_cb_complete_get_parameter, _cb_error_common);
                if( n_request<=0 ){
                    console.log("E : _cb_complete_sys_info : _gen_get_para_start_io");
                }
                else{
                    if( typeof parameter.cb_progress === 'function'){
                        parameter.stage_max = n_request;
                        parameter.stage_cur = 0;
                    }
                    b_result = true;
                }
                continue;
            }
            
            b_result = parameter.server.device_transmit_with_callback(
                parameter.device.get_device_index(),0,0, s_request,
                _cb_complete_sys_info,
                _cb_error_common,
                true
                );
            if( !b_result ){
                continue;
            }
            b_result = true;
        }while(false);

        if( parameter ){
            if( b_result ){
                elpusk.util.map_of_queue_push(_map_q_para,n_device_index,parameter);
            }
            else{
                parameter.device.clear_transaction();
                _notifiy_error(parameter);
            }
        }
    };

    /**
     * @private
     * @function _cb_complete_sys_info_only
     * @param {number} n_device_index The device index.
     * @param {Array<string>|string} s_rx The received data that is the data field of coffee framework.
     * @description This callback function is called when a "get system parameters" request is completed, but does not proceed to get all other parameters.
     */
    function _cb_complete_sys_info_only( n_device_index,s_rx  ){
        var b_result = false;
        var n_request = 0;
        var parameter = elpusk.util.map_of_queue_front(_map_q_para,n_device_index);
        do{
            if( parameter === null ){
                continue;
            }
            if( !parameter.device.set_rx_transaction(s_rx) ){
                continue;
            }
            if( !parameter.device.set_from_rx() ){
                continue;
            }

            if( typeof parameter.cb_progress === 'function'){
                parameter.stage_cur++;
                parameter.cb_progress(n_device_index,parameter.stage_max,parameter.stage_cur );
            }

            var s_request = parameter.device.get_tx_transaction();
            if( s_request === null ){
                //compete all response
                parameter.device.clear_transaction();
                _notifiy_received(parameter);
                parameter = null;
                b_result = true;
                continue;
            }
            
            b_result = parameter.server.device_transmit_with_callback(
                parameter.device.get_device_index(),0,0, s_request,
                _cb_complete_sys_info_only,
                _cb_error_common,
                true
                );
            if( !b_result ){
                continue;
            }
            b_result = true;
        }while(false);

        if( parameter ){
            if( b_result ){
                elpusk.util.map_of_queue_push(_map_q_para,n_device_index,parameter);
            }
            else{
                parameter.device.clear_transaction();
                _notifiy_error(parameter);
            }
        }
    };

    /**
     * @private
     * @function _cb_complete_set_parameter
     * @param {number} n_device_index The device index.
     * @param {Array<string>|string} s_rx The received data that is the data field of coffee framework.
     * @description This callback function is called when a "set parameters" request is completed, processing the received data and handling subsequent requests if necessary.
     */
    function _cb_complete_set_parameter( n_device_index,s_rx  ){
        var b_result = false;
        var parameter = elpusk.util.map_of_queue_front(_map_q_para,n_device_index);
        do{
            if( parameter === null ){
                console.log("E : _cb_complete_set_parameter : parameter");
                continue;
            }
            if( !parameter.device.set_rx_transaction(s_rx) ){
                console.log("E : _cb_complete_set_parameter : set_rx_transaction");
                continue;
            }
            if( !parameter.device.set_from_rx() ){
                console.log("E : _cb_complete_set_parameter : set_from_rx");
                continue;
            }
            if( typeof parameter.cb_progress === 'function'){
                parameter.stage_cur++;
                parameter.cb_progress(n_device_index,parameter.stage_max,parameter.stage_cur );
            }
            //
            var s_request = parameter.device.get_tx_transaction();
            if( s_request === null ){
                //compete all response
                parameter.device.clear_transaction();
                _notifiy_received(parameter);
                parameter = null;
                b_result = true;
                continue;
            }

            b_result = parameter.server.device_transmit_with_callback(
                parameter.device.get_device_index(),0,0, s_request,
                _cb_complete_set_parameter,
                _cb_error_common,
                true
                );
            if( !b_result ){
                console.log("E : _cb_complete_set_parameter : device_transmit_with_callback");
                continue;
            }

            b_result = true;
        }while(false);
        
        if( parameter ){ 
            if( b_result ){
                elpusk.util.map_of_queue_push(_map_q_para,n_device_index,parameter);                
            }
            else{
                parameter.device.clear_transaction();
                _notifiy_error(parameter);
            }
        }
    };
    /**
     * @private
     * @function _cb_complete_run_bootloader
     * @param {number} n_device_index The device index.
     * @param {Array<string>|string} s_rx The received data that is the data field of coffee framework.
     * @description This callback function is called when a "run bootloader" request is completed, processing the received data and handling subsequent requests if necessary.
     */
    function _cb_complete_run_bootloader( n_device_index,s_rx  ){
        var b_result = false;
        var parameter = elpusk.util.map_of_queue_front(_map_q_para,n_device_index);
        do{
            if( parameter === null ){
                console.log("E : _cb_complete_run_bootloader : parameter");
                continue;
            }
            if( !parameter.device.set_rx_transaction(s_rx) ){
                console.log("E : _cb_complete_run_bootloader : set_rx_transaction");
                continue;
            }
            if( !parameter.device.set_from_rx() ){
                console.log("E : _cb_complete_run_bootloader : set_from_rx");
                continue;
            }
            //
            var s_request = parameter.device.get_tx_transaction();
            if( s_request === null ){
                //compete all response
                parameter.device.clear_transaction();
                _notifiy_received(parameter);
                parameter = null;
                b_result = true;
                continue;
            }

            b_result = parameter.server.device_transmit_with_callback(
                parameter.device.get_device_index(),0,0, s_request,
                _cb_complete_run_bootloader,
                _cb_error_common,
                true
                );
            if( !b_result ){
                console.log("E : _cb_complete_set_parameter : device_transmit_with_callback");
                continue;
            }

            b_result = true;
        }while(false);
        
        if( parameter ){ 
            if( b_result ){
                elpusk.util.map_of_queue_push(_map_q_para,n_device_index,parameter);                
            }
            else{
                parameter.device.clear_transaction();
                _notifiy_error(parameter);
            }
        }
    };

    /**
     * @private
     * @function _check_server_and_device
     * @param {elpusk.framework.coffee} server coffee manager server object.
     * @param {elpusk.device.usb.hid.lpu237} device lpu237 protocol object.
     * @returns {boolean} true - server & device object is available.
     * <br /> false - server is invalid or device object is not opened.
     */
    function _check_server_and_device(server,device) {
        var b_check_ok = false;
        do{
            if( !server ){
                continue;
            }
            if(!device){
                continue;
            }
            if( device.get_device_index() <= 0 ){
                continue;
            }
            b_check_ok = true;
        }while(false);
        return b_check_ok;
    };

    /**
     * @constructs elpusk.framework.coffee.ctl_lpu237
     * @param {elpusk.framework.coffee} server coffee manager server object.
     * @param {elpusk.device.usb.hid.lpu237} device target device object.
     * @description Constructor of lpu237 control class.
    */
    _elpusk.framework.coffee.ctl_lpu237 = function(server,device){
        //private variables
        this._server = server;
        this._device = device;
    };


    /**
     * @public
     * @function toString
     * @return {string} format - class name( server session number, device path ).
     * @description return the information of instance by string format.
     */
    _elpusk.framework.coffee.ctl_lpu237.prototype.toString = function(){
        var s_message = "ctl_lpu237";
        var s_server = "none";
        var s_device = "none";

        if( this._server ){
            s_server = this._server.get_session_number();
        }
        if( this._device ){
            s_device = this._device.get_path();
        }
        s_message = s_message + "(" + s_server + "," + s_device + ")";
        return s_message;
    };

    /**
     * @public
     * @function get_server
     * @return {elpusk.framework.coffee} return server object of this controller.
     */
    _elpusk.framework.coffee.ctl_lpu237.prototype.get_server = function(){
        return this._server;
    };

    /**
     * @public
     * @function get_device
     * @return {elpusk.device.usb.hid.lpu237} return lpu237 object of this controller.
     */
    _elpusk.framework.coffee.ctl_lpu237.prototype.get_device = function(){
        return this._device;
    };

    /**
     * @public
     * @function open_with_promise
     * @return {Promise<string>} A promise that resolves with "success" or rejects with an `Error` object.
     * @description Executes "open device" with the server and lpu237 object provided during construction.
     * <br /> The promise resolves with the string "success".
     * <br /> The promise rejects with an `Error` object, whose message is typically "error".
     */
    _elpusk.framework.coffee.ctl_lpu237.prototype.open_with_promise = function(){
        var _server = this._server;
        var _device = this._device;

        return new Promise(function (resolve, reject) {
            var b_result = false;

            do{
                if( !_server ){
                    continue;
                }
                if(!_device){
                    continue;
                }
                if( _device.get_device_index() > 0 ){
                    b_result = true;
                    resolve("success");
                    continue;//already open
                }

                var b_shared = false;
                if( _device.get_type_string() == "compositive_ibutton" ){
                    b_shared = true;
                }
                _server.device_open(_device.get_path(),b_shared).then(function (n_device_index) {
                    if( typeof n_device_index === 'undefined'){
                        reject(new Error("error"));
                    }
                    else{
                        if( n_device_index!==0){
                            elpusk.util.map_of_queue_delete(_map_q_para,n_device_index);
                            _device.opened( n_device_index );
                            resolve("success");
                        }
                        else{
                            reject(new Error("error"));
                        }
                    }
                }).catch(function (event_error) {
                    // error here
                    reject(event_error);
                });
                //
                b_result = true;
            }while(false);
            if( !b_result ){
                reject(new Error("error"));
            }
        });//the end promise
    };

    /**
     * @public
     * @function close_with_promise
     * @return {Promise<string>} A promise that resolves with "success" or rejects with an `Error` object.
     * @description Executes "close device" with the server and lpu237 object provided during construction.
     * <br /> The promise resolves with the string "success".
     * <br /> The promise rejects with an `Error` object, whose message is typically "error".
     */
    _elpusk.framework.coffee.ctl_lpu237.prototype.close_with_promise = function(){
        var _server = this._server;
        var _device = this._device;

        return new Promise(function (resolve, reject) {
            var b_result = false;

            do{
                if( !_server ){
                    continue;
                }
                if(!_device){
                    continue;
                }
                if( _device.get_device_index() <= 0 ){
                    b_result = true;
                    resolve("success");
                    continue;//already close
                }
    
                _server.device_close(_device.get_device_index()).then(function (s_rx) {
                    if (Array.isArray(s_rx)){
                        if( s_rx[0] === "success"){
                            elpusk.util.map_of_queue_delete(_map_q_para,_device.get_device_index());
                            _device.closed();
                            resolve("success");
                        }
                        else{
                            reject(new Error("error"));
                        }
                    }
                    else{
                        if( s_rx === "success "){
                            elpusk.util.map_of_queue_delete(_map_q_para,_device.get_device_index());
                            _device.closed();
                            resolve("success");
                        }
                        else{
                            reject(new Error("error"));
                        }
                    }

                }).catch(function (event_error) {
                    // error here
                    reject(event_error);
                });
                //
                b_result = true;
            }while(false);
            if( !b_result ){
                reject(new Error("error"));
            }
        });//the end promise
    };

    /**
     * @public
     * @function load_all_parameter_from_device_with_promise
     * @param {function(number, number, number)} cb_progress This function will be called each stage of "get system information" and "get parameters". `cb_progress` prototype is `cb_progress(n_device_index, n_number_of_stage, n_current_stage)`.
     * @return {Promise<string>} A promise that resolves with "success" or rejects with an `Error` object.
     * @description Executes "get system information" and "get parameters" with the server and lpu237 object provided during construction.
     * <br /> The promise resolves with the string "success".
     * <br /> The promise rejects with an `Error` object, whose message is typically "error".
     * <br /> This function processes "get system parameters" and "get parameters" requests.
     * <br /> Therefore, `cb_progress()` will be called multiple times for "get system parameters" and "get parameters" requests.
     */
    _elpusk.framework.coffee.ctl_lpu237.prototype.load_all_parameter_from_device_with_promise = function(cb_progress){
        var b_error = true;
        var server = this._server;
        var device = this._device;
        var cb_progress_value = null;

        do{
            if( !_check_server_and_device(server,device)){
                continue;
            }

            if( !elpusk.util.map_of_queue_is_empty(_map_q_para,device.get_device_index()) ){
                continue;
            }

            if( typeof cb_progress === 'function'){
                cb_progress_value = cb_progress;
            }
            b_error = false;
        }while(false);

        if( b_error ){
            return new Promise(function (resolve, reject) {
                reject(new Error("error"));//another is running.
                }
            );//the end promise            
        }
        else{
            var b_read = true;

            return new Promise(function (resolve, reject) {
                var n_request = 0;

                do{
                    n_request = _gen_get_sysinfo_start_io( server, device,_cb_complete_sys_info, _cb_error_common);
                    if( n_request <= 0 ){
                        continue;
                    }

                    var parameter = {
                        "server" : server,
                        "device" : device,
                        "resolve" : resolve,
                        "reject" : reject,
                        "cb_progress" : cb_progress_value,
                        "stage_max" : n_request,
                        "stage_cur" : 0
                    };
                    elpusk.util.map_of_queue_push(_map_q_para,device.get_device_index(),parameter);

                }while(false);
                if( n_request <= 0 ){
                    reject(new Error("error"));
                }
            });//the end promise
        }
    };

    /**
     * @public
     * @function load_min_parameter_from_device_with_promise
     * @param {function(number, number, number)} cb_progress This function will be called each stage of "get system information". `cb_progress` prototype is `cb_progress(n_device_index, n_number_of_stage, n_current_stage)`.
     * @return {Promise<string>} A promise that resolves with "success" or rejects with an `Error` object.
     * @description Executes "get system information" with the server and lpu237 object provided during construction.
     * <br /> This function is used when reading MSR or iButton data.
     * <br /> The promise resolves with the string "success".
     * <br /> The promise rejects with an `Error` object, whose message is typically "error".
     */
    _elpusk.framework.coffee.ctl_lpu237.prototype.load_min_parameter_from_device_with_promise = function(cb_progress){
        var b_error = true;
        var server = this._server;
        var device = this._device;
        var cb_progress_value = null;

        do{
            if( !_check_server_and_device(server,device)){
                continue;
            }

            if( !elpusk.util.map_of_queue_is_empty(_map_q_para,device.get_device_index()) ){
                continue;
            }

            if( typeof cb_progress === 'function'){
                cb_progress_value = cb_progress;
            }
            b_error = false;
        }while(false);

        if( b_error ){
            return new Promise(function (resolve, reject) {
                reject(new Error("error"));//another is running.
                }
            );//the end promise            
        }
        else{
            var b_read = true;

            return new Promise(function (resolve, reject) {
                var n_request = 0;

                do{
                    n_request = _gen_get_sysinfo_start_io( server, device,_cb_complete_sys_info_only, _cb_error_common);
                    if( n_request <= 0 ){
                        continue;
                    }

                    var parameter = {
                        "server" : server,
                        "device" : device,
                        "resolve" : resolve,
                        "reject" : reject,
                        "cb_progress" : cb_progress_value,
                        "stage_max" : n_request,
                        "stage_cur" : 0
                    };
                    elpusk.util.map_of_queue_push(_map_q_para,device.get_device_index(),parameter);

                }while(false);
                if( n_request <= 0 ){
                    reject(new Error("error"));
                }
            });//the end promise
        }
    };
    
    /**
     * @public
     * @function save_parameter_to_device_with_promise
     * @param {function(number, number, number)} cb_progress This function will be called each stage of "set parameters". `cb_progress` prototype is `cb_progress(n_device_index, n_number_of_stage, n_current_stage)`.
     * @return {Promise<string>} A promise that resolves with "success" or rejects with an `Error` object.
     * @description Executes "set parameters" with the server and lpu237 object provided during construction.
     * <br /> The promise resolves with the string "success".
     * <br /> The promise rejects with an `Error` object, whose message is typically "error".
     */
    _elpusk.framework.coffee.ctl_lpu237.prototype.save_parameter_to_device_with_promise = function(cb_progress){
        var b_error = true;
        var server = this._server;
        var device = this._device;
        var cb_progress_value = null;

        do{
            if( !_check_server_and_device(server,device)){
                continue;
            }

            if( !elpusk.util.map_of_queue_is_empty(_map_q_para,device.get_device_index()) ){
                continue;
            }

            if( typeof cb_progress === 'function'){
                cb_progress_value = cb_progress;
            }

            b_error = false;
        }while(false);

        if( b_error ){
            return new Promise(function (resolve, reject) {
                reject(new Error("error"));//another is running.
                }
            );//the end promise            
        }
        else{
            var b_read = true;

            return new Promise(function (resolve, reject) {
                var n_request = 0;

                do{
                    n_request = _gen_set_para_start_io( server, device,_cb_complete_set_parameter, _cb_error_common);
                    if( n_request<=0){
                        continue;
                    }

                    var parameter = {
                        "server" : server,
                        "device" : device,
                        "resolve" : resolve,
                        "reject" : reject,
                        "cb_progress" : cb_progress_value,
                        "stage_max" : n_request,
                        "stage_cur" : 0
                    };
                    elpusk.util.map_of_queue_push(_map_q_para,device.get_device_index(),parameter);

                }while(false);
                if( n_request<= 0 ){
                    reject(new Error("error"));
                }
            });//the end promise
        }        
    };

    /**
     * @public
     * @function run_bootloader_of_device_with_promise
     * @return {Promise<string>} A promise that resolves with "success" or rejects with an `Error` object.
     * @description Runs the bootloader of the lpu237 device using the server and lpu237 object provided during construction.
     * <br /> The promise resolves with the string "success".
     * <br /> The promise rejects with an `Error` object, whose message is typically "error".
     */
    _elpusk.framework.coffee.ctl_lpu237.prototype.run_bootloader_of_device_with_promise = function(){
        var b_error = true;
        var server = this._server;
        var device = this._device;

        do{
            if( !_check_server_and_device(server,device)){
                continue;
            }

            if( !elpusk.util.map_of_queue_is_empty(_map_q_para,device.get_device_index()) ){
                continue;
            }

            b_error = false;
        }while(false);

        if( b_error ){
            return new Promise(function (resolve, reject) {
                reject(new Error("error"));//another is running.
                }
            );//the end promise            
        }
        else{
            return new Promise(function (resolve, reject) {
                var n_request = 0;

                do{
                    n_request = _gen_run_bootloader_start_io( server, device,_cb_complete_run_bootloader, _cb_error_common);
                    if( n_request<=0){
                        continue;
                    }

                    var parameter = {
                        "server" : server,
                        "device" : device,
                        "resolve" : resolve,
                        "reject" : reject
                    };
                    elpusk.util.map_of_queue_push(_map_q_para,device.get_device_index(),parameter);

                }while(false);
                if( n_request<= 0 ){
                    reject(new Error("error"));
                }
            });//the end promise
        }        
    };

    /**
     * @public
     * @function read_card_from_device_with_callback
     * @param {boolean} b_read true - reading card.
     * <br /> false - ignore reading card.
     * @param {function(number, string): void} cb_read_done Called when a card reading is done, or when the ready-for-reading state is canceled.
     * @param {function(number, Error): void} cb_read_error Called when an error occurs.
     * @returns {boolean} true - success processing.
     * <br /> false - error.
     * @description Changes the lpu237's status to "reading card" or "ignore reading card."
     * If this function is executed with "b_read is true",
     * <br /> lpu237 calls `cb_read_done` whenever a card reading is completed,
     * <br /> until an error (communication error or protocol error) occurs
     * <br /> or this function is executed with "b_read is false".
     * <br /> The result of the process will be given by the callback function.
     */
    _elpusk.framework.coffee.ctl_lpu237.prototype.read_card_from_device_with_callback = function(b_read,cb_read_done,cb_read_error){

        var b_result = false;
        var server = this._server;
        var device = this._device;
        do{
            if( typeof b_read !== 'boolean' ){
                continue;
            }

            device.reset_msr_data();

            switch(_get_status(device.get_device_index())){
                case _type_status.ST_IDLE:
                    if( !_check_server_and_device(server,device)){
                        break;
                    }
                    b_result = _cancel_start_io(server,device,_cb_complete_rsp,_cb_error_frame );
                    if( b_result ){
                        _set_status(device.get_device_index(),_type_status.ST_WAIT_CANCEL);
                    }
                    break;
                case _type_status.ST_WAIT_READ_DATA:
                    if( b_read ){
                        break;
                    }
                    b_result = _cancel_start_io(server,device,_cb_complete_rsp,_cb_error_frame );
                    break;
                default:
                    break;
            }//end switch
        }while(false);


        if( b_result ){
            var parameter = {
                "server" : server,
                "device" : device,
                "resolve" : null,
                "reject" : null,
                "b_read" : b_read,
                "cb_received" : cb_read_done,
                "cb_error" : cb_read_error
            };
            elpusk.util.map_of_queue_push(_map_q_para,device.get_device_index(),parameter);
        }

        return b_result;
    };


    /**
     * @public
     * @function read_ibutton_from_device_with_callback
     * @param {boolean} b_read true - reading iButton.
     * <br /> false - ignore reading iButton.
     * @param {function(number, string): void} cb_read_done Called when an iButton reading is done, or when the ready-for-reading state is canceled.
     * @param {function(number, Error): void} cb_read_error Called when an error occurs.
     * @returns {boolean} true - success processing.
     * <br /> false - error.
     * @description Changes the lpu237's status to "reading iButton" or "ignore reading iButton."
     * If this function is executed with "b_read is true",
     * <br /> lpu237 calls `cb_read_done` whenever an iButton reading is completed,
     * <br /> until an error (communication error or protocol error) occurs
     * <br /> or this function is executed with "b_read is false".
     * <br /> The result of the process will be given by the callback function.
     */
    _elpusk.framework.coffee.ctl_lpu237.prototype.read_ibutton_from_device_with_callback = function(b_read,cb_read_done,cb_read_error){

        var b_result = false;
        var server = this._server;
        var device = this._device;
        do{
            if( typeof b_read !== 'boolean' ){
                continue;
            }

            device.reset_ibutton_data();

            switch(_get_status(device.get_device_index())){
                case _type_status.ST_IDLE:
                    if( !_check_server_and_device(server,device)){
                        break;
                    }
                    b_result = _cancel_start_io(server,device,_cb_complete_rsp,_cb_error_frame );
                    if( b_result ){
                        _set_status(device.get_device_index(),_type_status.ST_WAIT_CANCEL);
                    }
                    break;
                case _type_status.ST_WAIT_READ_DATA:
                    if( b_read ){
                        break;
                    }
                     b_result = _cancel_start_io(server,device,_cb_complete_rsp,_cb_error_frame );
                    break;
                default:
                    break;
            }//end switch
        }while(false);


        if( b_result ){
            if(b_read){
                device.set_ignore_ibutton_data(false);
            }
            else{
                device.set_ignore_ibutton_data(true);
            }

            var parameter = {
                "server" : server,
                "device" : device,
                "resolve" : null,
                "reject" : null,
                "b_read" : b_read,
                "cb_received" : cb_read_done,
                "cb_error" : cb_read_error
            };
            elpusk.util.map_of_queue_push(_map_q_para,device.get_device_index(),parameter);
        }

        return b_result;
    };
    
    ////////////////////////////////////////////////////////////////////////////
    // the end of function
    window.elpusk = _elpusk;
}(window));