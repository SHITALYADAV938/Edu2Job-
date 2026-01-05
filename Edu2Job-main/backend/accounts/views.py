# accounts/views.py

from django.conf import settings

from rest_framework import generics, permissions, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from .models import User
from .serializers import RegisterSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]   # anyone can register


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class GoogleLoginView(APIView):
    """
    Frontend nundi Google id_token vastundi.
    Manam verify chesi -> user create/get -> JWT (access, refresh) return chestam.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get("token")
        role = request.data.get("role", "USER")  # Default to USER if not provided
        
        # Validate role
        if role not in ["USER", "ADMIN"]:
            role = "USER"  # Default to USER if invalid role provided
        
        if not token:
            return Response(
                {"detail": "Token missing"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Verify token with Google
            idinfo = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID,   # settings.py lo set chesam
            )
            if idinfo["iss"] not in [
                "accounts.google.com",
                "https://accounts.google.com",
            ]:
                raise ValueError("Wrong issuer")

        except Exception:
            return Response(
                {"detail": "Invalid Google token"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = idinfo.get("email")
        name = idinfo.get("name", "")
        username = (email.split("@")[0] if email else name.replace(" ", "").lower())

        if not email:
            return Response(
                {"detail": "Email not provided by Google"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # get or create user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={"username": username, "role": role},
        )

        if created:
            user.is_active = True
            # Update role if provided and user is new
            if role in ["USER", "ADMIN"]:
                user.role = role
            user.save()
        else:
            # For existing users, return a flag indicating they need to select role
            # (though we won't change existing user's role automatically)
            pass

        # Issue JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "username": user.username,
                    "role": user.role,
                },
                "is_new_user": created,
            },
            status=status.HTTP_200_OK,
        )
