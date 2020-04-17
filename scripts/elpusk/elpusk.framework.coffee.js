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
 * @version 1.1.0
 * @description elpusk framework coffee javascript library.
 * <br />  2020.3.5 - release 1.0.
 * <br />  2020.3.25 - release 1.1. 
 * <br />  : change recover callback positon. from the end of function, to the first of function.
 * <br />  : release device filter limit.
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
    /** documented as elpusk.framework */
    if (!_elpusk.framework) {
        _elpusk.framework = {};
    }

    /**
     * 
     * boolean, connected to server or not.
     * @private 
    */
   var _b_connet = false;

    /**
     * 
     * @private 
     * @function _system_handler system event handler callback
    */
   var _system_handler;//void(string, string) type

    if (!_elpusk.framework.coffee) {
         _b_connet = false;
        _elpusk.framework.coffee = {};

        /**
         * @class coffee
         * @classdesc this class support the interface to "coffee manager".
         * <br /> this class must be used by singleton pattern.
         * <br /> Use get_instance() method.
        */
        _elpusk.framework.coffee = (function(){
            /** 
             * instance of class
             * @private 
            */ 
            var _instance;
            
            /** 
             * websocket instance.
             * @private 
            */ 
            var _websocket;

            /** 
             * session number
             * @private
            */ 
            var _s_session;

            function _constructor(){

                /** 
                 * @private 
                 * @constant {map} 
                 *  @description error code to error message map.
                */                
                var _error_name_message = [
                    {name:'en_e_server_connect',message:"not connected to server"}
                    ,{name:'en_e_device_open',message:"device is not openned"}
                    ,{name:'en_e_server_mismatch_action',message:"server action code is not identical"}
                    ,{name:'en_e_server_data_field_format',message:"server data field format is not matched"}
                    ,{name:'en_e_server_unsupport_data',message:"server data cannot accept"}
                    ,{name:'en_e_device_index',message:"unknown device index"}
                    ,{name:'en_e_device_out_id',message:"unknown device out ID"}
                    ,{name:'en_e_device_in_id',message:"unknown device in ID"}
                ];

                /** 
                 * @private 
                 * @constant {string} 
                 *  @description the direction of packet.
                */                
                var _type_request_type = {
                    CLINET_TO_SERVER: "T",
                    SERVER_TO_CLINET: "R",
                    SYSTEM_EVENT: "S"
                };

                /** 
                 * @private 
                 * @constant {string} 
                 *  @description receiver of packet. manager or device.
                */                
                var _type_packet_owner = {
                    MANAGER: "M",
                    DEVICE: "D"
                };

                /** 
                 * @private 
                 * @constant {string} 
                 *  @description action code of packet
                */                
                var _type_action_code = {
                    UNKNOWN: "U",
                    ECHO: "E",
                    DEVICE_LIST: "L",
                    CONTROL_SHOW: "S",
                    DEVICE_PLUG_IN: "P",
                    DEVICE_OPEN: "o",
                    DEVICE_CLOSE: "c",
                    DEVICE_SEND: "s",
                    DEVICE_RECEIVE: "r",
                    DEVICE_TRANSMIT: "t",
                    DEVICE_CANCEL: "x"
                };

                /** 
                 * @private 
                 * @constant {string} 
                 *  @description the type of data field of packet.
                */                
                var _type_data_field_type = {
                    HEX_STRING: "H",
                    STRING_OR_STRING_ARRAY: "S"
                };

                /** 
                 * @private 
                 * @constant {number} 
                 *  @description impossible session number.
                */                
                var const_n_undefined_session_number = 0xFFFFFFFF;

                /** 
                 * @private 
                 * @constant {number} 
                 *  @description impossible device index number
                */                
                var const_n_undefined_device_index = 0;

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
                 * @function _is_chrome_or_firfox_or_opera
                 * @returns {boolean}
                 * @description check whether or not current brower is firfox or opera.
                */                
                function _is_chrome_or_firfox_or_opera() {
                    var isChrome = !!window.chrome && !!window.chrome.webstore,
                        isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
                        isFirefox = typeof InstallTrigger !== 'undefined',
                        isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification)),
                        isIE = /*@cc_on!@*/false || !!document.documentMode,
                        isEdge = !isIE && !!window.StyleMedia,
                        isBlink = (isChrome || isOpera) && !!window.CSS;
            
                    if (isChrome || isOpera || isFirefox) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }

                /** 
                 * @private 
                 * @function _get_server_url
                 * @param {string} s_protocol
                 * @param {string} s_port
                 * @returns {string}
                 * @description get URL of coffee manager.
                */                
                function _get_server_url(s_protocol, s_port){
                    var b_result = true;
                    var s_used_port = "443";
                    var s_used_protocol = "wss";
                    var s_used_domain = "127.0.0.1";
                    if (typeof s_protocol !== 'undefined') {
                        if (s_protocol == "ws") {
                            s_used_protocol = "ws";
                            s_used_port = "80";
                        }
                    }
                    if (typeof s_port !== 'undefined') {
                        s_used_port = s_port;
                    }
                    if (_is_chrome_or_firfox_or_opera()) {
                        s_used_domain = "localhost";
                    }
            
            
                    var s_uri = s_used_protocol + "://" + s_used_domain + ":" + s_used_port;//"wss://127.0.0.1:443";
                    return s_uri;
                }
            
                /** 
                 * @private 
                 * @function _is_valid_request_type
                 * @param {string} s_request_type
                 * @returns {boolean}
                 * @description checks whether or not packet direction is valied.
                */                
                function _is_valid_request_type(s_request_type) {
                    var b_result = false;
            
                    do {
                        if (typeof s_request_type === 'undefined'){
                            continue;
                        }
                        if (typeof s_request_type !== 'string'){
                            continue;
                        }
                        switch (s_request_type) {
                            case _type_request_type.CLINET_TO_SERVER:
                            case _type_request_type.SERVER_TO_CLINET:
                            case _type_request_type.SYSTEM_EVENT:
                                break;
                            default:
                                continue;
                        }//end switch
            
                        b_result = true;
                    } while (false);
                    return b_result;
                }

                /** 
                 * @private 
                 * @function _is_valid_packet_owner
                 * @param {string} s_packet_owner
                 * @returns {boolean}
                 * @description checks whether or not packet receiver is valied.
                */                
                function _is_valid_packet_owner(s_packet_owner) {
                    var b_result = false;
            
                    do {
                        if (typeof s_packet_owner === 'undefined'){
                            continue;
                        }
                        if (typeof s_packet_owner !== 'string'){
                            continue;
                        }
                        switch (s_packet_owner) {
                            case _type_packet_owner.DEVICE:
                            case _type_packet_owner.MANAGER:
                                break;
                            default:
                                continue;
                        }//end switch
            
                        b_result = true;
                    } while (false);
                    return b_result;
                }

                /** 
                 * @private 
                 * @function _is_valid_action_code
                 * @param {string} s_action_code this code is only for client request.
                 * @returns {boolean}
                 * @description checks whether or not packet action code is valied.
                */                
                function _is_valid_action_code(s_action_code) {
                    var b_result = false;
            
                    do {
                        if (typeof s_action_code === 'undefined'){
                            continue;
                        }
                        if (typeof s_action_code !== 'string'){
                            continue;
                        }
                        switch (s_action_code) {
                            case _type_action_code.CONTROL_SHOW:
                            case _type_action_code.DEVICE_CANCEL:
                            case _type_action_code.DEVICE_CLOSE:
                            case _type_action_code.DEVICE_LIST:
                            case _type_action_code.DEVICE_OPEN:
                            case _type_action_code.DEVICE_RECEIVE:
                            case _type_action_code.DEVICE_SEND:
                            case _type_action_code.DEVICE_TRANSMIT:
                            case _type_action_code.ECHO:
                            case _type_action_code.UNKNOWN:
                                break;
                            default:
                                continue;
                        }//end switch
            
                        b_result = true;
                    } while (false);
                    return b_result;
                }

                /** 
                 * @private 
                 * @function _is_valid_data_field_type
                 * @param {string} s_data_field_type
                 * @returns {boolean}
                 * @description checks whether or not packet data field type is valied.
                */                
                function _is_valid_data_field_type(s_data_field_type) {
                    var b_result = false;
            
                    do {
                        if (typeof s_data_field_type === 'undefined'){
                            continue;
                        }
                        if (typeof s_data_field_type !== 'string'){
                            continue;
                        }
                        switch (s_data_field_type) {
                            case _type_data_field_type.HEX_STRING:
                            case _type_data_field_type.STRING_OR_STRING_ARRAY:
                                break;
                            default:
                                continue;
                        }//end switch
            
                        b_result = true;
                    } while (false);
                    return b_result;
                }

                /** 
                 * @private 
                 * @function _is_valid_session_number
                 * @param {(string|number)} session_number
                 * @returns {boolean}
                 * @description checks whether or not session number is valied.
                */                
                function _is_valid_session_number(session_number) {
                    var b_result = false;
            
                    do {
                        if (typeof session_number === 'undefined'){
                            continue;
                        }
                        if (typeof session_number !== 'string' && typeof session_number !== 'number'){
                            continue;
                        }
                        //
                        var n_session = 0;
                        if (typeof session_number === 'string') {
                            n_session = parseInt(session_number);
                            if (isNaN(n_session)){
                                continue;
                            }
                        }
                        else {
                            n_session = session_number;
                        }
                        if (n_session == const_n_undefined_session_number){
                            continue;
                        }
            
                        b_result = true;
                    } while (false);
                    return b_result;
                }

                /** 
                 * @private 
                 * @function _is_valid_device_index
                 * @param {(string|number)} device_index
                 * @returns {boolean}
                 * @description checks whether or not device index number is valied.
                */                
                function _is_valid_device_index(device_index) {
                    var b_result = false;
            
                    do {
                        if (typeof device_index === 'undefined'){
                            continue;
                        }
                        if (typeof device_index !== 'string' && typeof device_index !== 'number'){
                            continue;
                        }
                        //
                        var n_device_index = 0;
                        if (typeof device_index === 'string') {
                            n_device_index = parseInt(device_index);
                            if (isNaN(n_device_index)){
                                continue;
                            }
                        }
                        else {
                            n_device_index = device_index;
                        }
                        if (n_device_index == const_n_undefined_device_index){
                            continue;
                        }
            
                        b_result = true;
                    } while (false);
                    return b_result;
                }

                /** 
                 * @private 
                 * @function _is_valid_device_id
                 * @param {(string|number)} device_id
                 * @returns {boolean}
                 * @description checks whether or not device id is valied.
                */                
                function _is_valid_device_id(device_id) {
                    var b_result = false;
            
                    do {
                        if (typeof device_id === 'undefined'){
                            continue;
                        }
                        if (typeof device_id !== 'string' && typeof device_id !== 'number'){
                            continue;
                        }
                        //
                        var n_device_id = 0;
                        if (typeof device_id === 'string') {
                            n_device_id = parseInt(device_id);
                            if (isNaN(n_device_id)){
                                continue;
                            }
                        }
                        else {
                            n_device_id = device_id;
                        }
                        if (n_device_id < 0 || n_device_id > 255){
                            continue;
                        }
            
                        b_result = true;
                    } while (false);
                    return b_result;
                }
            
                /** 
                 * @private 
                 * @function _generate_request_packet
                 * @param {string} s_packet_owner
                 * @param {number} n_device_index
                 * @param {string} s_action_code
                 * @param {number} n_in_id
                 * @param {number} n_out_id
                 * @param {string} s_data_field_type
                 * @param {string} data_field
                 * @returns {JSON}
                 * @description generate JSON packet from packet parameters.
                */                
                function _generate_request_packet(
                    s_packet_owner, n_device_index, s_action_code, n_in_id, n_out_id
                    , s_data_field_type 
                    , data_field
                ) {
                    var b_result = false;
                    do {
                        if (!_is_valid_packet_owner(s_packet_owner)){
                            continue;
                        }
                        if (!_is_valid_session_number(_s_session)){
                            continue;
                        }
                        if (!_is_valid_device_index(n_device_index)) {
                            if (n_device_index != const_n_undefined_device_index){
                                continue;
                            }
                        }
                        if (!_is_valid_action_code(s_action_code)){
                            continue;
                        }
                        if (!_is_valid_device_id(n_in_id)){
                            continue;
                        }
                        if (!_is_valid_device_id(n_out_id)){
                            continue;
                        }
                        if (!_is_valid_data_field_type(s_data_field_type)){
                            continue;
                        }
            
                        b_result = true;
                    } while (false);
            
                    if (!b_result){
                        return undefined;
                    }
            
                    var json_packet = {
                        request_type: _type_request_type.CLINET_TO_SERVER,
                        session_number: Number(_s_session),
                        packet_owner: s_packet_owner,
                        device_index: Number(n_device_index),
                        action_code: s_action_code,
                        in_id: Number(n_in_id),
                        out_id: Number(n_out_id),
                        data_field_type: s_data_field_type,
                        data_field: data_field
                    };
            
                    return json_packet;
                }
            
                /** 
                 * @private 
                 * @function _promise_echo
                 * @param {string} s_data_type
                 * @param {string} s_data
                 * @returns {Promise}
                 * @description send echo action to server and waits a response.
                */                
                function _promise_echo(s_data_type, s_data) {
                    return new Promise(function (resolve, reject) {
            
                        do {
                            if (!_b_connet) {
                                //already websocket created.
                                reject(_get_error_object('en_e_server_connect'));
                                continue;
                            }
            
                            var s_used_data_type;
            
                            if (!_is_valid_data_field_type(s_data_type)) {
                                if (typeof s_data_type !== 'undefined') {
                                    reject(_get_error_object('en_e_server_data_field_format'));
                                    continue;
                                }
                                s_used_data_type = _type_data_field_type.STRING_OR_STRING_ARRAY;
                            }
                            else {
                                s_used_data_type = s_data_type;
                            }
            
                            _websocket.onerror = function(evt){
                                _websocket.onerror = function(evt){ _on_def_error(evt);}
                                reject(evt);
                            }

                            _websocket.onmessage = function (evt) {
                                //recover default handler.
                                _websocket.onmessage = function (evt) { _on_def_message_json_format(evt); }

                                var json_obj = JSON.parse(evt.data);
                                if (json_obj.action_code == _type_action_code.ECHO) {
                                    resolve(json_obj.data_field);
                                }
                                else {
                                    reject(_get_error_object('en_e_server_mismatch_action'));
                                }
                            }
            
                            //send request
                            var s_echo_data;
                            if (typeof s_data === 'undefined') {
                                //generate randum data for each test
                                s_echo_data = Math.floor(Math.random() * 10000).toString();
                            }
                            else {
                                s_echo_data = s_data;
                            }
            
                            var json_packet = _generate_request_packet(
                                _type_packet_owner.MANAGER
                                , const_n_undefined_device_index
                                , _type_action_code.ECHO
                                , 0
                                , 0
                                , s_used_data_type
                                , String(s_echo_data)
                            );
            
                            var s_json_packet = JSON.stringify(json_packet);
                            _websocket.send(s_json_packet);
            
                        } while (false);
                    });
                }
            
                /** 
                 * @private 
                 * @function _on_def_open
                 * @param {Event} evt
                 * @description default callback function of websocket open event.
                */                
               function _on_def_open(evt){
                    //console.log('_on_def_open');
                }

                /** 
                 * @private 
                 * @function _on_def_close
                 * @param {Event} evt
                 * @description default callback function of websocket close event.
                */                
                function _on_def_close(evt){
                    //console.log('_on_def_close');
                    _b_connet = false;
                    _s_session = "";
                }

                /** 
                 * @private 
                 * @function _on_def_message_json_format
                 * @param {Event} evt
                 * @description default callback function of websocket reecive event.
                */                
                function _on_def_message_json_format(evt){
                    //console.log('_on_def_message_json_format');
                    do{
                        if( typeof _system_handler === 'undefined'){
                            continue;
                        }

                        var json_obj = JSON.parse(evt.data);

                        if( json_obj.request_type !== _type_request_type.SYSTEM_EVENT ){
                            continue;
                        }
    
                        _system_handler( json_obj.action_code, json_obj.data_field );

                    }while(false);
                }

                /** 
                 * @private 
                 * @function _on_def_error
                 * @param {Event} evt
                 * @description default callback function of websocket error event.
                */                
                function _on_def_error(evt){
                }

                return{

                    /** 
                     * @public 
                     * @function get_error_message
                     * @param {Error} error_object Error object
                     * 
                     * @returns {string} error description message
                     * 
                     * @description get error message of error object.
                    */                
                    get_error_message : function(error_object){
                        return _get_error_message(error_object.name);
                    },
                
                    /** 
                     * @public 
                     * @async
                     * @function connect
                     * @param {string} s_protocol For security Websocket. Use "wss". 
                     * <br /> For WebSocket. Use "ws".
                     * @param {string} s_port port number
                     * 
                     * @returns {Promise} if success, resolve with session number by string format.
                     * <br /> else reject with Error object.
                     * 
                     * @description connect to server by promise.
                    */                
                   connect : function (s_protocol, s_port){
                        return new Promise(function (resolve, reject) {
                
                            var s_url = _get_server_url(s_protocol, s_port);
                            if (_b_connet) {
                                //already websocket created.
                                resolve(_s_session);
                            }
                            else {
                                _websocket = new WebSocket(s_url, "elpusk.protocol.coffee.manager");
                                _websocket.onopen = function (evt) { _on_def_open(evt); }
                                _websocket.onclose = function (evt) { _on_def_close(evt); }
                
                                _websocket.onmessage = function (evt) {
                                    //recover default handler.
                                    _websocket.onmessage = function (evt) { _on_def_message_json_format(evt); }

                                    var json_obj = JSON.parse(evt.data);
                                    if (!_b_connet) {
                                        _s_session = json_obj.session_number.toString();
                                        _b_connet = true;//reponse of open request
                                    }
                
                                    resolve(_s_session);
                                }
                                _websocket.onerror = function(evt){
                                    _websocket.onerror = function(evt){ _on_def_error(evt);}
                                    reject(evt);
                                }
                            }
                        });
                
                    },
                
                    /** 
                     * @public 
                     * @async
                     * @function disconnect
                     * 
                     * @returns {Promise} if success, resolve with session number by string format.
                     * <br /> else reject with Error object.
                     * 
                     * @description disconnet with server by promise.
                    */                
                    disconnect : function () {
                        return new Promise(function (resolve, reject) {
                
                            if (!_b_connet) {
                                //already websocket disconnected.
                                resolve(_s_session);
                            }
                            else {
                                _websocket.onerror = function(evt){
                                    //recover default handler
                                    _websocket.onerror = function(evt){ _on_def_error(evt);}

                                    reject(evt);
                                }

                                _websocket.onclose = function (evt) {
                                    //recover default handler
                                    _websocket.onclose = function (evt) { _on_def_close(evt); }

                                    _b_connet = false;
                                    resolve(_s_session);
                                    _s_session = "";
                                }

                                _websocket.close();
                            }
                        });
                    },
                
                    /** 
                     * @public 
                     * @async
                     * @function echo_string
                     * @param {string} s_data s_data is string type.
                     * 
                     * @returns {Promise} if success, resolve with echo data from server.
                     * <br /> else reject with Error object.
                     * 
                     * @description run echo action to server by promise.
                    */                
                    echo_string : function (s_data) {
                        return _promise_echo(_type_data_field_type.STRING_OR_STRING_ARRAY, s_data);
                    },

                    /** 
                     * @public 
                     * @async
                     * @function echo_hex
                     * @param {string} s_data s_data is hex string type.
                     * <br />  server will change this parameter to binary. 
                     * 
                     * @returns {Promise} if success, resolve with echo data from server.
                     * <br /> else reject with Error object.
                     * 
                     * @description run echo action to server by promise.
                    */                
                    echo_hex : function (s_data) {
                        return _promise_echo(_type_data_field_type.HEX_STRING, s_data);
                    },
                
                    /** 
                     * @public 
                     * @async
                     * @function get_device_list
                     * @param {string} s_filter This filter is used to represent the desired USB device.
                     * <br />the filter format is “class#vid_xxxx&pid_yyyy&mi_zz".  
                     * <br />"class" is "hid" or "winusb".
                     * <br />"vid" is usb device vendor ID hex code.
                     * <br />"pid" is usb device product ID hex code.
                     * <br />"mi" is the interfce number of usb device.
                     * <br />ex) if you want to get all device that vendor ID is 0x134b and class device is hid,
                     * <br /> filter string is "hid#vid_134b".
                     * 
                     * @returns {Promise} if success, resolve with device path list.
                     * <br /> else reject with Error object.
                     * 
                     * @description run get device list action to server by promise with filter.
                     * <br /> server return the connected device paths list.
                     * <br /> this list contains only the managed device on server. 
                    */                
                    get_device_list : function (s_filter) {
                        return new Promise(function (resolve, reject){
                
                            do {
                                if (!_b_connet) {
                                    //already websocket created.
                                    reject(_get_error_object('en_e_server_connect'));
                                    continue;
                                }
                
                                var s_used_filter = "hid";
                                var action_code = _type_action_code.DEVICE_LIST;
                
                                if (typeof s_filter !== 'undefined') {
                                    s_used_filter = s_filter;
                                }
                
                                _websocket.onmessage = function (evt) {
                                    //recover default handler.
                                    _websocket.onmessage = function (evt) { _on_def_message_json_format(evt); }

                                    var json_obj = JSON.parse(evt.data);
                                    if (json_obj.action_code == action_code) {
                                        resolve(json_obj.data_field);
                                    }
                                    else {
                                        reject(_get_error_object('en_e_server_mismatch_action'));
                                    }
                                }
                                _websocket.onerror = function(evt){
                                    //recover default handler.
                                    _websocket.onerror = function(evt){ _on_def_error(evt);}

                                    reject(evt);
                                }
                
                                //send request
                                var json_packet = _generate_request_packet(
                                    _type_packet_owner.MANAGER
                                    , const_n_undefined_device_index
                                    , action_code
                                    , 0
                                    , 0
                                    , _type_data_field_type.STRING_OR_STRING_ARRAY
                                    , [String(s_used_filter)]
                                );
                
                                var s_json_packet = JSON.stringify(json_packet);
                                _websocket.send(s_json_packet);
                
                            } while (false);
                        });
                    },
                
                    /** 
                     * @public 
                     * @async
                     * @function device_open
                     * @param {string} s_path device path string
                     * 
                     * @returns {Promise} if success, resolve with device index number.
                     * <br /> else reject with Error object or resolve with zero number.
                     * 
                     * @description run device open action to server by promise.
                     * <br /> the device index number cannot be zero.
                     * <br /> if this function resolve with zero device index, this case also have to be process as error.
                    */                
                    device_open : function (s_path) {
                        return new Promise(function (resolve, reject) {
                
                            do {
                                if (!_b_connet) {
                                    reject(_get_error_object('en_e_server_connect'));
                                    continue;
                                }
                
                                var action_code = _type_action_code.DEVICE_OPEN;
                
                                if (typeof s_path === 'undefined') {
                                    reject(_get_error_object('en_e_server_unsupport_data'));
                                    continue;
                                }
                
                                _websocket.onmessage = function (evt) {
                                    //recover default handler.
                                    _websocket.onmessage = function (evt) { _on_def_message_json_format(evt); }

                                    var json_obj = JSON.parse(evt.data);
                                    if (json_obj.action_code == action_code) {
                                        if(json_obj.data_field == "success"){
                                            resolve(json_obj.device_index);
                                        }
                                        else{
                                            resolve(const_n_undefined_device_index);
                                        }
                                        
                                    }
                                    else {
                                        reject(_get_error_object('en_e_server_mismatch_action'));
                                    }
                                }
                                _websocket.onerror = function(evt){
                                    _websocket.onerror = function(evt){ _on_def_error(evt);}
                                    reject(evt);
                                }
                
                                //send request
                                var json_packet = _generate_request_packet(
                                    _type_packet_owner.DEVICE
                                    , const_n_undefined_device_index
                                    , action_code
                                    , 0
                                    , 0
                                    , _type_data_field_type.STRING_OR_STRING_ARRAY
                                    , String(s_path)
                                );
                
                                var s_json_packet = JSON.stringify(json_packet);
                                _websocket.send(s_json_packet);
                
                            } while (false);
                        });
                    },
                
                    /** 
                     * @public 
                     * @async
                     * @function device_close
                     * @param {number} n_device_index device index number must be greater then zero.
                     * 
                     * @returns {Promise} if success, resolve with "success" string.
                     * <br /> else reject with Error object or resolve with "error" string.
                     * 
                     * @description run device close action to server by promise.
                    */                
                    device_close : function (n_device_index) {
                        return new Promise(function (resolve, reject) {
                
                            do {
                                if (!_b_connet) {
                                    reject(_get_error_object('en_e_server_connect'));
                                    continue;
                                }
                
                                var action_code = _type_action_code.DEVICE_CLOSE;
                
                                if (typeof n_device_index !== 'number') {
                                    reject(_get_error_object('en_e_device_index'));
                                    continue;
                                }
                                if (n_device_index === const_n_undefined_device_index) {
                                    reject(_get_error_object('en_e_device_index'));
                                    continue;
                                }
                
                                _websocket.onmessage = function (evt) {
                                    //recover default handler.
                                    _websocket.onmessage = function (evt) { _on_def_message_json_format(evt); }

                                    var json_obj = JSON.parse(evt.data);
                                    if (json_obj.action_code == action_code) {
                                        resolve(json_obj.data_field);
                                    }
                                    else {
                                        reject(_get_error_object('en_e_server_mismatch_action'));
                                    }
                                }
                                _websocket.onerror = function(evt){
                                    _websocket.onerror = function(evt){ _on_def_error(evt);}

                                    reject(evt);
                                }
                
                                //send request
                                var json_packet = _generate_request_packet(
                                    _type_packet_owner.DEVICE
                                    , n_device_index
                                    , action_code
                                    , 0
                                    , 0
                                    , _type_data_field_type.STRING_OR_STRING_ARRAY
                                );
                
                                var s_json_packet = JSON.stringify(json_packet);
                                _websocket.send(s_json_packet);
                
                            } while (false);
                        });
                    },
                
                    /** 
                     * @public 
                     * @async
                     * @function device_send
                     * @param {number} n_device_index device index number.
                     * @param {number} n_out_id
                     * <br /> if the target device is hid class, n_out_id is out report id.
                     * <br /> if it is winusb class, n_out_id is out end-point number.
                     * @param {string} s_hex_string server will change this parameter to binary.
                     * <br /> each byte must be 2 characters, and seperator is space or empty.
                     * 
                     * @returns {Promise} if success, resolve with "success" string.
                     * <br /> else reject with Error object or resolve with "error" or "cancel" string.
                     * 
                     * @description run device send action to server by promise.
                     * <br /> send a data to device.
                    */                
                    device_send : function (n_device_index,n_out_id, s_hex_string) {
                        return new Promise(function (resolve, reject) {
                
                            do {
                                if (!_b_connet) {
                                    reject(_get_error_object('en_e_server_connect'));
                                    continue;
                                }
                
                                var action_code = _type_action_code.DEVICE_SEND;
                
                                if (typeof n_device_index !== 'number') {
                                    reject(_get_error_object('en_e_device_index'));
                                    continue;
                                }
                                if (n_device_index === const_n_undefined_device_index) {
                                    reject(_get_error_object('en_e_device_index'));
                                    continue;
                                }
                                if (typeof n_out_id !== 'number') {
                                    reject(_get_error_object('en_e_device_out_id'));
                                    continue;
                                }
                                if (n_out_id < 0 || n_out_id > 0xff ) {
                                    reject(_get_error_object('en_e_device_out_id'));
                                    continue;
                                }
                
                                if (typeof s_hex_string !== 'string') {
                                    reject(_get_error_object('en_e_server_data_field_format'));
                                    continue;
                                }
                
                                _websocket.onmessage = function (evt) {
                                    //recover default handler.
                                    _websocket.onmessage = function (evt) { _on_def_message_json_format(evt); }

                                    var json_obj = JSON.parse(evt.data);
                                    if (json_obj.action_code == action_code) {
                                        resolve(json_obj.data_field);
                                    }
                                    else {
                                        reject(_get_error_object('en_e_server_mismatch_action'));
                                    }
                                }
                                _websocket.onerror = function(evt){
                                    _websocket.onerror = function(evt){ _on_def_error(evt);}

                                    reject(evt);
                                }
                
                                //send request
                                var json_packet = _generate_request_packet(
                                    _type_packet_owner.DEVICE
                                    , n_device_index
                                    , action_code
                                    , 0
                                    , n_out_id
                                    , _type_data_field_type.HEX_STRING
                                    , String(s_hex_string)
                                );
                
                                var s_json_packet = JSON.stringify(json_packet);
                                _websocket.send(s_json_packet);
                
                            } while (false);
                        });
                    },
                
                    /** 
                     * @public 
                     * @async
                     * @function device_receive
                     * @param {number} n_device_index device index number.
                     * @param {number} n_in_id
                     * <br /> if the target device is hid class, n_out_id is in report id.
                     * <br /> if it is winusb class, n_out_id is in end-point number.
                     * 
                     * @returns {Promise} if success, resolve with hex string without seperator.
                     * <br /> else reject with Error object or resolve with "error" or "cancel" string.
                     * 
                     * @description run device receive action to server by promise.
                     * <br /> receive a data from device.
                    */                
                    device_receive : function (n_device_index, n_in_id) {
                        return new Promise(function (resolve, reject) {
                
                            do {
                                if (!_b_connet) {
                                    reject(_get_error_object('en_e_server_connect'));
                                    continue;
                                }
                
                                var action_code = _type_action_code.DEVICE_RECEIVE;
                
                                if (typeof n_device_index !== 'number') {
                                    reject(_get_error_object('en_e_device_index'));
                                    continue;
                                }
                                if (n_device_index === const_n_undefined_device_index) {
                                    reject(_get_error_object('en_e_device_index'));
                                    continue;
                                }
                                if (typeof n_in_id !== 'number') {
                                    reject(_get_error_object('en_e_device_in_id'));
                                    continue;
                                }
                                if (n_in_id < 0 || n_in_id > 0xff) {
                                    reject(_get_error_object('en_e_device_in_id'));
                                    continue;
                                }
                
                                if (typeof s_hex_string !== 'string') {
                                    reject(_get_error_object('en_e_server_data_field_format'));
                                    continue;
                                }
                
                                _websocket.onmessage = function (evt) {
                                    //recover default handler.
                                    _websocket.onmessage = function (evt) { _on_def_message_json_format(evt); }

                                    var json_obj = JSON.parse(evt.data);
                                    if (json_obj.action_code == action_code) {
                                        resolve(json_obj.data_field);
                                    }
                                    else {
                                        reject(_get_error_object('en_e_server_mismatch_action'));
                                    }
                                }
                                _websocket.onerror = function(evt){
                                    _websocket.onerror = function(evt){ _on_def_error(evt);}
                                    reject(evt);
                                }
                
                                //send request
                                var json_packet = _generate_request_packet(
                                    _type_packet_owner.DEVICE
                                    , n_device_index
                                    , action_code
                                    , n_in_id
                                    , 0
                                    , _type_data_field_type.HEX_STRING
                                );
                
                                var s_json_packet = JSON.stringify(json_packet);
                                _websocket.send(s_json_packet);
                
                            } while (false);
                        });
                    },
                
                    /** 
                     * @public 
                     * @async
                     * @function device_transmit
                     * @param {number} n_device_index device index number.
                     * @param {number} n_in_id
                     * <br /> if the target device is hid class, n_out_id is in report id.
                     * <br /> if it is winusb class, n_out_id is in end-point number.
                     * @param {number} n_out_id
                     * <br /> if the target device is hid class, n_out_id is out report id.
                     * <br /> if it is winusb class, n_out_id is out end-point number.
                     * 
                     * @returns {Promise} if success, resolve with hex string without seperator.
                     * <br /> else reject with Error object or resolve with "error" or "cancel" string.
                     * 
                     * @description run device send and receive action to server by promise.
                     * <br /> send a data to device and receive a data from device.
                     * <br /> If device protocol is send-receive pair type, you must use this method.
                    */                
                    device_transmit : function (n_device_index, n_in_id, n_out_id, s_hex_string) {
                        return new Promise(function (resolve, reject) {
                
                            do {
                                if (!_b_connet) {
                                    reject(_get_error_object('en_e_server_connect'));
                                    continue;
                                }
                
                                var action_code = _type_action_code.DEVICE_TRANSMIT;
                
                                if (typeof n_device_index !== 'number') {
                                    reject(_get_error_object('en_e_device_index'));
                                    continue;
                                }
                                if (n_device_index === const_n_undefined_device_index) {
                                    reject(_get_error_object('en_e_device_index'));
                                    continue;
                                }
                                if (typeof n_in_id !== 'number') {
                                    reject(_get_error_object('en_e_device_in_id'));
                                    continue;
                                }
                                if (n_in_id < 0 || n_in_id > 0xff) {
                                    reject(_get_error_object('en_e_device_in_id'));
                                    continue;
                                }
                                if (typeof n_out_id !== 'number') {
                                    reject(_get_error_object('en_e_device_out_id'));
                                    continue;
                                }
                                if (n_out_id < 0 || n_out_id > 0xff) {
                                    reject(_get_error_object('en_e_device_out_id'));
                                    continue;
                                }
                
                                if (typeof s_hex_string !== 'string') {
                                    reject(_get_error_object('en_e_server_data_field_format'));
                                    continue;
                                }
                
                                _websocket.onmessage = function (evt) {
                                    //recover default handler.
                                    _websocket.onmessage = function (evt) { _on_def_message_json_format(evt); }

                                    var json_obj = JSON.parse(evt.data);
                                    if (json_obj.action_code == action_code) {
                                        resolve(json_obj.data_field);
                                    }
                                    else {
                                        reject(_get_error_object('en_e_server_mismatch_action'));
                                    }
                                }
                                _websocket.onerror = function(evt){
                                    _websocket.onerror = function(evt){ _on_def_error(evt);}
                                    reject(evt);
                                }
                
                                //send request
                                var json_packet = _generate_request_packet(
                                    _type_packet_owner.DEVICE
                                    , n_device_index
                                    , action_code
                                    , n_in_id
                                    , n_out_id
                                    , _type_data_field_type.HEX_STRING
                                    , String(s_hex_string)
                                );
                
                                var s_json_packet = JSON.stringify(json_packet);
                                _websocket.send(s_json_packet);
                
                            } while (false);
                        });
                    },
                
                    /** 
                     * @public 
                     * @async
                     * @function device_transmit_with_callback
                     * @param {number} n_device_index device index number.
                     * @param {number} n_in_id
                     * <br /> if the target device is hid class, n_out_id is in report id.
                     * <br /> if it is winusb class, n_out_id is in end-point number.
                     * @param {number} n_out_id
                     * <br /> if the target device is hid class, n_out_id is out report id.
                     * <br /> if it is winusb class, n_out_id is out end-point number.
                     * @param {function} cb_received this callback function will be called when received a data from server.
                     * <br /> function cb_received( hex_string ) - return none
                     * @param {function} cb_error this callback function will be called when received a error from server.
                     * <br /> function cb_error( Error object ) - return none
                     * 
                     * @returns {boolean} true - success of starting process.
                     * <br /> false - failure of starting process.
                     * 
                     * @description run device send and receive action to server by callback function.
                     * <br /> send a data to device and receive a data from device.
                     * <br /> If device protocol is send-receive pair type, you must use this method.
                    */                
                   device_transmit_with_callback : function (
                       n_device_index, n_in_id, n_out_id, s_hex_string,
                       cb_received, cb_error
                       ) {
                           var b_result = false;
                            do {
                                if(typeof cb_received !== 'function' ){
                                    continue;
                                }
                                if(typeof cb_error !== 'function' ){
                                    continue;
                                }

                                if (!_b_connet) {
                                    continue;
                                }
                
                                var action_code = _type_action_code.DEVICE_TRANSMIT;
                
                                if (typeof n_device_index !== 'number') {
                                    continue;
                                }
                                if (n_device_index === const_n_undefined_device_index) {
                                    continue;
                                }
                                if (typeof n_in_id !== 'number') {
                                    continue;
                                }
                                if (n_in_id < 0 || n_in_id > 0xff) {
                                    continue;
                                }
                                if (typeof n_out_id !== 'number') {
                                    continue;
                                }
                                if (n_out_id < 0 || n_out_id > 0xff) {
                                    continue;
                                }
                
                                if (typeof s_hex_string !== 'string') {
                                    continue;
                                }
                
                                _websocket.onmessage = function (evt) {
                                    //recover default handler.
                                    _websocket.onmessage = function (evt) { _on_def_message_json_format(evt); }

                                    var json_obj = JSON.parse(evt.data);
                                    if (json_obj.action_code == action_code) {
                                        cb_received(json_obj.data_field);
                                    }
                                    else {
                                        cb_error(_get_error_object('en_e_server_mismatch_action'));
                                    }
                                }
                                _websocket.onerror = function(evt){
                                    _websocket.onerror = function(evt){ _on_def_error(evt);}
                                    cb_error(evt);
                                }
                
                                //send request
                                var json_packet = _generate_request_packet(
                                    _type_packet_owner.DEVICE
                                    , n_device_index
                                    , action_code
                                    , n_in_id
                                    , n_out_id
                                    , _type_data_field_type.HEX_STRING
                                    , String(s_hex_string)
                                );
                
                                var s_json_packet = JSON.stringify(json_packet);
                                _websocket.send(s_json_packet);
                
                                b_result = true;
                            } while (false);

                            return b_result;
                    },                    
                    /** 
                     * @public 
                     * @async
                     * @function device_cancel
                     * @param {number} n_device_index device index number.
                     * @param {number} n_in_id
                     * <br /> if the target device is hid class, n_out_id is in report id.
                     * <br /> if it is winusb class, n_out_id is in end-point number.
                     * @param {number} n_out_id
                     * <br /> if the target device is hid class, n_out_id is out report id.
                     * <br /> if it is winusb class, n_out_id is out end-point number.
                     * 
                     * @returns {Promise} if success, resolve with "success" string.
                     * <br /> else reject with Error object or resolve with "error" string.
                     * 
                     * @description cancel the current pending operation of device to server by promise.
                     * <br /> the current process will be cancel.
                    */                
                    device_cancel : function (n_device_index, n_in_id, n_out_id) {
                        return new Promise(function (resolve, reject) {
                
                            do {
                                if (!_b_connet) {
                                    reject(_get_error_object('en_e_server_connect'));
                                    continue;
                                }
                
                                var action_code = _type_action_code.DEVICE_CANCEL;
                
                                if (typeof n_device_index !== 'number') {
                                    reject(_get_error_object('en_e_device_index'));
                                    continue;
                                }
                                if (n_device_index === const_n_undefined_device_index) {
                                    reject(_get_error_object('en_e_device_index'));
                                    continue;
                                }
                                if (typeof n_in_id !== 'number') {
                                    reject(_get_error_object('en_e_device_in_id'));
                                    continue;
                                }
                                if (n_in_id < 0 || n_in_id > 0xff) {
                                    reject(_get_error_object('en_e_device_in_id'));
                                    continue;
                                }
                                if (typeof n_out_id !== 'number') {
                                    reject(_get_error_object('en_e_device_out_id'));
                                    continue;
                                }
                                if (n_out_id < 0 || n_out_id > 0xff) {
                                    reject(_get_error_object('en_e_device_out_id'));
                                    continue;
                                }
                
                                _websocket.onmessage = function (evt) {
                                    //recover default handler.
                                    _websocket.onmessage = function (evt) { _on_def_message_json_format(evt); }

                                    var json_obj = JSON.parse(evt.data);
                                    if (json_obj.action_code == action_code) {
                                        resolve(json_obj.data_field);
                                    }
                                    else {
                                        reject(_get_error_object('en_e_server_mismatch_action'));
                                    }
                                }
                                _websocket.onerror = function(evt){
                                    _websocket.onerror = function(evt){ _on_def_error(evt);}
                                    reject(evt);
                                }
                
                                //send request
                                var json_packet = _generate_request_packet(
                                    _type_packet_owner.DEVICE
                                    , n_device_index
                                    , action_code
                                    , n_in_id
                                    , n_out_id
                                    , _type_data_field_type.HEX_STRING
                                );
                
                                var s_json_packet = JSON.stringify(json_packet);
                                _websocket.send(s_json_packet);
                
                            } while (false);
                        });
                    }
                    ////////////////////////////////////////////////////////////////////////
                    //public variables

                };
            }
        
            /*** @return {_instance} the instance of coffee class. */
            return{
                /** 
                 * @public 
                 * @constructs get_instance
                 * 
                 * @returns {object} return coffee class instance.
                 * 
                 * @description coffee class use singleton pattern. you can get the instance of coffee class.
                */                   
                get_instance : function(){
                    if(!_instance){
                        _instance = _constructor();
                    }
                    return _instance;
                }
            };
        })();
    }//!_elpusk.framework.coffee

    /**
     * @public 
     * @function elpusk.framework.coffee.get_this_library_version
     * @return {string} library version string.
     * @description get coffee library verion
     */
    _elpusk.framework.coffee.get_this_library_version = function () {
        return "1.1.0";
    }

    /**
     * @public 
     * @function elpusk.framework.coffee.get_session_number
     * @return {string} the current session number.
     * @description get session number of connection.
     */
    _elpusk.framework.coffee.get_session_number = function () {
        return _s_session;
    }

    /**
     * @public 
     * @function elpusk.framework.coffee.set_system_event_handler
     * @param {function} handler system event handler callback function.
     * 
     * @description set system event handler.
     * <br /> handler must be void(string, string) type.
     * <br /> the first parameter is string type action code.
     * <br /> the second parameter is string or string array.
     * <br /> the current system event is
     * <br /> 1. removed device : the first parameter is "c". the second parameter is the removed device path.
     * <br /> 2. plugged in device : the first parameter is "P". the second parameter is the inserted device path.
     */
    _elpusk.framework.coffee.set_system_event_handler = function (handler) {
        _system_handler = handler;
    }

    // the end of function
    window.elpusk = _elpusk;
}(window))