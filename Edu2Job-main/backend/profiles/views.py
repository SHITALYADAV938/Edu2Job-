from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .models import UserProfile, JobApplication
from .serializers import UserProfileSerializer, JobApplicationSerializer

class MyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


# Job Application Views
class MyJobApplicationsView(generics.ListCreateAPIView):
    """List and create job applications for authenticated users"""
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return JobApplication.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_job_applications(request):
    """Get all job applications for admin"""
    applications = JobApplication.objects.select_related('user').all()
    serializer = JobApplicationSerializer(applications, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def update_job_application_status(request, application_id):
    """Update job application status (admin only)"""
    try:
        application = JobApplication.objects.get(id=application_id)
        new_status = request.data.get('status')
        
        if new_status in ['pending', 'shortlisted', 'rejected', 'hired']:
            application.status = new_status
            application.save()
            serializer = JobApplicationSerializer(application)
            return Response(serializer.data)
        else:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
    except JobApplication.DoesNotExist:
        return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)
