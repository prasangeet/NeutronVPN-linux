#!/usr/bin/env bash
# Stop WireGuard server

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WG_INTERFACE="wg0"

# Bring down the interface
sudo ip link set down dev $WG_INTERFACE 2>/dev/null
sudo ip link delete dev $WG_INTERFACE 2>/dev/null

# Remove NAT rules
INTERNET_NIC=$(ip route get 8.8.8.8 | awk '{for(i=1;i<=NF;i++){if($i=="dev"){print $(i+1); exit}}}')
if [[ -n $INTERNET_NIC ]]; then
    sudo iptables -D FORWARD -i $WG_INTERFACE -o $INTERNET_NIC -j ACCEPT 2>/dev/null
    sudo iptables -D FORWARD -i $INTERNET_NIC -o $WG_INTERFACE -m state --state RELATED,ESTABLISHED -j ACCEPT 2>/dev/null
    sudo iptables -t nat -D POSTROUTING -o $INTERNET_NIC -j MASQUERADE 2>/dev/null
fi

echo "🛑 WireGuard server $WG_INTERFACE stopped"