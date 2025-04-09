const EC = require('elliptic').ec;
const crypto = require('crypto');

const ec = new EC('secp256k1');

const privateKey = 'a460920b01cf300a1867a885d851fbea74799f39cb5d9f02dbe639c8b05d1a8b';
const publicKey = ec.keyFromPrivate(privateKey).getPublic(false, 'hex');

console.log(publicKey);

const transaction = {
    sender: publicKey,
    recipient: '046b296ad13754420f1240ac043ea882aaa0263768120e1c517616c0168ad91febfbc43307093d9ae7c5556971afd85bb860f1a2148941fb5bcf99449b359a9400',
    amt: 10,
    nonce: 3,
    data: null
};

function createSignature(tx, privateKeyHex) {
    const dataToSign = JSON.stringify({
        sender: tx.sender,
        recipient: tx.recipient,
        amt: String(tx.amt),
        data: tx.data || null,
        nonce: String(tx.nonce)
    });
    console.log("data to sign = ", dataToSign);
    const hash = crypto.createHash('sha256').update(dataToSign).digest('hex');
    const keyPair = ec.keyFromPrivate(privateKeyHex);
    return keyPair.sign(hash).toDER('hex');
}

function verifySignature(tx) {
    const dataToVerify = JSON.stringify({
        sender: tx.sender,
        recipient: tx.recipient,
        amt: String(tx.amt),
        data: tx.data || null,
        nonce: String(tx.nonce)
    });
    console.log("data to verify = ", dataToVerify);
    const hash = crypto.createHash('sha256').update(dataToVerify).digest('hex');
    console.log("hash = ", hash);
    console.log("sign = ", tx.sign);
    const key = ec.keyFromPublic(tx.sender, 'hex');
    return key.verify(hash, Buffer.from(tx.sign, 'hex'));
}

// 🔐 Create a valid signature
const signature = createSignature(transaction, privateKey);

// 📝 Attach signature to transaction
transaction.sign = signature;

// ✅ Now verify
const isValid = verifySignature(transaction);
console.log("Signature valid?", isValid);
