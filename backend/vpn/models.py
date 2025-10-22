from django.db import models

# Create your models here.
class VPNServer(models.Model):
    name = models.CharField(max_length=100)
    ip_address = models.GenericIPAddressField()
    location = models.CharField(max_length=100)
    port = models.IntegerField()
    public_key = models.TextField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"VPNServer {self.name} - {self.ip_address}"


class VPNClient(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    vpn_server = models.ForeignKey(VPNServer, on_delete=models.CASCADE)
    client_public_key = models.TextField()
    client_private_key = models.TextField()
    assigned_ip = models.GenericIPAddressField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"VPNClient {self.user.username} - {self.vpn_server.name}"