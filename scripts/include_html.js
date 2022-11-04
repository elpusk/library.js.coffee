
/*
function include_html() {
    var allElements = document.getElementsByTagName('*');
    Array.prototype.forEach.call(allElements, function(el) {
        var includePath = el.dataset.includePath;
        if (includePath ===  "data-include-path") {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    el.outerHTML = this.responseText;
                }
            };
            xhttp.open('GET', includePath, true);
            xhttp.send();
        }
    });
}
*/
// https://www.w3schools.com/howto/howto_html_include.asp
function include_html(callback) {
    var z, i, elmnt, file, xhr;
    /*loop through a collection of all HTML elements:*/
    z = document.getElementsByTagName('*');
    for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      /*search for elements with a certain atrribute:*/
      file = elmnt.getAttribute('include-html');
      //console.log(file);
      if (file) {
        /*make an HTTP request using the attribute value as the file name:*/
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {elmnt.innerHTML = this.responseText;}
            if (this.status == 404) {elmnt.innerHTML = 'Page not found.';}
            /*remove the attribute, and call this function once more:*/
            elmnt.removeAttribute('include-html');
            include_html(callback);
          }
        }      
        xhr.open('GET', file, true);
        xhr.send();
        /*exit the function:*/
       return;
      }
    }
    setTimeout(function() {
      callback();
    }, 0)
  };