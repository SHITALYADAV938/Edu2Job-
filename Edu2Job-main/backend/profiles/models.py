from django.db import models
from django.conf import settings

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    # --- Personal Info ---
    phone = models.CharField(max_length=15, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    # --- Academic Info ---
    highest_degree = models.CharField(max_length=50, blank=True, null=True)
    branch = models.CharField(max_length=100, blank=True, null=True)
    college = models.CharField(max_length=200, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    
    cgpa = models.FloatField(blank=True, null=True, default=0.0)
    tenth_percentage = models.FloatField(null=True, blank=True, default=0.0)
    twelfth_percentage = models.FloatField(null=True, blank=True, default=0.0)

    # --- Skills & Certifications ---
    skills = models.TextField(blank=True, help_text="Comma-separated skills")
    soft_skills = models.TextField(blank=True)
    certifications = models.TextField(blank=True, null=True)

    # --- Social Links ---
    github = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)

    # --- NEW: RECRUITMENT STATUS (Admin Control) ---
    STATUS_CHOICES = (
        ('PENDING', 'Pending Review'),
        ('SHORTLISTED', 'Shortlisted'),
        ('REJECTED', 'Rejected'),
        ('HIRED', 'Hired'),
    )
    recruitment_status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='PENDING'
    )

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} profile"


class JobApplication(models.Model):
    """Model to store job applications submitted by students"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='job_applications')
    
    job_title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    job_link = models.URLField(blank=True, null=True)
    match_score = models.FloatField(null=True, blank=True, help_text="Match score percentage")
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
        ('hired', 'Hired'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-applied_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.job_title} at {self.company}"