
'use strict';

(function (windows, undefined) {
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
         * @function elpusk.util.get_dword_hex_string
         * @param {number} dw_data unsigned int - double word number.
         * @returns {string} little endian double word hex string format. always 8 characters.
         */
        _elpusk.util.prototype.get_dword_hex_string = function( dw_data ){
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
         * @function elpusk.util.get_byte_hex_string
         * @param {number} c_data unsigned char
         * @returns {string} little endian byte hex string format. always 2 characters.
         */
        _elpusk.util.prototype.get_byte_hex_string = function( n_data ){
            var s_dword = _elpusk.util.prototype.get_dword_hex_string(n_data);
            return s_dword.substring(0,2);
        }
        
        /**
         * @public
         * @function elpusk.util.insert_to_set
         * @param {any[]} target_set array type set
         * @param {any} item
         * @returns {boolean} processing result
         */
        _elpusk.util.prototype.insert_to_set = function( target_set, item ){
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
        _elpusk.util.prototype.remove_from_set = function( target_set, item ){
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
         * @function elpusk.util.find_from_set
         * @param {any[]} target_set array type set
         * @param {any} item
         * @returns {number} index of item in target_set.
         */
        _elpusk.util.prototype.find_from_set = function( target_set, item ){
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

    }

    // the end of function
    window.elpusk = _elpusk;
}(window))