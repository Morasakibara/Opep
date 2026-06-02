import * as crypto from 'crypto';

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

export async function generateTicketQR(payload: TicketPayload, privateKeyPem: string): Promise<string> {
  const payloadStr = JSON.stringify(payload);
  const payloadBase64 = Buffer.from(payloadStr).toString('base64');
  
  const signer = crypto.createSign('SHA256');
  signer.update(payloadStr);
  signer.end();
  
  const signature = signer.sign({
    key: privateKeyPem,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
  }, 'base64');
  
  return `${payloadBase64}.${signature}`;
}

export function validateTicketQR(
  qrString: string,
  publicKeyPem: string,
  revokedTicketIds: string[] = []
): { valid: boolean; payload?: TicketPayload; reason?: string } {
  const [payloadBase64, signature] = qrString.split('.');
  if (!payloadBase64 || !signature) {
    return { valid: false, reason: 'Format invalide' };
  }
  
  const payloadStr = Buffer.from(payloadBase64, 'base64').toString();
  const payload: TicketPayload = JSON.parse(payloadStr);
  
  const verifier = crypto.createVerify('SHA256');
  verifier.update(payloadStr);
  verifier.end();
  
  const isValidSignature = verifier.verify({
    key: publicKeyPem,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
  }, signature, 'base64');
  
  if (!isValidSignature) {
    return { valid: false, reason: 'Signature invalide' };
  }
  
  if (revokedTicketIds.includes(payload.ticketId)) {
    return { valid: false, reason: 'Ticket révoqué' };
  }
  
  if (new Date(payload.validUntil) < new Date()) {
    return { valid: false, reason: 'Ticket expiré' };
  }
  
  return { valid: true, payload };
}
