from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Organization(models.Model):
    """Organization model for multi-tenancy"""
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    admin = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='organizations')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']


class Department(models.Model):
    """Department model within organizations"""
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.organization.name}"

    class Meta:
        unique_together = ('organization', 'name')
        ordering = ['name']


class Parcel(models.Model):
    """Parcel model for tracking parcels and letters"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('received', 'Received'),
        ('in_transit', 'In Transit'),
        ('delivered', 'Delivered'),
        ('lost', 'Lost'),
        ('returned', 'Returned'),
    ]

    TYPE_CHOICES = [
        ('parcel', 'Parcel'),
        ('letter', 'Letter'),
        ('package', 'Package'),
        ('document', 'Document'),
    ]

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='parcels')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='parcels')
    
    # Tracking
    tracking_number = models.CharField(max_length=100, unique=True, db_index=True)
    parcel_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='parcel')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Sender info
    sender_name = models.CharField(max_length=255)
    sender_email = models.EmailField(blank=True, null=True)
    sender_phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Receiver info
    receiver_name = models.CharField(max_length=255)
    receiver_email = models.EmailField(blank=True, null=True)
    receiver_phone = models.CharField(max_length=20, blank=True, null=True)
    receiver_address = models.TextField(blank=True, null=True)
    
    # Parcel details
    weight = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    value = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    
    # Location tracking
    current_location = models.CharField(max_length=255, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    delivered_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.tracking_number} - {self.receiver_name}"

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['tracking_number']),
            models.Index(fields=['status']),
            models.Index(fields=['organization', '-created_at']),
        ]


class ParcelStatusHistory(models.Model):
    """Track status changes of parcels"""
    parcel = models.ForeignKey(Parcel, on_delete=models.CASCADE, related_name='status_history')
    previous_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='status_changes')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.parcel.tracking_number}: {self.previous_status} → {self.new_status}"

    class Meta:
        ordering = ['-created_at']


class ParcelDeliveryHistory(models.Model):
    """Track delivery history for users"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='parcel_histories')
    parcel = models.ForeignKey(Parcel, on_delete=models.CASCADE, related_name='delivery_histories')
    role = models.CharField(max_length=20, choices=[('sender', 'Sender'), ('receiver', 'Receiver')])
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.parcel.tracking_number} ({self.role})"

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', '-timestamp']),
        ]


class DeliveryReview(models.Model):
    """Ratings and reviews for deliveries"""
    parcel = models.OneToOneField(Parcel, on_delete=models.CASCADE, related_name='review')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='delivery_reviews')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    title = models.CharField(max_length=255)
    comment = models.TextField()
    
    # Aspect ratings
    delivery_speed_rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    packaging_quality_rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    communication_rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    
    would_recommend = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Review for {self.parcel.tracking_number}"

    class Meta:
        ordering = ['-created_at']


class TrackingLocation(models.Model):
    """Real-time tracking locations"""
    parcel = models.ForeignKey(Parcel, on_delete=models.CASCADE, related_name='tracking_locations')
    latitude = models.FloatField()
    longitude = models.FloatField()
    location_name = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.parcel.tracking_number} - {self.location_name}"

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['parcel', '-timestamp']),
        ]


class DeliveryRoute(models.Model):
    """Delivery route information"""
    parcel = models.ForeignKey(Parcel, on_delete=models.CASCADE, related_name='delivery_routes')
    route_sequence = models.IntegerField()
    from_location = models.CharField(max_length=255)
    to_location = models.CharField(max_length=255)
    from_latitude = models.FloatField()
    from_longitude = models.FloatField()
    to_latitude = models.FloatField()
    to_longitude = models.FloatField()
    distance_km = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=50, choices=[
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.parcel.tracking_number} - Route {self.route_sequence}"

    class Meta:
        ordering = ['route_sequence']


class Notification(models.Model):
    """Notifications for users"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    parcel = models.ForeignKey(Parcel, on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.user.username}"

    class Meta:
        ordering = ['-created_at']
