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

    /**
     * @constructs elpusk.framework.coffee.ctl_lpu237
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
     */
    _elpusk.framework.coffee.ctl_lpu237.prototype.get_server = function(){
        return this._server;
    };

    /**
     * @public
     * @function get_device
     */
    _elpusk.framework.coffee.ctl_lpu237.prototype.get_device = function(){
        return this._device;
    };

    /**
     * @public
     * @function open_with_promise
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
                if( !server ){
                    continue;
                }
                if(!device){
                    continue;
                }
                if( device.get_device_index() <= 0 ){
                    continue;
                }

                _callback_info = {
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
                if( !server ){
                    continue;
                }
                if(!device){
                    continue;
                }
                if( device.get_device_index() <= 0 ){
                    continue;
                }

                _callback_info = {
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
        if( _callback_info || typeof b_read !== 'boolean' ){
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
                if( !server ){
                    continue;
                }
                if(!device){
                    continue;
                }
                if( device.get_device_index() <= 0 ){
                    continue;
                }

                _callback_info = {
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

            if( !server ){
                continue;
            }
            if(!device){
                continue;
            }
            if( device.get_device_index() <= 0 ){
                continue;
            }

            _callback_info = {
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