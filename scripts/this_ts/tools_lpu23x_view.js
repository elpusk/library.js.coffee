export function tools_dom_buld_inital_page(){
    var _body = document.getElementById('body_for_main_html');
    var _div_for_ini = document.createElement('div');

    _div_for_ini.setAttribute('class','tab');

    var _bt_for_device = document.createElement('button');
    _bt_for_device.setAttribute('class','tablinks');
    _bt_for_device.setAttribute('onclick','_tools_dom_open_tab_page(event, "id_device")');
    _bt_for_device.setAttribute('id','id_tab_device');
    _bt_for_device.innerHTML='device';

    _div_for_ini.appendChild(_bt_for_device);
    _body.appendChild(_div_for_ini);
}

export function tools_dom_add_connected_device_page(_ctl_lpu237,_b_device_is_composite){
    if(typeof _ctl_lpu237==='undefined'){
        return;
    }
    if( _ctl_lpu237===null){
        return;
    }
    if(_b_device_is_composite){
        var s_type = _ctl_lpu237.get_device().get_type_string();
        _tools_dom_button_status(true,s_type);
        return;
    }
    var _div_for_tab = document.getElementsByClassName('tab');

    var _bt_for_system = document.createElement('button');
    _bt_for_system.setAttribute('id','id_tab_system');
    _bt_for_system.setAttribute('class','tablinks');
    _bt_for_system.setAttribute('onclick','_tools_dom_open_tab_page(event, "id_system")');
    _bt_for_system.innerHTML='system';

    var i = 0;
    var _bt_for_iso = [];
    _bt_for_iso.push(document.createElement('button'));
    _bt_for_iso.push(document.createElement('button'));
    _bt_for_iso.push(document.createElement('button'));

    _bt_for_iso[i].setAttribute('id', 'id_tab_iso1');
    _bt_for_iso[i].setAttribute('class', 'tablinks');
    _bt_for_iso[i].setAttribute('onclick', '_tools_dom_open_tab_page(event, "id_iso1")');
    _bt_for_iso[i].innerHTML = 'ISO1 track';
    i++;

    _bt_for_iso[i].setAttribute('id', 'id_tab_iso2');
    _bt_for_iso[i].setAttribute('class', 'tablinks');
    _bt_for_iso[i].setAttribute('onclick', '_tools_dom_open_tab_page(event, "id_iso2")');
    _bt_for_iso[i].innerHTML = 'ISO2 track';
    i++;

    _bt_for_iso[i].setAttribute('id', 'id_tab_iso3');
    _bt_for_iso[i].setAttribute('class', 'tablinks');
    _bt_for_iso[i].setAttribute('onclick', '_tools_dom_open_tab_page(event, "id_iso3")');
    _bt_for_iso[i].innerHTML = 'ISO3 track';

    for( i=0; i<_div_for_tab.length; i++){
        _div_for_tab[i].appendChild(_bt_for_system);
        for( var j=0; j<_bt_for_iso.length; j++ ){
            _div_for_tab[i].appendChild(_bt_for_iso[j]);
        }//end for j
    }//end for i

    _print_message("id_system",_ctl_lpu237.get_device().get_string_html_table("system"));
    _print_message("id_iso1",_ctl_lpu237.get_device().get_string_html_table("iso1"));
    _print_message("id_iso2",_ctl_lpu237.get_device().get_string_html_table("iso2"));
    _print_message("id_iso3",_ctl_lpu237.get_device().get_string_html_table("iso3"));

    _tools_dom_adjust_page_size(true);

    var s_type = _ctl_lpu237.get_device().get_type_string();
    _tools_dom_button_status(true,s_type);
}

export function tools_dom_remove_connected_device_page(){

    _tools_dom_button_status(false,'');

    _print_message("id_system","Please connects a device.");
    _print_message("id_iso1","Please connects a device.");
    _print_message("id_iso2","Please connects a device.");
    _print_message("id_iso3","Please connects a device.");

    _tools_dom_adjust_page_size(false);

    var _div_for_tab = document.getElementsByClassName('tab');

    var _bt_for_system = document.getElementById('id_tab_system');
    var _bt_for_iso = [];
    _bt_for_iso.push(document.getElementById('id_tab_iso1') );
    _bt_for_iso.push(document.getElementById('id_tab_iso2') );
    _bt_for_iso.push(document.getElementById('id_tab_iso3') );

    for( var i=0; i<_div_for_tab.length; i++){
        if( _bt_for_system ){
            _div_for_tab[i].removeChild(_bt_for_system);
        }
        for( var j=0; j<_bt_for_iso.length; j++ ){
            if( _bt_for_iso[j] ){
                _div_for_tab[i].removeChild(_bt_for_iso[j]);
            }
        }//end for j
    }//end for i
}

export function _tools_dom_open_tab_page(evt, page_id) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(page_id).style.display = "block";
    evt.currentTarget.className += " active";
}

export function _tools_dom_adjust_page_size( b_connected ){
    do{
        if( typeof b_connected  !== 'boolean'){
            continue;
        }

        var tables = document.getElementsByTagName("table");

        var page_id = ['id_system'];
        page_id.push('id_iso1','id_iso2','id_iso3');

        if( b_connected ){
            //expand page for displaying information.
            
            var n_max_height = 0;
            var n_height = 0;
    
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
            continue;
        }

        //removed device part.
        //resize page to default page.
        var _tab_content  = document.getElementsByClassName("tabcontent");
        for( var i = 0; i<_tab_content.length; i++ ){
            _tab_content[i].style.height = "400px";
            _tab_content[i].style.display = "none";
        }//end for

        var _tab  = document.getElementsByClassName("tab");
        for( var i = 0; i<_tab.length; i++ ){
            _tab[i].style.height = "400px";
        }//end for

        document.getElementById("id_device").style.display = "block";

        var tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        tablinks[0].className += " active";//default
    }while(false);
}

export function tools_dom_update_device_list_with_promise( _array_device_list ){
    elpusk.framework.coffee.get_instance().get_device_list("hid#vid_134b&pid_0206&mi_01")
    .then(
        function(s_rx){
            var select_dev = document.getElementById("id_drop_get_device_list");
            select_dev.options.length = 0;

            if (Array.isArray(s_rx)) {
                var _array_device_list = new Array();
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

export function _tools_dom_button_status( b_connected, s_connected_device_type ){
    do{
        s_connected_device_type = s_connected_device_type || '';

        if( typeof b_connected !== "boolean"){
            continue;
        }

        if( b_connected ){
            document.getElementById("id_button_connect").disabled = true;

            if(s_connected_device_type === "compositive_msr"){
                document.getElementById("id_file_fw_select_updating").disabled = true;
                document.getElementById("id_file_select_setting").disabled = true;
                document.getElementById("id_button_reload_parameters").disabled = true;
                document.getElementById("id_button_enable_msr_read").disabled = false;
                document.getElementById("id_button_disable_msr_read").disabled = false;
                document.getElementById("id_button_enable_ibutton_read").disabled = true;
                document.getElementById("id_button_disable_ibutton_read").disabled = true;
            }
            else if(s_connected_device_type === "compositive_ibutton"){
                document.getElementById("id_file_fw_select_updating").disabled = true;
                document.getElementById("id_file_select_setting").disabled = true;
                document.getElementById("id_button_reload_parameters").disabled = true;
                document.getElementById("id_button_enable_msr_read").disabled = true;
                document.getElementById("id_button_disable_msr_read").disabled = true;
                document.getElementById("id_button_enable_ibutton_read").disabled = false;
                document.getElementById("id_button_disable_ibutton_read").disabled = false;
            }
            else if(s_connected_device_type === "primitive"){
                document.getElementById("id_file_fw_select_updating").disabled = false;
                document.getElementById("id_file_select_setting").disabled = false;
                document.getElementById("id_button_reload_parameters").disabled = false;
                document.getElementById("id_button_enable_msr_read").disabled = true;
                document.getElementById("id_button_disable_msr_read").disabled = true;
                document.getElementById("id_button_enable_ibutton_read").disabled = true;
                document.getElementById("id_button_disable_ibutton_read").disabled = true;
            }
            continue;
        }
        //disconnected
        document.getElementById("id_file_fw_select_updating").disabled = true;
        document.getElementById("id_file_select_setting").disabled = true;
        document.getElementById("id_button_reload_parameters").disabled = true;
        document.getElementById("id_button_connect").disabled = false;
        document.getElementById("id_button_enable_msr_read").disabled = true;
        document.getElementById("id_button_disable_msr_read").disabled = true;
        document.getElementById("id_button_enable_ibutton_read").disabled = true;
        document.getElementById("id_button_disable_ibutton_read").disabled = true;
    }while(false);
}