from django.urls import path
from .views import (
    MyProfileView,
    MyJobApplicationsView,
    admin_job_applications,
    update_job_application_status
)

urlpatterns = [
    path('me/', MyProfileView.as_view(), name='my_profile'),
    path('jobs/applied/', MyJobApplicationsView.as_view(), name='my_job_applications'),
    path('jobs/applied/<int:application_id>/status/', update_job_application_status, name='update_job_application_status'),
]
