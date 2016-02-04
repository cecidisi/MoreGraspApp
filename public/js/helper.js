
window.bytesToSize = function(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}


window.getDDMMYYYY = function(date){
    date = new Date(date);
    var day = date.getDay().toString().length === 1 ? '0'+date.getDay() : date.getDay(),
        month = (date.getMonth() + 1).toString().length === 1 ? '0'+(date.getMonth()+1) : date.getMonth()+1,
        year = date.getFullYear();
    return day + '/' + month + '/' + year;
};


window.getMMDDYYYY = function(date){
    date = new Date(date);
    var month = (date.getMonth() + 1).toString().length === 1 ? '0'+(date.getMonth()+1) : date.getMonth()+1,
        day = date.getDay().toString().length === 1 ? '0'+date.getDay() : date.getDay(),
        year = date.getFullYear();
    return month + '/' + day + '/' + year;
};


String.prototype.getMMYYYY = function(){
    var date = new Date(this);
    var month = (date.getMonth() + 1).toString().length === 1 ? '0'+(date.getMonth()+1) : date.getMonth()+1,
        year = date.getFullYear();
    return month + '/' + year;
};

String.prototype.MMYYYYtoDate = function(sep){
    var sep = sep || '/',
        dateParts = this.split(sep);
    return new Date(parseInt(dateParts[1]), parseInt(dateParts[0]) - 1);
};


String.prototype.toBool = function() {
    return (this == "true");
};
