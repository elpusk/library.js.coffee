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
 * <br />  2021.11.xx - release 1.0.
 * 
 * @namespace dll_service.default.sd_emv
 */

 'use strict';

(function (window, undefined) {

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

    //create namespace
    var _dll_service = window.dll_service;
    if (!_dll_service) {
        console.log("error : use _dll_service before this");
        return;
    }

    if (!_dll_service.default) {
        _dll_service.default = {};
    }

    if (!_dll_service.default.sd_emv) {
        _dll_service.default.sd_emv = {};

        /**
         * @class sd_emv
         * @classdesc this class support the interface to "emv service dll of coffee framework".
         * <br /> this class must be used by singleton pattern.
         * <br /> Use get_instance() method.
        */
        _dll_service.default.sd_emv = (function () {

            ///////////////////////////////
            //private variables of class

            /** 
             * instance of class
             * @private 
            */ 
            var _instance;

            ///////////////////////////////
            //private function of class
            /*
            function _x() {
            }
            */

            /**
             * @private
             * @description construtor of sd_emv class
             */
            function _constructor(){
                ///////////////////////////////
                //private variables of class instance

                /** 
                 * @private 
                 * @constant {number} 
                 *  @description session number.
                */                
                var _n_session = 0xFFFFFFFF;

                /** 
                 * @private 
                 * @constant {number} 
                 *  @description device index number.
                */                
                var _n_device = 0;

                var _s_device_path = "";
                var _s_sd_dll_name = "default/sd_emv.dll";
        
                ///////////////////////////////
                //private function of class instance
                /* ex)
                function _x() {
                }
                */

                return{
                    ///////////////////////////////
                    //public function of class instance

                    /* ex)
                    X : function(){
                    },
                    Y : function(){
                    }
                    */ 

                    /** 
                     * @public 
                     * @sync
                     * @function get_session_number
                     * @param none
                     * 
                     * @returns {number} session numnber
                     * 
                    */                
                    get_session_number : function(){
                        return _n_session;
                    },

                    /** 
                     * @public 
                     * @sync
                     * @function get_device_path
                     * @param none
                     * 
                     * @returns {String} the path of device.
                     * 
                    */                
                    get_device_path : function(){
                        return _s_device_path;
                    },

                    /** 
                     * @public 
                     * @async
                     * @function set_device_path
                     * @param {string} the path of device.
                     * 
                     * @returns none
                     * 
                     * @description save the device path.
                    */                
                    set_device_path : function(s_device_path){
                        do{
                            if(typeof s_device_path !== "string"){
                                continue;
                            }
                            //
                            _s_device_path = s_device_path;
                        }while(false);
                    },

                    /** 
                     * @public 
                     * @sync
                     * @function get_opened_device_index
                     * @param none
                     * 
                     * @returns {number}  the opened device index.
                     * 
                     * @description get the opened device index.
                    */                
                    get_opened_device_index : function(){
                        return _n_device;
                    },

                    /** 
                     * @public 
                     * @async
                     * @function sd_load
                     * @param {number} n_session - the session number( 0~ 0xFFFFFFFE)
                     * 
                     * @returns {Promise} if success, resolve with string array( first string is "success" ).
                     * <br /> else reject with Error object.
                     * 
                     * @description load sd_emv.dll and initialize
                    */                
                     sd_load : function(n_session){
                        return new Promise(function(resolve,reject){
                            var s_error = "";
                            var s_kernel_category = "service";

                            _n_session = n_session;
                            elpusk.framework.coffee.get_instance().kernel_load(s_kernel_category, _s_sd_dll_name)
                            .then(function (s_rx) {
                                var b_result = false;
                                do{
                                    if (!Array.isArray(s_rx)) {
                                        continue;
                                    }
                                    if(s_rx.length<1){
                                        continue;
                                    }
                                    if (s_rx[0] !== "success") {
                                        continue;
                                    }
                                    b_result = true;
                                }while(false);
    
                                if(b_result){
                                    resolve("success");
                                }
                                else{
                                    reject("kernel_load");
                                }
                            })
                            .catch(function (event_error) {
                                reject(s_error);
                            });
                        });
                    },

                    /** 
                     * @public 
                     * @async
                     * @function sd_get_device_list
                     * @param {string} s_filter This filter is used to represent the desired USB device.
                     * 
                     * @returns {Promise} if success, resolve with device path list.
                     * <br /> else reject with Error object.
                     * 
                     * @description get device path-list
                    */                
                    sd_get_device_list : function(s_filter){
                        return new Promise(function(resolve,reject){
                            var s_error = "";
                            var s_kernel_category = "device";

                            elpusk.framework.coffee.get_instance().kernel_list(s_kernel_category, s_filter)
                            .then(function (s_rx) {
                                var b_result = false;
                                do{
                                    if (!Array.isArray(s_rx)) {
                                        continue;
                                    }
                                    if(s_rx.length===0){
                                        continue;
                                    }
                                    b_result = true;
                                }while(false);
    
                                if(b_result){
                                    resolve(s_rx);
                                }
                                else{
                                    reject("kernel_list");
                                }
                            })
                            .catch(function (event_error) {
                                reject(s_error);
                            });
                        });
                    },

                    /** 
                     * @public 
                     * @async
                     * @function sd_open_device
                     * @param {string} s_path the path of device.
                     * 
                     * @returns {Promise} if success, resolve with device index
                     * <br /> else reject with Error object.
                     * 
                     * @description open device by kernel mode.
                    */                
                    sd_open_device : function(s_path){
                        return new Promise(function(resolve,reject){
                            var s_error = "";
                            var s_kernel_category = "device";

                            elpusk.framework.coffee.get_instance().kernel_open(s_kernel_category, s_path)
                            .then(function (n_device_index) {
                                var b_result = false;
                                do{
                                    _n_device = n_device_index;
                                    if (n_device_index === 0) {
                                        continue;
                                    }
                                    b_result = true;
                                }while(false);
    
                                if(b_result){
                                    resolve(n_device_index);
                                }
                                else{
                                    reject("kernel_open");
                                }
                            })
                            .catch(function (event_error) {
                                reject(s_error);
                            });
                        });
                    },

                    /** 
                     * @public 
                     * @async
                     * @function sd_open_device
                     * 
                     * @returns {Promise} if success, resolve with string array( first string is "success" ).
                     * <br /> else reject with Error object.
                     * 
                     * @description close device by kernel mode.
                    */                
                    sd_close_device : function(){
                        return new Promise(function(resolve,reject){
                            var s_error = "";
                            var s_kernel_category = "device";

                            elpusk.framework.coffee.get_instance().kernel_close(_n_device, s_kernel_category)
                            .then(function (s_rx) {
                                var b_result = false;
                                do{
                                    if (!Array.isArray(s_rx)) {
                                        continue;
                                    }
                                    if(s_rx.length<1){
                                        continue;
                                    }
                                    if (s_rx[0] !== "success") {
                                        continue;
                                    }
                                    b_result = true;
                                }while(false);
    
                                if(b_result){
                                    resolve("success");
                                }
                                else{
                                    reject("kernel_close");
                                }
                            })
                            .catch(function (event_error) {
                                reject(s_error);
                            });
                        });
                    },

                    /**
                     * 
                     * @param {*} n_in_id 
                     * @param {*} n_out_id 
                     * @param {*} array_s_input 
                     * @returns {Promise} if success, resolve with string array( first string is "success" ).
                     * <br /> else reject with Error object.
                     */
                    sd_execute : function(n_in_id, n_out_id,array_s_input){
                        return new Promise(function(resolve,reject){
                            var s_error = "";
                            var s_kernel_category = "service";

                            elpusk.framework.coffee.get_instance().kernel_execute(_n_device, n_in_id, n_out_id,s_kernel_category,_s_sd_dll_name,array_s_input)
                            .then(function (s_rx) {
                                var b_result = false;
                                do{
                                    if (!Array.isArray(s_rx)) {
                                        continue;
                                    }
                                    if(s_rx.length<1){
                                        continue;
                                    }
                                    if (s_rx[0] !== "success") {
                                        continue;
                                    }
                                    b_result = true;
                                }while(false);
    
                                if(b_result){
                                    resolve(s_rx);
                                }
                                else{
                                    reject("kernel_execute");
                                }
                            })
                            .catch(function (event_error) {
                                reject(s_error);
                            });
                        });
                    },

                    sd_cancel : function(n_in_id, n_out_id){
                        return new Promise(function(resolve,reject){
                            var s_error = "";
                            var s_kernel_category = "service";

                            elpusk.framework.coffee.get_instance().kernel_cancel(_n_device, n_in_id, n_out_id,s_kernel_category,_s_sd_dll_name)
                            .then(function (s_rx) {
                                var b_result = false;
                                do{
                                    if (!Array.isArray(s_rx)) {
                                        continue;
                                    }
                                    if(s_rx.length<1){
                                        continue;
                                    }
                                    if (s_rx[0] !== "success") {
                                        continue;
                                    }
                                    b_result = true;
                                }while(false);
    
                                if(b_result){
                                    resolve("success");
                                }
                                else{
                                    reject("kernel_cancel");
                                }
                            })
                            .catch(function (event_error) {
                                reject(s_error);
                            });
                        });
                    },

                    /** 
                     * @public 
                     * @async
                     * @function sd_unload
                     * @param {number} n_session - the session number( 0~ 0xFFFFFFFE)
                     * 
                     * @returns {Promise} if success, resolve with echo data from server.
                     * <br /> else reject with Error object.
                     * 
                     * @description unload sd_emv.dll and deinitialize
                    */                
                    sd_unload :function(n_session){
                        return new Promise(function(resolve,reject){
                            var s_kernel_category = "service";
                            var s_error = "";

                            elpusk.framework.coffee.get_instance().kernel_unload(s_kernel_category, _s_sd_dll_name)
                            .then(function (s_rx) {
                                var b_result = false;
                                do{
                                    if (!Array.isArray(s_rx)) {
                                        continue;
                                    }
                                    if(s_rx.length<1){
                                        continue;
                                    }
                                    if (s_rx[0] !== "success") {
                                        continue;
                                    }
                                    b_result = true;
                                }while(false);
    
                                if(b_result){
                                    resolve("success");
                                }
                                else{
                                    reject("kernel_unload");
                                }
                            })
                            .catch(function (event_error) {
                                reject(s_error);
                            });
                        });
                    },


                    ///////////////////////////////
                    //public variable of class instance

                };
            }


            /*** @return {_instance} the instance of sd_emv class. */
            return{
                /** 
                 * @public 
                 * @constructs get_instance
                 * 
                 * @returns {object} return sd_emv class instance.
                 * 
                 * @description coffee class use singleton pattern. you can get the instance of sd_emv class.
                */                   
                get_instance : function(){
                    if(!_instance){
                        _instance = _constructor();
                    }
                    return _instance;
                }
            };
        })();
        
    }//!_dll_service.default.sd_emv

    

    //some function is exported.


    window.dll_service = _dll_service;
}(window));