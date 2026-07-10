#!/bin/bash
# OPEP - RSA Key Generation Script
# Usage: bash scripts/generate-keys.sh
# Or via npm: npm run keygen (from apps/api)

set -e

KEYS_DIR="${1:-apps/api/keys}"

echo "=== OPEP RSA Key Generation ==="
echo "Keys directory: $KEYS_DIR"

# Create keys directory if it doesn't exist
mkdir -p "$KEYS_DIR"

# Check if openssl is available
if ! command -v openssl &> /dev/null; then
    echo "ERROR: openssl is not installed. Please install it first."
    exit 1
fi

# Check if keys already exist
if [ -f "$KEYS_DIR/private.pem" ] || [ -f "$KEYS_DIR/public.pem" ]; then
    echo "WARNING: RSA keys already exist in $KEYS_DIR"
    read -p "Overwrite? (y/N): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "Aborted."
        exit 0
    fi
fi

# Generate RSA 2048-bit private key
echo "Generating RSA 2048-bit private key..."
openssl genrsa -out "$KEYS_DIR/private.pem" 2048
chmod 600 "$KEYS_DIR/private.pem"

# Extract public key
echo "Extracting public key..."
openssl rsa -in "$KEYS_DIR/private.pem" -pubout -out "$KEYS_DIR/public.pem"

# Add keys to .gitignore if not already present
if [ -f ".gitignore" ]; then
    if ! grep -q "apps/api/keys/" .gitignore 2>/dev/null; then
        echo "" >> .gitignore
        echo "# RSA keys (generated locally, never commit)" >> .gitignore
        echo "apps/api/keys/" >> .gitignore
        echo "Added apps/api/keys/ to .gitignore"
    fi
fi

echo ""
echo "=== Keys generated successfully ==="
echo "Private key: $KEYS_DIR/private.pem"
echo "Public key:  $KEYS_DIR/public.pem"
echo ""
echo "Private key fingerprint:"
openssl pkey -in "$KEYS_DIR/private.pem" -pubout -outform der | openssl dgst -sha256
echo ""
echo "To use these keys, set in .env:"
echo "RSA_PRIVATE_KEY_PATH=./keys/private.pem"
echo "RSA_PUBLIC_KEY_PATH=./keys/public.pem"
