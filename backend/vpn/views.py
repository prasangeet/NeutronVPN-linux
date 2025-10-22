from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from .models import VPNServer, VPNClient
from django.shortcuts import get_object_or_404
import paramiko
import os
from io import StringIO
from django.conf import settings
from dotenv import load_dotenv

load_dotenv()

# Create your views here.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_client(request):
    client_name = request.data.get('name')
    server_id = request.data.get('server_id')

    if not client_name or not server_id:
        return Response({'error': 'Client name and server ID are required.'},
                        status=status.HTTP_400_BAD_REQUEST)
    
    server = get_object_or_404(VPNServer, id=server_id, is_active=True)
    
    private_key, public_key, _, _ = generate_client_keys(client_name)

    ip_last = VPNClient.objects.filter(vpn_server=server).count() + 2
    ip_address = f"10.200.200.{ip_last}"

    client = VPNClient.objects.create(
        user=request.user,
        vpn_server=server,
        client_public_key=public_key,
        client_private_key=private_key,
        assigned_ip=ip_address,
        is_active=True
    )

    # Add the peer to the remote WireGuard server
    add_peer_remote(
        server_ip=server.ip_address,
        interface=os.getenv("SERVER_INTERFACE_NAME"),
        client_public_key=client.client_public_key,
        client_ip=client.assigned_ip,
        ssh_user=os.getenv("SSH_USER"),
        ssh_port=int(os.getenv("SSH_PORT", 22)),
        ssh_private_key=os.getenv("SSH_KEY"),
        ssh_passphrase=os.getenv("SSH_KEY_PASSPHRASE")  # <-- passphrase here
    )

    return Response({
        'message': 'VPN Client created successfully.',
        'client': {
            'id': client.id,
            'user': client.user.username,
            'vpn_server': client.vpn_server.name,
            'assigned_ip': client.assigned_ip,
            'client_public_key': client.client_public_key,
        }
    }, status=status.HTTP_201_CREATED)


# ----------------------------
# Add Peer Remote Function
# ----------------------------
def add_peer_remote(server_ip, interface, client_public_key, client_ip, ssh_user, ssh_port=22, ssh_private_key=None, ssh_passphrase=None):
    """
    Adds a WireGuard client to a remote server via SSH.
    """
    if not ssh_private_key:
        raise Exception("SSH_PRIVATE_KEY not set in environment.")

    key_stream = StringIO(ssh_private_key)
    key = paramiko.Ed25519Key.from_private_key(key_stream, password=ssh_passphrase)

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname=server_ip, username=ssh_user, pkey=key, port=ssh_port)

    cmd = f"sudo wg set {interface} peer {client_public_key} allowed-ips {client_ip}/32"
    stdin, stdout, stderr = ssh.exec_command(cmd)
    err = stderr.read().decode().strip()
    if err:
        print(f"Error adding peer: {err}")
    else:
        print(f"Peer {client_ip} added successfully to server {server_ip}.")

    ssh.close()

def generate_client_keys(client_name):
    import subprocess

    private_key = subprocess.check_output(['wg', 'genkey']).strip().decode()
    public_key = subprocess.check_output(
        ['wg', 'pubkey'], input=private_key.encode()
    ).strip().decode()

    preshared_key = subprocess.check_output(['wg', 'genpsk']).strip().decode()

    return private_key, public_key, preshared_key, None


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_clients(request):
    clients = VPNClient.objects.filter(user=request.user, is_active=True)
    client_list = [{
        'id': client.id,
        'vpn_server': client.vpn_server.name,
        'assigned_ip': client.assigned_ip,
        'created_at': client.created_at,
    } for client in clients]

    return Response({'clients': client_list}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_client_config(request, client_id):
    client = get_object_or_404(VPNClient, id=client_id, user=request.user, is_active=True)
    server = client.vpn_server

    config = f"""
[Interface]
PrivateKey = {client.client_private_key}
Address = {client.assigned_ip}/24
DNS = 1.1.1.1
[Peer]
PublicKey = {server.public_key}
Endpoint = {server.ip_address}:{server.port}
AllowedIPs = 0.0.0.0/0, ::/0
"""
    return Response({'config': config.strip()}, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_client(request, client_id):
    client = get_object_or_404(VPNClient, id=client_id, user=request.user, is_active=True)
    client.is_active = False
    client.save()
    return Response({'message': 'VPN Client deleted successfully.'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_servers(request):
    servers = VPNServer.objects.filter(is_active=True)
    server_list = [{
        'id': server.id,
        'name': server.name,
        'ip_address': server.ip_address,
        'location': server.location,
        'port': server.port,
    } for server in servers]

    return Response({'servers': server_list}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_server(request):
    name = request.data.get('name')
    ip_address = request.data.get('ip_address')
    location = request.data.get('location')
    port = request.data.get('port')
    public_key = request.data.get('public_key')

    if not all([name, ip_address, location, port, public_key]):
        return Response({'error': 'All fields are required.'},
                        status=status.HTTP_400_BAD_REQUEST)

    server = VPNServer.objects.create(
        name=name,
        ip_address=ip_address,
        location=location,
        port=port,
        public_key=public_key,
        is_active=True
    )

    return Response({
        'message': 'VPN Server added successfully.',
        'server': {
            'id': server.id,
            'name': server.name,
            'ip_address': server.ip_address,
            'location': server.location,
            'port': server.port,
        }
    }, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_server(request, server_id):
    server = get_object_or_404(VPNServer, id=server_id, is_active=True)
    server.is_active = False
    server.save()
    return Response({'message': 'VPN Server deleted successfully.'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def server_details(request, server_id):
    server = get_object_or_404(VPNServer, id=server_id, is_active=True)
    server_info = {
        'id': server.id,
        'name': server.name,
        'ip_address': server.ip_address,
        'location': server.location,
        'port': server.port,
        'public_key': server.public_key,
    }
    return Response({'server': server_info}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def client_details(request, client_id):
    client = get_object_or_404(VPNClient, id=client_id, user=request.user, is_active=True)
    client_info = {
        'id': client.id,
        'vpn_server': client.vpn_server.name,
        'assigned_ip': client.assigned_ip,
        'created_at': client.created_at,
        'client_public_key': client.client_public_key,
    }
    return Response({'client': client_info}, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_server(request, server_id):
    server = get_object_or_404(VPNServer, id=server_id, is_active=True)

    name = request.POST.get('name')
    ip_address = request.POST.get('ip_address')
    location = request.POST.get('location')
    port = request.POST.get('port')
    public_key = request.POST.get('public_key')

    if name:
        server.name = name
    if ip_address:
        server.ip_address = ip_address
    if location:
        server.location = location
    if port:
        server.port = port
    if public_key:
        server.public_key = public_key

    server.save()

    return Response({
        'message': 'VPN Server updated successfully.',
        'server': {
            'id': server.id,
            'name': server.name,
            'ip_address': server.ip_address,
            'location': server.location,
            'port': server.port,
        }
    }, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_client(request, client_id):
    client = get_object_or_404(VPNClient, id=client_id, user=request.user, is_active=True)

    assigned_ip = request.POST.get('assigned_ip')

    if assigned_ip :

        client.assigned_ip = assigned_ip
    client.save()
    return Response({
        'message': 'VPN Client updated successfully.',
        'client': {
            'id': client.id,
            'vpn_server': client.vpn_server.name,
            'assigned_ip': client.assigned_ip,
        }
    }, status=status.HTTP_200_OK)
