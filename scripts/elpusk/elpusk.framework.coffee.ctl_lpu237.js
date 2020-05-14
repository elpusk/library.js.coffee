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
                continue;
            }

            b_result = true;
        }while(false);
        return b_result;
    }    

    /**
     * @constructs elpusk.framework.coffee.ctl_lpu237
    */
    _elpusk.framework.coffee.ctl_lpu237 = function(server,device,undefined){
        //private variables
        this._server = server;
        this._device = device;

        this._cb_error_get_parameter= function ( event_error ){
            reject(event_error);
        };

        this._cb_complete_get_parameter = function ( s_rx  ){
            var b_result = false;
            do{
                //
                if( !device.set_rx_transaction(s_rx) ){
                    continue;
                }
                if( !device.set_from_rx() ){
                    continue;
                }
                //
                var s_request = device.get_tx_transaction();
                if( s_request === null ){
                    //compete all response
                    device.clear_transaction();
                    resolve("success");
                    b_result = true;
                    continue;
                }

                b_result = server.device_transmit_with_callback(
                    device.get_device_index(),0,0, s_request,
                    this._cb_complete_get_parameter,
                    this._cb_error_get_parameter
                    );
                if( !b_result ){
                    continue;
                }

                b_result = true;

            }while(false);

            if( !b_result ){
                device.clear_transaction();
                reject(new Error("error"));
            }
        };

        this._cb_error_sys_info = function ( event_error ){
            reject(event_error);
        };

        this._cb_complete_sys_info = function( s_rx  ){
            var b_result = false;
            do{
                //
                if( !device.set_rx_transaction(s_rx) ){
                    continue;
                }
                if( !device.set_from_rx() ){
                    continue;
                }

                var s_request = device.get_tx_transaction();
                if( s_request === null ){
                    b_result = _get_parameters(server,device,this._cb_complete_get_parameter, this._cb_error_get_parameter);
                    continue;
                }

                b_result = server.device_transmit_with_callback(
                    device.get_device_index(),0,0, s_request,
                    this._cb_complete_sys_info,
                    this._cb_error_sys_info
                    );
                if( !b_result ){
                    continue;
                }

                b_result = true;
            }while(false);

            if( !b_result ){
                device.clear_transaction();
                reject(new Error("error"));
            }
        };

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
        var _server = this._server;
        var _device = this._device;
        var _cb_complete_sys_info = this._cb_complete_sys_info;
        var _cb_error_sys_info = this._cb_error_sys_info;

        return new Promise(function (resolve, reject) {
            var b_result = false;
            var n_req = 0;
            var s_request = null;

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

                b_result = _get_system_information( _server, _device,_cb_complete_sys_info, _cb_error_sys_info);
            }while(false);
            if( !b_result ){
                reject(new Error("error"));
            }
        });//the end promise
    };
    
    ////////////////////////////////////////////////////////////////////////////
    // the end of function
    window.elpusk = _elpusk;
}(window));