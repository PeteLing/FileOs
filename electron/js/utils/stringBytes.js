// 字符串=>二进制
module.exports.getContentBytesLength = (content) =>{
    let buffer = new Buffer(content);
    return buffer.length;
};

module.exports.getByteLen = function(val) {
    var len = 0;
    for (var i = 0; i < val.length; i++) {
        if (val[i].match(/[^\x00-\xff]/ig) != null) //全角或汉字
            len += 2;
        else
            len += 1;
    }
    return len;
}

//返回val在规定字节长度max内的值
module.exports.getByteVal = function(val, max) {
    var returnValue = '';
    var byteValLen = 0;
    for (var i = 0; i < val.length; i++) {
        if (val[i].match(/[^\x00-\xff]/ig) != null)
            byteValLen += 2;
        else
            byteValLen += 1;
        if (byteValLen > max)
            break;
        returnValue += val[i];
    }
    return returnValue;
}

module.exports.sliceStr2Array = function(val, size) {
    let rst = [];
    let temp = '';
    while (val.length > 0) {
        temp = this.getByteVal(val, size)
        rst.push(temp);
        val = val.substr(temp.length);
    }
    return rst;
}