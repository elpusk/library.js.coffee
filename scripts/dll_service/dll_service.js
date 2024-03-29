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
 * @description sd_x.dll controller of elpusk framework coffee javascript library .
 * <br /> error rules
 * <br /> * coffee framework error : generates promise reject or calls error callback function.
 * <br /> 
 * <br />  2021.11.xx - release 1.0.
 * 
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

    /**
     * dll_service - the base class of all service dll.
     */
    var _dll_service = window.dll_service;
    if(!_dll_service){
        'use strict';

        /**
         * @constructs dll_service
         * @param {number} n_session mandotry,  session number of this service dll.
         * @param {string} s_sd_dll_path mandotry, service dll path( default/sd_*.dll or 3thpart/sd_*.dll)
         */
        _dll_service = function (n_session,s_sd_dll_path) {
            if( typeof s_sd_dll_path !== 'string' ){
                this._s_sd_dll_path = "";
                console.log("error : s_sd_dll_path must be string type(default/sd_*.dll or 3thpart/sd_*.dll)");
            }
            else{
                this._s_sd_dll_path = s_sd_dll_path;
            }

            if( typeof n_session !== 'number'){
                this._n_session = 0xFFFFFFFF;//undefined session number
                console.log("error : n_session must be number type(0~0xFFFFFFFE)");
            }
            else{
                this._n_session = n_session;
            }

            /**
             * @type {number}
             */
            this._n_device_index = 0;// 0 is undefined index number

            /**
             * @type {string}
             */
            this._s_device_path = "";// the path of of this._n_device_index
        };

        /**
         * @public
         * @function get_path
         * @return {string} service dll path
         */
         _dll_service.prototype.get_path = function()
         {
             return this._s_sd_dll_path;
         }
 
        /**
         * @public
         * @function get_device_index
         * @return {number} the index of device. 0 is unknown index value.
         */
         _dll_service.prototype.get_device_index = function()
         {
             return this._n_device_index;
         }

        /**
         * @public
         * @function get_session_number
         * @return {number} this instance's master session number. 0xFFFFFFFF is unknown value.
         */
         _dll_service.prototype.get_session_number = function()
         {
             return this._n_session;
         }


        /** 
         * @public 
         * @async
         * @function sd_load
         * 
         * @returns {Promise} if success, resolve with string array( first string is "success" ).
         * <br /> else reject with Error object.
         * 
         * @description load service dll and initialize
        */                
         _dll_service.prototype.sd_load = function(){
            var this_sd_dll = this;
            return new Promise(function(resolve,reject){
                var s_error = "";
                var s_kernel_category = "service";

                elpusk.framework.coffee.get_instance().kernel_load(s_kernel_category, this_sd_dll._s_sd_dll_path)
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
        }

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
         _dll_service.prototype.sd_get_device_list = function(s_filter){
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
        }

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
         _dll_service.prototype.sd_open_device = function(s_path){
            var this_sd_dll = this;

            return new Promise(function(resolve,reject){
                var s_error = "";
                var s_kernel_category = "device";

                elpusk.framework.coffee.get_instance().kernel_open(
                    s_kernel_category, 
                    s_path
                    )
                .then(function (n_device_index) {
                    var b_result = false;
                    do{
                        if (n_device_index === 0) {
                            continue;
                        }
                        this_sd_dll._n_device_index = n_device_index;
                        this_sd_dll._s_device_path = s_path;
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
        }

        /** 
         * @public 
         * @async
         * @function sd_close_device
         * 
         * @returns {Promise} if success, resolve with string array( first string is "success" ).
         * <br /> else reject with Error object.
         * 
         * @description close device by kernel mode.
        */                
        _dll_service.prototype.sd_close_device = function(){
            var this_sd_dll = this;

            return new Promise(function(resolve,reject){
                var s_error = "";
                var s_kernel_category = "device";

                elpusk.framework.coffee.get_instance().kernel_close(
                    this_sd_dll._n_device_index, 
                    s_kernel_category
                    )
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
                        this_sd_dll._n_device_index = 0;
                        this_sd_dll._s_device_path = "";
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
        }

        /**
         * @public 
         * @async
         * @function sd_execute
         * @param {*} n_in_id
         * @param {*} n_out_id 
         * @param {*} array_s_input 
         * @returns {Promise} if success, resolve with string array( first string is "success" ).
         * <br /> else reject with Error object.
         */
         _dll_service.prototype.sd_execute = function(n_in_id, n_out_id,array_s_input){
            var this_sd_dll = this;
            
            return new Promise(function(resolve,reject){
                var s_error = "";
                var s_kernel_category = "service";

                elpusk.framework.coffee.get_instance().kernel_execute(
                    this_sd_dll._n_device_index,
                     n_in_id, n_out_id,
                     s_kernel_category,
                     this_sd_dll._s_sd_dll_path,
                     array_s_input
                     )
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
        }

        /**
         * @public 
         * @async
         * @function sd_cancel
         * @param {*} n_in_id
         * @param {*} n_out_id 
         * @returns {Promise} if success, resolve with string array( first string is "success" ).
         * <br /> else reject with Error object.
         */
        _dll_service.prototype.sd_cancel = function(n_in_id, n_out_id){
            var this_sd_dll = this;

            return new Promise(function(resolve,reject){
                var s_error = "";
                var s_kernel_category = "service";

                elpusk.framework.coffee.get_instance().kernel_cancel(
                    this_sd_dll._n_device_index, 
                    n_in_id, n_out_id,
                    s_kernel_category,
                    this_sd_dll._s_sd_dll_path
                    )
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
        }

        /** 
         * @public 
         * @async
         * @function sd_unload
         * 
         * @returns {Promise} if success, resolve with echo data from server.
         * <br /> else reject with Error object.
         * 
         * @description unload sd_emv.dll and deinitialize
        */                
         _dll_service.prototype.sd_unload = function(){
            
            var this_sd_dll = this;

            return new Promise(function(resolve,reject){
                var s_kernel_category = "service";
                var s_error = "";

                elpusk.framework.coffee.get_instance().kernel_unload(
                    s_kernel_category, 
                    this_sd_dll._s_sd_dll_path
                    )
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
                        this_sd_dll._s_sd_dll_path = "";
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
        }        

    }// the end of function
    
    window.dll_service = _dll_service;
}(window));