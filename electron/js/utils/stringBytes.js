// 字符串=>二进制
module.exports.getContentBytesLength = (content) =>{
    let buffer = new Buffer(content);
    return buffer.length;
};

// 将内存以64字节分块
module.exports.splitContent = (content) => {
    let buffer = new Buffer(content);
    let contentArr = [];
    let length = Math.ceil(buffer.length/64);
    for(let i=0; i<length; i++){
        let bufferString = buffer.toString('utf-8', 64*i, 64*(i+1));
        contentArr.push(bufferString);
    }
    return contentArr;
};
