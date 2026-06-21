const crypto = require('crypto');

const secretBase64 = 'MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5MA==';
const secret = Buffer.from(secretBase64, 'base64');

const header = 'eyJhbGciOiJIUzI1NiJ9';
const payload = 'eyJzdWIiOiJodW5nbGUiLCJpYXQiOjE3ODE2OTIzNjAsImV4cCI6MTc4MTc3ODc2MH0';
const data = header + '.' + payload;

const signature = crypto.createHmac('sha256', secret).update(data).digest('base64url');

console.log("Expected signature:", signature);
console.log("Actual signature:  ", '6s6Ee_5mHaQwfADpC17y-fJAIZqID-XNelrZg2_kFI0');
console.log("Match:", signature === '6s6Ee_5mHaQwfADpC17y-fJAIZqID-XNelrZg2_kFI0');
