// first parameter is the data to send,
// second parameter is the script to execute.
function saveToServer(source, address) {
    var http = new XMLHttpRequest();
    http.open('POST', address, true);

    http.setRequestHeader('Content-type', 'application/json');

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            printResponse(http.response);
        }
    }

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();

    var obj = {
        "meta-data": date + '_' + time,
        "scroll-length": scrolledcm,
        "scroll-data": scrollHistory,
        "img-data": source
    }
    var json = JSON.stringify(obj);

    http.send(json);
}