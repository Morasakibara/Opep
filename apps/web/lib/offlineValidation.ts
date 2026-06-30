/**
 * Client-side QR ticket validation using Web Crypto API.
 * This allows offline validation without requiring an API call.
 */

export interface TicketPayload {
  ticketId: string;
  reservationCode: string;
  passengerName: string;
  seatNumber: string;
  tripId: string;
  departureCity: string;
  arrivalCity: string;
  departureDateTime: string;
  validUntil: string;
  agencyId: string;
  issuedAt: string;
}

interface ValidationResult {
  valid: boolean;
  payload?: TicketPayload;
  reason?: string;
}

/**
 * Convert a PEM-formatted RSA public key to a CryptoKey for the Web Crypto API.
 * Supports both SPKI (-----BEGIN PUBLIC KEY-----) and PKCS#1 (-----BEGIN RSA PUBLIC KEY-----) formats.
 */
async function importPublicKey(pem: string): Promise<CryptoKey> {
  // Detect format and strip header/footer
  const isPkcs1 = pem.includes('-----BEGIN RSA PUBLIC KEY-----');
  pem = pem
    .replace(/-----BEGIN (RSA )?PUBLIC KEY-----/, '')
    .replace(/-----END (RSA )?PUBLIC KEY-----/, '')
    .replace(/\s/g, '');
  
  let keyData: ArrayBuffer = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0)).buffer;

  if (isPkcs1) {
    // PKCS#1 to SPKI conversion: wrap raw RSA key in SubjectPublicKeyInfo
    // SPKI header for RSA (OID 1.2.840.113549.1.1.1) with 2048-bit key
    const spkiHeader = new Uint8Array([
      0x30, 0x82, 0x01, 0x22, 0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86,
      0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01, 0x05, 0x00, 0x03,
      0x82, 0x01, 0x0f, 0x00
    ]);
    const pkcs1Der = new Uint8Array(keyData);
    const combined = new Uint8Array(spkiHeader.length + pkcs1Der.length);
    combined.set(spkiHeader);
    combined.set(pkcs1Der, spkiHeader.length);
    keyData = combined.buffer;
  }

  return crypto.subtle.importKey(
    'spki',
    keyData,
    {
      name: 'RSA-PSS',
      hash: { name: 'SHA-256' },
    },
    false,
    ['verify']
  );
}

/**
 * Validate a QR ticket string offline using the provided RSA public key.
 * QR format: base64Payload.base64Signature
 */
export async function validateTicketOffline(
  qrString: string,
  publicKeyPem: string,
  revokedTicketIds: string[] = []
): Promise<ValidationResult> {
  try {
    const [payloadBase64, signatureBase64] = qrString.split('.');
    
    if (!payloadBase64 || !signatureBase64) {
      return { valid: false, reason: 'Format du QR code invalide' };
    }

    // Decode payload
    const payloadStr = atob(payloadBase64);
    const payload: TicketPayload = JSON.parse(payloadStr);

    // Import the public key
    let publicKey: CryptoKey;
    try {
      publicKey = await importPublicKey(publicKeyPem);
    } catch {
      return { valid: false, reason: 'Cle publique invalide' };
    }

    // Verify signature
    const dataBuffer = new TextEncoder().encode(payloadStr);
    const signatureBuffer = Uint8Array.from(atob(signatureBase64), (c) => c.charCodeAt(0));

    const isValid = await crypto.subtle.verify(
      {
        name: 'RSA-PSS',
        saltLength: 32, // Same as RSA_PSS_SALTLEN_DIGEST
      },
      publicKey,
      signatureBuffer,
      dataBuffer
    );

    if (!isValid) {
      return { valid: false, reason: 'Signature invalide' };
    }

    // Check if revoked
    if (revokedTicketIds.includes(payload.ticketId)) {
      return { valid: false, reason: 'Ticket revoque' };
    }

    // Check expiration
    if (new Date(payload.validUntil) < new Date()) {
      return { valid: false, reason: 'Ticket expire' };
    }

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, reason: `Erreur de validation: ${err.message || 'Inconnue'}` };
  }
}


