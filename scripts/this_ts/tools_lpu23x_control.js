var g_n_system_event = 0;
var g_ctl_lpu237 = null;
var g_n_opened_device_index = 0;
var g_array_device_list = [];
var g_time_start, g_time_end;
var g_b_updating = false;//fw updating .......
var g_file_rom = null;
var g_n_cnt_read_msr = 0;
var g_n_cnt_read_ibutton = 0;

export function _cb_system_event( s_action_code,s_data_field ){
    do{
        if( typeof s_action_code === 'undefined'){
            continue;
        }

        if( s_action_code === "c"){
            //removed event
            ++g_n_system_event;
            
            do{
                if( s_data_field.length <= 0 ){
                    continue;
                }
                if( !g_ctl_lpu237 ){
                    continue;
                }
                if( !g_ctl_lpu237.get_device() ){
                    continue;
                }

                for( var i = 0; i<s_data_field.length; i++  ){
                    if( g_ctl_lpu237.get_device().get_path() === s_data_field[i] ){
                        //remove object
                        g_ctl_lpu237 = null;
                        g_n_opened_device_index = 0;
                        tools_dom_remove_connected_device_page();
                        // don't call promise function here while upates firmware.
                        // promise function will change a callback function.
                        // this will be problemed.
                        if( !g_b_updating )
                            tools_dom_update_device_list_with_promise( g_array_device_list );
                        break;//exit for
                    }
                }//end for
                
            }while(false);
            
        }
        if( s_action_code === "P"){
            //plugged in event
            ++g_n_system_event;
            //printMessage_pre("system event [" + g_n_system_event.toString() + "] : plugged in : " + s_data_field );
            tools_dom_update_device_list_with_promise( g_array_device_list );
            continue;
        }
        //

    }while(false);
}

export function _cb_progress_get_parameters( n_device_index, n_max_stage, n_cur_stage ){
    if( n_cur_stage <= 1){
        _set_progress('id_progress_page_device',n_cur_stage,n_max_stage);
    }
    else{
        _increase_progress('id_progress_page_device');
    }
}

export function _cb_progress_set_parameters( n_device_index, n_max_stage, n_cur_stage ){
    if( n_cur_stage <= 1){
        _set_progress('id_progress_page_device',n_cur_stage,n_max_stage);
    }
    else{
        _increase_progress('id_progress_page_device');
    }
}

export function _cb_progress_fw_copy( b_result , n_progress , n_fw_size, s_message){
    do{
        if( !b_result ){
            if( s_message == "file_firmware_create"){
                //temp firmware creation failure.
                var checkbox_remove_fw = document.getElementById("id_checkbox_auto_remove_fw");
                if( checkbox_remove_fw.checked ){
                    //retry after delete file.
                    _fun_firmware_update_after_delete_firmware(g_file_rom);
                    continue;
                }
            }
            _print_message("id_p_page_device","error = " + s_message);
            //remove
            continue;
        }

        var n_percentage = n_progress*100/n_fw_size;
        n_percentage.toFixed(3);

        _print_message("id_p_page_device",
            "fw offset = " + n_progress.toString() + "/" + n_fw_size.toString()
             + "( " + n_percentage.toString() +"% ) : " + s_message);

        g_time_end = (new Date()).getTime();
        var duration = (g_time_end - g_time_start) / 1000;
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
            var checkbox_display_updater_ui = document.getElementById("id_checkbox_display_updater_ui");
            if( checkbox_display_updater_ui.checked ){
                _fun_firmware_set_parameter_with_native_dialog();
            }
            else{
                _fun_firmware_set_parameter_without_native_dialog();
            }
        } 
    }while(false);
}   

export function _cb_update_firmware( b_result , n_current_step , n_total_step, s_message){
    do{
        if( !b_result ){
            g_b_updating = false;
            _print_message("id_p_page_device","error = " + s_message);
            alert("error in updating the firmware.");
            continue;
        }

        if( n_total_step > 0 ){
            var n_percentage = (n_current_step+1)*100/n_total_step;
            n_percentage.toFixed(1);
            if( (n_current_step+1) === n_total_step ){
                g_b_updating = false;
                _print_message(
                    "id_p_page_device"
                    ,"complete update = " + n_percentage.toFixed(1).toString() + " % ( " + (n_current_step+1).toString() + "/" + n_total_step.toString() +  " ) : " + s_message
                    );
                alert("complete firmware update.");
            }
            else{
                _print_message(
                    "id_p_page_device"
                    ,"updating = " + n_percentage.toFixed(1).toString() + " % ( " + (n_current_step+1).toString() + "/" + n_total_step.toString() +  " ) : " + s_message
                    );
            }

            document.getElementById("id_progress_fw_update").value = n_percentage.toFixed(1);
        }

    }while(false);
}  

/////////////////////////////////////////////////////////////////////
// callback function for reading card.

/**
 * @function _cb_read_msr_done
 * @parameter {number} n_device_index the index value of device on coffee framework.
 * <br /> this value is equal to g_ctl_lpu237.get_device().get_device_index()
 * @parameter {string} s_msg always "success". therefore, you can ignore this.
 * @description callback function of g_ctl_lpu237.read_card_from_device_with_callback().
 * <br /> this function announce that a card is reading done.
 * <br /> called by controller.(g_ctl_lpu237)
 */
export function _cb_read_msr_done( n_device_index, s_msg ){
    //s_msg always "success"
    g_n_cnt_read_msr++;
    _print_message("id_p_page_device_ms_ibutton_data",g_n_cnt_read_msr + " CB : card data");

    //all card track reading
    for( var i = 0; i<3; i++ ){
        //check whether or not each track is error. 
        if( g_ctl_lpu237.get_device().get_msr_error_code(i) !== 0 ){
            //track is error. dispaly error code.
            _add_message("id_p_page_device_ms_ibutton_data","error : " + String(g_ctl_lpu237.get_device().get_msr_error_code(i)));
            continue;
        }

        //get a track data.
        var s_card = g_ctl_lpu237.get_device().get_msr_data(i);
        if( s_card.length == 0 ){
            _add_message("id_p_page_device_ms_ibutton_data","none data");
        }
        else{
            _add_message("id_p_page_device_ms_ibutton_data",g_ctl_lpu237.get_device().get_msr_data(i));
        }
    }

    //clear card data of contoller.
    g_ctl_lpu237.get_device().reset_msr_data();
}


/**
 * @function _cb_read_ibutton_done
 * @parameter {number} n_device_index the index value of device on coffee framework.
 * <br /> this value is equal to g_ctl_lpu237.get_device().get_device_index()
 * @parameter {string} s_msg always "success". therefore, you can ignore this.
 * @description callback function of g_ctl_lpu237.read_ibutton_from_device_with_callback().
 * <br /> this function announce that a ibutton is reading done.
 * <br /> called by controller.(g_ctl_lpu237)
 */
export function _cb_read_ibutton_done( n_device_index, s_msg ){
    //s_msg always "success"
    g_n_cnt_read_ibutton++;
    _print_message("id_p_page_device_ms_ibutton_data",g_n_cnt_read_ibutton + " CB : ibutton data");

    //check whether or not ibutton is error. 
    if( g_ctl_lpu237.get_device().get_ibutton_error_code() !== 0 ){
        //ibutton is error. dispaly error code.
        _add_message("id_p_page_device_ms_ibutton_data","error : " + String(g_ctl_lpu237.get_device().get_ibutton_error_code()));
    }

    //get a ibutton data.
    var s_card = g_ctl_lpu237.get_device().get_ibutton_data();
    if( s_card.length == 0 ){
        _add_message("id_p_page_device_ms_ibutton_data","none data");
    }
    else{
        _add_message("id_p_page_device_ms_ibutton_data",g_ctl_lpu237.get_device().get_ibutton_data());
    }

    //clear card data of contoller.
    g_ctl_lpu237.get_device().reset_ibutton_data();
}

/**
 * @function _cb_msr_read_error
 * @parameter {number} n_device_index the index value of device on coffee framework.
 * <br /> this value is equal to g_ctl_lpu237.get_device().get_device_index()
 * @parameter {object} event_error Event object.
 * @description error callback function of g_ctl_lpu237.read_card_from_device_with_callback().
 * <br /> this function announce that a error is occured.
 * <br /> this error is coffee framework error or protocol error.
 * <br /> called by controller.(g_ctl_lpu237)
 */        
export function _cb_msr_read_error( n_device_index,event_error){
    _add_message("id_p_page_device_ms_ibutton_data","CB : Error : read msr : "+ event_error.message);
}

/**
 * @function _cb_ibutton_read_error
 * @parameter {number} n_device_index the index value of device on coffee framework.
 * <br /> this value is equal to g_ctl_lpu237.get_device().get_device_index()
 * @parameter {object} event_error Event object.
 * @description error callback function of g_ctl_lpu237.read_ibutton_from_device_with_callback().
 * <br /> this function announce that a error is occured.
 * <br /> this error is coffee framework error or protocol error.
 * <br /> called by controller.(g_ctl_lpu237)
 */        
export function _cb_ibutton_read_error( n_device_index,event_error){
    _add_message("id_p_page_device_ms_ibutton_data","CB : Error : read ibutton : "+ event_error.message);
}

/**
 * @function _cb_stop_msr_done
 * @parameter {number} n_device_index the index value of device on coffee framework.
 * <br /> this value is equal to g_ctl_lpu237.get_device().get_device_index()
 * @parameter {string} s_msg always "success". therefore, you can ignore this.
 * @description callback function of g_ctl_lpu237.read_card_from_device_with_callback().
 * <br /> this function announce that device(lpu237) will ignore a card data.
 * <br /> called by controller.(g_ctl_lpu237)
 */
export function _cb_stop_msr_done( n_device_index,s_msg ){
    //s_msg always "success"
    _add_message("id_p_page_device_ms_ibutton_data","CB : cancel msr : "+s_msg);
}

/**
 * @function _cb_stop_ibutton_done
 * @parameter {number} n_device_index the index value of device on coffee framework.
 * <br /> this value is equal to g_ctl_lpu237.get_device().get_device_index()
 * @parameter {string} s_msg always "success". therefore, you can ignore this.
 * @description callback function of g_ctl_lpu237.read_ibutton_from_device_with_callback().
 * <br /> this function announce that device(lpu237) will ignore a card data.
 * <br /> called by controller.(g_ctl_lpu237)
 */
export function _cb_stop_ibutton_done( n_device_index,s_msg ){
    //s_msg always "success"
    _add_message("id_p_page_device_ms_ibutton_data","CB : cancel ibutton : "+s_msg);
}

/**
 * @function _cb_stop_msr_error
 * @parameter {number} n_device_index the index value of device on coffee framework.
 * <br /> this value is equal to g_ctl_lpu237.get_device().get_device_index()
 * @parameter {object} event_error Event object.
 * @description error callback function of g_ctl_lpu237.read_card_from_device_with_callback().
 * <br /> this error is coffee framework error or protocol error.
 * <br /> called by controller.(g_ctl_lpu237)
 */        
export function _cb_stop_msr_error(n_device_index,event_error){
    _add_message("id_p_page_device_ms_ibutton_data","CB : cancel : error msr : "+ event_error.message);
}

/**
 * @function _cb_stop_ibutton_error
 * @parameter {number} n_device_index the index value of device on coffee framework.
 * <br /> this value is equal to g_ctl_lpu237.get_device().get_device_index()
 * @parameter {object} event_error Event object.
 * @description error callback function of g_ctl_lpu237.read_ibutton_from_device_with_callback().
 * <br /> this error is coffee framework error or protocol error.
 * <br /> called by controller.(g_ctl_lpu237)
 */        
export function _cb_stop_ibutton_error(n_device_index,event_error){
    _add_message("id_p_page_device_ms_ibutton_data","CB : cancel : error ibutton : "+ event_error.message);
}

export function init() {
    if( typeof Promise === 'undefined'){
        _add_message("id_p_page_device","none promise");
    }
    fun_init();
    // 
    console.log("the end of init");
}

export function _fun_init_coffee_framework() {

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
    g_array_device_list.length = 0;

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
                var g_array_device_list = new Array();
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

export function fun_init() {

    _fun_init_coffee_framework();

    if(!(File && FileReader && FileList && Blob)) {
        _add_message("id_p_page_device","Not Supported File API");
    }
    
    // select setting file
    document.getElementById("id_file_select_setting").onclick = function () {
        this.value='';
        document.getElementById("id_lable_progress_page_device").textContent = "loading system parameters file : ";
    };
    document.getElementById("id_file_select_setting").onchange = function () {
        var file = this.files[0];
        var name = file.name;
        var size = file.size;
        //
        g_ctl_lpu237.get_device().set_from_file(file).then(function (b_result) {
            //alway true.
            _print_message('id_p_page_device',"success : loading the setting file.");
            document.getElementById("id_lable_progress_page_device").textContent = "saving system parameters : ";

            _fun_set_parameter_by_setting_file();
        }).catch(function (event_error) {
            // error here
            _print_message('id_p_page_device', "failure : loading setting file : "+ g_ctl_lpu237.get_device().get_error_message(event_error));
        });

    };

    // select firmware rom file.
    document.getElementById("id_file_fw_select_updating").onclick = function () {
        g_file_rom = null;
        this.value='';
        document.getElementById("id_progress_fw_update").value = 0;
    };
    document.getElementById("id_file_fw_select_updating").onchange = function () {
        g_file_rom = this.files[0];
        _fun_firmware_file_copy(g_file_rom);
    };

    
}

export function fun_connect(){
    var select_dev = document.getElementById("id_drop_get_device_list");
    if( select_dev.options.length <= 0 ){
        alert("none device.")
        return;//already open
    }

    if( g_ctl_lpu237 !== null ){
        if( g_ctl_lpu237.get_device().get_device_index() !== 0 ){
            alert("device already is opend.")
            return;//already open
        }
    }
        
    var s_device_path = select_dev.options[select_dev.selectedIndex].text;

    var b_device_is_composite = false;
    if(/^(switch|scr)\d+$|msr$|ibutton$/.test(s_device_path)){
        b_device_is_composite = true;
    }

    g_ctl_lpu237 = new elpusk.framework.coffee.ctl_lpu237(
        elpusk.framework.coffee.get_instance()
        ,new elpusk.device.usb.hid.lpu237(s_device_path) 
    );
    console.log("create device controller : "+g_ctl_lpu237.toString());

    g_ctl_lpu237.open_with_promise()
    .then(
        function( s_message ){
            //s_message is always "success"
            _print_message('id_p_page_device'," the connected : "+g_ctl_lpu237.get_device().get_path());
            _add_message('id_p_page_device'," device index : "+g_ctl_lpu237.get_device().get_device_index());

            if(b_device_is_composite){
                return g_ctl_lpu237.load_min_parameter_from_device_with_promise(_cb_progress_get_parameters)
            }
            else{
                return g_ctl_lpu237.load_all_parameter_from_device_with_promise(_cb_progress_get_parameters);
            }
        }
    )
    .catch(
        function(event_error){
            _print_message('id_p_page_device', "failure : open_with_promise : "+ g_ctl_lpu237.get_device().get_error_message(event_error));
            throw(event_error);
        }
    )
    .then(function (s_message) {
        tools_dom_add_connected_device_page(g_ctl_lpu237,b_device_is_composite);
        g_n_opened_device_index = g_ctl_lpu237.get_device().get_device_index();
        document.getElementById("id_lable_progress_page_device").textContent = "complete loading system parameters : ";
    }).catch(
        function (event_error) {
        // error here
        _print_message('id_p_page_device', "failure : load_all_parameter_from_device_with_promise : "+ event_error.message);
    });    
    ;
}

export function fun_load_system_parameters(){

    document.getElementById("id_lable_progress_page_device").textContent = "loading system parameters : ";

    tools_dom_remove_connected_device_page();

    const startTime = performance.now(); // Capture start time

    g_ctl_lpu237.load_all_parameter_from_device_with_promise(_cb_progress_get_parameters).then(function (s_message) {
        const endTime = performance.now(); // Capture end time
        const duration = (endTime - startTime).toFixed(2); // Calculate duration in milliseconds

        tools_dom_add_connected_device_page(g_ctl_lpu237,false); // for primitive device.
        document.getElementById("id_lable_progress_page_device").textContent = `complete loading system parameters (${duration}mmsec) : `;
    }).catch(
        function (event_error) {
        // error here
        _print_message('id_p_page_device', "failure : load_all_parameter_from_device_with_promise : "+ event_error.message);
    });    
}

export function _fun_firmware_set_parameter_without_native_dialog(){
    var server = elpusk.framework.coffee.get_instance();
    var s_name = g_ctl_lpu237.get_device().get_name();
    server.device_update_set_parameter( g_n_opened_device_index,"model_name",s_name).then(function (s_rx) {
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

            
            var s_version = elpusk.util.get_version_string_from_version(g_ctl_lpu237.get_device().get_system_version());
            return elpusk.framework.coffee.get_instance().device_update_set_parameter( g_n_opened_device_index,"system_version",s_version);
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
            return elpusk.framework.coffee.get_instance().device_update_set_parameter( g_n_opened_device_index,"_cf_bl_progress_","true");
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
            return elpusk.framework.coffee.get_instance().device_update_set_parameter( g_n_opened_device_index,"_cf_bl_window_","false");
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

export function _fun_firmware_set_parameter_with_native_dialog(){
    var server = elpusk.framework.coffee.get_instance();
    var s_name = g_ctl_lpu237.get_device().get_name();
    server.device_update_set_parameter( g_n_opened_device_index,"model_name",s_name).then(function (s_rx) {
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
            var s_version = elpusk.util.get_version_string_from_version(g_ctl_lpu237.get_device().get_system_version());
            return elpusk.framework.coffee.get_instance().device_update_set_parameter( g_n_opened_device_index,"system_version",s_version);
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
            return elpusk.framework.coffee.get_instance().device_update_set_parameter( g_n_opened_device_index,"_cf_bl_progress_","true");
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
            return elpusk.framework.coffee.get_instance().device_update_set_parameter( g_n_opened_device_index,"_cf_bl_window_","true");
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

export function _fun_firmware_file_copy(file_fw){
    var name = file_fw.name;
    var size = file_fw.size;

    _print_message('id_p_page_device',"firmware file size "+size.toString()+" bytes.");
    _add_message('id_p_page_device',"firmware file size "+(size/1024).toString()+" Kbytes.");
    //
    do{
        var server = elpusk.framework.coffee.get_instance();
        var n_packet_size = 10*1024;//10K bytes 
        if( !server.file_Copy_firmware_callback(file_fw,n_packet_size,_cb_progress_fw_copy) ){
            _add_message('id_p_page_device',"file_Copy_firmware_callback : start bERROR");
        }
        else{
            g_time_start = (new Date()).getTime();
            _add_message('id_p_page_device',"file_Copy_firmware_callback : start SUCCESS");
        }
    }while(false);
}

export function _fun_firmware_update(){

    document.getElementById("id_progress_fw_update").value = 0;

    var server = elpusk.framework.coffee.get_instance();
    if( server.device_update_start_with_callback(g_n_opened_device_index,0,0,_cb_update_firmware) ){
        g_b_updating = true;
        _add_message("id_p_page_device","success : device_update_start_with_callback");
    }
    else{
        _add_message("id_p_page_device","fail : device_update_start_with_callback.");
    }
}

export function _fun_firmware_update_after_delete_firmware( file ){
    var server = elpusk.framework.coffee.get_instance();
    server.file_firmware_delete().then(function (s_rx) {
        do{
            if (!Array.isArray(s_rx)) {
                _add_message("id_p_page_device","erro reponse : " + s_rx);
                continue;
            }
            if (s_rx === null) {
                _add_message("id_p_page_device","invalied reponse");
                continue;
            }
            else if( s_rx != "success" ){
                _add_message("id_p_page_device","firmware delete failure :");
                continue;
            }
            _add_message("id_p_page_device","firmware delete success.");
            _fun_firmware_file_copy(g_file_rom);

        }while(false);
    }).catch(function (event_error) {
        // error here
        _add_message("id_p_page_device","fail : delete : "+ server.get_error_message(event_error));
    });

}

export function _fun_set_parameter_by_setting_file(){
    g_ctl_lpu237.save_parameter_to_device_with_promise(_cb_progress_set_parameters).then(function (s_message) {
        //s_message always "success".
        document.getElementById("id_lable_progress_page_device").textContent = "complete saving system parameters : ";
        _add_message("id_p_page_device","success : _fun_set_parameter_by_setting_file");

        alert(g_ctl_lpu237.get_device().get_string());

        var b_reload = confirm("Would you reload the system parameters?");
        if( b_reload ){
            fun_load_system_parameters();
        }
    }).catch(function (event_error) {
        // error here
        _add_message("id_p_page_device","fail : _fun_set_parameter_by_setting_file : "+ event_error.message);
    });

}

/**
 * @function fun_enable_msr_read_with_callback
 * @description button handler of id = button_enable_msr_read_with_callback.
 * <br /> th status of lpu237 device change to "reading card" mode.
 */
export function fun_enable_msr_read_with_callback(){
    if( g_ctl_lpu237.read_card_from_device_with_callback(true,_cb_read_msr_done,_cb_msr_read_error) ){
        _print_message("id_p_page_device_ms_ibutton_data","ready : waits reading.");
    }
    else{
        _print_message("id_p_page_device_ms_ibutton_data","not ready : failure.");
    }
}

/**
 * @function fun_disable_msr_read_with_callback
 * @description button handler of id = button_disable_msr_read_with_callback.
 * <br /> th status of lpu237 device change to "ignoring card" mode.
 */
export function fun_disable_msr_read_with_callback(){
    if( g_ctl_lpu237.read_card_from_device_with_callback(false,_cb_stop_msr_done,_cb_stop_msr_error) ){
        _print_message("id_p_page_device_ms_ibutton_data","ok : cancel.");
    }
    else{
        _print_message("id_p_page_device_ms_ibutton_data","error : cancel.");
    }
}

/**
 * @function fun_enable_ibutton_read_with_callback
 * @description button handler of id = button_enable_ibutton_read_with_callback.
 * <br /> th status of lpu237 device change to "reading card" mode.
 */
export function fun_enable_ibutton_read_with_callback(){
    if( g_ctl_lpu237.read_ibutton_from_device_with_callback(true,_cb_read_ibutton_done,_cb_ibutton_read_error) ){
        _print_message("id_p_page_device_ms_ibutton_data","ready : waits reading.");
    }
    else{
        _print_message("id_p_page_device_ms_ibutton_data","not ready : failure.");
    }
}

/**
 * @function fun_disable_ibutton_read_with_callback
 * @description button handler of id = button_disable_ibutton_read_with_callback.
 * <br /> th status of lpu237 device change to "ignoring card" mode.
 */
export function fun_disable_ibutton_read_with_callback(){
    if( g_ctl_lpu237.read_ibutton_from_device_with_callback(false,_cb_stop_ibutton_done,_cb_stop_ibutton_error) ){
        _print_message("id_p_page_device_ms_ibutton_data","ok : cancel.");
    }
    else{
        _print_message("id_p_page_device_ms_ibutton_data","error : cancel.");
    }
}
export function fun_save_to_sessionStorage(){
    g_ctl_lpu237.get_device().save_to_sessionStorage();
}

export function fun_set_from_sessionStorage(){
    g_ctl_lpu237.get_device().set_from_sessionStorage();
}        