"use client";

import React, { useContext, useEffect, useState, useRef } from 'react';
import { Box, Text, Icon , Stack, Button, Wrap, Flex, Heading, Divider, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react'
import { PeculiarFortifyCertificates } from '@peculiar/fortify-webcomponents-react';
import * as x509 from "@peculiar/x509";
import { useWebViewer } from '@/lib/hooks/useWebViewer';
import '@peculiar/fortify-webcomponents/dist/peculiar/peculiar.css';
import * as pkijs from 'pkijs'
import * as asn1js from 'asn1js';
import * as pvtsutils from 'pvtsutils';

enum SigningMethod {
    Certificate = "Certificate", 
    Device =  "Device",
}
function arrayBufferToBase64( buffer: any ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return btoa( binary );
}

function copy(src: any)  {
    var dst = new ArrayBuffer(src.byteLength);
    new Uint8Array(dst).set(new Uint8Array(src));
    return dst;
}

const HSMSigning = () => {
    const file = "digital_signature.pdf";
    const { instance, loadDocument, document, loadingDocument } = useWebViewer();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [signingMethod, setSigningMethod] = useState<SigningMethod>();

    useEffect(() =>{
        if(!instance.Core) return;
        instance.UI.loadDocument(`/files/${file}`);
        

    },[instance]);


    const handleContinueSimple = async (event: any) => {
        const { documentViewer, PDFNet, Annotations } = instance.Core;
        const { X509Certificate, DigitalSignatureField, DigestAlgorithm, ObjectIdentifier, SDFDoc } = PDFNet;

        // Get certficate information
        var provider = await event.detail.socketProvider.getCrypto(event.detail.providerId);
        provider.sign = provider.subtle.sign.bind(provider.subtle);

        var cert = await provider.certStorage.getItem(event.detail.certificateId);
        var privateKey = await provider.keyStorage.getItem(event.detail.privateKeyId);
        var certRawData = await provider.certStorage.exportCert('raw', cert);

        const encoder = new TextEncoder();
        const message = "This is a test message";

        const signedContent = await provider.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, encoder.encode(message));

        //console.log(window.btoa(String.fromCharCode.apply(null, new Uint8Array(signedContent))))
    };

    function formatPEM (raw: any, tag: any) {
        var pemString = pvtsutils.Convert.ToBase64(raw);
        var stringLength = pemString.length;
        var resultString = "";
    
        for (var i = 0, count = 0; i < stringLength; i++, count++) {
          if (count > 63) {
            resultString = resultString + '\n';
            count = 0;
          }
    
          resultString = resultString + pemString[i];
        }
    
        return '-----BEGIN ' + tag.toUpperCase() + '-----\n' + resultString + '\n-----END ' + tag.toUpperCase() + '-----\n';
      }

    const signContent = async (event: any, digest: ArrayBuffer)=> {
        try {
            var provider = await event.detail.socketProvider.getCrypto(event.detail.providerId);
      
            provider.sign = provider.subtle.sign.bind(provider.subtle);
      
            pkijs.setEngine(
              "newEngine",
              provider,
              new pkijs.CryptoEngine({
                name: "",
                crypto: provider,
                subtle: provider.subtle,
              })
            );
      
            var cert = await provider.certStorage.getItem(event.detail.certificateId);
            var privateKey = await provider.keyStorage.getItem(event.detail.privateKeyId);
            var certRawData = await provider.certStorage.exportCert('raw', cert);
      
            var pkiCert = new pkijs.Certificate({
              schema: asn1js.fromBER(certRawData).result,
            });
      
            var signedData = new pkijs.SignedData({
              version: 1,
              encapContentInfo: new pkijs.EncapsulatedContentInfo({
                eContentType: "1.2.840.113549.1.7.1", // "data" content type
              }),
              signerInfos: [
                new pkijs.SignerInfo({
                  version: 1,
                  sid: new pkijs.IssuerAndSerialNumber({
                    issuer: pkiCert.issuer,
                    serialNumber: pkiCert.serialNumber,
                  }),
                }),
              ],
              certificates: [pkiCert],
            });
      
            var contentInfo = new pkijs.EncapsulatedContentInfo({
              eContent: new asn1js.OctetString({
                valueHex: digest,
              }),
            });
      
            signedData.encapContentInfo.eContent = contentInfo.eContent;
      
            await signedData.sign(privateKey, 0, "sha-256");
      
            var cms = new pkijs.ContentInfo({
              contentType: "1.2.840.113549.1.7.2",
              content: signedData.toSchema(true),
            });
            var result = cms.toSchema().toBER(false);
            var pem = formatPEM(result, "CMS");
      
            console.log(pem);
          } catch (error) {
            alert('Failed to sign CMS');
            console.error(error);
          }
    }
    
    const handleContinue = async (event: any) => {
        const { documentViewer, PDFNet, Annotations } = instance?.Core;
        const { X509Certificate, DigitalSignatureField, DigestAlgorithm, ObjectIdentifier, SDFDoc } = PDFNet;

        // Get certficate information
        var provider = await event.detail.socketProvider.getCrypto(event.detail.providerId);
        provider.sign = provider.subtle.sign.bind(provider.subtle);

        var cert = await provider.certStorage.getItem(event.detail.certificateId);
        var privateKey = await provider.keyStorage.getItem(event.detail.privateKeyId);
        var certRawData = await provider.certStorage.exportCert('raw', cert);
        var encoder = new TextEncoder();

        const certificate = new x509.X509Certificate(certRawData);
        const signer_cert = await X509Certificate.createFromBuffer(encoder.encode(certificate.toString("pem")))
        var chain_certs = [signer_cert];

        const document = await documentViewer.getDocument().getPDFDoc();

        let signature_field = await document.getField("SignatureFormField 1");
        let digital_signature_field = await DigitalSignatureField.createFromField(signature_field);
       
        await digital_signature_field.createSigDictForCustomSigning(
            "Adobe.PPKLite",
            DigitalSignatureField.SubFilterType.e_adbe_pkcs7_detached,
            10000
        );

        await document.saveMemoryBuffer(PDFNet.SDFDoc.SaveOptions.e_incremental);
        
        const pdf_digest = await digital_signature_field.calculateDigest(DigestAlgorithm.Type.e_SHA256);
        const pades_versioned_ess_signing_cert_attribute = await DigitalSignatureField.generateESSSigningCertPAdESAttribute(signer_cert, DigestAlgorithm.Type.e_SHA256);

        console.log(pdf_digest)
        console.log(pvtsutils.BufferSourceConverter.toArrayBuffer(pdf_digest))
        // generate the signedAttrs component of CMS
        const signed_attributes = await DigitalSignatureField.generateCMSSignedAttributes(pvtsutils.BufferSourceConverter.toArrayBuffer(pdf_digest), pvtsutils.BufferSourceConverter.toArrayBuffer(pades_versioned_ess_signing_cert_attribute));
        
        // Calculate the digest of the signedAttrs (i.e. not the PDF digest, this time).
        const signed_attributes_digest = await DigestAlgorithm.calculateDigest(DigestAlgorithm.Type.e_SHA256, new Uint8Array(signed_attributes));
        const signed_digest = await provider.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, signed_attributes_digest.buffer);

        //const digest_algorithm_oid = await ObjectIdentifier.createFromDigestAlgorithm(DigestAlgorithm.Type.e_SHA256);
        const digest_algorithm_oid = await ObjectIdentifier.createFromIntArray([2,16,840,1,101,3,4,2,1]);
        const signature_algorithm_oid = await ObjectIdentifier.createFromIntArray([1, 2, 840, 113549, 1, 11]);

                                                                                   
        const cms_signature = await DigitalSignatureField.generateCMSSignature(
            signer_cert, 
            chain_certs, 
            digest_algorithm_oid, 
            signature_algorithm_oid, 
            signed_digest, 
            signed_attributes.buffer);

        const docbuf = await document.saveCustomSignatureBuffer(cms_signature, digital_signature_field);
        const blob = new Blob([docbuf], { type: 'application/pdf' });
        instance.UI.loadDocument(blob)
    };
  return (
    <Box>
        <Stack spacing={'3'}>
            <Heading>HSM Signing</Heading>
            <Divider />
            <Text>(Add instructions).</Text>
            <Divider />
            <Button onClick={onOpen}>Sign Document</Button>

        </Stack>

        <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Select Certificate</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                <PeculiarFortifyCertificates
                    id="fortify-certificates-wc"
                    language="en"
                    hideFooter
                    filters={{ 
                       // providerNameMatch: "Windows CryptoAPI",
                      //  onlySmartcards: true, 
                        onlyWithPrivateKey: true,
                        //keyUsage: ['digitalSignature']
                    }}
                    onSelectionSuccess={handleContinue}
                />
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </Box>
  );
}

export default HSMSigning;