// console.log(Buffer.from([0x00, 0x00, 0x0c, 0x3a]));
// let count = 3130;
// let buf = Buffer.alloc(4);
// buf.writeUInt32BE(3130);
// // let n = buf.readUInt32BE();
// // let buf = Buffer.from('v');
// // let n = buf.readUInt32BE();
// console.log(buf.toString('utf-8'));
// console.log(Buffer.from('abcdeabcde', 'ascii').length);

// let buf = Buffer.allocUnsafeSlow(12).fill(0); // 默认为0
// let buf = Buffer.alloc(6); // 默认为0
// let now = Date.now();
// console.log('now: %d', now);
// buf.writeUIntBE(15318867552);
// console.log(buf);
// // buf.writeUInt32LE(1531886755245);
// console.log('buf length: %d', buf.length);

// var buf = new Buffer(6);
 
let buf = Buffer.allocUnsafe(8); // 默认为0
let now = Date.now();
console.log('now: %d', now);
// buf.writeIntLE(now, 0, 8);
buf.writeIntLE(1531889030648, 0, 8);
console.log('buf length: %d', buf.length);
console.log(buf.readUIntLE(0, 8));
