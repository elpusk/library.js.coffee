
'use strict';

    function _get_hid_modifier_code_hex_string_by_key_symbol( s_key_symbol ){
        
        var s_hid_modifier_code_hex = null;

        do{
            if( typeof s_key_symbol !== 'string' ){
                continue;
            }
            if(s_key_symbol.length === 0 ){
                s_hid_modifier_code_hex = "00";
                continue;
            }

            var n_modifier = 0;

            if( s_key_symbol.indexOf("s") !== -1 ){
                n_modifier |= 0x02;//left shift
            }
            if( s_key_symbol.indexOf("c") !== -1 ){
                n_modifier |= 0x01;//left control
            }
            if( s_key_symbol.indexOf("a") !== -1 ){
                n_modifier |= 0x04;//left alt
            }

            s_hid_modifier_code_hex = "0" + n_modifier.toString(16);

        }while(false);

        return s_hid_modifier_code_hex;
    }


    function _get_hid_key_code_hex_string_by_key_symbol( s_key_symbol ){
        //key
        var s_hid_key_code_hex = null;
        
        do{
            if( typeof s_key_symbol !== 'string' ){
                continue;
            }
            if(s_key_symbol.length === 0 ){
                s_hid_key_code_hex = "00";
                continue;
            }
            if( s_key_symbol.indexOf("0x")>=0 ){
                if( s_key_symbol.length !== 4 ){
                    continue;
                }
                //hex string
                s_hid_key_code_hex = s_key_symbol.substring(2);
                continue;
            }
            if( s_key_symbol === "f1" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY________F1;
                continue;
            }
            if( s_key_symbol === "f2" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY________F2;
                continue;
            }
            if( s_key_symbol === "f3" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY________F3;
                continue;
            }
            if( s_key_symbol === "f4" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY________F4;
                continue;
            }
            if( s_key_symbol === "f5" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY________F5;
                continue;
            }
            if( s_key_symbol === "f6" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY________F6;
                continue;
            }
            if( s_key_symbol === "f7" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY________F7;
                continue;
            }
            if( s_key_symbol === "f8" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY________F8;
                continue;
            }
            if( s_key_symbol === "f9" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY________F9;
                continue;
            }
            if( s_key_symbol === "f10" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_______F10;
                continue;
            }
            if( s_key_symbol === "f11" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_______F11;
                continue;
            }
            if( s_key_symbol === "f12" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_______F12;
                continue;
            }
            if( s_key_symbol === "esc" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____ESCAPE;
                continue;
            }
            if( s_key_symbol === "space" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_____SPACE;
                continue;
            }
            if( s_key_symbol === "tab" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_______TAB;
                continue;
            }
            if( s_key_symbol === "q" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____q____Q;
                continue;
            }
            if( s_key_symbol === "w" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____w____W;
                continue;
            }
            if( s_key_symbol === "e" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____e____E;
                continue;
            }
            if( s_key_symbol === "r" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____r____R;
                continue;
            }
            if( s_key_symbol === "t" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____t____T;
                continue;
            }
            if( s_key_symbol === "y" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____y____Y;
                continue;
            }
            if( s_key_symbol === "u" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____u____U;
                continue;
            }
            if( s_key_symbol === "i" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____i____I;
                continue;
            }
            if( s_key_symbol === "o" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____o____O;
                continue;
            }
            if( s_key_symbol === "p" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____p____P;
                continue;
            }
            if( s_key_symbol === "[" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_LBT___LBR;
                continue;
            }
            if( s_key_symbol === "]" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_RBT___RBR;
                continue;
            }
            if( s_key_symbol === "\\" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_BSLA_VBAR;
                continue;
            }
            if( s_key_symbol === "del" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____DELETE;
                continue;
            }
            if( s_key_symbol === "z" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____z____Z;
                continue;
            }
            if( s_key_symbol === "x" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____x____X;
                continue;
            }
            if( s_key_symbol === "c" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____c____C;
                continue;
            }
            if( s_key_symbol === "v" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____v____V;
                continue;
            }
            if( s_key_symbol === "b" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____b____B;
                continue;
            }
            if( s_key_symbol === "n" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____n____N;
                continue;
            }
            if( s_key_symbol === "m" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____m____M;
                continue;
            }
            if( s_key_symbol === "," ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_COMA___LT;
                continue;
            }
            if( s_key_symbol === "." ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_PERIOD_GT;
                continue;
            }
            if( s_key_symbol === "/" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_SLASH__QM;
                continue;
            }
            if( s_key_symbol === "`" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_GRAV_TILD;
                continue;
            }
            if( s_key_symbol === "1" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____1_EXCL;
                continue;
            }
            if( s_key_symbol === "2" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____2_QUOT;
                continue;
            }
            if( s_key_symbol === "3" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____3_SHAR;
                continue;
            }
            if( s_key_symbol === "4" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____4_DOLL;
                continue;
            }
            if( s_key_symbol === "5" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____5_PERC;
                continue;
            }
            if( s_key_symbol === "6" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____6_CIRC;
                continue;
            }
            if( s_key_symbol === "7" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____7_AMPE;
                continue;
            }
            if( s_key_symbol === "8" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____8_ASTE;
                continue;
            }
            if( s_key_symbol === "9" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____9_L_PA;
                continue;
            }
            if( s_key_symbol === "0" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____0_R_PA;
                continue;
            }
            if( s_key_symbol === "-" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_MIN_UNDER;
                continue;
            }
            if( s_key_symbol === "=" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_EQU__PLUS;
                continue;
            }
            if( s_key_symbol === "bs" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_BACKSPACE;
                continue;
            }
            if( s_key_symbol === "a" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____a____A;
                continue;
            }
            if( s_key_symbol === "s" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____s____S;
                continue;
            }
            if( s_key_symbol === "d" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____d____D;
                continue;
            }
            if( s_key_symbol === "f" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____f____F;
                continue;
            }
            if( s_key_symbol === "g" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____g____G;
                continue;
            }
            if( s_key_symbol === "h" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____h____H;
                continue;
            }
            if( s_key_symbol === "j" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____j____J;
                continue;
            }
            if( s_key_symbol === "k" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____k____K;
                continue;
            }
            if( s_key_symbol === "l" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____l____L;
                continue;
            }
            if( s_key_symbol === ";" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_SEMI__COL;
                continue;
            }
            if( s_key_symbol === "'" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY_APOS_QUOT;
                continue;
            }
            if( s_key_symbol === "enter" ){
                s_hid_key_code_hex = elpusk.util.keyboard.const.HIDKEY____RETURN;
                continue;
            }
        }while(false);
        return s_hid_key_code_hex;
    }

    function _get_hid_key_pair_hex_string_from_string(s_string){

        var s_hex_result = null;

        do{
            if( typeof s_string !== 'string'){
                continue;
            }

            var s_src = s_string;
            s_src = s_src.trim();

            if( s_src.length === 0 ){
                s_hex_result = "000000000000000000000000000000";//15 byets 
                continue;
            }

            

            var b_error = false;

            var s_token = "";
            var array_s_open_close = [];
            var array_s_token = [];
            var s_char = "";

            do{
                s_char = s_src.slice(0,1);
                s_src = s_src.substring(1);
                s_src = s_src.trim();//remove space

                do{
                    if( s_char === "[" ){
                        if( array_s_open_close.length % 2 === 0 ){
                            s_token = "";
                            array_s_open_close.push(s_char);
                            continue;
                        }
                        s_token = s_token + s_char;//add '['
                        continue;
                    }
                    if( array_s_open_close.length % 2 != 1 ){
                        b_error = true;
                        continue;
                    }
                    if( array_s_open_close[array_s_open_close.length-1] !== "["){
                        b_error = true;
                        continue;
                    }
                    if( s_char === "]" ){
                        if( s_src.length === 0 ){
                            array_s_token.push(s_token);
                            continue;
                        }
                        if( s_src.slice(0,1)==="["){
                            array_s_token.push(s_token);
                            continue;
                        }
                    }
                    //
                    s_token = s_token + s_char;
                }while(false);

                if( b_error ){
                    break;//exit while
                }
            }while(s_src.length > 0);

            if( b_error === true ){
                continue;
            }
            // array_s_token have item that is removed spaces. and seperated '[ ]'

            if( array_s_token.length === 0 ){
                continue;
            }
            if(array_s_token.length %2 !== 0 ){
                continue;
            }

            var array_s_mod = [];
            var array_s_key = [];

            for( var i = 0; i<array_s_token.length; i++ ){
                if( i%2 === 0 ){
                    array_s_mod.push(array_s_token[i]);
                }
                else{
                    array_s_key.push(array_s_token[i]);
                }
            }//end for
            //
            for( var i = 0; i<array_s_mod.length; i++ ){
                s_hid_modifier_code_hex = _get_hid_modifier_code_hex_string_by_key_symbol(array_s_mod[i]);
                if( s_hid_modifier_code_hex === null ){
                    b_error = true;
                    break;//exit for
                }
                s_hid_key_code_hex = _get_hid_key_code_hex_string_by_key_symbol(array_s_mod[i]);
                if( s_hid_key_code_hex === null ){
                    b_error = true;
                    break;//exit for
                }
                s_hex_result = s_hid_modifier_code_hex + s_hid_key_code_hex;
            }//end for

            if( b_error ){
                s_hex_result = null;
            }

        }while(false);
        
        return s_hex_result;
    }