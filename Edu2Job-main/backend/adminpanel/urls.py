from django.urls import path
from .views import (
    admin_stats, 
    admin_users_list, 
    update_user_status, 
    admin_analytics_data
)
from profiles.views import admin_job_applications, update_job_application_status

urlpatterns = [
    path('stats/', admin_stats, name='admin_stats'),
    path('users/', admin_users_list, name='admin_users_list'),
    path('user/<int:user_id>/status/', update_user_status, name='update_user_status'), # New
    path('analytics-data/', admin_analytics_data, name='admin_analytics_data'), # New
    path('job-applications/', admin_job_applications, name='admin_job_applications'),
    path('job-applications/<int:application_id>/status/', update_job_application_status, name='update_job_application_status'),
]