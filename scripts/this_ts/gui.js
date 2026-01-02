export function _print_message(s_id,Message)
{
    var parag_main = document.getElementById(s_id);
    parag_main.style.overflowWrap = "break-word"; // standard
    parag_main.style.wordWrap = "break-word"; // old 
    parag_main.style.fontSize = "12px";
    parag_main.innerHTML = Message + "<br />";
}
export function _add_message(s_id,Message) {
    var parag_main = document.getElementById(s_id);
    parag_main.style.overflowWrap = "break-word"; // standard
    parag_main.style.wordWrap = "break-word"; //old
    parag_main.style.fontSize = "12px";
    parag_main.innerHTML += (Message + "<br />");
}
export function _add_multi_message(s_id,ssMessage) {
    var ss_msg = ssMessage.split("\n");
    for( var i = 0; i<ss_msg.length; i++ ){
        _add_message(s_id,ss_msg[i]);
    }
}

export function _set_progress( s_id,n_cur, n_max ){
    var prog = document.getElementById(s_id);
    prog.setAttribute("max",String(n_max));
    prog.value = n_cur;
}

export function _increase_progress(s_id){
    var prog = document.getElementById(s_id);
    var n_cur = prog.value;
    n_cur++;
    prog.value = n_cur;
}