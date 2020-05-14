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
    }//the end of _elpusk.util

    // the end of function
    window.elpusk = _elpusk;
}(window));