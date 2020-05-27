/**
 * 2020.5.14
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
 * @description lpu237 helper of elpusk framework coffee javascript library .
 * <br />  2020.5.14 - release 1.0.
  * @namespace
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
    if(_elpusk.framework.coffee.ctl_lpu237){
        return;
    }


    //////////////////////////////////////////////////////////////////////////
    //
    /**
     * map of queue of promise resolve & reject.
     * @private
     */
    var _map_of_queue_promise_parameter = new Map();

    /** 
     * @private 
     * @function _push_promise_parameter
     * @param {number} n_device_index
     * @param {object} paramemter of promise.
     * @description push promise parameter for promise method.
    */                
    function _push_promise_parameter(n_device_index,paramemter) {
        do{
            if( !_map_of_queue_promise_parameter.has(n_device_index) ){
                var queue = [];
                queue.push(paramemter);
                _map_of_queue_promise_parameter.set(n_device_index,queue);
                continue;
            }
            var q = _map_of_queue_promise_parameter.get(n_device_index);
            q.push(paramemter);

        }while(false);
    }

    /** 
     * @private 
     * @function _front_promise_parameter
     * @param {number} n_device_index
     * @returns {object|null} success - resolve & reject of promise.
     * <br /> empty - null
     * @description add promise parameter for promise method to queue.
    */                
    function _front_promise_parameter(n_device_index) {
        var parameter = null;
        do{
            if( !_map_of_queue_promise_parameter.has(n_device_index) ){
                continue;
            }
            var q = _map_of_queue_promise_parameter.get(n_device_index);
            if( q.length <= 0 ){
                continue;
            }
            //
            parameter = q.shift();
            if( q.length <= 0 ){
                _map_of_queue_promise_parameter.delete(n_device_index);
            }
        }while(false);
        return parameter;
    }

    /** 
     * @private 
     * @function _is_empty_promise_parameter
     * @param {number} n_device_index
     * @returns {boolean} true - empty promise parameter queue.
     * <br /> false - not  empty promise parameter queue.
     * @description check the promise parameter queue. if it is empty or not.
    */                
    function _is_empty_promise_parameter(n_device_index) {
        var b_empty = true;
        do{
            if( !_map_of_queue_promise_parameter.has(n_device_index) ){
                continue;
            }
            var q = _map_of_queue_promise_parameter.get(n_device_index);
            if( q.length <= 0 ){
                continue;
            }
            //
            b_empty = false;
        }while(false);
        return b_empty;
    }
    
    /** 
     * @private 
     * @function _delete_promise_parameter
     * @param {number} n_device_index
     * @description delete the promise parameter queue.
    */                
    function _delete_promise_parameter(n_device_index){
        if( _map_of_queue_promise_parameter.has(n_device_index)){
            _map_of_queue_promise_parameter.delete(n_device_index);
        }
    }

    /** 
     * @private 
     * @function _clear_promise_parameter
     * @description remove all item of map of  the promise parameter queue.
    */                
    function _clear_promise_parameter(){
        _map_of_queue_promise_parameter.clear();
    }
    /**
     * @private
     * @function _get_system_information
     * @param {object} server coffee manager server object.
     * @param {object} device target devuce object.
     * @param {function} cb_complete_sys_info It is called "callback function" when "get system information" is completed successfually. 
     * @param {function} cb_error_sys_info It is called "callback function" when error is occured.
     * @return {boolean} true - request is delivered to server successfully.
     * <br /> false - It is failed that request is delivered.
     * @description requests "get system information" to server by callback method.
     */
    function _get_system_information(server, device,cb_complete_sys_info,cb_error_sys_info) {
        var b_result = false;
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
                continue;
            }

            b_result = server.device_transmit_with_callback(
                device.get_device_index(),0,0, s_request,
                cb_complete_sys_info,
                cb_error_sys_info
                );
            if( !b_result ){
                device.clear_transaction();
                continue;
            }
            //
            b_result = true;
        }while(false);
        return b_result;
    }

    /**
     * @private
     * @function _get_parameters
     * @param {object} server coffee manager server object.
     * @param {object} device target devuce object.
     * @param {function} cb_complete_get_parameter It is called "callback function" when "get parameters" is completed successfually. 
     * @param {function} cb_error_get_parameter It is called "callback function" when error is occured.
     * @return {boolean} true - request is delivered to server successfully.
     * <br /> false - It is failed that request is delivered.
     * @description requests "get parameters" to server by callback method.
     */
    function _get_parameters(server, device,cb_complete_get_parameter,cb_error_get_parameter){
        var b_result = false;
        var s_request = null;
        var n_req = 0;

        do{
            device.clear_transaction();

            n_req = device.generate_get_parameters();
            if( n_req <= 0 ){
                continue;
            }

            s_request = device.get_tx_transaction();
            if( s_request === null ){
                continue;
            }

            b_result = server.device_transmit_with_callback(
                device.get_device_index(),0,0, s_request,
                cb_complete_get_parameter,
                cb_error_get_parameter
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
     * @function _set_parameters
     * @param {object} server coffee manager server object.
     * @param {object} device target devuce object.
     * @param {function} cb_complete_set_parameter It is called "callback function" when "set parameters" is completed successfually. 
     * @param {function} cb_error_set_parameter It is called "callback function" when error is occured.
     * @return {boolean} true - request is delivered to server successfully.
     * <br /> false - It is failed that request is delivered.
     * @description requests "set parameters" to server by callback method.
     */
    function _set_parameters(server, device,cb_complete_set_parameter,cb_error_set_parameter){
        var b_result = false;
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
                continue;
            }

            b_result = server.device_transmit_with_callback(
                device.get_device_index(),0,0, s_request,
                cb_complete_set_parameter,
                cb_error_set_parameter
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
     * @function _read_card
     * @param {object} server coffee manager server object.
     * @param {object} device target devuce object.
     * @param {function} cb_complete_ready_card If b_read parameter is true, It is called "callback function" when "card reading" is completed successfully. 
     * <br /> If b_read parameter is false, It is called "callback function" when device accepts your request successfully. 
     * @param {function} cb_error_ready_card It is called "callback function" when error is occured.
     * @param {boolean} b_read true - device waits a card reading.
     * <br /> false - device ignore a card reading.
     * @return {boolean} true - request is delivered to server successfully.
     * <br /> false - It is failed that request is delivered.
     * @description requests "card reading" to server by callback method. or
     * <br /> requests "ignore a card reading" to server by callback method.
     */
    function _read_card(server, device,cb_complete_ready_card,cb_error_ready_card,b_read){
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
                cb_complete_ready_card,
                cb_error_ready_card
                );
            if( !b_result ){
                device.clear_transaction();
                continue;
            }

            b_result = true;
        }while(false);
        return b_result;
    }    

    //static variables
    var _callback_info = null;
    var _callback_cancel = null;

    /**
     * @private
     * @function _cb_error_get_parameter
     * @param {object} Event object
     * @description local callback function.
     * <br /> this is called when error is occured in "get parameter" request.
     */
    function _cb_error_get_parameter( event_error ){
        if(_callback_info ){
            _callback_info.reject(event_error);
            _callback_info = null;
        }
    };

    function _cb_complete_get_parameter( s_rx  ){
        if( _callback_info === null ){
            return;
        }
        var b_result = false;
        do{
            //
            if( !_callback_info.device.set_rx_transaction(s_rx) ){
                continue;
            }
            if( !_callback_info.device.set_from_rx() ){
                continue;
            }
            //
            var s_request = _callback_info.device.get_tx_transaction();
            if( s_request === null ){
                //compete all response
                _callback_info.device.clear_transaction();
                _callback_info.resolve("success");
                _callback_info = null;
                b_result = true;
                continue;
            }

            b_result = _callback_info.server.device_transmit_with_callback(
                _callback_info.device.get_device_index(),0,0, s_request,
                _cb_complete_get_parameter,
                _cb_error_get_parameter
                );
            if( !b_result ){
                continue;
            }

            b_result = true;

        }while(false);

        if( !b_result ){
            _callback_info.device.clear_transaction();
            _callback_info.reject(new Error("error"));
            _callback_info = null;
        }
    };

    function _cb_error_sys_info( event_error ){
        if(_callback_info){
            _callback_info.reject(event_error);
            _callback_info = null;
        }
    };

    function _cb_complete_sys_info( s_rx  ){
        if(_callback_info === null){
            return;
        }

        var b_result = false;
        do{
            //
            if( !_callback_info.device.set_rx_transaction(s_rx) ){
                continue;
            }
            if( !_callback_info.device.set_from_rx() ){
                continue;
            }

            var s_request = _callback_info.device.get_tx_transaction();
            if( s_request === null ){
                b_result = _get_parameters(_callback_info.server,_callback_info.device,_cb_complete_get_parameter, _cb_error_get_parameter);
                continue;
            }

            b_result = _callback_info.server.device_transmit_with_callback(
                _callback_info.device.get_device_index(),0,0, s_request,
                _cb_complete_sys_info,
                _cb_error_sys_info
                );
            if( !b_result ){
                continue;
            }

            b_result = true;
        }while(false);

        if( !b_result ){
            _callback_info.device.clear_transaction();
            _callback_info.reject(new Error("error"));
            _callback_info = null;
        }
    };

    function _cb_error_set_parameter( event_error ){
        if(_callback_info ){
            _callback_info.reject(event_error);
            _callback_info = null;
        }
    };

    function _cb_complete_set_parameter( s_rx  ){
        if( _callback_info === null ){
            return;
        }
        var b_result = false;
        do{
            //
            if( !_callback_info.device.set_rx_transaction(s_rx) ){
                continue;
            }
            if( !_callback_info.device.set_from_rx() ){
                continue;
            }
            //
            var s_request = _callback_info.device.get_tx_transaction();
            if( s_request === null ){
                //compete all response
                _callback_info.device.clear_transaction();
                _callback_info.resolve("success");
                _callback_info = null;
                b_result = true;
                continue;
            }

            b_result = _callback_info.server.device_transmit_with_callback(
                _callback_info.device.get_device_index(),0,0, s_request,
                _cb_complete_set_parameter,
                _cb_error_set_parameter
                );
            if( !b_result ){
                continue;
            }

            b_result = true;

        }while(false);

        if( !b_result ){
            _callback_info.device.clear_transaction();
            _callback_info.reject(new Error("error"));
            _callback_info = null;
        }
    };

    function _cb_error_ready_card( event_error ){
        console.log("++_cb_error_ready_card");
        var cb_temp = _callback_info;
        _callback_info = null;

        if(cb_temp ){
            if( cb_temp.reject !== null ){
                cb_temp.reject(event_error);
            }
            else{
                cb_temp.cb_read_error(event_error);
            }
        }
    };

    function _cb_complete_ready_card( s_rx  ){
        console.log("++_cb_complete_ready_card");
        if( _callback_info === null ){
            return;
        }
        var b_result = false;
        do{
            //
            if( !_callback_info.device.set_rx_transaction(s_rx) ){
                continue;
            }
            if( !_callback_info.device.set_from_rx() ){
                continue;
            }
            //
            var s_request = _callback_info.device.get_tx_transaction();
            if( s_request !== null ){
                continue;
            }

            if( !_callback_info.b_read ){
                //stop read
                _callback_info.device.clear_transaction();
                if(_callback_info.resolve!==null){
                    _callback_info.resolve("success");
                }
                else{
                    _callback_info.cb_read_done("success");
                }
                _callback_info = null;
                b_result = true;
            }

            b_result = _callback_info.server.device_receive_with_callback(
                _callback_info.device.get_device_index(),0,
                _cb_complete_read_card,
                _cb_error_read_card
                );
            if( !b_result ){
                continue;
            }

            b_result = true;

        }while(false);

        if( !b_result ){
            var cb_temp = _callback_info;
            _callback_info = null;

            cb_temp.device.clear_transaction();
            if( cb_temp.reject !== null ){
                cb_temp.reject(new Error("error"));
            }
            else{
                cb_temp.cb_read_error(new Error("error"));
            }
        }
    };


    function _cb_error_read_card( event_error ){
        console.log("++_cb_error_read_card");
        var cb_temp = _callback_info;
        _callback_info = null;

        if(cb_temp ){
            if( cb_temp.reject !== null ){
                cb_temp.reject(event_error);
            }
            else{
                cb_temp.cb_read_error(event_error);
            }
        }
    };

    function _cb_complete_read_card( s_rx  ){
        console.log("++_cb_complete_read_card");
        if( _callback_info === null ){
            return;
        }
        var b_result = false;
        do{
            //s_rx - lpu237 protocol packet.( = websocket's protocol's data field)
            if( !_callback_info.device.set_msr_data_from_rx(s_rx)){
                continue;
            }

            var cb_temp = _callback_info;
            _callback_info = null;

            cb_temp.device.clear_transaction();
            if( cb_temp.resolve !== null ){
                cb_temp.resolve("success");
            }
            else{
                cb_temp.cb_read_done("success");
            }
            b_result = true;

        }while(false);

        if( !b_result ){
            var cb_temp = _callback_info;
            _callback_info = null;

            cb_temp.device.clear_transaction();
            if( cb_temp.reject !== null ){
                cb_temp.reject(new Error("error"));
            }
            else{
                cb_temp.cb_read_error(new Error("error"));
            }
        }
    };

    function _cb_error_cancel_card( event_error ){
        console.log("++_cb_error_cancel_card");
        var cb_temp = _callback_cancel;
        _callback_cancel = null;

        if(cb_temp ){
            if( cb_temp.reject !== null ){
                cb_temp.reject(event_error);
            }
            else{
                cb_temp.cb_cancel_error(event_error);
            }
        }
    };

    function _cb_complete_cancel_card( s_rx  ){
        console.log("++_cb_complete_cancel_card");
        if( _callback_cancel === null ){
            return;
        }

        var b_result = false;
        do{
            //
            if( s_rx[0] !== "success" ){
                continue;
            }
            var server = _callback_cancel.server;
            var device = _callback_cancel.device;
            var resolve = _callback_cancel.resolve;
            var reject = _callback_cancel.reject;
            var b_read = false;

            if( !_check_server_and_device(server,device)){
                continue;
            }

            _callback_info = {
                "command" : "read",
                "server" : server,
                "device" : device,
                "resolve" : resolve,
                "reject" : reject,
                "b_read" : b_read
            };

            b_result = _read_card( server, device,_cb_complete_ready_card, _cb_error_ready_card,b_read);
            if( b_result ){
                _callback_cancel = null;
            }
            else{
                _callback_info = null;
            }

        }while(false);

        if( !b_result ){
            var cb_temp = _callback_cancel;
            _callback_cancel = null;

            if( cb_temp.reject !== null ){
                cb_temp.reject(new Error("error"));
            }
            else{
                cb_temp.cb_cancel_error(new Error("error"));
            }
        }
    };

    /**
     * @private
     * @function _check_server_and_device
     * @param {object} server coffee manager server object
     * @param {object} device lpu237 protocol object.
     * @returns {boolean} true - server & device object is available.
     * <br /> false - server is invalied or device object is not openned.
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

    function _ready_card_from_device_with_promise(server,device){

        var b_error_return = true;
        do{
            if( _callback_info ){
                continue;
            }

            b_error_return = false;
        }while(false);

        if( b_error_return ){
            return new Promise(function (resolve, reject) {
                reject(new Error("error"));//another is running.
                }
            );//the end promise            
        }

        var b_read = true;

        return new Promise(function (resolve, reject) {
            var b_result = false;

            do{
                if( !_check_server_and_device(server,device)){
                    continue;
                }

                _callback_info = {
                    "command" : "read",
                    "server" : server,
                    "device" : device,
                    "resolve" : resolve,
                    "reject" : reject,
                    "b_read" : b_read
                };
                b_result = _read_card( server, device,_cb_complete_ready_card, _cb_error_ready_card,b_read);
            }while(false);
            if( !b_result ){
                reject(new Error("error"));
                _callback_info = null;
            }
        });//the end promise
    };    

    function _cancel_card_from_device_with_promise(server,device){

        if(_callback_cancel){
            //now cancelling.......
            return new Promise(function (resolve, reject) {
                reject(new Error("error"));//another is running.
                }
            );//the end promise            
        }

        if( _callback_info ){
            // need io cancel
            return new Promise(function (resolve, reject) {
                if( !_check_server_and_device(server,device)){
                    reject(new Error("error"));
                }
                else{
                    _callback_cancel = {
                        "server" : server,
                        "device" : device,
                        "resolve" : resolve,
                        "reject" : reject
                    };

                    if( !server.device_cancel_with_callback(device.get_device_index(),0,0,_cb_complete_cancel_card, _cb_error_cancel_card) ){
                        _callback_cancel = null;
                        reject(new Error("error"));
                    }
                }
            });//the end promise
        }        

        var b_read = false;

        return new Promise(function (resolve, reject) {
            var b_result = false;

            do{
                if( !_check_server_and_device(server,device)){
                    continue;
                }

                _callback_info = {
                    "command" : "read",
                    "server" : server,
                    "device" : device,
                    "resolve" : resolve,
                    "reject" : reject,
                    "b_read" : b_read
                };
                b_result = _read_card( server, device,_cb_complete_ready_card, _cb_error_ready_card,b_read);
            }while(false);
            if( !b_result ){
                reject(new Error("error"));
                _callback_info = null;
            }
        });//the end promise
    };    

    /**
     * @constructs elpusk.framework.coffee.ctl_lpu237
     * @param {object} server coffee manager server object.
     * @param {object} device target devuce object.
     * @description constucture of lpu237 control class.
    */
    _elpusk.framework.coffee.ctl_lpu237 = function(server,device,undefined){
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
    }

    /**
     * @public
     * @function get_server
     * @return {object} return server obejct of this controller.
     */
    _elpusk.framework.coffee.ctl_lpu237.prototype.get_server = function(){
        return this._server;
    };

    /**
     * @public
     * @function get_device
     * @return {object} return lpu237 object of  this controller.
     */
    _elpusk.framework.coffee.ctl_lpu237.prototype.get_device = function(){
        return this._device;
    };

    /**
     * @public
     * @function open_with_promise
     * @return {object} return promise object.
     * @description execute "open device" with server and lpu237 object by construcutor.
     * <br /> the result of proccess will be given promise object type.
     * <br /> Always the parameter of promise's resolve is "success" string.
     * <br />  the parameter of promise's reject is Error object.( this object message is "error" string ).
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
    
                _server.device_open(_device.get_path()).then(function (n_device_index) {
                    if( typeof n_device_index === 'undefined'){
                        reject(new Error("error"));
                    }
                    else{
                        if( n_device_index!==0){
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
     * @return {object} return promise object.
     * @description execute "close device" with server and lpu237 object by construcutor.
     * <br /> the result of proccess will be given promise object type.
     * <br /> Always the parameter of promise's resolve is "success" string.
     * <br />  the parameter of promise's reject is Error object.( this object message is "error" string ).
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
                    if( s_rx === "success "){
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
     * @function load_parameter_from_device_with_promise
     * @return {object} return promise object.
     * @description execute "get system information" and "get parameters" with server and lpu237 object by construcutor.
     * <br /> the result of proccess will be given promise object type.
     * <br /> Always the parameter of promise's resolve is "success" string.
     * <br />  the parameter of promise's reject is Error object.( this object message is "error" string ).
     */
    _elpusk.framework.coffee.ctl_lpu237.prototype.load_parameter_from_device_with_promise = function(){
        if( _callback_info ){
            return new Promise(function (resolve, reject) {
                reject(new Error("error"));//another is running.
                }
            );//the end promise            
        }
        var server = this._server;
        var device = this._device;

        return new Promise(function (resolve, reject) {
            var b_result = false;

            do{
                if( !_check_server_and_device(server,device)){
                    continue;
                }

                _callback_info = {
                    "command" : "load",
                    "server" : server,
                    "device" : device,
                    "resolve" : resolve,
                    "reject" : reject
                };
                b_result = _get_system_information( server, device,_cb_complete_sys_info, _cb_error_sys_info);
            }while(false);
            if( !b_result ){
                reject(new Error("error"));
                _callback_info = null;
            }
        });//the end promise
    };
    
    /**
     * @public
     * @function save_parameter_to_device_with_promise
     */
    _elpusk.framework.coffee.ctl_lpu237.prototype.save_parameter_to_device_with_promise = function(){
        if( _callback_info ){
            return new Promise(function (resolve, reject) {
                reject(new Error("error"));//another is running.
                }
            );//the end promise            
        }
        var server = this._server;
        var device = this._device;

        return new Promise(function (resolve, reject) {
            var b_result = false;

            do{
                if( !_check_server_and_device(server,device)){
                    continue;
                }

                _callback_info = {
                    "command" : "save",
                    "server" : server,
                    "device" : device,
                    "resolve" : resolve,
                    "reject" : reject
                };
                b_result = _set_parameters( server, device,_cb_complete_set_parameter, _cb_error_set_parameter);
            }while(false);
            if( !b_result ){
                reject(new Error("error"));
                _callback_info = null;
            }
        });//the end promise
    };

    /**
     * @public
     * @function read_card_from_device_with_promise
     */
    _elpusk.framework.coffee.ctl_lpu237.prototype.read_card_from_device_with_promise = function(b_read){

        if( typeof b_read !== 'boolean' ){
            return new Promise(function (resolve, reject) {
                reject(new Error("error"));//another is running.
                }
            );//the end promise            
        }
        else{
            if( b_read ){
                return _ready_card_from_device_with_promise(this._server,this._device);
            }
            else{
                return _cancel_card_from_device_with_promise(this._server,this._device);
            }
        }
    };

    /**
     * @public
     * @function read_card_from_device_with_callback
     */
    _elpusk.framework.coffee.ctl_lpu237.prototype.read_card_from_device_with_callback = function(b_read,cb_read_done,cb_read_error){
        var b_result = false;
        var server = this._server;
        var device = this._device;

        do{
            if( typeof cb_read_done !=='function'){
                continue;
            }
            if( typeof cb_read_error !=='function'){
                continue;
            }

            if( !_check_server_and_device(server,device)){
                continue;
            }

            _callback_info = {
                "command" : "read",
                "server" : server,
                "device" : device,
                "resolve" : null,
                "reject" : null,
                "b_read" : b_read,
                "cb_read_done" : cb_read_done,
                "cb_read_error" : cb_read_error
            };
            //
            b_result = _read_card( server, device,_cb_complete_ready_card, _cb_error_ready_card,b_read);
        }while(false);
        return b_result;
    };

    ////////////////////////////////////////////////////////////////////////////
    // the end of function
    window.elpusk = _elpusk;
}(window));