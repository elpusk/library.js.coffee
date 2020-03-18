

/* using
              getLocalIPv4().then((ipAddr) => {
                 wsUri = "ws://" + ipAddr + ":8080";
                writeToScreen("your ip address : " + wsUri);
            });
*/
function ns_getLocalIPv4() {//only for chrome or firefox
    return new Promise(function (resolve, reject) {
        // NOTE: window.RTCPeerConnection is "not a constructor" in FF22/23
        var RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

        if (!RTCPeerConnection) {
            reject('Your browser does not support this API');
        }

        var rtc = new RTCPeerConnection({ iceServers: [] });
        var addrs = {};
        addrs["0.0.0.0"] = false;

        function grepSDP(sdp) {
            var hosts = [];
            var finalIP = '';
            sdp.split('\r\n').forEach(function (line) { // c.f. http://tools.ietf.org/html/rfc4566#page-39
                if (~line.indexOf("a=candidate")) {     // http://tools.ietf.org/html/rfc4566#section-5.13
                    var parts = line.split(' '),        // http://tools.ietf.org/html/rfc5245#section-15.1
                        addr = parts[4],
                        type = parts[7];
                    if (type === 'host') {
                        finalIP = addr;
                    }
                } else if (~line.indexOf("c=")) {       // http://tools.ietf.org/html/rfc4566#section-5.7
                    var parts = line.split(' '),
                        addr = parts[2];
                    finalIP = addr;
                }
            });
            return finalIP;
        }

        if (1 || window.mozRTCPeerConnection) {      // FF [and now Chrome!] needs a channel/stream to proceed
            rtc.createDataChannel('', { reliable: false });
        };

        rtc.onicecandidate = function (evt) {
            if (evt.candidate) {
                var addr = grepSDP("a=" + evt.candidate.candidate);
                resolve(addr);
            }
        };
        rtc.createOffer(function (offerDesc) {
            rtc.setLocalDescription(offerDesc);
        }, function (e) { console.warn("offer failed", e); });
    });
}

function ns_get_raw_packet_string_for_display(parsed_packet) {
    var sDisplay;

    do {
        sDisplay = ('<span style="color: blue;">');

        sDisplay += ('[type : ' + parsed_packet['type'] + '] ');
        sDisplay += ('[session : ' + parsed_packet['session'] + '] ');
        sDisplay += ('[device : ' + parsed_packet['device'] + '] ');
        sDisplay += ('[owner : ' + parsed_packet['owner'] + '] ');
        sDisplay += ('[action : ' + parsed_packet['action'] + '] ');
        sDisplay += ('[length : ' + parsed_packet['length'] + '] ');

        sDisplay += '</span>';

        sDisplay += '<br />';

        if (parsed_packet['data'].length == 0) {
            sDisplay += ('<span style="color: blue;"> none data field. </span>');
            continue;
        }

        if (parsed_packet['data'].length > 1) {
            sDisplay += ('<span style="color: blue;"> data is multi type. data has a ' + parsed_packet['data'].length.toString() + ' fields.</span>');
            sDisplay += ('<span style="color: blue;"> At from field1 to field' + (parsed_packet['data'].length - 1).toString() + ', :s are not displayed.</span>');
        }
        else {
            sDisplay += ('<span style="color: blue;"> data is single type. </span>');
        }

        for (var index in parsed_packet['data']) {
            sDisplay += '<br />';
            sDisplay += ('<span style="color: blue;"> data' + index.toString() + ' : ' + parsed_packet['data'][index] + '</span>');
        }//end for

    } while (false);

    return sDisplay;
}

function ns_get_json_string_of_request_echo(sSession) {
    var sRandum = Math.floor(Math.random() * 10000).toString();

    var json_packet = {
        request_type:"T",
        session_number:Number(sSession),
        packet_owner:"M",
        device_index:0,
        action_code: "E",
        in_id: 0,
        out_id: 0,
        data_field_type:"S",  //data field type is string
        data_field:String(sRandum)
    }

    var s_json_packet = JSON.stringify(json_packet);
    return s_json_packet;
}

function ns_get_json_string_of_request_get_device_list(sSession, sFilter) {
    /* sFilter
     * filter_hid
     * filter_ccid
     * filter_winusb
     */
    var json_packet = {
        request_type: "T",
        session_number: Number(sSession),
        packet_owner: "M",
        device_index: 0,
        action_code: "L",
        in_id: 0,
        out_id: 0,
        data_field_type: "S",  //data field type is string
        data_field: String(sFilter)
    }

    var s_json_packet = JSON.stringify(json_packet);
    return s_json_packet;
}

function ns_get_json_string_of_request_open_device(sSession, sDevicePath) {
    var json_packet = {
        request_type: "T",
        session_number: Number(sSession),
        packet_owner: "D",
        device_index: 0,
        action_code: "o",
        data_field_type: "S",  //data field type is hex string
        data_field: String(sDevicePath)
    }

    var s_json_packet = JSON.stringify(json_packet);
    return s_json_packet;
}
function ns_get_json_string_of_request_close_device(sSession, sDeviceIndex) {
    var json_packet = {
        request_type: "T",
        session_number: Number(sSession),
        packet_owner: "D",
        device_index: Number(sDeviceIndex),
        action_code: "c",
        data_field_type: "H",  //data field type is hex string
        data_field: null
    }

    var s_json_packet = JSON.stringify(json_packet);
    return s_json_packet;
}

function ns_get_json_string_of_request_write_device(sSession, sDeviceIndex, sHexData) {
    var json_packet = {
        request_type: "T",
        session_number: Number(sSession),
        packet_owner: "D",
        device_index: Number(sDeviceIndex),
        action_code: "s",
        data_field_type: "H",  //data field type is hex string
        data_field: String(sHexData)
    }

    var s_json_packet = JSON.stringify(json_packet);
    return s_json_packet;
}
function ns_get_json_string_of_request_read_device(sSession, sDeviceIndex) {
    var json_packet = {
        request_type: "T",
        session_number: Number(sSession),
        packet_owner: "D",
        device_index: Number(sDeviceIndex),
        action_code: "r",
        data_field_type: "H",  //data field type is hex string
        data_field: null
    }

    var s_json_packet = JSON.stringify(json_packet);
    return s_json_packet;
}
function ns_get_json_string_of_request_transmit_device(sSession, sDeviceIndex, sHexData) {
    var json_packet = {
        request_type: "T",
        session_number: Number(sSession),
        packet_owner: "D",
        device_index: Number(sDeviceIndex),
        action_code: "t",
        data_field_type: "H",  //data field type is hex string
        data_field: String(sHexData)
    }

    var s_json_packet = JSON.stringify(json_packet);
    return s_json_packet;
}
function ns_get_json_string_of_request_cancel_device(sSession, sDeviceIndex) {
    var json_packet = {
        request_type: "T",
        session_number: Number(sSession),
        packet_owner: "D",
        device_index: Number(sDeviceIndex),
        action_code: "x",
        data_field_type: "H",  //data field type is hex string
        data_field: null
    }

    var s_json_packet = JSON.stringify(json_packet);
    return s_json_packet;
}
//

function ns_get_json_string_of_request_lpu237_get_id(sSession, sDeviceIndex) {
    var json_packet = {
        request_type: "T",
        session_number: Number(sSession),
        packet_owner: "D",
        device_index: Number(sDeviceIndex),
        action_code: "t",
        data_field_type: "H",  //data field type is hex string
        data_field: "55 00 00"
    }

    var s_json_packet = JSON.stringify(json_packet);
    return s_json_packet;
}
function ns_get_json_string_of_request_lpu237_enter_opos(sSession, sDeviceIndex) {
    var json_packet = {
        request_type: "T",
        session_number: Number(sSession),
        packet_owner: "D",
        device_index: Number(sDeviceIndex),
        action_code: "t",
        data_field_type: "H",  //data field type is hex string
        data_field: "49 00 00"
    }

    var s_json_packet = JSON.stringify(json_packet);
    return s_json_packet;
}
function ns_get_json_string_of_request_lpu237_leave_opos(sSession, sDeviceIndex) {
    var json_packet = {
        request_type: "T",
        session_number: Number(sSession),
        packet_owner: "D",
        device_index: Number(sDeviceIndex),
        action_code: "t",
        data_field_type: "H",  //data field type is hex string
        data_field: "4a 00 00"
    }

    var s_json_packet = JSON.stringify(json_packet);
    return s_json_packet;
}

function ns_get_json_string_of_request_lpu237_enter_cs(sSession, sDeviceIndex) {
    var json_packet = {
        request_type: "T",
        session_number: Number(sSession),
        packet_owner: "D",
        device_index: Number(sDeviceIndex),
        action_code: "t",
        data_field_type: "H",  //data field type is hex string
        data_field: "58 00 00"
    }

    var s_json_packet = JSON.stringify(json_packet);
    return s_json_packet;
}
function ns_get_json_string_of_request_lpu237_leave_cs(sSession, sDeviceIndex) {
    var json_packet = {
        request_type: "T",
        session_number: Number(sSession),
        packet_owner: "D",
        device_index: Number(sDeviceIndex),
        action_code: "t",
        data_field_type: "H",  //data field type is hex string
        data_field: "59 00 00"
    }

    var s_json_packet = JSON.stringify(json_packet);
    return s_json_packet;
}

function ns_get_json_string_of_request_lpu237_uart_bypass(sSession, sDeviceIndex, sData) {

    
    var s_data_field = "5400";
    var s_len = sData.length.toString(16);
    if (s_len.length % 2 != 0)
        s_len += "0";

    s_data_field += s_len;
    s_data_field += sData;

    var json_packet = {
        request_type: "T",
        session_number: Number(sSession),
        packet_owner: "D",
        device_index: Number(sDeviceIndex),
        action_code: "t",
        data_field_type: "H",  //data field type is hex string
        data_field: s_data_field
    }

    var s_json_packet = JSON.stringify(json_packet);
    return s_json_packet;
}