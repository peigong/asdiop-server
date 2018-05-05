console.log(Buffer.from([0x00, 0x00, 0x0c, 0x3a]));
let count = 3130;
let buf = Buffer.alloc(4);
buf.writeUInt32BE(3130);
// let n = buf.readUInt32BE();
// let buf = Buffer.from('v');
// let n = buf.readUInt32BE();
console.log(buf.toString('utf-8'));
console.log(Buffer.from('abcdeabcde', 'ascii').length);
