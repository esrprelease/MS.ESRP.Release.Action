"use strict";
//https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/certificate-credentials.md
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPFX = void 0;
const forge = require('node-forge');
/**
 * @param {string} pfx: certificate + private key combination in pfx format
 * @param {string} passphrase: passphrase used to encrypt pfx file
 * @returns {Object}
 */
function convertPFX(certString, passphrase = null) {
    const p12Der = forge.util.decode64(certString);
    const p12Asn1 = forge.asn1.fromDer(p12Der);
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1);
    // Retrieve key data
    const keyData = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[forge.pki.oids.pkcs8ShroudedKeyBag]
        .concat(p12.getBags({ bagType: forge.pki.oids.keyBag })[forge.pki.oids.keyBag]);
    // Retrieve certificate data
    const certBags = p12.getBags({ bagType: forge.pki.oids.certBag })[forge.pki.oids.certBag];
    const certificate = forge.pki.certificateToPem(certBags[0].cert);
    // Convert a Forge private key to an ASN.1 RSAPrivateKey
    const rsaPrivateKey = forge.pki.privateKeyToAsn1(keyData[0].key);
    // Wrap an RSAPrivateKey ASN.1 object in a PKCS#8 ASN.1 PrivateKeyInfo
    const privateKeyInfo = forge.pki.wrapRsaPrivateKey(rsaPrivateKey);
    // Convert a PKCS#8 ASN.1 PrivateKeyInfo to PEM
    const privateKey = forge.pki.privateKeyInfoToPem(privateKeyInfo);
    return {
        certificate: certificate,
        key: privateKey
    };
}
exports.convertPFX = convertPFX;
