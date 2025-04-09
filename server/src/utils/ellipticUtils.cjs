// Import the elliptic and crypto libraries
const EC = require('elliptic').ec;
const crypto = require('crypto');

// Initialize elliptic curve (secp256k1)
const ec = new EC('secp256k1');

/**
 * Generates a random public-private key pair.
 *
 * @returns {Object} - An object containing the private key and public key in hexadecimal format.
 */
function generateKeyPair() {
    const keyPair = ec.genKeyPair();
    const privateKey = keyPair.getPrivate('hex');
    const publicKey = keyPair.getPublic(true, 'hex'); // true for compressed format

    return { privateKey, publicKey };
}

/**
 * Creates a digital signature for a transaction.
 *
 * @param {string} senderPublicKey - Sender's public key (compressed hex format).
 * @param {string} recipient - Recipient's address or public key.
 * @param {number} amt - Transaction amount.
 * @param {number} nonce - Transaction nonce.
 * @param {string} privateKeyHex - Sender's private key (hex format).
 * @returns {string} - The digital signature for the transaction.
 */
function createSignature(tx, privateKeyHex) {
    const dataToSign = JSON.stringify({
        sender: tx.sender,
        recipient: tx.recipient,
        amt: tx.amt,
        data: tx.data || null,
        nonce: tx.nonce
    });
    const hash = crypto.createHash('sha256').update(dataToSign).digest('hex');
    const keyPair = ec.keyFromPrivate(privateKeyHex);
    return keyPair.sign(hash).toDER('hex');
}


/**
 * Verifies a digital signature for a transaction.
 *
 * @param {string} senderPublicKey - Sender's public key (compressed hex format).
 * @param {string} recipient - Recipient's address or public key.
 * @param {number} amt - Transaction amount.
 * @param {number} nonce - Transaction nonce.
 * @param {string} signatureHex - The digital signature to verify (hex format).
 * @returns {boolean} - Returns true if the signature is valid, false otherwise.
 */
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

// Export the functions for use in other modules
module.exports = { generateKeyPair, createSignature, verifySignature };

// Example usage:
// const { generateKeyPair, createSignature, verifySignature } = require('./your_module_name');
// const keys = generateKeyPair();
// const signature = createSignature(keys.publicKey, "recipient_address", 100, 1, keys.privateKey);
// console.log("Signature valid:", verifySignature(keys.publicKey, "recipient_address", 100, 1, signature));
