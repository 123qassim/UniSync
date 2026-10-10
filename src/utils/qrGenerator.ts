/**
 * Real QR Code Generation Utility
 * Uses qrcode library to generate high-resolution scannable QR data URLs.
 */

import QRCode from 'qrcode';

export async function generateQRCodeDataUrl(
  text: string,
  options?: {
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }
): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: options?.width || 280,
      margin: options?.margin || 2,
      color: {
        dark: options?.color?.dark || '#0f172a', // dark navy / slate
        light: options?.color?.light || '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR code data URL:', err);
    // Fallback simple SVG data URI
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23f1f5f9"/><text x="100" y="100" font-family="sans-serif" font-size="12" text-anchor="middle" fill="%2364748b">QR Code</text></svg>`;
  }
}
