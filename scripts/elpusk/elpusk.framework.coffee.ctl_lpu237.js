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
                cb_error_sys_info,
                true
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
                cb_error_get_parameter,
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
                cb_error_set_parameter,
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
                cb_error_ready_card,
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
     * @function _cb_error_common
     * @param {object} Event object
     * @description local callback function.
     * <br /> this is called when error is occured in a  request.
     */
    function _cb_error_common( n_device_index,event_error ){

        do{
            var parameter = elpusk.util.map_of_queue_front(_map_of_queue_promise_parameter,n_device_index);
            if( parameter === null ){
                continue;
            }
            if( parameter.reject ){
                parameter.reject(event_error);
                continue;
            }
            if(parameter.cb_error){
                parameter.cb_error(n_device_index,event_error);
            }
        }while(false);
    };

    function _cb_complete_get_parameter( n_device_index,s_rx  ){
        var b_result = false;
        var parameter = elpusk.util.map_of_queue_front(_map_of_queue_promise_parameter,n_device_index);
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
            var s_request = parameter.device.get_tx_transaction();
            if( s_request === null ){
                //compete all response
                parameter.device.clear_transaction();
                parameter.resolve("success");
                parameter = null;
                b_result = true;
                continue;
            }

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
                elpusk.util.map_of_queue_push(_map_of_queue_promise_parameter,n_device_index,parameter);
            }
            else{
                parameter.device.clear_transaction();
                parameter.reject(new Error("error"));
            }
        }
    };

    function _cb_complete_sys_info( n_device_index,s_rx  ){
        var b_result = false;
        var parameter = elpusk.util.map_of_queue_front(_map_of_queue_promise_parameter,n_device_index);
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

            var s_request = parameter.device.get_tx_transaction();
            if( s_request === null ){
                b_result = _get_parameters(parameter.server,parameter.device,_cb_complete_get_parameter, _cb_error_common);
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
                elpusk.util.map_of_queue_push(_map_of_queue_promise_parameter,n_device_index,parameter);
            }
            else{
                parameter.device.clear_transaction();
                parameter.reject(new Error("error"));
            }
        }
    };

    function _cb_complete_set_parameter( n_device_index,s_rx  ){
        var b_result = false;
        var parameter = elpusk.util.map_of_queue_front(_map_of_queue_promise_parameter,n_device_index);
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
            var s_request = parameter.device.get_tx_transaction();
            if( s_request === null ){
                //compete all response
                parameter.device.clear_transaction();
                parameter.resolve("success");
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
                continue;
            }

            b_result = true;
        }while(false);
        
        if( parameter ){ 
            if( b_result ){
                elpusk.util.map_of_queue_push(_map_of_queue_promise_parameter,n_device_index,parameter);                
            }
            else{
                parameter.device.clear_transaction();
                parameter.reject(new Error("error"));
            }
        }
    };

    function _cb_complete_ready_card( n_device_index,s_rx  ){
        var b_result = false;
        var parameter = elpusk.util.map_of_queue_front(_map_of_queue_promise_parameter,n_device_index);
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
            var s_request = parameter.device.get_tx_transaction();
            if( s_request !== null ){
                continue;
            }

            if( !parameter.b_read ){
                //stop read
                parameter.device.clear_transaction();
                if(parameter.resolve!==null){
                    parameter.resolve("success");
                }
                else{
                    parameter.cb_received(n_device_index,"success");
                }
                parameter = null;
                b_result = true;
                continue;
            }

            b_result = parameter.server.device_receive_with_callback(
                parameter.device.get_device_index(),0,
                _cb_complete_read_card,
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
                elpusk.util.map_of_queue_push(_map_of_queue_promise_parameter,n_device_index,parameter);
            }
            else{
                parameter.device.clear_transaction();
                if( parameter.reject !== null ){
                    parameter.reject(new Error("error"));
                }
                else{
                    parameter.cb_error(n_device_index,new Error("error"));
                }
            }
        }
    };

    function _cb_complete_read_card( n_device_index,s_rx  ){
        var b_result = false;
        var parameter = elpusk.util.map_of_queue_front(_map_of_queue_promise_parameter,n_device_index);
        do{
            if( parameter === null ){
                continue;
            }
            //s_rx - lpu237 protocol packet.( = websocket's protocol's data field)
            if( !parameter.device.set_msr_data_from_rx(s_rx)){
                continue;
            }

            parameter.device.clear_transaction();
            if( parameter.resolve !== null ){
                parameter.resolve("success");
            }
            else{
                parameter.cb_received(n_device_index,"success");
            }
            b_result = true;

        }while(false);


        if( parameter && !b_result ){
            parameter.device.clear_transaction();
            if( parameter.reject !== null ){
                parameter.reject(new Error("error"));
            }
            else{
                parameter.cb_error(n_device_index,new Error("error"));
            }
        }
    };

    function _cb_complete_cancel_card( n_device_index,s_rx  ){
        var b_result = false;
        var parameter = elpusk.util.map_of_queue_front(_map_of_queue_promise_parameter,n_device_index);
        do{
            if( parameter === null ){
                continue;
            }
            if( s_rx[0] !== "success" ){
                continue;
            }

            var b_read = false;
            if( !_check_server_and_device(parameter.server,parameter.device)){
                continue;
            }

            b_result = _read_card( parameter.server, parameter.device,_cb_complete_ready_card, _cb_error_common,b_read);
            if( b_result ){
                elpusk.util.map_of_queue_push(_map_of_queue_promise_parameter,n_device_index,parameter);                
            }
        }while(false);

        if( parameter && !b_result ){
            if( parameter.reject !== null ){
                parameter.reject(new Error("error"));
            }
            else{
                parameter.cb_error(new Error("error"));
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

    /**
     * @private
     * @function _ready_card_from_device_with_promise
     * @param {object} server the instance of coffee class
     * @param {object} device the instance of lpu237 class
     * @returns {object} the instance of Promise class
     * @description change the status of lpu237 device to ready status that waits a card reading.
     */
    function _ready_card_from_device_with_promise(server,device){

        var b_error = true;
        do{
            if( !_check_server_and_device(server,device)){
                continue;
            }

            if( !elpusk.util.map_of_queue_is_empty(_map_of_queue_promise_parameter,device.get_device_index()) ){
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
            var b_read = true;

            return new Promise(function (resolve, reject) {
                var b_result = false;

                do{
                    var parameter = {
                        "server" : server,
                        "device" : device,
                        "resolve" : resolve,
                        "reject" : reject
                    };
                    elpusk.util.map_of_queue_push(_map_of_queue_promise_parameter,device.get_device_index(),parameter);

                    b_result = _read_card( server, device,_cb_complete_ready_card, _cb_error_common,b_read);
                }while(false);
                if( !b_result ){
                    reject(new Error("error"));
                }
            });//the end promise
        }
    };    

    /**
     * @private
     * @function _cancel_card_from_device_with_promise
     * @param {object} server the instance of coffee class
     * @param {object} device the instance of lpu237 class
     * @returns {object} the instance of Promise class
     * @description change the status of lpu237 device to ready status that waits a card reading.
     */
    function _cancel_card_from_device_with_promise(server,device){
        var b_error = true;
        do{
            if( !_check_server_and_device(server,device)){
                continue;
            }

            b_error = false;

            if( !elpusk.util.map_of_queue_is_empty(_map_of_queue_promise_parameter,device.get_device_index()) ){
                var param = elpusk.util.map_of_queue_front(_map_of_queue_promise_parameter,device.get_device_index());
                param.reject(new Error("error"));//canceled
                continue;
            }
        }while(false);

        if( b_error ){
            return new Promise(function (resolve, reject) {
                reject(new Error("error"));//another is running.
                }
            );//the end promise            
        }
        else{
            var b_read = false;

            return new Promise(function (resolve, reject) {
                var b_result = false;

                do{
                    var parameter = {
                        "server" : server,
                        "device" : device,
                        "resolve" : resolve,
                        "reject" : reject
                    };
                    elpusk.util.map_of_queue_push(_map_of_queue_promise_parameter,device.get_device_index(),parameter);

                    b_result = _read_card( server, device,_cb_complete_cancel_card, _cb_error_common,b_read);
                }while(false);
                if( !b_result ){
                    reject(new Error("error"));
                }
            });//the end promise
        }
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
                            elpusk.util.map_of_queue_delete(_map_of_queue_promise_parameter,n_device_index);
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
                        elpusk.util.map_of_queue_delete(_map_of_queue_promise_parameter,_device.get_device_index());
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
        var b_error = true;
        var server = this._server;
        var device = this._device;

        do{
            if( !_check_server_and_device(server,device)){
                continue;
            }

            if( !elpusk.util.map_of_queue_is_empty(_map_of_queue_promise_parameter,device.get_device_index()) ){
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
            var b_read = true;

            return new Promise(function (resolve, reject) {
                var b_result = false;

                do{
                    var parameter = {
                        "server" : server,
                        "device" : device,
                        "resolve" : resolve,
                        "reject" : reject
                    };
                    elpusk.util.map_of_queue_push(_map_of_queue_promise_parameter,device.get_device_index(),parameter);

                    b_result = _get_system_information( server, device,_cb_complete_sys_info, _cb_error_common);
                }while(false);
                if( !b_result ){
                    reject(new Error("error"));
                }
            });//the end promise
        }
    };
    
    /**
     * @public
     * @function save_parameter_to_device_with_promise
     * @return {object} return promise object.
     * @description execute "set parameters" with server and lpu237 object by construcutor.
     * <br /> the result of proccess will be given promise object type.
     * <br /> Always the parameter of promise's resolve is "success" string.
     * <br />  the parameter of promise's reject is Error object.( this object message is "error" string ).
     */
    _elpusk.framework.coffee.ctl_lpu237.prototype.save_parameter_to_device_with_promise = function(){
        var b_error = true;
        var server = this._server;
        var device = this._device;

        do{
            if( !_check_server_and_device(server,device)){
                continue;
            }

            if( !elpusk.util.map_of_queue_is_empty(_map_of_queue_promise_parameter,device.get_device_index()) ){
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
            var b_read = true;

            return new Promise(function (resolve, reject) {
                var b_result = false;

                do{
                    var parameter = {
                        "server" : server,
                        "device" : device,
                        "resolve" : resolve,
                        "reject" : reject
                    };
                    elpusk.util.map_of_queue_push(_map_of_queue_promise_parameter,device.get_device_index(),parameter);

                    b_result = _set_parameters( server, device,_cb_complete_set_parameter, _cb_error_common);
                }while(false);
                if( !b_result ){
                    reject(new Error("error"));
                }
            });//the end promise
        }        
    };

    /**
     * @public
     * @function read_card_from_device_with_promise
     * @return {object} return promise object.
     * @description execute "one time reading card" or "ignore reading card." with server and lpu237 object by construcutor.
     * <br /> the result of proccess will be given promise object type.
     * <br /> Always the parameter of promise's resolve is "success" string.
     * <br />  the parameter of promise's reject is Error object.( this object message is "error" string ).
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
     * @param {boolean} b_read enable read.
     * @param {function} cb_read_done called when a card reading is done. or canceled ready for reading.
     * @param {function} cb_read_error called when a error is ocurred.
     * @returns {boolean}   true - success processing.
     * <br /> false - error.
     * @description execute "one time reading card" or "ignore reading card." with server and lpu237 object by construcutor.
     * <br /> the result of proccess will be given by callback function.
     */
    _elpusk.framework.coffee.ctl_lpu237.prototype.read_card_from_device_with_callback = function(b_read,cb_read_done,cb_read_error){
        var b_result = false;
        var server = this._server;
        var device = this._device;

        do{
            if( typeof b_read !== 'boolean'){
                continue;
            }
            if( typeof cb_read_done !=='function'){
                continue;
            }
            if( typeof cb_read_error !=='function'){
                continue;
            }
            if(!elpusk.util.map_of_queue_is_empty(_map_of_queue_promise_parameter) ){
                if( b_read ){
                    continue;
                }
                //
                var cur_para = elpusk.util.map_of_queue_front(_map_of_queue_promise_parameter,device.get_device_index() );
                if( cur_para.reject ){
                    cur_para.reject(new Error("error"));//cancel
                }
                //todo.

            }
            if( !_check_server_and_device(server,device)){
                continue;
            }

            var parameter = {
                "server" : server,
                "device" : device,
                "resolve" : null,
                "reject" : null,
                "cb_received" : cb_read_done,
                "cb_error" : cb_read_error
            };
            elpusk.util.map_of_queue_push(_map_of_queue_promise_parameter,device.get_device_index(),parameter);
            //
            b_result = _read_card( server, device,_cb_complete_ready_card, _cb_error_common,b_read);
        }while(false);
        return b_result;
    };

    ////////////////////////////////////////////////////////////////////////////
    // the end of function
    window.elpusk = _elpusk;
}(window));