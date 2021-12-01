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
                console.log("connect : " + event_error);
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
                console.log("get device list : " + event_error);
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
                console.log("sd_load : " + event_error);
            }
        )
        //open
        .then(
            function (n_device) {
                if (typeof n_device === 'number') {
                    if (n_device !== 0) {
                        etc_tools_add_msg_to_paragraph("p_top", 12, "ready for starting EMV process.<br />");
                    }
                    else {
                        etc_tools_add_msg_to_paragraph("p_top", 14, "error : device index must be gratetr then zero : " + n_device.toString());
                    }
                }
                else {
                    etc_tools_add_msg_to_paragraph("p_top", 14, "error : sd_open_device : " + n_device.toString());
                }
            }
        )
        .catch(
            function (event_error) {
                etc_tools_add_msg_to_paragraph("p_top", 14, "error sd_open_device : " + event_error);
                console.log("sd_open_device : " + event_error);
            }
        )
        ;
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
                        console.log(s_rx);
                    }
                )
                .catch(
                    function (event_error) {
                        etc_tools_add_msg_to_paragraph("p_middle", 14, `error ${s_fun_name} : ` + event_error);
                        console.log(s_fun_name + " : "+ event_error);
                    }
                );
                break;
            case "power_on":
                result = g_emv_terminal.get_status();
                break;
            case "power_off":
                result = g_emv_terminal.get_status();
                break;
            default:
                continue;
        }//end switch

    } while (false);
    return result;
}