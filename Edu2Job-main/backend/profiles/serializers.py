from rest_framework import serializers
from .models import UserProfile, JobApplication

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['user']
        
        # IMPORTANT: Ee setting lekapothe empty URL pampinappudu error vastundi
        extra_kwargs = {
            'github': {'allow_blank': True},
            'linkedin': {'allow_blank': True},
            'phone': {'allow_blank': True},
            'highest_degree': {'allow_blank': True},
            'branch': {'allow_blank': True},
            'college': {'allow_blank': True},
            'state': {'allow_blank': True},
        }


class JobApplicationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = JobApplication
        fields = '__all__'
        read_only_fields = ['user', 'applied_at', 'updated_at']