from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "username", "role")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default="USER", required=False)

    class Meta:
        model = User
        fields = ("id", "email", "username", "password", "role")

    def create(self, validated_data):
        password = validated_data.pop("password")
        role = validated_data.pop("role", "USER")
        user = User.objects.create_user(password=password, role=role, **validated_data)
        return user
