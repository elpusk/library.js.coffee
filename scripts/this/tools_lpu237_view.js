function tools_dom_buld_inital_page(){
    var _body = document.getElementById('body_for_main_html');
    var _div_for_ini = document.createElement('div');

    _div_for_ini.setAttribute('class','tab');

    var _bt_for_device = document.createElement('button');
    _bt_for_device.setAttribute('class','tablinks');
    _bt_for_device.setAttribute('onclick','tools_dom_open_tab_page(event, "id_device")');
    _bt_for_device.setAttribute('id','id_tab_device');
    _bt_for_device.innerHTML='device';

    _div_for_ini.appendChild(_bt_for_device);
    _body.appendChild(_div_for_ini);
}

function tools_dom_add_connected_device_page(){
    var _div_for_tab = document.getElementsByClassName('tab');

    var _bt_for_system = document.createElement('button');
    _bt_for_system.setAttribute('class','tablinks');
    _bt_for_system.setAttribute('onclick','tools_dom_open_tab_page(event, "id_system")');
    _bt_for_system.innerHTML='system';

    var i = 0;
    var _bt_for_iso = [];
    _bt_for_iso.push( document.createElement('button'));
    _bt_for_iso.push( document.createElement('button'));
    _bt_for_iso.push( document.createElement('button'));

    _bt_for_iso[i].setAttribute('class','tablinks');
    _bt_for_iso[i].setAttribute('onclick','tools_dom_open_tab_page(event, "id_iso1")');
    _bt_for_iso[i].innerHTML='ISO1 track';
    i++;

    _bt_for_iso[i].setAttribute('class','tablinks');
    _bt_for_iso[i].setAttribute('onclick','tools_dom_open_tab_page(event, "id_iso2")');
    _bt_for_iso[i].innerHTML='ISO2 track';
    i++;

    _bt_for_iso[i].setAttribute('class','tablinks');
    _bt_for_iso[i].setAttribute('onclick','tools_dom_open_tab_page(event, "id_iso3")');
    _bt_for_iso[i].innerHTML='ISO3 track';

    for( i=0; i<_div_for_tab.length; i++){
        _div_for_tab[i].appendChild(_bt_for_system);
        for( var j=0; j<_bt_for_iso.length; j++ ){
            _div_for_tab[i].appendChild(_bt_for_iso[j]);
        }//end for j
    }//end for i
}

function tools_dom_remove_connected_device_page(){
    
    var _div_for_tab = document.getElementsByClassName('tab');

    var tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    for( i=0; i<_div_for_tab.length; i++){
        _div_for_tab[i].appendChild(_bt_for_system);
        for( var j=0; j<_bt_for_iso.length; j++ ){
            _div_for_tab[i].appendChild(_bt_for_iso[j]);
        }//end for j
    }//end for i


    var _bt_for_system = document.createElement('button');
    _bt_for_system.setAttribute('class','tablinks');
    _bt_for_system.setAttribute('onclick','tools_dom_open_tab_page(event, "id_system")');
    _bt_for_system.innerHTML='system';

    var i = 0;
    var _bt_for_iso = [];
    _bt_for_iso.push( document.createElement('button'));
    _bt_for_iso.push( document.createElement('button'));
    _bt_for_iso.push( document.createElement('button'));

    _bt_for_iso[i].setAttribute('class','tablinks');
    _bt_for_iso[i].setAttribute('onclick','tools_dom_open_tab_page(event, "id_iso1")');
    _bt_for_iso[i].innerHTML='ISO1 track';
    i++;

    _bt_for_iso[i].setAttribute('class','tablinks');
    _bt_for_iso[i].setAttribute('onclick','tools_dom_open_tab_page(event, "id_iso2")');
    _bt_for_iso[i].innerHTML='ISO2 track';
    i++;

    _bt_for_iso[i].setAttribute('class','tablinks');
    _bt_for_iso[i].setAttribute('onclick','tools_dom_open_tab_page(event, "id_iso3")');
    _bt_for_iso[i].innerHTML='ISO3 track';

    for( i=0; i<_div_for_tab.length; i++){
        _div_for_tab[i].appendChild(_bt_for_system);
        for( var j=0; j<_bt_for_iso.length; j++ ){
            _div_for_tab[i].appendChild(_bt_for_iso[j]);
        }//end for j
    }//end for i
}

function tools_dom_open_tab_page(evt, page_id) {
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
