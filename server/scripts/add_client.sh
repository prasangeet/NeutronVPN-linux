#!/usr/bin/env zsh
# Usage: ./add_client.sh client_name

CLIENT_NAME=$1
if [[ -z $CLIENT_NAME ]]; then
    echo "Usage: $0 <client_name>"
    exit 1
fi

BASE_DIR=$(dirname $0)/..
KEYS_DIR="$BASE_DIR/keys"
mkdir -p $KEYS_DIR/clients

# Generate client keys
CLIENT_PRIV=$(wg genkey)
CLIENT_PUB=$(echo $CLIENT_PRIV | wg pubkey)

echo $CLIENT_PRIV > $KEYS_DIR/clients/${CLIENT_NAME}_private.key
echo $CLIENT_PUB > $KEYS_DIR/clients/${CLIENT_NAME}_public.key

# Assign next IP
CLIENT_COUNT=$(ls $KEYS_DIR/clients/*.conf 2>/dev/null | wc -l)
NEXT_IP="10.200.200.$((2 + CLIENT_COUNT))"

# Client config
SERVER_PUBLIC_IP="64.227.143.96"  # <-- replace with real public IP
cat > $KEYS_DIR/clients/${CLIENT_NAME}.conf <<EOF
[Interface]
PrivateKey = $CLIENT_PRIV
Address = $NEXT_IP/24
DNS = 1.1.1.1

[Peer]
PublicKey = $(cat $KEYS_DIR/server_public.key)
Endpoint = $SERVER_PUBLIC_IP:51820
AllowedIPs = 0.0.0.0/0
EOF

# Add peer if server is running
if sudo wg show wg0 &>/dev/null; then
    sudo wg set wg0 peer $CLIENT_PUB allowed-ips $NEXT_IP/32
    echo "Client $CLIENT_NAME added and peer set on server."
else
    echo "Client $CLIENT_NAME added. Start server to activate peer."
fi
