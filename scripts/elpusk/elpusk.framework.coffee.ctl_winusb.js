/**
 * 2023.04.27
 * @license MIT
 * Copyright (c) 2023 Elpusk.Co.,Ltd.
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
 * @copyright Elpusk.Co.,Ltd 2023
 * @version 0.1.0
 * @description winusb controller of elpusk framework coffee javascript library.
 *
 * Error Rules:
 * - coffee framework error: generates promise reject or calls error callback function.
 * - protocol error (winusb device protocol): generates promise reject or calls error callback function.
 * - rx error: generates promise resolve or calls complete callback function.
 * - rx success: generates promise resolve or calls complete callback function.
 *
 * 2023.4.27 - starts
 *
 * @namespace elpusk.framework.coffee.ctl_winusb
 */

'use strict';


(function (window, undefined) {
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
    if(_elpusk.framework.coffee.ctl_winusb){
        return;
    }


    //////////////////////////////////////////////////////////////////////////
    //
    var _type_status = {
        /** @description Undefined status. */
        ST_UNDEFINED : -1,
        /** @description Idle status, no operation is in progress. */
        ST_IDLE : 0,
        /** @description Waiting for a response from the device. */
        ST_WAIT_RSP : 1,
        /** @description Waiting for a cancel confirmation from the device. */
        ST_WAIT_CANCEL : 2
    };

    /**
     * map of queue of promise resolve & reject.
     * @private
     */
    var _map_q_para = new Map();

    /**
     * map of device status
     * @private
     */
    var _map_status = new Map();

    /**
     * @private
     * @function _get_status
     * @param {number} n_device_index the index value of device.
     * @return {number} _type_status type vaue.
     * @description turns the system status for a given device index in card reading method.
     * internal use only.
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
     * @param {number} n_device_index The index value of the device.
     * @param {number} new_status The new status, one of `_type_status` values.
     * @description Changes the system status for a given device index in card reading method.
     * Internal use only.
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
     * @function _gen_get_para_start_io
     * @param {object} server coffee manager server object.
     * @param {object} device target device object.
     * @param {function} cb_complete_get_parameter Callback function called when "get parameters" completes successfully.
     * @param {function} cb_error_get_parameter Callback function called when an error occurs during "get parameters".
     * @returns {number} A positive number if the request is delivered to the server successfully,
     *                   or zero/negative if the request delivery failed.
     * @description Requests "get parameters" to the server using a callback method.
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
     * @param {object} server coffee manager server object.
     * @param {object} device target device object.
     * @param {function} cb_complete_set_parameter Callback function called when "set parameters" completes successfully.
     * @param {function} cb_error_set_parameter Callback function called when an error occurs during "set parameters".
     * @returns {number} A positive number if the request is delivered to the server successfully,
     *                   or zero/negative if the request delivery failed.
     * @description Requests "set parameters" to the server using a callback method.
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
     * @param {object} server coffee manager server object.
     * @param {object} device target device object.
     * @param {function} cb_complete_changed_opos Callback function called when card reading is completed successfully (if `b_read` is true),
     *                                          or when the device accepts the request successfully (if `b_read` is false).
     * @param {function} cb_error_changed_opos Callback function called when an error occurs.
     * @param {boolean} b_read If true, the device waits for a card reading. If false, the device ignores card reading.
     * @returns {boolean} True if the request is delivered to the server successfully, otherwise false.
     * @description Requests "card reading" or "ignore card reading" to the server using a callback method.
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
     * @param {object} server coffee manager server object.
     * @param {object} device target device object.
     * @param {function} cb_complete_cancel Callback function called when the device accepts the request successfully.
     * @param {function} cb_error_cancel Callback function called when an error occurs.
     * @returns {boolean} True if the request is delivered to the server successfully, otherwise false.
     * @description Requests "cancel" to the server using a callback method.
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
     * @param {object} server coffee manager server object.
     * @param {object} device target device object.
     * @param {function} cb_complete_run_bootloader Callback function called when the device accepts the request successfully.
     * @param {function} cb_error_run_bootloader Callback function called when an error occurs.
     * @returns {boolean} True if the request is delivered to the server successfully, otherwise false.
     * @description Requests the WinUSB device to execute its bootloader.
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
     * @function _notifiy_error
     * @param {object} parameter Object containing notification information, including `device`, `reject`, and `cb_error`.
     * @param {object|undefined} [event_error] Optional Error object.
     * @description Calls the error callback function or rejects the promise.
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
     * @param {object|undefined} [event_error] Optional Error object.
     * @description Calls the error callback function or rejects the promise for all pending requests of a specific device.
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
     * @param {object|undefined} [event_error] Optional Error object.
     * @description Calls the error callback function or rejects the promise for all pending requests across all devices.
     */
    function _notifiy_error_map( event_error ){
        do{
            _map_q_para.forEach(
                function (value, key, map) {
                // 'value' here is the queue for a specific device index, 'key' is the device index
                // So, we need to call _notifiy_error_all with the device index and event_error
                _notifiy_error_all(key, event_error);
            });
            elpusk.util.map_of_queue_clear();
        }while(false);
    }    
    /**
     * @private
     * @function _notifiy_received
     * @param {object} parameter Object containing notification information, including `device`, `resolve`, and `cb_received`.
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
     * @param {object} device WinUSB protocol object.
     * @param {Array|String} s_rx The received data, which is the data field of the Coffee Framework.
     * @returns {boolean} True if the response from the Coffee Framework is successful, otherwise false.
     * @description Checks whether the response from the Coffee Framework indicates success.
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
     * @param {Array} s_rx The received data, which is the data field of the Coffee Framework.
     * @returns {boolean} True if the first item in the received data array is "cancel", otherwise false.
     * @description Checks whether the response from the Coffee Framework is a "cancel" message.
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
     * @function _process_event_in_idle
     * @param {number} n_device_index The device index.
     * @description Processes an occurred event when the system is in an idle status (e.g., card reading case).
     */
    function _process_event_in_idle(n_device_index){
        _notifiy_error_all(n_device_index);
        elpusk.util.map_of_queue_delete(_map_q_para,n_device_index);
    }

    /**
     * @private
     * @function _process_event_in_wait_rsp
     * @param {number} n_device_index The device index.
     * @param {Array|String} s_rx The received data, which is the data field of the Coffee Framework.
     * @description Processes an occurred event when the system is waiting for a response (e.g., card reading case).
     */
    function _process_event_in_wait_rsp(n_device_index,s_rx){
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
                _set_status(n_device_index,_type_status.ST_IDLE);
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
     * @function _process_event_in_wait_cancel
     * @param {number} n_device_index The device index.
     * @param {Array|String} s_rx The received data, which is the data field of the Coffee Framework.
     * @description Processes an occurred event when the system is waiting for a cancel response (e.g., card reading case).
     */
    function _process_event_in_wait_cancel(n_device_index,s_rx){
        do{
            var para = elpusk.util.map_of_queue_get(_map_q_para,n_device_index);
            if( !para ){
                continue;
            }
            if( !_is_event_rsp_good(para.device,s_rx)){
                continue;
            }

            //e_rsp_good
            var b_result = _gen_opos_start_io( para.server, para.device,_cb_complete_rsp, _cb_error_frame,para.b_read);
            if( !b_result ){
                continue;
            }
            _set_status(para.device.get_device_index(),_type_status.ST_WAIT_RSP);
            return;
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
     * @param {Array|String} s_rx The received data, which is the data field of the Coffee Framework.
     * @description Callback function for when a response is completed (e.g., in card reading case).
     * Processes the occurred event while waiting for a response.
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
                    _process_event_in_idle(n_device_index);
                    continue;
                case _type_status.ST_WAIT_RSP :
                    _process_event_in_wait_rsp(n_device_index,s_rx);
                    continue;
                case _type_status.ST_WAIT_CANCEL :
                    _process_event_in_wait_cancel(n_device_index,s_rx);
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
     * @param {object} event_error Error object.
     * @description Callback function for a frame error event.
     * This function does not process missing card data events; those are handled by `_cb_complete_rsp()`.
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
     * @param {object} event_error Error object.
     * @description Local callback function called when an error occurs in a request.
     * `_cb_error_frame()` will be used in card reading cases.
     */
    function _cb_error_common( n_device_index,event_error ){
        var parameter = elpusk.util.map_of_queue_front(_map_q_para,n_device_index);
        _notifiy_error(parameter);
    };
    /**
     * @private
     * @function _cb_complete_get_parameter
     * @param {number} n_device_index The device index.
     * @param {Array|String} s_rx The received data, which is the data field of the Coffee Framework.
     * @description This callback function is called when a "get parameters" request is completed.
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
     * @param {Array|String} s_rx The received data, which is the data field of the Coffee Framework.
     * @description This callback function is called when a "get system parameters" request is completed.
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
     * @function _cb_complete_set_parameter
     * @param {number} n_device_index The device index.
     * @param {Array|String} s_rx The received data, which is the data field of the Coffee Framework.
     * @description This callback function is called when a "set parameters" request is completed.
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
     * @param {Array|String} s_rx The received data, which is the data field of the Coffee Framework.
     * @description This callback function is called when a "run bootloader" request is completed.
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
     * @function _gen_rx_start_io
     * @param {object} server coffee manager server object.
     * @param {object} device target device object.
     * @param {function} cb_complete Callback function called on successful completion.
     * @param {function} cb_error Callback function called on error.
     * @returns {number} A positive number indicating success, or zero/negative on failure.
     * @description Generates and initiates an RX (receive) operation. This is a placeholder.
     */
    function _gen_rx_start_io(server, device, cb_complete, cb_error) {
        // Placeholder implementation
        // In a real scenario, this would involve generating and sending a request
        // to the server to initiate a receive operation, similar to other _gen_ functions.
        // For now, it just simulates success or failure.
        var n_req = device.generate_get_sys_info(); // Assuming this generates an initial request
        if (n_req > 0) {
            return n_req;
        }
        return 0; // Simulate failure
    }

    /**
     * @private
     * @function _gen_write_start_io
     * @param {object} server coffee manager server object.
     * @param {object} device target device object.
     * @param {function} cb_complete Callback function called on successful completion.
     * @param {function} cb_error Callback function called on error.
     * @returns {number} A positive number indicating success, or zero/negative on failure.
     * @description Generates and initiates a write operation. This is a placeholder.
     */
    function _gen_write_start_io(server, device, cb_complete, cb_error) {
        // Placeholder implementation
        // In a real scenario, this would involve generating and sending a request
        // to the server to initiate a write operation, similar to other _gen_ functions.
        // For now, it just simulates success or failure.
        var n_req = device.generate_set_parameters(); // Assuming this generates an initial request
        if (n_req > 0) {
            return n_req;
        }
        return 0; // Simulate failure
    }

    /**
     * @private
     * @function _check_server_and_device
     * @param {object} server Coffee manager server object.
     * @param {object} device WinUSB protocol object.
     * @returns {boolean} True if the server and device objects are available and the device is opened, otherwise false.
     * @description Checks the availability and open status of the server and device objects.
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
     * @class
     * @classdesc Controls WinUSB device communication within the Coffee framework.
     * @param {object} server The Coffee manager server object.
     * @param {object} device The target WinUSB device object.
     */
    _elpusk.framework.coffee.ctl_winusb = function(server,device){
        //private variables
        this._server = server;
        this._device = device;
    };


    /**
     * @public
     * @function toString
     * @returns {string} Formatted string: class name (server session number, device path).
     * @description Returns the instance information as a formatted string.
     */
    _elpusk.framework.coffee.ctl_winusb.prototype.toString = function(){
        var s_message = "ctl_winusb";
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
     * @returns {object} The server object associated with this controller.
     */
    _elpusk.framework.coffee.ctl_winusb.prototype.get_server = function(){
        return this._server;
    };

    /**
     * @public
     * @function get_device
     * @returns {object} The WinUSB device object associated with this controller.
     */
    _elpusk.framework.coffee.ctl_winusb.prototype.get_device = function(){
        return this._device;
    };

    /**
     * @public
     * @function open_with_promise
     * @returns {Promise<string>} A promise that resolves with "success" string upon successful device opening,
     *                            or rejects with an Error object (message "error") on failure.
     * @description Executes the "open device" operation using the server and WinUSB object from the constructor.
     */
    _elpusk.framework.coffee.ctl_winusb.prototype.open_with_promise = function(){
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

                _server.device_open(_device.get_path()).then(function (n_device_index) {
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
     * @returns {Promise<string>} A promise that resolves with "success" string upon successful device closing,
     *                            or rejects with an Error object (message "error") on failure.
     * @description Executes the "close device" operation using the server and WinUSB object from the constructor.
     */
    _elpusk.framework.coffee.ctl_winusb.prototype.close_with_promise = function(){
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
                    if( s_rx === "success "){
                        elpusk.util.map_of_queue_delete(_map_q_para,_device.get_device_index());
                        _device.closed();
                        resolve("success");
                    }
                    else{
                        reject(new Error("error"));
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
     * @function read_from_device_with_promise
     * @param {function(number, number, number)} cb_progress Callback function called to report progress during RX operations.
     *                                                        Prototype: `cb_progress(n_device_index, n_number_of_stage, n_current_stage)`.
     * @returns {Promise<string>} A promise that resolves with "success" string upon successful RX,
     *                            or rejects with an Error object (message "error") on failure.
     * @description Executes "read" (RX) operations with the server and WinUSB object.
     * This function processes "get system parameters" and "get parameters" requests.
     * Therefore, `cb_progress()` will be called multiple times for these requests.
     */
    _elpusk.framework.coffee.ctl_winusb.prototype.read_from_device_with_promise = function(cb_progress){
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
            return new Promise(function (resolve, reject) {
                var n_request = 0;

                do{
                    n_request = _gen_rx_start_io( server, device,_cb_complete_sys_info, _cb_error_common);
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
     * @function write_to_device_with_promise
     * @param {function(number, number, number)} cb_progress Callback function called to report progress during writing data.
     *                                                        Prototype: `cb_progress(n_device_index, n_number_of_stage, n_current_stage)`.
     * @returns {Promise<string>} A promise that resolves with "success" string upon successful write,
     *                            or rejects with an Error object (message "error") on failure.
     * @description Executes "write" operations with the server and WinUSB object.
     */
    _elpusk.framework.coffee.ctl_winusb.prototype.write_to_device_with_promise = function(cb_progress){
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
                    n_request = _gen_write_start_io( server, device,_cb_complete_set_parameter, _cb_error_common);
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
     * @function read_from_device_with_callback
     * @param {function} cb_read_done Callback function called when an RX operation is done or canceled.
     * @param {function} cb_read_error Callback function called when an error occurs.
     * @returns {boolean} True if processing was successful, otherwise false.
     * @description Changes the WinUSB device's status to "wait for RX" or "ignore RX."
     * The processing result is provided via callback functions.
     */
    _elpusk.framework.coffee.ctl_winusb.prototype.read_from_device_with_callback = function(cb_read_done,cb_read_error){

        var b_result = false;
        var server = this._server;
        var device = this._device;
        do{

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
                "cb_received" : cb_read_done,
                "cb_error" : cb_read_error
            };
            elpusk.util.map_of_queue_push(_map_q_para,device.get_device_index(),parameter);
        }

        return b_result;
    };

    /**
     * @public
     * @function write_from_device_with_callback
     * @param {function} cb_read_done Callback function called when a TX operation is done or canceled.
     * @param {function} cb_read_error Callback function called when an error occurs.
     * @returns {boolean} True if processing was successful, otherwise false.
     * @description Provides the processing result via callback functions for TX (write) operations.
     */
    _elpusk.framework.coffee.ctl_winusb.prototype.write_from_device_with_callback = function(cb_read_done,cb_read_error){

        var b_result = false;
        var server = this._server;
        var device = this._device;
        do{
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