var g_n_system_event = 0;

function sd_emv_cb_system_event(s_action_code, s_data_field) {
    do {
        if (typeof s_action_code === 'undefined') {
            continue;
        }

        if (s_action_code === "c") {
            //removed event
            ++g_n_system_event;
            addMessage_pre("system event [" + g_n_system_event.toString() + "] : removed : " + s_data_field);
            continue;
        }
        if (s_action_code === "P") {
            //plugged in event
            ++g_n_system_event;
            addMessage_pre("system event [" + g_n_system_event.toString() + "] : plugged in : " + s_data_field);
            continue;
        }
        if (s_action_code === "A") {
            //send data to session of advance operation.
            addMessage_pre("system event [" + g_n_system_event.toString() + "] : advance operation : " + s_data_field);
            continue;
        }
        //

    } while (false);
}

var g_dev_path = "";
var g_emv_terminal;

function sd_emv_ini_server() {

    elpusk.framework.coffee.set_system_event_handler(sd_emv_cb_system_event);
    //
    var device = new elpusk.device("device");
    var usb = new elpusk.device.usb("usb");
    var hid = new elpusk.device.usb.hid("hid");

    var n_session = 0xFFFFFFFF;
    console.log(device);
    console.log(usb);
    console.log(hid);

    console.log(device.get_path());
    console.log(usb.get_path());
    console.log(hid.get_path());


    //
    g_dev_path = "";

    var server = elpusk.framework.coffee.get_instance();

    server.connect("wss", "443").then(
        function (s_session_number) {
            console.log("session : " + s_session_number);
            n_session = Number(s_session_number);
            etc_tools_print_msg_to_paragraph("p_top", 12, `session : ${n_session}<br />`);
            return elpusk.framework.coffee.get_instance().get_device_list("hid#vid_134b&pid_0206&mi_01");
        }
    )
        .catch(
            function (event_error) {
                console.log("[E] connect : " + event_error);
                throw (event_error);
            }
        )
        //connect
        .then(
            function (s_rx) {
                if (Array.isArray(s_rx)) {
                    if (s_rx.length > 0) {
                        g_dev_path = s_rx[0];//select the first device.
                        etc_tools_add_msg_to_paragraph("p_top", 12, `selected : ${g_dev_path}<br />`);
                        g_emv_terminal = new dll_service.default.sd_emv(n_session, 0, 0, 0);
                        if (typeof g_emv_terminal == 'object') {
                            etc_tools_add_msg_to_paragraph("p_top", 12, "created emv_terminal.<br />");
                            return g_emv_terminal.sd_load();
                        }
                        else {
                            etc_tools_add_msg_to_paragraph("p_top", 12, "error : create virtual terminal.");
                        }

                    }
                    else {
                        etc_tools_add_msg_to_paragraph("p_top", 12, "none device.");
                    }
                }
                else {
                    if (s_rx === null) {
                        etc_tools_add_msg_to_paragraph("p_top", 12, "none device.");
                    }
                    else {
                        etc_tools_add_msg_to_paragraph("p_top", 14, "error response : " + s_rx);
                    }
                }
            }
        )
        .catch(
            function (event_error) {
                etc_tools_add_msg_to_paragraph("p_top", 14, "error response : " + event_error);
                console.log("[E] get device list : " + event_error);
                throw (event_error);
            }
        )
        //load 
        .then(
            function (s_rx) {
                console.log(s_rx);
                if (s_rx === "success") {
                    etc_tools_add_msg_to_paragraph("p_top", 12, "loaded sd_emv.dll.<br />");
                    return g_emv_terminal.sd_open_device(g_dev_path);
                }
                else {
                    etc_tools_add_msg_to_paragraph("p_top", 14, "error : sd_load : " + s_rx);
                }
            }
        )
        .catch(
            function (event_error) {
                etc_tools_add_msg_to_paragraph("p_top", 14, "error response : " + event_error);
                console.log("[E] sd_load : " + event_error);
                throw (event_error);
            }
        )
        //open
        .then(
            function (n_device) {
                if (typeof n_device === 'number') {
                    if (n_device !== 0) {
                        var today = new Date();
                        var s_year = today.getFullYear().toString().slice(-2);
                        var s_month = ('0' + (today.getMonth() + 1)).slice(-2);
                        var s_day = ('0' + today.getDate()).slice(-2);

                        etc_tools_add_msg_to_paragraph("p_top", 12, `opened device ${n_device}.<br />`);
                        var s_hex_9f35_tag_value = "11";//1 byte hex string( CONTROL_BY_FINANCIAL | TERMINAL_TYPE_ATTENDED_ONLINE)
                        var s_hex_9f1a_tag_value = "0410";//2 bytes hex string  ISO 3166, KOR
                        var s_hex_9a_tag_value = s_year + s_month + s_day;//3 byets YYMMDD
                        var s_hex_9f33_tag_value = "06E8E8";//3 bytes hex string 

                        return g_emv_terminal.terminal_on(
                            s_hex_9f35_tag_value,
                            s_hex_9f1a_tag_value,
                            s_hex_9a_tag_value,
                            s_hex_9f33_tag_value
                        );
                    }
                    else {
                        etc_tools_add_msg_to_paragraph("p_top", 14, `error : device index must be gratetr then zero : ${n_device}.<br />`);
                    }
                }
                else {
                    etc_tools_add_msg_to_paragraph("p_top", 14, `error : sd_open_device : ${n_device}.<br />`);
                }
            }
        )
        .catch(
            function (event_error) {
                etc_tools_add_msg_to_paragraph("p_top", 14, `error sd_open_device : ${event_error}.<br />`);
                console.log("[E] sd_open_device : " + event_error);
                throw (event_error);
            }
        )
        //create virtual terminal
        .then(
            function (s_rx) {
                console.log(s_rx);
                if (Array.isArray(s_rx)) {
                    if (s_rx.length > 0) {
                        if (s_rx[0] === "success") {
                            etc_tools_add_msg_to_paragraph("p_top", 12, "created virtual terminal.<br />");
                        }
                        else {
                            etc_tools_add_msg_to_paragraph("p_top", 14, "error : terminal_on : " + s_rx);
                        }
                    }
                    else {
                        etc_tools_add_msg_to_paragraph("p_top", 14, "error : terminal_on : " + s_rx);
                    }
                }
                else {
                    etc_tools_add_msg_to_paragraph("p_top", 14, "error : terminal_on : " + s_rx);
                }
            }
        )
        .catch(
            function (event_error) {
                etc_tools_add_msg_to_paragraph("p_top", 14, `error response : ${event_error}.<br />`);
                console.log("[E] terminal_on : " + event_error);
            }
        )
        ;
}

function _check_rx_for_emv_run_fun(s_rx, n_mandotry) {
    console.log(s_rx);
    var b_result = false;
    do {
        if (n_mandotry <= 0) {
            continue;
        }
        if (!Array.isArray(s_rx)) {
            continue;
        }
        if (s_rx.length < n_mandotry) {
            continue;
        }
        if (s_rx[0] !== "success") {
            continue;
        }
        b_result = true;

    } while (false);
    return b_result;
}
/**
 * 
 * @param {*} s_fun_name 
 * @returns promise or undefined
 */
function sd_emv_run_fun(s_fun_name) {
    var result = undefined;
    do {
        if (typeof s_fun_name !== 'string') {
            continue;
        }
        if (typeof g_emv_terminal !== 'object') {
            continue;
        }

        switch (s_fun_name) {
            case "get_status":
                result = g_emv_terminal.get_status()
                    .then(
                        function (s_rx) {
                            if (_check_rx_for_emv_run_fun(s_rx, 2)) {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `card : status : ${s_rx[1]}.<br />`);
                            }
                            else {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `error : get_status : ${s_rx}.<br />`);
                            }
                        }
                    )
                    .catch(
                        function (event_error) {
                            etc_tools_add_msg_to_paragraph("p_middle", 14, `error ${s_fun_name} : ${event_error}.<br />`);
                            console.log(s_fun_name + " : " + event_error);
                        }
                    );
                break;
            case "power_on":
                result = g_emv_terminal.power_on()
                    .then(
                        function (s_rx) {
                            if (_check_rx_for_emv_run_fun(s_rx, 2)) {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `atr : ${s_rx[1]}.<br />`);
                            }
                            else {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `error : power_on : ${s_rx}.<br />`);
                            }
                        }
                    )
                    .catch(
                        function (event_error) {
                            etc_tools_add_msg_to_paragraph("p_middle", 14, `error ${s_fun_name} : ${event_error}.<br />`);
                            console.log(s_fun_name + " : " + event_error);
                        }
                    );
                break;
            case "power_off":
                result = g_emv_terminal.power_off()
                    .then(
                        function (s_rx) {
                            if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `icc power off.<br />`);
                            }
                            else {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `error : power_off : ${s_rx}.<br />`);
                            }
                        }
                    )
                    .catch(
                        function (event_error) {
                            etc_tools_add_msg_to_paragraph("p_middle", 14, `error ${s_fun_name} : ${event_error}.<br />`);
                            console.log(s_fun_name + " : " + event_error);
                        }
                    );
                break;
            case "initialize_transaction":
                var s_hex_9c_tag_value = "00";//1 byte  ISO 8583:1987
                var s_hex_5f2a_tag_value = "0410";//2 bytes ISO 4217
                var s_hex_5f36_tag_value = "00";//1 byte
                var s_dec_9f02_tag_value = "0";
                var s_dec_9f03_tag_value = "0";
                result = g_emv_terminal.initialize_transaction(
                    s_hex_9c_tag_value,
                    s_hex_5f2a_tag_value,
                    s_hex_5f36_tag_value,
                    s_dec_9f02_tag_value,
                    s_dec_9f03_tag_value
                )
                    .then(
                        function (s_rx) {
                            if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `initialize_transaction.<br />`);
                            }
                            else {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `error : initialize_transaction : ${s_rx}.<br />`);
                            }
                        }
                    )
                    .catch(
                        function (event_error) {
                            etc_tools_add_msg_to_paragraph("p_middle", 14, `error ${s_fun_name} : ${event_error}.<br />`);
                            console.log(s_fun_name + " : " + event_error);
                        }
                    );
                break;
            case "build_candidate_list":
                var s_use_pse = "1";
                result = g_emv_terminal.build_candidate_list(s_use_pse)
                    .then(
                        function (s_rx) {
                            if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `build_candidate_list.<br />`);
                            }
                            else {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `error : build_candidate_list : ${s_rx}.<br />`);
                            }
                        }
                    )
                    .catch(
                        function (event_error) {
                            etc_tools_add_msg_to_paragraph("p_middle", 14, `error ${s_fun_name} : ${event_error}.<br />`);
                            console.log(s_fun_name + " : " + event_error);
                        }
                    );
                break;
            case "select_application":
                var s_use_confirm = "0";
                result = g_emv_terminal.select_application(s_use_confirm)
                    .then(
                        function (s_rx) {
                            if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `select_application.<br />`);
                            }
                            else {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `error : select_application : ${s_rx}.<br />`);
                            }
                        }
                    )
                    .catch(
                        function (event_error) {
                            etc_tools_add_msg_to_paragraph("p_middle", 14, `error ${s_fun_name} : ${event_error}.<br />`);
                            console.log(s_fun_name + " : " + event_error);
                        }
                    );
                break;
            case "read_data":
                result = g_emv_terminal.read_data()
                    .then(
                        function (s_rx) {
                            if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `read_data.<br />`);
                            }
                            else {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `error : read_data : ${s_rx}.<br />`);
                            }
                        }
                    )
                    .catch(
                        function (event_error) {
                            etc_tools_add_msg_to_paragraph("p_middle", 14, `error ${s_fun_name} : ${event_error}.<br />`);
                            console.log(s_fun_name + " : " + event_error);
                        }
                    );
                break;

            default:
                etc_tools_add_msg_to_paragraph("p_middle", 14, `error ${s_fun_name} : none implementation.<br />`);
                continue;
        }//end switch

    } while (false);
    return result;
}