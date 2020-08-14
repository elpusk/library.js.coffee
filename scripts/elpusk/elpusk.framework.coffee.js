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
 * @version 1.7.0
 * @description elpusk framework coffee javascript library.
 * <br />  2020.3.5 - release 1.0.
 * <br />  2020.3.25 - release 1.1. 
 * <br />  : change recover callback positon. from the end of function, to the first of function.
 * <br />  : release device filter limit.
 * 
 * <br />  2020.5.13 - release 1.2. 
 * <br />  : fix - device_receive() function code missing.
 * <br />  : add - device_receive_with_callback() method.
 * 
 * <br />  2020.5.14 - release 1.3.
 * <br />  : add - get_session_number() method.( instance function, class function get_session_number() is already existed.)
 * 
 * <br />  2020.5.20 - release 1.4.
 * <br />  : add - device_cancel_with_callback() method.
 * 
 * <br />  2020.5.26 - release 1.5.
 * <br />  : support - supports multi websocket callback function.
 * 
 * <br />  2020.5.29 - release 1.6.
 * <br />  : add - "b_need_device_index" optional parameter to x_with_callback() functions.
 * 
 * <br />  2020.6.11 - release 1.7.
 * <br />  : add - action code "C" system event when system enters hibernation mode.
 *
 * <br />  2020.8.13 - release 1.8.
 * <br />  : add - action code "F" file operation
 * 
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
     * @param {string} first  string type, action code.
     * @param {array} second string array type , device path list.
     * @returns {undefined} none
    */
    var _system_handler;//void(string, array string) type

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

            /**
             * map of queue of promise resolve & reject.
             * @private
             */
            var _map_of_queue_promise_parameter = new Map();

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
                    FILE_OPERATION: "F",
                    DEVICE_PLUG_IN: "P",
                    SERVER_CLOSE:"C",//this value is only in JS library.
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
                            case _type_action_code.FILE_OPERATION:
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
                                _on_def_error(0,evt);
                            }

                            _websocket.onmessage = function (evt) {
                                _on_def_message_json_format(0,evt);
                            }

                            var parameter = {
                                "n_device_index" : 0,
                                "method" : "_promise_echo",
                                "resolve" : resolve,
                                "reject" : reject
                            };
                            _push_promise_parameter(0,parameter);
            
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
                    console.log('_on_def_close');
                    _b_connet = false;

                    var n_device_index = 0;
                    var parameter = null;

                    if( !_is_empty_promise_parameter(n_device_index)){
                        //manager request.
                        parameter = _front_promise_parameter(n_device_index);
                        if( parameter.method === "disconnect" ){
                            parameter.resolve(_s_session );
                        }
                    }//the end of manager request.
                    else{
                        console.log(evt);
                        if( typeof _system_handler === 'function'){
                            var closed = [];
                            closed[0] = "close";
                            _system_handler( _type_action_code.SERVER_CLOSE, closed );
                        }
                    }
                    _s_session = "";
                }

                /** 
                 * @private 
                 * @function _on_def_message_json_format
                 * @param {Event} evt
                 * @description default callback function of websocket reecive event.
                */                
                function _on_def_message_json_format(n_device_index,evt){
                    //console.log('_on_def_message_json_format');
                    do{

                        var json_obj = JSON.parse(evt.data);

                        if( json_obj.request_type === _type_request_type.SYSTEM_EVENT ){
                            if( typeof _system_handler === 'function'){
                                _system_handler( json_obj.action_code, json_obj.data_field );
                            }
                            continue;
                        }

                        var parameter = null;

                        if(_is_empty_promise_parameter(n_device_index) ){
                            continue;
                        }
                        parameter = _front_promise_parameter(n_device_index);

                        if( n_device_index === 0){
                            //manager request.
                            switch(parameter.method){
                                case "connect":
                                    if (!_b_connet) {
                                        _s_session = json_obj.session_number.toString();
                                        _b_connet = true;//reponse of open request
                                    }
                                    parameter.resolve(_s_session );
                                    break;
                                case "_promise_echo":
                                    if (json_obj.action_code == _type_action_code.ECHO) {
                                        parameter.resolve(json_obj.data_field);
                                    }
                                    else {
                                        parameter.reject(_get_error_object('en_e_server_mismatch_action'));
                                    }
                                    break;
                                case "get_device_list":
                                    if (json_obj.action_code == _type_action_code.DEVICE_LIST) {
                                        parameter.resolve(json_obj.data_field);
                                    }
                                    else {
                                        parameter.reject(_get_error_object('en_e_server_mismatch_action'));
                                    }
                                    break;
                                case "file_create":
                                case "file_open":
                                case "file_close":
                                case "file_delete":
                                case "file_truncate":
                                case "file_get_size":
                                case "file_get_list":
                                case "file_append":
                                    if (json_obj.action_code == _type_action_code.FILE_OPERATION) {
                                        parameter.resolve(json_obj.data_field);
                                    }
                                    else {
                                        parameter.reject(_get_error_object('en_e_server_mismatch_action'));
                                    }
                                    break;

                                case "device_open":
                                    if (json_obj.action_code == _type_action_code.DEVICE_OPEN) {
                                        if(json_obj.data_field == "success"){
                                            _delete_promise_parameter(json_obj.device_index);
                                            parameter.resolve(json_obj.device_index);
                                        }
                                        else{
                                            parameter.resolve(const_n_undefined_device_index);
                                        }
                                    }
                                    else {
                                        parameter.reject(_get_error_object('en_e_server_mismatch_action'));
                                    }
                                    break;
                                default:
                                    break;
                            }//end switch
                            continue;
                        }//the end of manager request.

                        switch(parameter.method){
                            case "device_close":
                                if (json_obj.action_code == _type_action_code.DEVICE_CLOSE) {
                                    _delete_promise_parameter(n_device_index);
                                    parameter.resolve(json_obj.data_field);
                                }
                                else {
                                    parameter.reject(_get_error_object('en_e_server_mismatch_action'));
                                }
                                break;
                            case "device_send":
                                if (json_obj.action_code == _type_action_code.DEVICE_SEND) {
                                    parameter.resolve(json_obj.data_field);
                                }
                                else {
                                    parameter.reject(_get_error_object('en_e_server_mismatch_action'));
                                }
                                break;
                            case "device_receive":
                                if (json_obj.action_code == _type_action_code.DEVICE_RECEIVE) {
                                    if( parameter.resolve === null ){
                                        if( parameter.b_device_index ){
                                            parameter.cb_received(n_device_index,json_obj.data_field);
                                        }
                                        else{
                                            parameter.cb_received(json_obj.data_field);
                                        }
                                    }
                                    else{
                                        parameter.resolve(json_obj.data_field);
                                    }
                                }
                                else {
                                    if( parameter.reject === null ){
                                        if( parameter.b_device_index ){
                                            parameter.cb_error(n_device_index,_get_error_object('en_e_server_mismatch_action'));
                                        }
                                        else{
                                            parameter.cb_error(_get_error_object('en_e_server_mismatch_action'));
                                        }
                                    }
                                    else{
                                        parameter.reject(_get_error_object('en_e_server_mismatch_action'));
                                    }
                                }
                                break;
                            case "device_transmit":
                                if (json_obj.action_code == _type_action_code.DEVICE_TRANSMIT) {
                                    if( parameter.resolve === null ){
                                        if( parameter.b_device_index ){
                                            parameter.cb_received(n_device_index,json_obj.data_field);
                                        }
                                        else{
                                            parameter.cb_received(json_obj.data_field);
                                        }
                                    }
                                    else{
                                        parameter.resolve(json_obj.data_field);
                                    }
                                }
                                else {
                                    if( parameter.reject === null ){
                                        if( parameter.b_device_index ){
                                            parameter.cb_error(n_device_index,_get_error_object('en_e_server_mismatch_action'));
                                        }
                                        else{
                                            parameter.cb_error(_get_error_object('en_e_server_mismatch_action'));
                                        }
                                    }
                                    else{
                                        parameter.reject(_get_error_object('en_e_server_mismatch_action'));
                                    }
                                }
                                break;
                            case "device_cancel":
                                if (json_obj.action_code == _type_action_code.DEVICE_CANCEL) {
                                    if( parameter.resolve === null ){
                                        if( parameter.b_device_index ){
                                            parameter.cb_received(n_device_index,json_obj.data_field);
                                        }
                                        else{
                                            parameter.cb_received(json_obj.data_field);
                                        }
                                    }
                                    else{
                                        parameter.resolve(json_obj.data_field);
                                    }
                                }
                                else {
                                    if( parameter.reject === null ){
                                        if( parameter.b_device_index ){
                                            parameter.cb_error(n_device_index,_get_error_object('en_e_server_mismatch_action'));
                                        }
                                        else{
                                            parameter.cb_error(_get_error_object('en_e_server_mismatch_action'));
                                        }
                                    }
                                    else{
                                        parameter.reject(_get_error_object('en_e_server_mismatch_action'));
                                    }
                                }
                                break;
                            default:
                                break;
                        }//end switch
                    }while(false);//the end of 
                }

                /** 
                 * @private 
                 * @function _on_def_error
                 * @param {Event} evt
                 * @description default callback function of websocket error event.
                */                
                function _on_def_error(n_device_index,evt){
                    //console.log('_on_def_error');
                    do{
                        var parameter = null;

                        if( _is_empty_promise_parameter(n_device_index)){
                            continue;
                        }
                        parameter = _front_promise_parameter(n_device_index);

                        if( n_device_index === 0){
                            //manager request.
                            switch(parameter.method){
                                case "connect":
                                case "disconnect":
                                case "_promise_echo":
                                case "get_device_list":
                                case "file_create":
                                case "file_open":
                                case "file_close":
                                case "file_delete":
                                case "file_truncate":
                                case "file_get_size":
                                case "file_get_list":
                                case "file_append":
                                case "device_open":
                                    parameter.reject(evt);
                                    break;
                                default:
                                    break;
                            }//end switch
                            continue;
                        }//the end of manager request.

                        switch(parameter.method){
                            case "device_close":
                            case "device_send":
                                parameter.reject(evt);
                                break;
                            case "device_receive":
                            case "device_transmit":
                            case "device_cancel":
                                if( parameter.reject === null ){
                                    if( parameter.b_device_index ){
                                        parameter.cb_error(n_device_index,evt);
                                    }
                                    else{
                                        parameter.cb_error(evt);
                                    }
                                }
                                else{
                                    parameter.reject(evt);
                                }
                                break;
                            default:
                                break;
                        }//end switch

                    }while(false);
                    var parameter;
                }

                return{

                    /**
                     * @public 
                     * @function get_session_number
                     * @return {string} the current session number.
                     * @description get session number of connection.
                     */
                    get_session_number : function () {
                        return _s_session;
                    },

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
                                _clear_promise_parameter();

                                _websocket = new WebSocket(s_url, "elpusk.protocol.coffee.manager");
                                _websocket.onopen = function (evt) { _on_def_open(evt); }
                                _websocket.onclose = function (evt) { _on_def_close(evt); }

                                _websocket.onerror = function(evt){
                                    _on_def_error(0,evt);
                                }
    
                                _websocket.onmessage = function (evt) {
                                    _on_def_message_json_format(0,evt);
                                }
    
                                var parameter = {
                                    "n_device_index" : 0,
                                    "method" : "connect",
                                    "resolve" : resolve,
                                    "reject" : reject
                                };
                                _push_promise_parameter(0,parameter);
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
                                var parameter = {
                                    "n_device_index" : 0,
                                    "method" : "disconnect",
                                    "resolve" : resolve,
                                    "reject" : reject
                                };
                                _push_promise_parameter(0,parameter);
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
                     * @function file_create
                     * @param {string} s_file_name the created file name.
                     * @returns {Promise} if success, resolve with echo data from server.
                     * <br /> else reject with Error object.
                     * 
                     * @description file crearte action to server by promise.
                    */                
                    file_create : function (s_file_name) {
                        return new Promise(function (resolve, reject){
                
                            do {
                                if (!_b_connet) {
                                    //already websocket created.
                                    reject(_get_error_object('en_e_server_connect'));
                                    continue;
                                }
                
                                var action_code = _type_action_code.FILE_OPERATION;
                
               
                                _websocket.onerror = function(evt){
                                    _on_def_error(0,evt);
                                }
    
                                _websocket.onmessage = function (evt) {
                                    _on_def_message_json_format(0,evt);
                                }
    
                                var parameter = {
                                    "n_device_index" : 0,
                                    "method" : "file_create",
                                    "resolve" : resolve,
                                    "reject" : reject
                                };
                                _push_promise_parameter(0,parameter);
                
                                //send request
                                var json_packet = _generate_request_packet(
                                    _type_packet_owner.MANAGER
                                    , const_n_undefined_device_index
                                    , action_code
                                    , 0
                                    , 0
                                    , _type_data_field_type.STRING_OR_STRING_ARRAY
                                    , ["create",s_file_name]
                                );
                
                                var s_json_packet = JSON.stringify(json_packet);
                                _websocket.send(s_json_packet);
                
                            } while (false);
                        });
                    },

                    /** 
                     * @public 
                     * @async
                     * @function file_open
                     * @param {string} s_file_name the opened file name.
                     * @returns {Promise} if success, resolve with echo data from server.
                     * <br /> else reject with Error object.
                     * 
                     * @description file crearte action to server by promise.
                    */                
                    file_open : function (s_file_name) {
                        return new Promise(function (resolve, reject){
                
                            do {
                                if (!_b_connet) {
                                    //already websocket created.
                                    reject(_get_error_object('en_e_server_connect'));
                                    continue;
                                }
                
                                var action_code = _type_action_code.FILE_OPERATION;
                
               
                                _websocket.onerror = function(evt){
                                    _on_def_error(0,evt);
                                }
    
                                _websocket.onmessage = function (evt) {
                                    _on_def_message_json_format(0,evt);
                                }
    
                                var parameter = {
                                    "n_device_index" : 0,
                                    "method" : "file_open",
                                    "resolve" : resolve,
                                    "reject" : reject
                                };
                                _push_promise_parameter(0,parameter);
                
                                //send request
                                var json_packet = _generate_request_packet(
                                    _type_packet_owner.MANAGER
                                    , const_n_undefined_device_index
                                    , action_code
                                    , 0
                                    , 0
                                    , _type_data_field_type.STRING_OR_STRING_ARRAY
                                    , ["open",s_file_name]
                                );
                
                                var s_json_packet = JSON.stringify(json_packet);
                                _websocket.send(s_json_packet);
                
                            } while (false);
                        });
                    },

                    /** 
                     * @public 
                     * @async
                     * @function file_close
                     * @returns {Promise} if success, resolve with echo data from server.
                     * <br /> else reject with Error object.
                     * 
                     * @description file close action to server by promise.
                    */                
                    file_close : function () {
                        return new Promise(function (resolve, reject){
                
                            do {
                                if (!_b_connet) {
                                    //already websocket created.
                                    reject(_get_error_object('en_e_server_connect'));
                                    continue;
                                }
                
                                var action_code = _type_action_code.FILE_OPERATION;
                
               
                                _websocket.onerror = function(evt){
                                    _on_def_error(0,evt);
                                }
    
                                _websocket.onmessage = function (evt) {
                                    _on_def_message_json_format(0,evt);
                                }
    
                                var parameter = {
                                    "n_device_index" : 0,
                                    "method" : "file_close",
                                    "resolve" : resolve,
                                    "reject" : reject
                                };
                                _push_promise_parameter(0,parameter);
                
                                //send request
                                var json_packet = _generate_request_packet(
                                    _type_packet_owner.MANAGER
                                    , const_n_undefined_device_index
                                    , action_code
                                    , 0
                                    , 0
                                    , _type_data_field_type.STRING_OR_STRING_ARRAY
                                    , ["close"]
                                );
                
                                var s_json_packet = JSON.stringify(json_packet);
                                _websocket.send(s_json_packet);
                
                            } while (false);
                        });
                    },

                    /** 
                     * @public 
                     * @async
                     * @function file_delete
                     * @param {string} s_file_name the deleted file name.
                     * @returns {Promise} if success, resolve with echo data from server.
                     * <br /> else reject with Error object.
                     * 
                     * @description file delete action to server by promise.
                    */                
                   file_delete : function (s_file_name) {
                        return new Promise(function (resolve, reject){
                
                            do {
                                if (!_b_connet) {
                                    //already websocket created.
                                    reject(_get_error_object('en_e_server_connect'));
                                    continue;
                                }
                
                                var action_code = _type_action_code.FILE_OPERATION;
                
               
                                _websocket.onerror = function(evt){
                                    _on_def_error(0,evt);
                                }
    
                                _websocket.onmessage = function (evt) {
                                    _on_def_message_json_format(0,evt);
                                }
    
                                var parameter = {
                                    "n_device_index" : 0,
                                    "method" : "file_delete",
                                    "resolve" : resolve,
                                    "reject" : reject
                                };
                                _push_promise_parameter(0,parameter);
                
                                //send request
                                var json_packet = _generate_request_packet(
                                    _type_packet_owner.MANAGER
                                    , const_n_undefined_device_index
                                    , action_code
                                    , 0
                                    , 0
                                    , _type_data_field_type.STRING_OR_STRING_ARRAY
                                    , ["delete",s_file_name]
                                );
                
                                var s_json_packet = JSON.stringify(json_packet);
                                _websocket.send(s_json_packet);
                
                            } while (false);
                        });
                    },

                    /** 
                     * @public 
                     * @async
                     * @function file_truncate
                     * @returns {Promise} if success, resolve with echo data from server.
                     * <br /> else reject with Error object.
                     * 
                     * @description file truncate action to server by promise.
                    */                
                    file_truncate : function () {
                        return new Promise(function (resolve, reject){
                
                            do {
                                if (!_b_connet) {
                                    //already websocket created.
                                    reject(_get_error_object('en_e_server_connect'));
                                    continue;
                                }
                
                                var action_code = _type_action_code.FILE_OPERATION;
                
               
                                _websocket.onerror = function(evt){
                                    _on_def_error(0,evt);
                                }
    
                                _websocket.onmessage = function (evt) {
                                    _on_def_message_json_format(0,evt);
                                }
    
                                var parameter = {
                                    "n_device_index" : 0,
                                    "method" : "file_truncate",
                                    "resolve" : resolve,
                                    "reject" : reject
                                };
                                _push_promise_parameter(0,parameter);
                
                                //send request
                                var json_packet = _generate_request_packet(
                                    _type_packet_owner.MANAGER
                                    , const_n_undefined_device_index
                                    , action_code
                                    , 0
                                    , 0
                                    , _type_data_field_type.STRING_OR_STRING_ARRAY
                                    , ["truncate"]
                                );
                
                                var s_json_packet = JSON.stringify(json_packet);
                                _websocket.send(s_json_packet);
                
                            } while (false);
                        });
                    },

                    /** 
                     * @public 
                     * @async
                     * @function file_get_size
                     * @returns {Promise} if success, resolve with echo data from server.
                     * <br /> else reject with Error object.
                     * 
                     * @description file get size action to server by promise.
                    */                
                   file_get_size : function () {
                        return new Promise(function (resolve, reject){
                
                            do {
                                if (!_b_connet) {
                                    //already websocket created.
                                    reject(_get_error_object('en_e_server_connect'));
                                    continue;
                                }
                
                                var action_code = _type_action_code.FILE_OPERATION;
                
               
                                _websocket.onerror = function(evt){
                                    _on_def_error(0,evt);
                                }
    
                                _websocket.onmessage = function (evt) {
                                    _on_def_message_json_format(0,evt);
                                }
    
                                var parameter = {
                                    "n_device_index" : 0,
                                    "method" : "file_get_size",
                                    "resolve" : resolve,
                                    "reject" : reject
                                };
                                _push_promise_parameter(0,parameter);
                
                                //send request
                                var json_packet = _generate_request_packet(
                                    _type_packet_owner.MANAGER
                                    , const_n_undefined_device_index
                                    , action_code
                                    , 0
                                    , 0
                                    , _type_data_field_type.STRING_OR_STRING_ARRAY
                                    , ["get","size"]
                                );
                
                                var s_json_packet = JSON.stringify(json_packet);
                                _websocket.send(s_json_packet);
                
                            } while (false);
                        });
                    },

                    /** 
                     * @public 
                     * @async
                     * @function file_get_list
                     * @returns {Promise} if success, resolve with echo data from server.
                     * <br /> else reject with Error object.
                     * 
                     * @description file get list action to server by promise.
                    */                
                    file_get_list : function () {
                        return new Promise(function (resolve, reject){
                
                            do {
                                if (!_b_connet) {
                                    //already websocket created.
                                    reject(_get_error_object('en_e_server_connect'));
                                    continue;
                                }
                
                                var action_code = _type_action_code.FILE_OPERATION;
                
               
                                _websocket.onerror = function(evt){
                                    _on_def_error(0,evt);
                                }
    
                                _websocket.onmessage = function (evt) {
                                    _on_def_message_json_format(0,evt);
                                }
    
                                var parameter = {
                                    "n_device_index" : 0,
                                    "method" : "file_get_list",
                                    "resolve" : resolve,
                                    "reject" : reject
                                };
                                _push_promise_parameter(0,parameter);
                
                                //send request
                                var json_packet = _generate_request_packet(
                                    _type_packet_owner.MANAGER
                                    , const_n_undefined_device_index
                                    , action_code
                                    , 0
                                    , 0
                                    , _type_data_field_type.STRING_OR_STRING_ARRAY
                                    , ["get","list"]
                                );
                
                                var s_json_packet = JSON.stringify(json_packet);
                                _websocket.send(s_json_packet);
                
                            } while (false);
                        });
                    },

                    /** 
                     * @public 
                     * @async
                     * @function file_append
                     * @param {string} s_hex_string server will change this parameter to binary.
                     * <br /> each byte must be 2 characters, and seperator is space or empty.
                     * @returns {Promise} if success, resolve with echo data from server.
                     * <br /> else reject with Error object.
                     * 
                     * @description file crearte action to server by promise.
                    */                
                    file_append : function (s_hex_string) {
                        return new Promise(function (resolve, reject){
                
                            do {
                                if (!_b_connet) {
                                    //already websocket created.
                                    reject(_get_error_object('en_e_server_connect'));
                                    continue;
                                }
                
                                var action_code = _type_action_code.FILE_OPERATION;
                
               
                                _websocket.onerror = function(evt){
                                    _on_def_error(0,evt);
                                }
    
                                _websocket.onmessage = function (evt) {
                                    _on_def_message_json_format(0,evt);
                                }
    
                                var parameter = {
                                    "n_device_index" : 0,
                                    "method" : "file_append",
                                    "resolve" : resolve,
                                    "reject" : reject
                                };
                                _push_promise_parameter(0,parameter);
                
                                //send request
                                var json_packet = _generate_request_packet(
                                    _type_packet_owner.MANAGER
                                    , const_n_undefined_device_index
                                    , action_code
                                    , 0
                                    , 0
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
                
                                _websocket.onerror = function(evt){
                                    _on_def_error(0,evt);
                                }
    
                                _websocket.onmessage = function (evt) {
                                    _on_def_message_json_format(0,evt);
                                }
    
                                var parameter = {
                                    "n_device_index" : 0,
                                    "method" : "get_device_list",
                                    "resolve" : resolve,
                                    "reject" : reject
                                };
                                _push_promise_parameter(0,parameter);
                
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
     
                                _websocket.onerror = function(evt){
                                    _on_def_error(0,evt);
                                }
    
                                _websocket.onmessage = function (evt) {
                                    _on_def_message_json_format(0,evt);
                                }
    
                                var parameter = {
                                    "n_device_index" : 0,
                                    "method" : "device_open",
                                    "resolve" : resolve,
                                    "reject" : reject
                                };
                                _push_promise_parameter(0,parameter);
                
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
                                _websocket.onerror = function(evt){
                                    _on_def_error(n_device_index,evt);
                                }
    
                                _websocket.onmessage = function (evt) {
                                    _on_def_message_json_format(n_device_index,evt);
                                }
                    
                                var parameter = {
                                    "n_device_index" : n_device_index,
                                    "method" : "device_close",
                                    "resolve" : resolve,
                                    "reject" : reject
                                };
                                _push_promise_parameter(n_device_index,parameter);
                
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
                
                                _websocket.onerror = function(evt){
                                    _on_def_error(n_device_index,evt);
                                }
    
                                _websocket.onmessage = function (evt) {
                                    _on_def_message_json_format(n_device_index,evt);
                                }
                    
                                var parameter = {
                                    "n_device_index" : n_device_index,
                                    "method" : "device_send",
                                    "resolve" : resolve,
                                    "reject" : reject
                                };
                                _push_promise_parameter(n_device_index,parameter);
                
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
                
                                _websocket.onerror = function(evt){
                                    _on_def_error(n_device_index,evt);
                                }
    
                                _websocket.onmessage = function (evt) {
                                    _on_def_message_json_format(n_device_index,evt);
                                }
                    
                                var parameter = {
                                    "n_device_index" : n_device_index,
                                    "method" : "device_receive",
                                    "resolve" : resolve,
                                    "reject" : reject
                                };
                                _push_promise_parameter(n_device_index,parameter);

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
                     * @function device_receive_with_callback
                     * @param {number} n_device_index device index number.
                     * @param {number} n_in_id
                     * <br /> if the target device is hid class, n_out_id is in report id.
                     * <br /> if it is winusb class, n_out_id is in end-point number.
                     * @param {function} cb_received this callback function will be called when received a data from server.
                     * <br /> function cb_received( hex_string ) - return none
                     * @param {function} cb_error this callback function will be called when received a error from server.
                     * <br /> function cb_error( Error object ) - return none
                     * @param {boolean} b_need_device_index option parameter.
                     * <br /> undefined or false - n_device_index is not used by the parameter of cb_received, cb_error callback.
                     * <br /> true - the first parameter of cb_received, cb_error callback is n_device_index.
                     * 
                     * @returns {boolean} true - success of starting process.
                     * <br /> false - failure of starting process.
                     * 
                     * @description run receive action to server by callback function.
                     * <br /> receive a data from device.
                     * <br /> If device protocol is send-receive pair type, you must don't use this method.
                    */                
                    device_receive_with_callback : function ( n_device_index, n_in_id, cb_received, cb_error,b_need_device_index ) {
                        var b_result = false;
                        var b_device_index = false;
                         do {
                            if( typeof b_need_device_index === 'boolean'){
                                if( b_need_device_index === true ){
                                    b_device_index = b_need_device_index;
                                }
                            }
                             if(typeof cb_received !== 'function' ){
                                 continue;
                             }
                             if(typeof cb_error !== 'function' ){
                                 continue;
                             }

                             if (!_b_connet) {
                                 continue;
                             }
             
                             var action_code = _type_action_code.DEVICE_RECEIVE;
             
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
             
                             _websocket.onerror = function(evt){
                                _on_def_error(n_device_index,evt);
                            }

                            _websocket.onmessage = function (evt) {
                                _on_def_message_json_format(n_device_index,evt);
                            }
                
                            var parameter = {
                                "n_device_index" : n_device_index,
                                "method" : "device_receive",
                                "resolve" : null,
                                "reject" : null,
                                "cb_received" : cb_received,
                                "cb_error" : cb_error,
                                "b_device_index" : b_device_index
                            };
                            _push_promise_parameter(n_device_index,parameter);
             
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
             
                             b_result = true;
                         } while (false);

                         return b_result;
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
                
                                _websocket.onerror = function(evt){
                                    _on_def_error(n_device_index,evt);
                                }
    
                                _websocket.onmessage = function (evt) {
                                    _on_def_message_json_format(n_device_index,evt);
                                }
                    
                                var parameter = {
                                    "n_device_index" : n_device_index,
                                    "method" : "device_transmit",
                                    "resolve" : resolve,
                                    "reject" : reject
                                };
                                _push_promise_parameter(n_device_index,parameter);

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
                     * @param {boolean} b_need_device_index option parameter.
                     * <br /> undefined or false - n_device_index is not used by the parameter of cb_received, cb_error callback.
                     * <br /> true - the first parameter of cb_received, cb_error callback is n_device_index.
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
                       cb_received, cb_error, b_need_device_index
                       ) {
                           var b_result = false;
                           var b_device_index = false;
                            do {
                                if( typeof b_need_device_index === 'boolean'){
                                    if( b_need_device_index === true ){
                                        b_device_index = b_need_device_index;
                                    }
                                }
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
                
                                _websocket.onerror = function(evt){
                                    _on_def_error(n_device_index,evt);
                                }
    
                                _websocket.onmessage = function (evt) {
                                    _on_def_message_json_format(n_device_index,evt);
                                }
                    
                                var parameter = {
                                    "n_device_index" : n_device_index,
                                    "method" : "device_transmit",
                                    "resolve" : null,
                                    "reject" : null,
                                    "cb_received" : cb_received,
                                    "cb_error" : cb_error,
                                    "b_device_index" : b_device_index
                                };
                                _push_promise_parameter(n_device_index,parameter);
                
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
                
                                _websocket.onerror = function(evt){
                                    _on_def_error(n_device_index,evt);
                                }
    
                                _websocket.onmessage = function (evt) {
                                    _on_def_message_json_format(n_device_index,evt);
                                }
                    
                                var parameter = {
                                    "n_device_index" : n_device_index,
                                    "method" : "device_cancel",
                                    "resolve" : resolve,
                                    "reject" : reject
                                };
                                _push_promise_parameter(n_device_index,parameter);
                
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
                    },
                    /** 
                     * @public 
                     * @async
                     * @function device_cancel_with_callback
                     * @param {number} n_device_index device index number.
                     * @param {number} n_in_id
                     * <br /> if the target device is hid class, n_out_id is in report id.
                     * <br /> if it is winusb class, n_out_id is in end-point number.
                     * @param {number} n_out_id
                     * <br /> if the target device is hid class, n_out_id is out report id.
                     * <br /> if it is winusb class, n_out_id is out end-point number.
                     * @param {function} cb_received this callback function will be called when received a data from server.
                     * <br /> function cb_received( string(maybe "success") ) - return none
                     * @param {function} cb_error this callback function will be called when received a error from server.
                     * <br /> function cb_error( Error object ) - return none
                     * @param {boolean} b_need_device_index option parameter.
                     * <br /> undefined or false - n_device_index is not used by the parameter of cb_received, cb_error callback.
                     * <br /> true - the first parameter of cb_received, cb_error callback is n_device_index.
                     * 
                     * @returns {boolean} true - success of cancel process.
                     * <br /> false - failure of cancel process.
                     * 
                     * @description cancel the current pending operation of device to server.
                     * <br /> the current process will be cancel.
                    */                
                    device_cancel_with_callback : function (n_device_index, n_in_id, n_out_id,cb_received, cb_error, b_need_device_index) {
                        var b_result = false;
                        var b_device_index = false;
                        do {
                            if( typeof b_need_device_index === 'boolean'){
                                if( b_need_device_index === true ){
                                    b_device_index = b_need_device_index;
                                }
                            }
                            if(typeof cb_received !== 'function' ){
                                continue;
                            }
                            if(typeof cb_error !== 'function' ){
                                continue;
                            }
                            if (!_b_connet) {
                                continue;
                            }
            
                            var action_code = _type_action_code.DEVICE_CANCEL;
            
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
            
                            _websocket.onerror = function(evt){
                                _on_def_error(n_device_index,evt);
                            }

                            _websocket.onmessage = function (evt) {
                                _on_def_message_json_format(n_device_index,evt);
                            }
                
                            var parameter = {
                                "n_device_index" : n_device_index,
                                "method" : "device_cancel",
                                "resolve" : null,
                                "reject" : null,
                                "cb_received" : cb_received,
                                "cb_error" : cb_error,
                                "b_device_index" : b_device_index
                            };
                            _push_promise_parameter(n_device_index,parameter);

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
            
                            b_result = true;
                        } while (false);

                        return b_result;
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
        return "1.5.0";
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
}(window));