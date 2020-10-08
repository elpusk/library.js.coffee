/**
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
 */

'use strict';

(function (window, undefined) {
    /**@private */
    var _elpusk = window.elpusk;

    /** documented as elpusk.util */
    if (!_elpusk) {
        _elpusk = {};
    }
    if (!_elpusk.util) {
        _elpusk.util = {};

        /**
         * @public
         * @function elpusk.util.get_number_from_little_endian_hex_string
         * @param {string} s_hex little endian hex string.
         * @returns {number} converted number.
         */
        _elpusk.util.get_number_from_little_endian_hex_string = function( s_hex ){
            var n_value = 0;

            do{

                var a = s_hex.match(/../g);     // split number in groups of two
                a.reverse();                    // reverse the groups

                var s_big_hex = a.join("");

                n_value = parseInt(s_big_hex,16);
            }while(false);
            return n_value;
        }

        /**
         * @private
         * @function _elpusk.util.get_version_string_from_version
         * @param {number[]} version 4 number array
         * @returns {string} version string
         */
        _elpusk.util.get_version_string_from_version = function( version ){
            var s_value = "0.0.0.0";
            do{
                if( !Array.isArray(version)){
                    continue;
                }
                if( version.length !== 4 ){
                    continue;
                }

                s_value = version[0].toString(10) + "." 
                + version[1].toString(10) + "." 
                + version[2].toString(10) + "." 
                + version[3].toString(10);
            }while(false);
            return s_value;
        }

        /**
         * @public
         * @function elpusk.util.get_dword_hex_string_from_number
         * @param {number} dw_data unsigned int - double word number.
         * @returns {string} little endian double word hex string format. always 8 characters.
         */
        _elpusk.util.get_dword_hex_string_from_number = function( dw_data ){
            var s_big_hex = dw_data.toString(16);

            s_big_hex = s_big_hex.replace(/^(.(..)*)$/, "0$1"); // add a leading zero if needed
            var n_need_zeros = 4*2 - s_big_hex.length;
            for( var i = 0; i<n_need_zeros; i++ ){
                s_big_hex = "0" + s_big_hex;    //padding for dword.
            }//end for

            var a = s_big_hex.match(/../g);     // split number in groups of two
            a.reverse();                        // reverse the groups

            var s_little_hex = a.join("");
            return s_little_hex;
        }

        /**
         * @public
         * @function elpusk.util.get_byte_hex_string_from_number
         * @param {number} c_data unsigned char
         * @returns {string} little endian byte hex string format. always 2 characters.
         */
        _elpusk.util.get_byte_hex_string_from_number = function( c_data ){
            var s_big_hex = c_data.toString(16);

            s_big_hex = s_big_hex.replace(/^(.(..)*)$/, "0$1"); // add a leading zero if needed
            var n_need_zeros = 1*2 - s_big_hex.length;
            for( var i = 0; i<n_need_zeros; i++ ){
                s_big_hex = "0" + s_big_hex;    //padding for dword.
            }//end for

            return s_big_hex.substring(0,2);
        }
        
        /**
         * @public
         * @function elpusk.util.insert_to_set
         * @param {any[]} target_set array type set
         * @param {any} item
         * @returns {boolean} processing result
         */
        _elpusk.util.insert_to_set = function( target_set, item ){
            var b_result = false;
            do{
                if( typeof target_set === 'undefined' ){
                    continue;
                }
                if( !Array.isArray(target_set)){
                    continue;
                }
                if( typeof item === 'undefined' ){
                    continue;
                }

                if( target_set.indexOf(item) >= 0 ){
                    continue;
                }

                target_set.push(item);
                
                b_result = true;
            }while(false);
            return b_result;
        }

        /**
         * @public
         * @function elpusk.util.remove_from_set
         * @param {any[]} target_set array type set
         * @param {any} item
         * @returns {boolean} processing result
         */
        _elpusk.util.remove_from_set = function( target_set, item ){
            var b_result = false;
            do{
                if( typeof target_set === 'undefined' ){
                    continue;
                }
                if( !Array.isArray(target_set)){
                    continue;
                }
                if( typeof item === 'undefined' ){
                    continue;
                }

                var n_index = target_set.indexOf(item);
                if(  n_index < 0 ){
                    continue;
                }

                target_set.splice(n_index,1);
                
                b_result = true;
            }while(false);
            return b_result;
        }

        /**
         * @public
         * @function elpusk.util.clear_set
         * @param {any[]} target_set array type set
         * @param {any} item
         */
        _elpusk.util.clear_set = function( target_set ){
            var b_result = false;
            do{
                if( typeof target_set === 'undefined' ){
                    continue;
                }
                if( !Array.isArray(target_set)){
                    continue;
                }

                target_set.length = 0;
            }while(false);
        }        
        /**
         * @public
         * @function elpusk.util.find_from_set
         * @param {any[]} target_set array type set
         * @param {any} item
         * @returns {number} index of item in target_set.
         */
        _elpusk.util.find_from_set = function( target_set, item ){
            var n_index = -1;
            do{
                if( typeof target_set === 'undefined' ){
                    continue;
                }
                if( !Array.isArray(target_set)){
                    continue;
                }
                if( typeof item === 'undefined' ){
                    continue;
                }

                n_index = target_set.indexOf(item);
            }while(false);
            return n_index;
        }
        /** 
         * @public 
         * @function elpusk.util.map_of_queue_push
         * @param {object} target_map instance of Map
         * @param {any} key the key of map(target_map).
         * @param {any} value the push value to queue of key in map.
         * @description push key value pair to map(target_map).
        */                
        _elpusk.util.map_of_queue_push = function(target_map,key,value) {
            do{
                if( !(target_map instanceof Map)){
                    continue;
                }
                if( !target_map.has(key) ){
                    var queue = [];
                    queue.push(value);
                    target_map.set(key,queue);
                    continue;
                }
                var q = target_map.get(key);
                q.push(value);
            }while(false);
        }
        /** 
         * @public 
         * @function elpusk.util.map_of_queue_front
         * @param {object} target_map Map instance
         * @param {any} key the key of map(target_map).
         * @returns {object|null} success - The front value of the queue corresponding to the key in the map.
         * <br /> error - null
         * @description return the front value of the queue corresponding to the key in the map.
         * <br /> key & value is removed.
        */                
        _elpusk.util.map_of_queue_front =  function(target_map,key) {
            var value = null;
            do{
                if( !(target_map instanceof Map)){
                    continue;
                }
                if( !target_map.has(key) ){
                    continue;
                }
                var q = target_map.get(key);
                if( q.length <= 0 ){
                    continue;
                }
                //
                value = q.shift();
                if( q.length <= 0 ){
                    target_map.delete(key);
                }
            }while(false);
            return value;
        }
        /** 
         * @public 
         * @function elpusk.util.map_of_queue_get
         * @param {object} target_map Map instance
         * @param {any} key the key of map(target_map).
         * @returns {object|null} success - The value of the queue corresponding to the key in the map.
         * <br /> error - null
         * @description return the value of the queue corresponding to the key in the map.
         * <br /> key & value is not removed.
        */                
       _elpusk.util.map_of_queue_get =  function(target_map,key) {
            var value = null;
            do{
                if( !(target_map instanceof Map)){
                    continue;
                }
                if( !target_map.has(key) ){
                    continue;
                }
                var q = target_map.get(key);
                if( q.length <= 0 ){
                    continue;
                }
                //
                value = q[0];
            }while(false);
            return value;
        }
        /** 
         * @public 
         * @function elpusk.util.map_of_queue_is_empty
         * @param {object} target_map Map instance
         * @param {any} key the key of map(target_map).
         * @returns {boolean} true - It is empty that the queue corresponding to the key in the map.
         * <br /> false - It is not empty that the queue corresponding to the key in the map.
         * @description check the queue corresponding to the key in the map. if it is empty or not.
        */                
        _elpusk.util.map_of_queue_is_empty = function(target_map, key) {
            var b_empty = true;
            do{
                if( !(target_map instanceof Map)){
                    continue;
                }
                if( !target_map.has(key) ){
                    continue;
                }
                var q = target_map.get(key);
                if( q.length <= 0 ){
                    continue;
                }
                //
                b_empty = false;
            }while(false);
            return b_empty;
        }
        /** 
         * @public 
         * @function elpusk.util.map_of_queue_delete
         * @param {object} target_map Map instance
         * @param {any} key the key of map(target_map).
         * @description delete the queue corresponding to the key in the map.
        */                
        _elpusk.util.map_of_queue_delete = function(target_map,key){
            do{
                if( !(target_map instanceof Map)){
                    continue;
                }
                if( target_map.has(key)){
                    target_map.delete(key);
                }
            }while(false);
        }

        /** 
         * @public 
         * @function elpusk.util.map_of_queue_clear
         * @param {object} target_map Map instance
         * @description remove all queue of map.
        */                
        _elpusk.util.map_of_queue_clear = function(target_map){
            if(target_map instanceof Map){
                target_map.clear();
            }
        }

        _elpusk.util.ascii_symbol_map = [
             "NUL"
            ,"SOH"
            ,"STX"
            ,"ETX"
            ,"EOT"
            ,"ENQ"
            ,"ACK"
            ,"BEL"
            ,"BS"
            ,"HT"
            ,"LF"
            ,"VT"
            ,"FF"
            ,"CR"
            ,"SO"
            ,"SI"
            ,"DLE"
            ,"DC1"
            ,"DC2"
            ,"DC3"
            ,"DC4"
            ,"NAK"
            ,"SYN"
            ,"ETB"
            ,"CAN"
            ,"EM"
            ,"SUB"
            ,"ESC"
            ,"FS"
            ,"GS"
            ,"RS"
            ,"US"
            ,"SP"
            ,"!"
            ,'"'
            ,'#'
            ,'%'
            ,'&'
            ,"'"
            ,"("
            ,")"
            ,"*"
            ,"+"
            ,","
            ,"-"
            ,"."
            ,"/"
            ,"0"
            ,"1"
            ,"2"
            ,"3"
            ,"4"
            ,"5"
            ,"6"
            ,"7"
            ,"8"
            ,"9"
            ,":"
            ,";"
            ,"<"
            ,"="
            ,">"
            ,"?"
            ,"@"
            ,"A"
            ,"B"
            ,"C"
            ,"D"
            ,"E"
            ,"F"
            ,"G"
            ,"H"
            ,"I"
            ,"J"
            ,"K"
            ,"L"
            ,"M"
            ,"N"
            ,"O"
            ,"P"
            ,"Q"
            ,"R"
            ,"S"
            ,"T"
            ,"U"
            ,"V"
            ,"W"
            ,"X"
            ,"Y"
            ,"Z"
            ,"["
            ,"\\"
            ,"]"
            ,"^"
            ,"_"
            ,"`"
            ,"a"
            ,"b"
            ,"c"
            ,"d"
            ,"e"
            ,"f"
            ,"g"
            ,"h"
            ,"i"
            ,"j"
            ,"k"
            ,"l"
            ,"m"
            ,"n"
            ,"o"
            ,"p"
            ,"q"
            ,"u"
            ,"v"
            ,"w"
            ,"x"
            ,"y"
            ,"z"
            ,"{"
            ,"|"
            ,"}"
            ,"~"
            ,"DEL"
        ];     
        /** 
         * @public 
         * @function elpusk.util.get_ascii_symbol_from_char_code
         * @param {number} one byte ascii code.
         * @returns {string} ascii symbol string
         * @description ASCII symbol from ascii code.
        */                
        _elpusk.util.get_ascii_symbol_from_char_code = function(n_ascii){
            var s_symbol = "";

            do{
                if( typeof n_ascii !== 'number'){
                    continue;
                }
                if( n_ascii <0 || n_ascii >127){
                    continue;
                }
                s_symbol = _elpusk.util.ascii_symbol_map[n_ascii];
            }while(false);
            return s_symbol;
        }

        ////////////////////////////////
        ////////////////////////////////
    }//the end of _elpusk.util

    // the end of function
    window.elpusk = _elpusk;
}(window));