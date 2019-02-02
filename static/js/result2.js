window.onload = () => {
    document.title = setSessionid();
};

function setSessionid() {
    let url = new URLSearchParams(window.location.search);
    let param = parseInt(url.get('category'));
    var pageStr = 'Results for category ';

    switch (param) {
        case 1:
            return pageStr + 'Race';
        case 2:
            return pageStr + 'Gender';
        case 3:
            return pageStr + 'Disability';
        case 4:
            return pageStr + 'Religion';
        default:
            return pageStr + 'Race';
    }
}