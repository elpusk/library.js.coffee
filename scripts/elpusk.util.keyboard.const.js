
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
    }
    if (!_elpusk.util.keyboard) {
        _elpusk.util.keyboard = {};
    }

    /** documented as elpusk.util.keyboard.const */
    if (!_elpusk.util.keyboard.const) {
        _elpusk.util.keyboard.const = {};
        //

        _elpusk.util.keyboard.const.prototype.FOR_CVT_MAX_ASCII_CODE = 130;		//covertable maximmum of ascii-code.

        _elpusk.util.keyboard.const.prototype.SUPPORT_KB_MAP	=	11;
        
        _elpusk.util.keyboard.const.prototype.HIDKEY_MAP_NUMBER	=		_elpusk.util.keyboard.const.SUPPORT_KB_MAP;	//the number of map table
        _elpusk.util.keyboard.const.prototype.PS2KEY_MAP_NUMBER	=		_elpusk.util.keyboard.const.SUPPORT_KB_MAP;	//the number of map table
        
        /////////////////////////////////////////////////////
        //definition of key code.......  for USB keyboard
        //USA.......(default definition)
        
        // HID MODIFIERS KEYS
        _elpusk.util.keyboard.const.prototype.HIDKEY_MOD__NONE			="00";//none modifier
        _elpusk.util.keyboard.const.prototype.HIDKEY_MOD_L_CTL			="01";//left control
        _elpusk.util.keyboard.const.prototype.HIDKEY_MOD_L_SFT			="02";//left shift
        _elpusk.util.keyboard.const.prototype.HIDKEY_MOD_L_ALT			="04";//left alt
        _elpusk.util.keyboard.const.prototype.HIDKEY_MOD_L_GUI			="08";//left windows key
        _elpusk.util.keyboard.const.prototype.HIDKEY_MOD_R_CTL			="10";//right control
        _elpusk.util.keyboard.const.prototype.HIDKEY_MOD_R_SFT			="20";//right shift
        _elpusk.util.keyboard.const.prototype.HIDKEY_MOD_R_ALT			="40";//right alt
        _elpusk.util.keyboard.const.prototype.HIDKEY_MOD_R_GUI			="80";//right windows key
        
        
        _elpusk.util.keyboard.const.prototype.HIDKEY____a____A			="04";// a A
        _elpusk.util.keyboard.const.prototype.HIDKEY____b____B			="05";// b B
        _elpusk.util.keyboard.const.prototype.HIDKEY____c____C			="06";// c C
        _elpusk.util.keyboard.const.prototype.HIDKEY____d____D			="07";// d D
        _elpusk.util.keyboard.const.prototype.HIDKEY____e____E			="08";// e E
        _elpusk.util.keyboard.const.prototype.HIDKEY____f____F			="09";// f F
        _elpusk.util.keyboard.const.prototype.HIDKEY____g____G			="0a";// g G
        _elpusk.util.keyboard.const.prototype.HIDKEY____h____H			="0b";// h H
        _elpusk.util.keyboard.const.prototype.HIDKEY____i____I			="0c";// i I
        _elpusk.util.keyboard.const.prototype.HIDKEY____j____J			="0d";// j J
        _elpusk.util.keyboard.const.prototype.HIDKEY____k____K			="0e";// k K
        _elpusk.util.keyboard.const.prototype.HIDKEY____l____L			="0f";// l L
        _elpusk.util.keyboard.const.prototype.HIDKEY____m____M			="10";// m M
        _elpusk.util.keyboard.const.prototype.HIDKEY____n____N			="11";// n N
        _elpusk.util.keyboard.const.prototype.HIDKEY____o____O			="12";// o O
        _elpusk.util.keyboard.const.prototype.HIDKEY____p____P			="13";// p P
        _elpusk.util.keyboard.const.prototype.HIDKEY____q____Q			="14";// q Q
        _elpusk.util.keyboard.const.prototype.HIDKEY____r____R			="15";// r R
        _elpusk.util.keyboard.const.prototype.HIDKEY____s____S			="16";// s S
        _elpusk.util.keyboard.const.prototype.HIDKEY____t____T			="17";// t T
        _elpusk.util.keyboard.const.prototype.HIDKEY____u____U			="18";// u U
        _elpusk.util.keyboard.const.prototype.HIDKEY____v____V			="19";// v V
        _elpusk.util.keyboard.const.prototype.HIDKEY____w____W			="1a";// w W
        _elpusk.util.keyboard.const.prototype.HIDKEY____x____X			="1b";// x X
        _elpusk.util.keyboard.const.prototype.HIDKEY____y____Y			="1c";// y Y
        _elpusk.util.keyboard.const.prototype.HIDKEY____z____Z			="1d";// z Z
        _elpusk.util.keyboard.const.prototype.HIDKEY____1_EXCL			="1e";// 1 ! Exclamation point
        _elpusk.util.keyboard.const.prototype.HIDKEY____2_QUOT			="1f";// 2 @ Quotation mark
        _elpusk.util.keyboard.const.prototype.HIDKEY____3_SHAR			="20";// 3 # Sharp
        _elpusk.util.keyboard.const.prototype.HIDKEY____4_DOLL			="21";// 4 $ Dollar sign
        _elpusk.util.keyboard.const.prototype.HIDKEY____5_PERC			="22";// 5 % Percent sign
        _elpusk.util.keyboard.const.prototype.HIDKEY____6_CIRC			="23";// 6 ^ Circumflex
        _elpusk.util.keyboard.const.prototype.HIDKEY____7_AMPE			="24";// 7 & ampersand
        _elpusk.util.keyboard.const.prototype.HIDKEY____8_ASTE			="25";// 8 * asterisk
        _elpusk.util.keyboard.const.prototype.HIDKEY____9_L_PA			="26";// 9 ( left parenthesis
        _elpusk.util.keyboard.const.prototype.HIDKEY____0_R_PA			="27";// 0 ) right parenthesis
        _elpusk.util.keyboard.const.prototype.HIDKEY____RETURN			="28";// Return
        _elpusk.util.keyboard.const.prototype.HIDKEY____ESCAPE			="29";// Escape
        _elpusk.util.keyboard.const.prototype.HIDKEY_BACKSPACE			="2a";// Backspace
        _elpusk.util.keyboard.const.prototype.HIDKEY_______TAB			="2b";// Tab
        _elpusk.util.keyboard.const.prototype.HIDKEY_____SPACE			="2c";// Space
        _elpusk.util.keyboard.const.prototype.HIDKEY_MIN_UNDER			="2d";// - _ underline
        _elpusk.util.keyboard.const.prototype.HIDKEY_EQU__PLUS			="2e";// = +
        
        
        _elpusk.util.keyboard.const.prototype.HIDKEY_LBT___LBR			="2f";// [ { left bracket,left brace
        _elpusk.util.keyboard.const.prototype.HIDKEY_RBT___RBR			="30";// ] } right bracket,right brace
        _elpusk.util.keyboard.const.prototype.HIDKEY_BSLA_VBAR			="31";// \ | back slash, vertical bar 
        _elpusk.util.keyboard.const.prototype.HIDKEY_SEMI__COL			="33";// ; : semicolon, colon 
        _elpusk.util.keyboard.const.prototype.HIDKEY_APOS_QUOT			="34";// ' " apostrophe, Double Quotation
        _elpusk.util.keyboard.const.prototype.HIDKEY_GRAV_TILD			="35";// ` ~ Grave, Tilde
        _elpusk.util.keyboard.const.prototype.HIDKEY_COMA___LT			="36";// , < comma, less then sign
        _elpusk.util.keyboard.const.prototype.HIDKEY_PERIOD_GT			="37";// . > period, greater then sign
        _elpusk.util.keyboard.const.prototype.HIDKEY_SLASH__QM			="38";// / ? slash
        _elpusk.util.keyboard.const.prototype.HIDKEY__CAPSLOCK			="39";//Caps Lock
        _elpusk.util.keyboard.const.prototype.HIDKEY________F1			="3a";//F1
        _elpusk.util.keyboard.const.prototype.HIDKEY________F2			="3b";//F2
        _elpusk.util.keyboard.const.prototype.HIDKEY________F3			="3c";//F3
        _elpusk.util.keyboard.const.prototype.HIDKEY________F4			="3d";//F4
        _elpusk.util.keyboard.const.prototype.HIDKEY________F5			="3e";//F5
        _elpusk.util.keyboard.const.prototype.HIDKEY________F6			="3f";//F6
        _elpusk.util.keyboard.const.prototype.HIDKEY________F7			="40";//F7
        _elpusk.util.keyboard.const.prototype.HIDKEY________F8			="41";//F8
        _elpusk.util.keyboard.const.prototype.HIDKEY________F9			="42";//F19
        _elpusk.util.keyboard.const.prototype.HIDKEY_______F10			="43";//F10
        _elpusk.util.keyboard.const.prototype.HIDKEY_______F11			="44";//F11
        _elpusk.util.keyboard.const.prototype.HIDKEY_______F12			="45";//F12
        _elpusk.util.keyboard.const.prototype.HIDKEY_PRINT_SCR			="46";//Print Screen
        _elpusk.util.keyboard.const.prototype.HIDKEY_SCROLLLOC			="47";//Scroll Lock
        _elpusk.util.keyboard.const.prototype.HIDKEY_____BREAK			="48";//Break (Ctrl-Pause)
        _elpusk.util.keyboard.const.prototype.HIDKEY____INSERT			="49";//Insert
        _elpusk.util.keyboard.const.prototype.HIDKEY______HOME			="4a";//Home
        _elpusk.util.keyboard.const.prototype.HIDKEY____PAGEUP			="4b";//Page Up
        _elpusk.util.keyboard.const.prototype.HIDKEY____DELETE			="4c";//Delete
        _elpusk.util.keyboard.const.prototype.HIDKEY_______END			="4d";//End
        _elpusk.util.keyboard.const.prototype.HIDKEY__PAGEDOWN			="4e";//Page Down
        
        _elpusk.util.keyboard.const.prototype.HIDKEY_ARROW___R			="4f";//Right Arrow
        _elpusk.util.keyboard.const.prototype.HIDKEY_ARROW___L			="50";//Left Arrow
        _elpusk.util.keyboard.const.prototype.HIDKEY_ARROW___D			="51";//Down Arrow
        _elpusk.util.keyboard.const.prototype.HIDKEY_ARROW___U			="52";//Up Arrow
        
        _elpusk.util.keyboard.const.prototype.HIDKEY_KPAD__DIV			="54";//Keypad /
        _elpusk.util.keyboard.const.prototype.HIDKEY_KPAD__MUL			="55";//Keypad *
        _elpusk.util.keyboard.const.prototype.HIDKEY_KPAD_MINU			="56";//Keypad -
        _elpusk.util.keyboard.const.prototype.HIDKEY_KPAD_PLUS			="57";//Keypad +
        _elpusk.util.keyboard.const.prototype.HIDKEY_KEYPAD_EN	        ="58";//Keypad Enter
        
        _elpusk.util.keyboard.const.prototype.HIDKEY_KEYPAD__1            ="59";//Keypad 1 End
        _elpusk.util.keyboard.const.prototype.HIDKEY_KEYPAD__2            ="5a";//Keypad 2 Down
        _elpusk.util.keyboard.const.prototype.HIDKEY_KEYPAD__3            ="5b";//Keypad 3 PageDn
        _elpusk.util.keyboard.const.prototype.HIDKEY_KEYPAD__4            ="5c";//Keypad 4 Left
        _elpusk.util.keyboard.const.prototype.HIDKEY_KEYPAD__5            ="5d";//Keypad 5
        _elpusk.util.keyboard.const.prototype.HIDKEY_KEYPAD__6            ="5e";//Keypad 6 Right
        _elpusk.util.keyboard.const.prototype.HIDKEY_KEYPAD__7            ="5f";//Keypad 7 Home
        _elpusk.util.keyboard.const.prototype.HIDKEY_KEYPAD__8            ="60";//Keypad 8 Up
        _elpusk.util.keyboard.const.prototype.HIDKEY_KEYPAD__9            ="61";//Keypad 9 PageUp
        _elpusk.util.keyboard.const.prototype.HIDKEY_KEYPAD__0            ="62";//Keypad 0 Insert
        _elpusk.util.keyboard.const.prototype.HIDKEY_KPAD__DOT			="63";//Keypad . Delete
        
        
        
        /////////////////////////////////////////////////////
        //definition of key code.......  for PS/2 keyboard scancode set2
        //make code only, break code is ="f0,make-code
        //USA.......(default definition)
        
        _elpusk.util.keyboard.const.prototype.PS2_BREAK_PRFIXCODE			="f0";
        
        //control key
        _elpusk.util.keyboard.const.prototype.PS2KEY______NONE			="00";
        _elpusk.util.keyboard.const.prototype.PS2KEY_____L_CTL			="14";
        _elpusk.util.keyboard.const.prototype.PS2KEY_____L_SFT			="12";
        _elpusk.util.keyboard.const.prototype.PS2KEY_____L_ALT			="11";
        
        //_elpusk.util.keyboard.const.prototype.PS2KEY_____R_CTL			"="E0 ="14
        _elpusk.util.keyboard.const.prototype.PS2KEY_____R_CTL			="F4";	//using you must parsing data to ="E0 ="14
        _elpusk.util.keyboard.const.prototype.PS2KEY_____R_SFT			="59";
        _elpusk.util.keyboard.const.prototype.PS2KEY_____R_ALT			="F1";	//using you must parsing data to ="E0 ="11
        //_elpusk.util.keyboard.const.prototype.PS2KEY_____R_ALT			="E0 ="11
        
        //general key
        _elpusk.util.keyboard.const.prototype.PS2KEY____a____A			="1c";// a A
        _elpusk.util.keyboard.const.prototype.PS2KEY____b____B			="32";// b B
        _elpusk.util.keyboard.const.prototype.PS2KEY____c____C			="21";// c C
        _elpusk.util.keyboard.const.prototype.PS2KEY____d____D			="23";// d D
        _elpusk.util.keyboard.const.prototype.PS2KEY____e____E			="24";// e E
        _elpusk.util.keyboard.const.prototype.PS2KEY____f____F			="2b";// f F
        _elpusk.util.keyboard.const.prototype.PS2KEY____g____G			="34";// g G
        _elpusk.util.keyboard.const.prototype.PS2KEY____h____H			="33";// h H
        _elpusk.util.keyboard.const.prototype.PS2KEY____i____I			="43";// i I
        _elpusk.util.keyboard.const.prototype.PS2KEY____j____J			="3b";// j J
        _elpusk.util.keyboard.const.prototype.PS2KEY____k____K			="42";// k K
        _elpusk.util.keyboard.const.prototype.PS2KEY____l____L			="4b";// l L
        _elpusk.util.keyboard.const.prototype.PS2KEY____m____M			="3a";// m M
        _elpusk.util.keyboard.const.prototype.PS2KEY____n____N			="31";// n N
        _elpusk.util.keyboard.const.prototype.PS2KEY____o____O			="44";// o O
        _elpusk.util.keyboard.const.prototype.PS2KEY____p____P			="4d";// p P
        _elpusk.util.keyboard.const.prototype.PS2KEY____q____Q			="15";// q Q
        _elpusk.util.keyboard.const.prototype.PS2KEY____r____R			="2d";// r R
        _elpusk.util.keyboard.const.prototype.PS2KEY____s____S			="1b";// s S
        _elpusk.util.keyboard.const.prototype.PS2KEY____t____T			="2c";// t T
        _elpusk.util.keyboard.const.prototype.PS2KEY____u____U			="3c";// u U
        _elpusk.util.keyboard.const.prototype.PS2KEY____v____V			="2a";// v V
        _elpusk.util.keyboard.const.prototype.PS2KEY____w____W			="1d";// w W
        _elpusk.util.keyboard.const.prototype.PS2KEY____x____X			="22";// x X
        _elpusk.util.keyboard.const.prototype.PS2KEY____y____Y			="35";// y Y
        _elpusk.util.keyboard.const.prototype.PS2KEY____z____Z			="1a";// z Z
        _elpusk.util.keyboard.const.prototype.PS2KEY____1_EXCL			="16";// 1 ! Exclamation point
        _elpusk.util.keyboard.const.prototype.PS2KEY____2_QUOT			="1e";// 2 @ Quotation mark
        _elpusk.util.keyboard.const.prototype.PS2KEY____3_SHAR			="26";// 3 # Sharp
        _elpusk.util.keyboard.const.prototype.PS2KEY____4_DOLL			="25";// 4 $ Dollar sign
        _elpusk.util.keyboard.const.prototype.PS2KEY____5_PERC			="2e";// 5 % Percent sign
        _elpusk.util.keyboard.const.prototype.PS2KEY____6_CIRC			="36";// 6 ^ Circumflex
        _elpusk.util.keyboard.const.prototype.PS2KEY____7_AMPE			="3d";// 7 & ampersand
        _elpusk.util.keyboard.const.prototype.PS2KEY____8_ASTE			="3e";// 8 * asterisk
        _elpusk.util.keyboard.const.prototype.PS2KEY____9_L_PA			="46";// 9 ( left parenthesis
        _elpusk.util.keyboard.const.prototype.PS2KEY____0_R_PA			="45";// 0 ) right parenthesis
        _elpusk.util.keyboard.const.prototype.PS2KEY____RETURN			="5a";// Return
        _elpusk.util.keyboard.const.prototype.PS2KEY____ESCAPE			="76";// Escape
        _elpusk.util.keyboard.const.prototype.PS2KEY_BACKSPACE			="66";// Backspace
        _elpusk.util.keyboard.const.prototype.PS2KEY_______TAB			="0d";// Tab
        _elpusk.util.keyboard.const.prototype.PS2KEY_____SPACE			="29";// Space
        _elpusk.util.keyboard.const.prototype.PS2KEY_MIN_UNDER			="4e";// - _ underline
        _elpusk.util.keyboard.const.prototype.PS2KEY_EQU__PLUS			="55";// = +
        
        
        _elpusk.util.keyboard.const.prototype.PS2KEY_LBT___LBR			="54";// [ { left bracket,left brace
        _elpusk.util.keyboard.const.prototype.PS2KEY_RBT___RBR			="5b";// ] } right bracket,right brace
        _elpusk.util.keyboard.const.prototype.PS2KEY_BSLA_VBAR			="5d";// \ | back slash, vertical bar 
        _elpusk.util.keyboard.const.prototype.PS2KEY_SEMI__COL			="4c";// ; : semicolon, colon 
        _elpusk.util.keyboard.const.prototype.PS2KEY_APOS_QUOT			="52";// ' " apostrophe, Quotation mark
        _elpusk.util.keyboard.const.prototype.PS2KEY_GRAV_TILD			="0e";// ` ~ Grave, Tilde
        _elpusk.util.keyboard.const.prototype.PS2KEY_COMA___LT			="41";// , < comma, less then sign
        _elpusk.util.keyboard.const.prototype.PS2KEY_PERIOD_GT			="49";// . > period, greater then sign
        _elpusk.util.keyboard.const.prototype.PS2KEY_SLASH__QM			="4a";// / ? slash
        _elpusk.util.keyboard.const.prototype.PS2KEY__CAPSLOCK			="58";//Caps Lock
        _elpusk.util.keyboard.const.prototype.PS2KEY________F1			="05";//F1
        _elpusk.util.keyboard.const.prototype.PS2KEY________F2			="06";//F2
        _elpusk.util.keyboard.const.prototype.PS2KEY________F3			="04";//F3
        _elpusk.util.keyboard.const.prototype.PS2KEY________F4			="0c";//F4
        _elpusk.util.keyboard.const.prototype.PS2KEY________F5			="03";//F5
        _elpusk.util.keyboard.const.prototype.PS2KEY________F6			="0b";//F6
        _elpusk.util.keyboard.const.prototype.PS2KEY________F7			="83";//F7
        _elpusk.util.keyboard.const.prototype.PS2KEY________F8			="0a";//F8
        _elpusk.util.keyboard.const.prototype.PS2KEY________F9			="01";//F9
        _elpusk.util.keyboard.const.prototype.PS2KEY_______F10			="09";//F10
        _elpusk.util.keyboard.const.prototype.PS2KEY_______F11			="78";//F11
        _elpusk.util.keyboard.const.prototype.PS2KEY_______F12			="07";//F12
        //_elpusk.util.keyboard.const.prototype.PS2KEY_PRINT_SCR			//Print Screen
        _elpusk.util.keyboard.const.prototype.PS2KEY_SCROLLLOC			="7e";//Scroll Lock
        //_elpusk.util.keyboard.const.prototype.PS2KEY_____BREAK			//Break (Ctrl-Pause)
        //_elpusk.util.keyboard.const.prototype.PS2KEY____INSERT			//Insert
        //_elpusk.util.keyboard.const.prototype.PS2KEY______HOME			//Home
        //_elpusk.util.keyboard.const.prototype.PS2KEY____PAGEUP			//Page Up
        //_elpusk.util.keyboard.const.prototype.PS2KEY____DELETE			//Delete
        //_elpusk.util.keyboard.const.prototype.PS2KEY_______END			//End
        //_elpusk.util.keyboard.const.prototype.PS2KEY__PAGEDOWN			//Page Down
        
        //_elpusk.util.keyboard.const.prototype.PS2KEY_ARROW___R			//Right Arrow
        //_elpusk.util.keyboard.const.prototype.PS2KEY_ARROW___L			//Left Arrow
        //_elpusk.util.keyboard.const.prototype.PS2KEY_ARROW___D			//Down Arrow
        //_elpusk.util.keyboard.const.prototype.PS2KEY_ARROW___U			//Up Arrow
        
        //_elpusk.util.keyboard.const.prototype.PS2KEY_KPAD__DIV			//Keypad /
        _elpusk.util.keyboard.const.prototype.PS2KEY_KPAD__MUL			="7c";//Keypad *
        _elpusk.util.keyboard.const.prototype.PS2KEY_KPAD_MINU			="7b";//Keypad -
        _elpusk.util.keyboard.const.prototype.PS2KEY_KPAD_PLUS			="79";//Keypad +
        //_elpusk.util.keyboard.const.prototype.PS2KEY_KEYPAD_EN	        //Keypad Enter
        
        _elpusk.util.keyboard.const.prototype.PS2KEY_KEYPAD__1            ="69";//Keypad 1 End
        _elpusk.util.keyboard.const.prototype.PS2KEY_KEYPAD__2            ="72";//Keypad 2 Down
        _elpusk.util.keyboard.const.prototype.PS2KEY_KEYPAD__3            ="7a";//Keypad 3 PageDn
        _elpusk.util.keyboard.const.prototype.PS2KEY_KEYPAD__4            ="6b";//Keypad 4 Left
        _elpusk.util.keyboard.const.prototype.PS2KEY_KEYPAD__5            ="73";//Keypad 5
        _elpusk.util.keyboard.const.prototype.PS2KEY_KEYPAD__6            ="74";//Keypad 6 Right
        _elpusk.util.keyboard.const.prototype.PS2KEY_KEYPAD__7            ="6c";//Keypad 7 Home
        _elpusk.util.keyboard.const.prototype.PS2KEY_KEYPAD__8            ="75";//Keypad 8 Up
        _elpusk.util.keyboard.const.prototype.PS2KEY_KEYPAD__9            ="7d";//Keypad 9 PageUp
        _elpusk.util.keyboard.const.prototype.PS2KEY_KEYPAD__0            ="70";//Keypad 0 Insert
        _elpusk.util.keyboard.const.prototype.PS2KEY_KPAD__DOT			="71";//Keypad . Delete
        
        /*
        ;=============================
        ;PC to Keyboard Command Set
        ;=============================
        */
        _elpusk.util.keyboard.const.prototype.PS2_CMD_RESET				="ff";
        _elpusk.util.keyboard.const.prototype.PS2_CMD_RESEND				="fe";
        _elpusk.util.keyboard.const.prototype.PS2_CMD_SCANSET3_0			="f7";
        _elpusk.util.keyboard.const.prototype.PS2_CMD_SCANSET3_1			="f8";
        _elpusk.util.keyboard.const.prototype.PS2_CMD_SCANSET3_2			="f9";
        _elpusk.util.keyboard.const.prototype.PS2_CMD_SCANSET3_3			="fa";
        _elpusk.util.keyboard.const.prototype.PS2_CMD_SCANSET3_4			="fb";
        _elpusk.util.keyboard.const.prototype.PS2_CMD_SCANSET3_5			="fc";
        _elpusk.util.keyboard.const.prototype.PS2_CMD_SCANSET3_6			="fd";
        _elpusk.util.keyboard.const.prototype.PS2_CMD_SETDEFAULT			="f6";
        _elpusk.util.keyboard.const.prototype.PS2_CMD_DEFAULTDISABLE		="f5";
        _elpusk.util.keyboard.const.prototype.PS2_CMD_ENABLE				="f4";
        _elpusk.util.keyboard.const.prototype.PS2_CMD_SETTYPEMATICRATE	="f3";
        _elpusk.util.keyboard.const.prototype.PS2_CMD_IDBYTEREQUEST		="f2";
        _elpusk.util.keyboard.const.prototype.PS2_CMD_INVAILD				="f1";
        _elpusk.util.keyboard.const.prototype.PS2_CMD_SETSCANSET			="f0";
        _elpusk.util.keyboard.const.prototype.PS2_CMD_INVAILD0			="ef";
        _elpusk.util.keyboard.const.prototype.PS2_CMD_ECHO				="ee";
        _elpusk.util.keyboard.const.prototype.PS2_CMD_INDICATORCONTROL	="ed";
        
        /*
        ;=============================
        ;Keyboard to PC Command Set
        ;=============================
        */
        _elpusk.util.keyboard.const.prototype.PS2_RSP_ACK					="fa";
        _elpusk.util.keyboard.const.prototype.PS2_RSP_OVERRUN1			="ff";	//Mark fifo as full for Scan Set1
        _elpusk.util.keyboard.const.prototype.PS2_RSP_OVERRUN23			="ff";	//Mark fifo as full for Scan Set2,3
        _elpusk.util.keyboard.const.prototype.PS2_RSP_DIAGNOSTICFAILURE	="fc";
        _elpusk.util.keyboard.const.prototype.PS2_RSP_BREAKCODEPREFIX		="f0";
        _elpusk.util.keyboard.const.prototype.PS2_RSP_DIAGCOMPLETION		="aa";
        
        _elpusk.util.keyboard.const.prototype.PS2_KEYBOARD_ID_XX			="ab";
        _elpusk.util.keyboard.const.prototype.PS2_KEYBOARD_ID_YY			="83";
        
        _elpusk.util.keyboard.const.prototype.PS2_KEYBOARD_CUR_SCODE		="02";	//the currentm scan-code of keyboard
        
        _elpusk.util.keyboard.const.prototype.PS2_SCAN2_BREAK_PREFIX		="f0";	//the prefix code of scancode-set2 
        
        
        _elpusk.util.keyboard.const.prototype.FOR_CVT_MAX_ASCII_CODE		=130;		//covertable maximmum of ascii-code.
        
        /////////////////////////////////////////////
        // key mapping table

    }//the end of elpusk.util.keyboard


    // the end of function
    window.elpusk = _elpusk;
}(window))