from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

# ----------------------------
# Helper to create JWT tokens
# ----------------------------
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# ----------------------------
# Register View
# ----------------------------
@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    role = request.data.get('role', 'user')

    if not username or not password:
        return Response({'error': 'Username and password are required.'},
                        status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'},
                        status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password, role=role)
    tokens = get_tokens_for_user(user)
    return Response({
        'message': 'User registered successfully.',
        'tokens': tokens,
        'user': {'username': user.username, 'role': user.role}
    }, status=status.HTTP_201_CREATED)

# ----------------------------
# Login View
# ----------------------------
@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if not user:
        return Response({'error': 'Invalid credentials'}, status=401)

    tokens = get_tokens_for_user(user)
    return Response({
        'tokens': tokens,
        'user': {'username': user.username, 'role': user.role}
    }, status=status.HTTP_200_OK)

# ----------------------------
# Profile View
# ----------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    return Response({
        'username': user.username,
        'role': user.role
    })
