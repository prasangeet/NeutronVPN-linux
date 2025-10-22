#!/usr/bin/env zsh
# Usage: ./disconnect.sh client_config.conf
CLIENT_CONF=$1

if [[ -z $CLIENT_CONF ]]; then
    echo "Usage: $0 <client_config.conf>"
    exit 1
fi

# Bring down the WireGuard interface
sudo wg-quick down $CLIENT_CONF

echo "Client disconnected and VPN interface removed."
