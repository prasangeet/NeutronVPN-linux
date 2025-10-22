#!/usr/bin/env bash
# Minimal WireGuard Server Setup Script

# --- Resolve script directory ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KEYS_DIR="$SCRIPT_DIR/../keys"
WG_INTERFACE="wg0"
SERVER_PRIV_KEY_FILE="$KEYS_DIR/server_private.key"

# Check server key
if [[ ! -f $SERVER_PRIV_KEY_FILE ]]; then
    echo "❌ Server private key not found at $SERVER_PRIV_KEY_FILE"
    exit 1
fi

SERVER_PRIV_KEY=$(cat $SERVER_PRIV_KEY_FILE)

# Detect internet-facing NIC automatically
INTERNET_NIC=$(ip route get 8.8.8.8 | awk '{for(i=1;i<=NF;i++){if($i=="dev"){print $(i+1); exit}}}')
if [[ -z $INTERNET_NIC ]]; then
    echo "❌ Could not detect internet NIC."
    exit 1
fi
echo "🌐 Using NIC: $INTERNET_NIC"

# Setup WireGuard interface
sudo ip link add dev $WG_INTERFACE type wireguard 2>/dev/null
sudo ip address add 10.200.200.1/24 dev $WG_INTERFACE
echo $SERVER_PRIV_KEY | sudo tee /tmp/server_private.key >/dev/null
sudo chmod 600 /tmp/server_private.key
sudo wg set $WG_INTERFACE private-key /tmp/server_private.key listen-port 51820
rm -f /tmp/server_private.key

# Enable IP forwarding
sudo sysctl -w net.ipv4.ip_forward=1

# NAT and firewall rules
sudo iptables -P FORWARD ACCEPT
sudo iptables -A FORWARD -i $WG_INTERFACE -o $INTERNET_NIC -j ACCEPT
sudo iptables -A FORWARD -i $INTERNET_NIC -o $WG_INTERFACE -m state --state RELATED,ESTABLISHED -j ACCEPT
sudo iptables -t nat -A POSTROUTING -o $INTERNET_NIC -j MASQUERADE

# Bring up the interface
sudo ip link set up dev $WG_INTERFACE

echo "✅ WireGuard server started on $WG_INTERFACE (Port 51820)"
