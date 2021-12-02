

function etc_tools_add_button(s_parent_name, s_name, s_onclick, s_data,b_insert_cr_before_new) {

    do {
        var parent = document.getElementById(`id_${s_parent_name}`);
        if(!parent){
            console.log(`[E] : id_${s_parent_name} is not exist.`);
            continue;
        }
        var bt = document.createElement('button');
        bt.setAttribute('onclick', s_onclick);
        bt.setAttribute('id', `id_${s_name}`);

        if (typeof s_data === 'string') {
            bt.innerHTML = s_data;
        }
        else {
            bt.innerHTML = "";
        }

        if( typeof b_insert_cr_before_new === 'boolean'){
            if(b_insert_cr_before_new){
                parent.innerHTML += "<br />";
            }
        }
        parent.appendChild(bt);
        
    } while (false);
}

function etc_tools_clear_paragraph(s_paragraph_name,n_font_size_px) {
    var parag_main = document.getElementById(`id_${s_paragraph_name}`);
    parag_main.style.wordWrap = "break-word";

    if( typeof n_font_size_px !== 'number'){
        parag_main.style.fontSize = "12px";
    }
    else{
        parag_main.style.fontSize = n_font_size_px.toString()+"px";
    }

    parag_main.innerHTML ="";
}

function etc_tools_print_msg_to_paragraph(s_paragraph_name,n_font_size_px,s_msg){
    var parag_main = document.getElementById(`id_${s_paragraph_name}`);
    parag_main.style.wordWrap = "break-word";

    if( typeof n_font_size_px !== 'number'){
        parag_main.style.fontSize = "12px";
    }
    else{
        parag_main.style.fontSize = n_font_size_px.toString()+"px";
    }

    parag_main.innerHTML = s_msg;
}

function etc_tools_add_msg_to_paragraph(s_paragraph_name,n_font_size_px,s_msg) {
    var parag_main = document.getElementById(`id_${s_paragraph_name}`);
    parag_main.style.wordWrap = "break-word";

    if( typeof n_font_size_px !== 'number'){
        parag_main.style.fontSize = "12px";
    }
    else{
        parag_main.style.fontSize = n_font_size_px.toString()+"px";
    }

    parag_main.innerHTML += (s_msg);
}
