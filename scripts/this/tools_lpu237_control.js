var n_system_event = 0;
var ctl_lpu237 = null;
var array_device_list = [];

function cb_system_event( s_action_code,s_data_field ){
    do{
        if( typeof s_action_code === 'undefined'){
            continue;
        }

        if( s_action_code === "c"){
            //removed event
            ++n_system_event;
            
            do{
                if( s_data_field.length <= 0 ){
                    continue;
                }
                if( !ctl_lpu237 ){
                    continue;
                }
                if( !ctl_lpu237.get_device() ){
                    continue;
                }

                for( var i = 0; i<s_data_field.length; i++  ){

                    if( ctl_lpu237.get_device().get_path() === s_data_field[i] ){
                        //remove object
                        ctl_lpu237 = null;
                        //printMessage_pre("system event [" + n_system_event.toString() + "] : removed." + s_data_field[i] );
                        document.getElementById("id_file_select_setting").disabled = true;
                        document.getElementById("id_button_connect").disabled = false;
                
                        break;//exit for
                    }
                }//end for
                
            }while(false);
        }
        if( s_action_code === "P"){
            //plugged in event
            ++n_system_event;
            printMessage_pre("system event [" + n_system_event.toString() + "] : plugged in : " + s_data_field );
            continue;
        }
        //

    }while(false);
}

function init() {
    if( typeof Promise === 'undefined'){
        addMessage("none promise");
    }
    fun_init();
    // 
    console.log("the end of init");
}

function _fun_init_coffee_framework() {

    elpusk.framework.coffee.set_system_event_handler(cb_system_event);
    //
    var device = new elpusk.device("device");
    var usb = new elpusk.device.usb("usb");
    var hid = new elpusk.device.usb.hid("hid");

    console.log(device);
    console.log(usb);
    console.log(hid);

    console.log(device.get_path());
    console.log(usb.get_path());
    console.log(hid.get_path());

    //
    array_device_list.length = 0;

    var server = elpusk.framework.coffee.get_instance();

    server.connect("wss","443").then(
        function(s_session_number){
            console.log("session : " + s_session_number);
            return elpusk.framework.coffee.get_instance().get_device_list("hid#vid_134b&pid_0206&mi_01");
        }
    )
    .catch(
        function(event_error){
            console.log("connect : " + event_error);
            throw(event_error);
        }
    )
    .then(
        function(s_rx){
            var select_dev = document.getElementById("id_drop_get_device_list");
            var length = select_dev.options.length;
            for (var i = length - 1; i >= 0; i--) {
                select_dev.options[i] = null;
            }

            if (Array.isArray(s_rx)) {
                var array_device_list = new Array();
                var n_device = s_rx.length;
                for (var n_device_index = 0; n_device_index < n_device; n_device_index++) {
                    var option = document.createElement('option');
                    option.value = n_device_index;
                    option.text = s_rx[n_device_index];
                    select_dev.add(option, 0);
                }

            }
            else {
                if (s_rx === null) {
                    _print_message('id_p_page_device',"none device.");
                }
                else {
                    _print_message('id_p_page_device',"error response : " + s_rx);
                }
            }
        }
    )
    .catch(
        function(event_error){
            _print_message('id_p_page_device',"error response : " + event_error);
            console.log("get device list : "+event_error);
        }
    );
}


function fun_init() {

    _fun_init_coffee_framework();

    if(!(File && FileReader && FileList && Blob)) {
        addMessage("Not Supported File API");
    }
    
    //
    document.getElementById("id_file_select_setting").onclick = function () {
        this.value='';
    };

    document.getElementById("id_file_select_setting").onchange = function () {
        var file = this.files[0];
        var name = file.name;
        var size = file.size;
        //
        ctl_lpu237.get_device().set_from_file(file).then(function (b_result) {
            //alway true.
            clearMessage();
            _print_message('id_p_page_device',"success : loading the setting file.");
            //addMessage( ctl_lpu237.get_device().get_string_html_table() );
            //addMultiMessage(ctl_lpu237.get_device().get_string());

        }).catch(function (event_error) {
            // error here
            _print_message('id_p_page_device', "failure : loading setting file : "+ ctl_lpu237.get_device().get_error_message(event_error));
        });

    };
    
}

function fun_connect(){
    if( ctl_lpu237 !== null ){
        if( ctl_lpu237.get_device().get_device_index() !== 0 ){
            alert("device already is opend.")
            return;//already open
        }
    }
    var select_dev = document.getElementById("id_drop_get_device_list");
    var s_device_path = select_dev.options[select_dev.selectedIndex].text;

    ctl_lpu237 = new elpusk.framework.coffee.ctl_lpu237(
        elpusk.framework.coffee.get_instance()
        ,new elpusk.device.usb.hid.lpu237(s_device_path) 
    );
    console.log("create device controller : "+ctl_lpu237.toString());

    ctl_lpu237.open_with_promise()
    .then(
        function( s_message ){
            //s_message is always "success"
            _print_message('id_p_page_device'," the connected : "+ctl_lpu237.get_device().get_path());
            _add_message('id_p_page_device'," device index : "+ctl_lpu237.get_device().get_device_index());

            return ctl_lpu237.load_parameter_from_device_with_promise(_cb_progress_get_parameters);
        }
    )
    .catch(
        function(event_error){
            _print_message('id_p_page_device', "failure : open_with_promise : "+ ctl_lpu237.get_device().get_error_message(event_error));
            throw(event_error);
        }
    )
    .then(function (s_message) {
        //addMessage( ctl_lpu237.get_device().get_string_html_table() );
        //addMultiMessage( ctl_lpu237.get_device().get_string() );
        //addMessage("0x"+ctl_lpu237.get_device().get_tag_by_ascii_hex_string(ctl_lpu237.get_device().get_private_prefix(0)));
        //addMessage(ctl_lpu237.get_device().get_tag_by_ascii_string(ctl_lpu237.get_device().get_private_prefix(0)));
        document.getElementById("id_file_select_setting").disabled = false;
        document.getElementById("id_button_connect").disabled = true;;

        tools_dom_add_connected_device_page();
        _print_message("id_system",ctl_lpu237.get_device().get_string_html_table("system"));
        _print_message("id_iso1",ctl_lpu237.get_device().get_string_html_table("iso1"));
        _print_message("id_iso2",ctl_lpu237.get_device().get_string_html_table("iso2"));
        _print_message("id_iso3",ctl_lpu237.get_device().get_string_html_table("iso3"));

        var tables = document.getElementsByTagName("table");
        var n_max_height = 0;
        var n_height = 0;
        var page_id = ['id_system','id_iso1','id_iso2','id_iso3']

        for( var i = 0; i<tables.length; i++ ){
            document.getElementById(page_id[i]).style.display = 'block';
            n_height = tables[i].offsetHeight;
            if( n_height > n_max_height){
                n_max_height = n_height;
            }
            document.getElementById(page_id[i]).style.display = 'none';
        }//end for

        if( n_max_height >0 ){
            var _tab_content  = document.getElementsByClassName("tabcontent");
            for( var i = 0; i<_tab_content.length; i++ ){
                _tab_content[i].style.height = n_max_height.toString()+"px";
            }//end for

            var _tab  = document.getElementsByClassName("tab");
            for( var i = 0; i<_tab.length; i++ ){
                _tab[i].style.height = n_max_height.toString()+"px";
            }//end for
        }

    }).catch(
        function (event_error) {
        // error here
        _print_message('id_p_page_device', "failure : load_parameter_from_device_with_promise : "+ event_error.message);
    });    
    ;
}

function _cb_progress_get_parameters( n_device_index, n_max_stage, n_cur_stage ){
    if( n_cur_stage <= 1){
        _set_progress('id_progress_page_device',n_cur_stage,n_max_stage);
    }
    else{
        _increase_progress('id_progress_page_device');
    }
}
