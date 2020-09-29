var n_system_event = 0;
var ctl_lpu237 = null;
var n_opened_device_index = 0;
var array_device_list = [];
var startTime, endTime;
var b_updating = false;//fw updating .......

function _cb_system_event( s_action_code,s_data_field ){
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
                        n_opened_device_index = 0;
                        tools_dom_remove_connected_device_page();
                        // don't call promise function here while upates firmware.
                        // promise function will change a callback function.
                        // this will be problemed.
                        if( !b_updating )
                            tools_dom_update_device_list_with_promise( array_device_list );
                        break;//exit for
                    }
                }//end for
                
            }while(false);
            
        }
        if( s_action_code === "P"){
            //plugged in event
            ++n_system_event;
            //printMessage_pre("system event [" + n_system_event.toString() + "] : plugged in : " + s_data_field );
            tools_dom_update_device_list_with_promise( array_device_list );
            continue;
        }
        //

    }while(false);
}

function _cb_progress_get_parameters( n_device_index, n_max_stage, n_cur_stage ){
    if( n_cur_stage <= 1){
        _set_progress('id_progress_page_device',n_cur_stage,n_max_stage);
    }
    else{
        _increase_progress('id_progress_page_device');
    }
}

function _cb_progress_fw_copy( b_result , n_progress , n_fw_size, s_message){
    do{
        if( !b_result ){
            _print_message("id_p_page_device","error = " + s_message);
            continue;
        }

        var n_percentage = n_progress*100/n_fw_size;
        n_percentage.toFixed(3);

        _print_message("id_p_page_device",
            "fw offset = " + n_progress.toString() + "/" + n_fw_size.toString()
             + "( " + n_percentage.toString() +"% ) : " + s_message);

        endTime = (new Date()).getTime();
        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = n_progress * 8;
        var speedBps = (bitsLoaded / duration).toFixed(2);
        var speedKbps = (speedBps / 1024).toFixed(2);
        var speedMbps = (speedKbps / 1024).toFixed(2);
        _add_message( "id_p_page_device","Your connection speed is:" );
        _add_message( "id_p_page_device",speedBps.toString() + " bps");
        _add_message( "id_p_page_device",speedKbps + " kbps" );
        _add_message( "id_p_page_device",speedMbps + " Mbps");
        //
        if( n_progress > 0 && n_progress === n_fw_size ){
            //the end of fw copy.
            _fun_firmware_set_parameter_with_native_dialog();
        } 
    }while(false);
}   

function _cb_update_firmware( b_result , n_current_step , n_total_step, s_message){
    do{
        if( !b_result ){
            b_updating = false;
            _print_message("id_p_page_device","error = " + s_message);
            alert("error in updating the firmware.");
            continue;
        }

        if( n_total_step > 0 ){
            var n_percentage = (n_current_step+1)*100/n_total_step;
            n_percentage.toFixed(1);
            if( (n_current_step+1) === n_total_step ){
                b_updating = false;
                _print_message(
                    "id_p_page_device"
                    ,"complete update = " + n_percentage.toFixed(1).toString() + " % ( " + n_current_step.toString() + "/" + n_total_step.toString() +  " ) : " + s_message
                    );
                alert("complete firmware update.");
            }
            else{
                _print_message(
                    "id_p_page_device"
                    ,"updating = " + n_percentage.toFixed(1).toString() + " % ( " + n_current_step.toString() + "/" + n_total_step.toString() +  " ) : " + s_message
                    );
            }

            document.getElementById("id_progress_fw_update").value = n_percentage.toFixed(1);
        }

    }while(false);
}  

function init() {
    if( typeof Promise === 'undefined'){
        _add_message("id_p_page_device","none promise");
    }
    fun_init();
    // 
    console.log("the end of init");
}

function _fun_init_coffee_framework() {

    elpusk.framework.coffee.set_system_event_handler(_cb_system_event);
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
        _add_message("id_p_page_device","Not Supported File API");
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
            _print_message('id_p_page_device',"success : loading the setting file.");

        }).catch(function (event_error) {
            // error here
            _print_message('id_p_page_device', "failure : loading setting file : "+ ctl_lpu237.get_device().get_error_message(event_error));
        });

    };

    //
    document.getElementById("id_file_fw_select_updating").onclick = function () {
        this.value='';
        document.getElementById("id_progress_fw_update").value = 0;
    };
    document.getElementById("id_file_fw_select_updating").onchange = function () {
        var file = this.files[0];
        var name = file.name;
        var size = file.size;

        _print_message('id_p_page_device',"firmware file size "+size.toString()+" bytes.");
        _add_message('id_p_page_device',"firmware file size "+(size/1024).toString()+" Kbytes.");
        //
        do{
            var server = elpusk.framework.coffee.get_instance();
            var n_packet_size = 10*1024;//10K bytes 
            if( !server.file_Copy_firmware_callback(file,n_packet_size,_cb_progress_fw_copy) ){
                _add_message('id_p_page_device',"file_Copy_firmware_callback : start bERROR");
            }
            else{
                startTime = (new Date()).getTime();
                _add_message('id_p_page_device',"file_Copy_firmware_callback : start SUCCESS");
            }
        }while(false);
    };

    
}

function fun_connect(){
    var select_dev = document.getElementById("id_drop_get_device_list");
    if( select_dev.options.length <= 0 ){
        alert("none device.")
        return;//already open
    }

    if( ctl_lpu237 !== null ){
        if( ctl_lpu237.get_device().get_device_index() !== 0 ){
            alert("device already is opend.")
            return;//already open
        }
    }
        
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
        tools_dom_add_connected_device_page(ctl_lpu237);
        n_opened_device_index = ctl_lpu237.get_device().get_device_index();
        
    }).catch(
        function (event_error) {
        // error here
        _print_message('id_p_page_device', "failure : load_parameter_from_device_with_promise : "+ event_error.message);
    });    
    ;
}

function _fun_firmware_set_parameter_without_native_dialog(){
    var server = elpusk.framework.coffee.get_instance();
    var s_name = ctl_lpu237.get_device().get_name();
    server.device_update_set_parameter( n_opened_device_index,"model_name",s_name).then(function (s_rx) {
        do{
            if (!Array.isArray(s_rx)) {
                _add_message("id_p_page_device","error reponse : " + s_rx);
                continue;
            }
            if (s_rx === null) {
                _add_message("id_p_page_device","invalied response");
                continue;
            }
            else if( s_rx != "success" ){
                _add_message("id_p_page_device","device_update_set_parameter failure");
                continue;
            }
            _add_message("id_p_page_device","device_update_set_parameter success");

            
            var s_version = elpusk.util.get_version_string_from_version(ctl_lpu237.get_device().get_system_version());
            return elpusk.framework.coffee.get_instance().device_update_set_parameter( n_opened_device_index,"system_version",s_version);
        }while(false);
    }).catch(function (event_error) {
        // error here
        _add_message("id_p_page_device","fail : device_update_set_parameter send : "+ server.get_error_message(event_error));
        throw(event_error);
    })
    .then(function (s_rx) {
        do{
            if (!Array.isArray(s_rx)) {
                _add_message("id_p_page_device","error reponse : " + s_rx);
                continue;
            }
            if (s_rx === null) {
                _add_message("id_p_page_device","invalied response");
                continue;
            }
            else if( s_rx != "success" ){
                _add_message("id_p_page_device","device_update_set_parameter failure");
                continue;
            }
            _add_message("id_p_page_device","device_update_set_parameter success : version");
            return elpusk.framework.coffee.get_instance().device_update_set_parameter( n_opened_device_index,"_cf_bl_progress_","true");
        }while(false);
    }).catch(function (event_error) {
        // error here
        _add_message("id_p_page_device","fail : device_update_set_parameter version : "+ server.get_error_message(event_error));
        throw(event_error);
    })
    .then(function (s_rx) {
        do{
            if (!Array.isArray(s_rx)) {
                _add_message("id_p_page_device","error reponse : " + s_rx);
                continue;
            }
            if (s_rx === null) {
                _add_message("id_p_page_device","invalied response");
                continue;
            }
            else if( s_rx != "success" ){
                _add_message("id_p_page_device","device_update_set_parameter failure");
                continue;
            }
            _add_message("id_p_page_device","device_update_set_parameter success : _cf_bl_progress_");

            _fun_firmware_update();//start update.
        }while(false);
    }).catch(function (event_error) {
        // error here
        _add_message("id_p_page_device","fail : device_update_set_parameter _cf_bl_progress_ : "+ server.get_error_message(event_error));
    })
    ;
}

function _fun_firmware_set_parameter_with_native_dialog(){
    var server = elpusk.framework.coffee.get_instance();
    var s_name = ctl_lpu237.get_device().get_name();
    server.device_update_set_parameter( n_opened_device_index,"model_name",s_name).then(function (s_rx) {
        do{
            if (!Array.isArray(s_rx)) {
                _add_message("id_p_page_device","error reponse : " + s_rx);
                continue;
            }
            if (s_rx === null) {
                _add_message("id_p_page_device","invalied response");
                continue;
            }
            else if( s_rx != "success" ){
                _add_message("id_p_page_device","device_update_set_parameter failure");
                continue;
            }
            _add_message("id_p_page_device","device_update_set_parameter success");
            var s_version = elpusk.util.get_version_string_from_version(ctl_lpu237.get_device().get_system_version());
            return elpusk.framework.coffee.get_instance().device_update_set_parameter( n_opened_device_index,"system_version",s_version);
        }while(false);
    }).catch(function (event_error) {
        // error here
        _add_message("id_p_page_device","fail : device_update_set_parameter send : "+ server.get_error_message(event_error));
        throw(event_error);
    })
    .then(function (s_rx) {
        do{
            if (!Array.isArray(s_rx)) {
                _add_message("id_p_page_device","error reponse : " + s_rx);
                continue;
            }
            if (s_rx === null) {
                _add_message("id_p_page_device","invalied response");
                continue;
            }
            else if( s_rx != "success" ){
                _add_message("id_p_page_device","device_update_set_parameter failure");
                continue;
            }
            _add_message("id_p_page_device","device_update_set_parameter success : version");
            return elpusk.framework.coffee.get_instance().device_update_set_parameter( n_opened_device_index,"_cf_bl_progress_","true");
        }while(false);
    }).catch(function (event_error) {
        // error here
        _add_message("id_p_page_device","fail : device_update_set_parameter version : "+ server.get_error_message(event_error));
        throw(event_error);
    })
    .then(function (s_rx) {
        do{
            if (!Array.isArray(s_rx)) {
                _add_message("id_p_page_device","error reponse : " + s_rx);
                continue;
            }
            if (s_rx === null) {
                _add_message("id_p_page_device","invalied response");
                continue;
            }
            else if( s_rx != "success" ){
                _add_message("id_p_page_device","device_update_set_parameter failure");
                continue;
            }
            _add_message("id_p_page_device","device_update_set_parameter success : _cf_bl_progress_");
            return elpusk.framework.coffee.get_instance().device_update_set_parameter( n_opened_device_index,"_cf_bl_window_","true");
        }while(false);
    }).catch(function (event_error) {
        // error here
        _add_message("id_p_page_device","fail : device_update_set_parameter _cf_bl_progress_ : "+ server.get_error_message(event_error));
        throw(event_error);
    })
    .then(function (s_rx) {
        do{
            if (!Array.isArray(s_rx)) {
                _add_message("id_p_page_device","error reponse : " + s_rx);
                continue;
            }
            if (s_rx === null) {
                _add_message("id_p_page_device","invalied response");
                continue;
            }
            else if( s_rx != "success" ){
                _add_message("id_p_page_device","device_update_set_parameter failure");
                continue;
            }
            _add_message("id_p_page_device","device_update_set_parameter success : _cf_bl_window_");
            _fun_firmware_update();//start update.
        }while(false);
    }).catch(function (event_error) {
        // error here
        _add_message("id_p_page_device","fail : device_update_set_parameter _cf_bl_window_ : "+ server.get_error_message(event_error));
    })
    ;
}


function _fun_firmware_update(){

    document.getElementById("id_progress_fw_update").value = 0;

    var server = elpusk.framework.coffee.get_instance();
    if( server.device_update_start_with_callback(n_opened_device_index,0,0,_cb_update_firmware) ){
        b_updating = true;
        _add_message("id_p_page_device","success : device_update_start_with_callback");
    }
    else{
        _add_message("id_p_page_device","fail : device_update_start_with_callback.");
    }
}

