from django.urls import path
from . import views

urlpatterns = [
    # VPN Client URLs
    path('clients/', views.list_clients, name='list_clients'),  # GET all clients for user
    path('clients/add/', views.add_client, name='add_client'),  # POST create client
    path('clients/<int:client_id>/', views.client_details, name='client_details'),  # GET client info
    path('clients/<int:client_id>/config/', views.get_client_config, name='get_client_config'),  # GET config
    path('clients/<int:client_id>/update/', views.update_client, name='update_client'),  # PUT update client
    path('clients/<int:client_id>/delete/', views.delete_client, name='delete_client'),  # DELETE client

    # VPN Server URLs
    path('servers/', views.list_servers, name='list_servers'),  # GET all servers
    path('servers/add/', views.add_server, name='add_server'),  # POST add server
    path('servers/<int:server_id>/', views.server_details, name='server_details'),  # GET server info
    path('servers/<int:server_id>/update/', views.update_server, name='update_server'),  # PUT update server
    path('servers/<int:server_id>/delete/', views.delete_server, name='delete_server'),  # DELETE server
]
