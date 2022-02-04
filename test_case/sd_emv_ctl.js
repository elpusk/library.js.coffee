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

var g_response_of_go_online = [];

function sd_emv_ini_server(s_yymmdd_for_debug) {

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
                        var s_hex_9f33_tag_value = "60E8E8";//3 bytes hex string 

                        if(typeof s_yymmdd_for_debug === 'string'){
                            var s_pattern = /^\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/;
                            if (s_pattern.test(s_yymmdd_for_debug)) {
                                s_hex_9a_tag_value = s_yymmdd_for_debug;//override for debugging
                            }
                        }
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

/**
 * 
 * @param {*} s_rx string array, received data
 * @param {*} n_mandotry the number of mandotry string on s_rx array.
 * @returns 
 */
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
 * @param {Array} ar_parameter - the first item have to be a function name.
 * @returns promise or undefined
 */
function sd_emv_run_fun(ar_parameter) {
    var result = undefined;
    do {
        if(!Array.isArray(ar_parameter)){
            continue;
        }
        if(ar_parameter.length == 0){
            continue;
        }
        if (typeof g_emv_terminal !== 'object') {
            continue;
        }

        var s_fun_name = ar_parameter[0];
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
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `read_data : ${s_rx}.<br />`);
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
            case "offline_data_authentication"://////
                result = g_emv_terminal.offline_data_authentication()
                    .then(
                        function (s_rx) {
                            if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `offline_data_authentication : ${s_rx}.<br />`);
                            }
                            else {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `error : offline_data_authentication : ${s_rx}.<br />`);
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
            case "processing_restrictions":
                result = g_emv_terminal.processing_restrictions()
                    .then(
                        function (s_rx) {
                            if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `processing_restrictions : ${s_rx}.<br />`);
                            }
                            else {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `error : processing_restrictions : ${s_rx}.<br />`);
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

            case "cardholder_verification":
                result = g_emv_terminal.cardholder_verification()
                    .then(
                        function (s_rx) {
                            if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `cardholder_verification : ${s_rx}.<br />`);
                            }
                            else {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `error : cardholder_verification : ${s_rx}.<br />`);
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

            case "terminal_risk_managment":
                result = g_emv_terminal.terminal_risk_managment()
                    .then(
                        function (s_rx) {
                            if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `terminal_risk_managment : ${s_rx}.<br />`);
                            }
                            else {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `error : terminal_risk_managment : ${s_rx}.<br />`);
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

            case "terminal_action_analysis":
                result = g_emv_terminal.terminal_action_analysis()
                    .then(
                        function (s_rx) {
                            if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `terminal_action_analysis : ${s_rx}.<br />`);
                            }
                            else {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `error : terminal_action_analysis : ${s_rx}.<br />`);
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
            case "card_action_analysis":
                result = g_emv_terminal.card_action_analysis()
                    .then(
                        function (s_rx) {
                            if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `card_action_analysis : ${s_rx}.<br />`);
                            }
                            else {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `error : card_action_analysis : ${s_rx}.<br />`);
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
            case "go_online":
                var s_get_tags = 'AUTHORISATION_REQUEST';
                result = g_emv_terminal.go_online(s_get_tags)
                    .then(
                        function (s_rx) {//g_response_of_go_online
                            //g_response_of_go_online.push
                            if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `go_online : ${s_rx}.<br />`);
                            }
                            else {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `error : go_online : ${s_rx}.<br />`);
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
            case "go_online_response":
                var s_issuer_arc = "approval";
                var s_issuer_data = "";
                var s_referral_decision = "approval";
                result = g_emv_terminal.go_online_response(s_issuer_arc,s_issuer_data, s_referral_decision)
                    .then(
                        function (s_rx) {
                            if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `go_online_response : ${s_rx}.<br />`);
                            }
                            else {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `error : go_online_response : ${s_rx}.<br />`);
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
            case "complete_transaction":
                result = g_emv_terminal.complete_transaction()
                    .then(
                        function (s_rx) {
                            if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `complete_transaction : ${s_rx}.<br />`);
                            }
                            else {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `error : complete_transaction : ${s_rx}.<br />`);
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
            case "end_transaction":
                result = g_emv_terminal.end_transaction()
                    .then(
                        function (s_rx) {
                            if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `end_transaction : ${s_rx}.<br />`);
                            }
                            else {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `error : end_transaction : ${s_rx}.<br />`);
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

            case "etc_gets":
                var s_tag_para = [];//["9c:n:0","5f2a:n:0","5f36:n:0","9f02:n:0","9f03:n:0"];
                result = g_emv_terminal.etc_gets(s_tag_para)
                    .then(
                        function (s_rx) {
                            if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `etc_gets : ${s_rx}.<br />`);
                            }
                            else {
                                etc_tools_add_msg_to_paragraph("p_middle", 14, `error : etc_gets : ${s_rx}.<br />`);
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

/**
 * @function sd_emv_run__all()
 * @description run all phases of emv transaction.
 *          
 */
function sd_emv_run_all() {
    g_emv_terminal.get_status()
        .then(
            function (s_rx) {
                if (_check_rx_for_emv_run_fun(s_rx, 2)) {
                    if (s_rx[1] === 'active' || s_rx[1] === 'deactive') {
                        etc_tools_add_msg_to_paragraph("p_middle", 14, `get_status : ${s_rx}.<br />`);
                        return g_emv_terminal.power_off();
                    }
                }
                etc_tools_add_msg_to_paragraph("p_middle", 14, `error get_status : ${s_rx}.<br />`);
            }
        )
        .catch(
            function (event_error) {
                etc_tools_add_msg_to_paragraph("p_middle", 14, `error none card : ${event_error}.<br />`);
                console.log("get_status : " + event_error);
            }
        )
        //power off
        .then(
            function (s_rx) {
                if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `power_off : ${s_rx}.<br />`);
                    return g_emv_terminal.power_on();
                }
                etc_tools_add_msg_to_paragraph("p_middle", 14, `error power_off : ${s_rx}.<br />`);
            }
        )
        .catch(
            function (event_error) {
                etc_tools_add_msg_to_paragraph("p_middle", 14, `error power_off : ${event_error}.<br />`);
                console.log("power_off : " + event_error);
            }
        )
        //power on
        .then(
            function (s_rx) {
                if (_check_rx_for_emv_run_fun(s_rx, 2)) {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `atr : ${s_rx}.<br />`);
                    var s_hex_9c_tag_value = "00";//1 byte  ISO 8583:1987
                    var s_hex_5f2a_tag_value = "0410";//2 bytes ISO 4217
                    var s_hex_5f36_tag_value = "00";//1 byte
                    var s_dec_9f02_tag_value = "0";
                    var s_dec_9f03_tag_value = "0";
                    return g_emv_terminal.initialize_transaction(
                        s_hex_9c_tag_value,
                        s_hex_5f2a_tag_value,
                        s_hex_5f36_tag_value,
                        s_dec_9f02_tag_value,
                        s_dec_9f03_tag_value
                    );
                }
                else {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `error : power_on : ${s_rx}.<br />`);
                }
            }
        )
        .catch(
            function (event_error) {
                etc_tools_add_msg_to_paragraph("p_middle", 14, `error power_on : ${event_error}.<br />`);
                console.log("power_on : " + event_error);
            }
        )
        //initialize_transaction
        .then(
            function (s_rx) {
                if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `initialize_transaction : ${s_rx}.<br />`);
                    var s_use_pse = "1";
                    return g_emv_terminal.build_candidate_list(s_use_pse);
                }
                else {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `error : initialize_transaction : ${s_rx}.<br />`);
                }
            }
        )
        .catch(
            function (event_error) {
                etc_tools_add_msg_to_paragraph("p_middle", 14, `error initialize_transaction : ${event_error}.<br />`);
                console.log("initialize_transaction : " + event_error);
            }
        )
        //build_candidate_list
        .then(
            function (s_rx) {
                if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `build_candidate_list : ${s_rx}.<br />`);
                    var s_use_confirm = "0";
                    return g_emv_terminal.select_application(s_use_confirm);
                }
                else {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `error : build_candidate_list : ${s_rx}.<br />`);
                }
            }
        )
        .catch(
            function (event_error) {
                etc_tools_add_msg_to_paragraph("p_middle", 14, `error build_candidate_list : ${event_error}.<br />`);
                console.log("build_candidate_list : " + event_error);
            }
        )
        //select_application
        .then(
            function (s_rx) {
                if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `select_application : ${s_rx}.<br />`);
                    return g_emv_terminal.read_data();
                }
                else {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `error : select_application : ${s_rx}.<br />`);
                }
            }
        )
        .catch(
            function (event_error) {
                etc_tools_add_msg_to_paragraph("p_middle", 14, `error select_application : ${event_error}.<br />`);
                console.log("select_application : " + event_error);
            }
        )
        //read_data   
        .then(
            function (s_rx) {
                if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `read_data : ${s_rx}.<br />`);
                    return g_emv_terminal.offline_data_authentication();
                }
                else {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `error : read_data : ${s_rx}.<br />`);
                }
            }
        )
        .catch(
            function (event_error) {
                etc_tools_add_msg_to_paragraph("p_middle", 14, `error read_data : ${event_error}.<br />`);
                console.log("read_data : " + event_error);
            }
        )
        //offline_data_authentication
        .then(
            function (s_rx) {
                if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `offline_data_authentication : ${s_rx}.<br />`);
                    return g_emv_terminal.processing_restrictions();
                }
                else {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `error : offline_data_authentication : ${s_rx}.<br />`);
                }
            }
        )
        .catch(
            function (event_error) {
                etc_tools_add_msg_to_paragraph("p_middle", 14, `error offline_data_authentication : ${event_error}.<br />`);
                console.log("offline_data_authentication : " + event_error);
            }
        )
        //processing_restrictions
        .then(
            function (s_rx) {
                if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `processing_restrictions : ${s_rx}.<br />`);
                    return g_emv_terminal.cardholder_verification();
                }
                else {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `error : processing_restrictions : ${s_rx}.<br />`);
                }
            }
        )
        .catch(
            function (event_error) {
                etc_tools_add_msg_to_paragraph("p_middle", 14, `error processing_restrictions : ${event_error}.<br />`);
                console.log("processing_restrictions : " + event_error);
            }
        )
        //cardholder_verification
        .then(
            function (s_rx) {
                if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `cardholder_verification : ${s_rx}.<br />`);
                    return g_emv_terminal.terminal_risk_managment();
                }
                else {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `error : cardholder_verification : ${s_rx}.<br />`);
                }
            }
        )
        .catch(
            function (event_error) {
                etc_tools_add_msg_to_paragraph("p_middle", 14, `error cardholder_verification : ${event_error}.<br />`);
                console.log("cardholder_verification : " + event_error);
            }
        )
        //terminal_risk_managment
        .then(
            function (s_rx) {
                if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `terminal_risk_managment : ${s_rx}.<br />`);
                    return g_emv_terminal.terminal_action_analysis();
                }
                else {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `error : terminal_risk_managment : ${s_rx}.<br />`);
                }
            }
        )
        .catch(
            function (event_error) {
                etc_tools_add_msg_to_paragraph("p_middle", 14, `error terminal_risk_managment : ${event_error}.<br />`);
                console.log("terminal_risk_managment : " + event_error);
            }
        )
        //terminal_action_analysis
        .then(
            function (s_rx) {
                if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `terminal_action_analysis : ${s_rx}.<br />`);
                    g_emv_terminal.card_action_analysis();
                }
                else {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `error : terminal_action_analysis : ${s_rx}.<br />`);
                }
            }
        )
        .catch(
            function (event_error) {
                etc_tools_add_msg_to_paragraph("p_middle", 14, `error terminal_action_analysis : ${event_error}.<br />`);
                console.log("terminal_action_analysis : " + event_error);
            }
        )
        //card_action_analysis
        .then(
            function (s_rx) {
                if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `card_action_analysis : ${s_rx}.<br />`);
                    return g_emv_terminal.go_online();
                }
                else {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `error : card_action_analysis : ${s_rx}.<br />`);
                }
            }
        )
        .catch(
            function (event_error) {
                etc_tools_add_msg_to_paragraph("p_middle", 14, `error terminal_action_analysis : ${event_error}.<br />`);
                console.log(" : " + event_error);
            }
        )
        //go_online
        .then(
            function (s_rx) {
                if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `go_online : ${s_rx}.<br />`);
                    return g_emv_terminal.complete_transaction();
                }
                else {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `error : go_online : ${s_rx}.<br />`);
                }
            }
        )
        .catch(
            function (event_error) {
                etc_tools_add_msg_to_paragraph("p_middle", 14, `error go_online : ${event_error}.<br />`);
                console.log( "go_online : " + event_error);
            }
        )
        //complete_transaction
        .then(
            function (s_rx) {
                if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `complete_transaction : ${s_rx}.<br />`);
                    return g_emv_terminal.end_transaction();
                }
                else {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `error : complete_transaction : ${s_rx}.<br />`);
                }
            }
        )
        .catch(
            function (event_error) {
                etc_tools_add_msg_to_paragraph("p_middle", 14, `error complete_transaction : ${event_error}.<br />`);
                console.log("complete_transaction : " + event_error);
            }
        )
        //end_transaction
        .then(
            function (s_rx) {
                if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `end_transaction : ${s_rx}.<br />`);
                    return g_emv_terminal.power_off();
                }
                else {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `error : end_transaction : ${s_rx}.<br />`);
                }
            }
        )
        .catch(
            function (event_error) {
                etc_tools_add_msg_to_paragraph("p_middle", 14, `error end_transaction : ${event_error}.<br />`);
                console.log("end_transaction : " + event_error);
            }
        )
        //power off
        .then(
            function (s_rx) {
                if (_check_rx_for_emv_run_fun(s_rx, 1)) {
                    etc_tools_add_msg_to_paragraph("p_middle", 14, `power_off : ${s_rx}.<br />`);
                    return g_emv_terminal.power_on();
                }
                etc_tools_add_msg_to_paragraph("p_middle", 14, `error power_off : ${s_rx}.<br />`);
            }
        )
        .catch(
            function (event_error) {
                etc_tools_add_msg_to_paragraph("p_middle", 14, `error power_off : ${event_error}.<br />`);
                console.log("power_off : " + event_error);
            }
        )
        ;


}

