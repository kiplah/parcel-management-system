from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Organization, Department, Parcel, ParcelStatusHistory, ParcelDeliveryHistory,
    DeliveryReview, TrackingLocation, DeliveryRoute, Notification
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class OrganizationSerializer(serializers.ModelSerializer):
    admin = UserSerializer(read_only=True)

    class Meta:
        model = Organization
        fields = ['id', 'name', 'description', 'admin', 'created_at', 'updated_at']


class DepartmentSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)

    class Meta:
        model = Department
        fields = ['id', 'organization', 'organization_name', 'name', 'description', 'created_at']


class ParcelStatusHistorySerializer(serializers.ModelSerializer):
    changed_by_username = serializers.CharField(source='changed_by.username', read_only=True)

    class Meta:
        model = ParcelStatusHistory
        fields = ['id', 'parcel', 'previous_status', 'new_status', 'changed_by', 'changed_by_username', 'notes', 'created_at']


class ParcelDeliveryHistorySerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = ParcelDeliveryHistory
        fields = ['id', 'user', 'user_username', 'parcel', 'role', 'timestamp']


class TrackingLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackingLocation
        fields = ['id', 'parcel', 'latitude', 'longitude', 'location_name', 'status', 'timestamp', 'notes']


class DeliveryRouteSerializer(serializers.ModelSerializer):
    parcel_tracking = serializers.CharField(source='parcel.tracking_number', read_only=True)

    class Meta:
        model = DeliveryRoute
        fields = ['id', 'parcel', 'parcel_tracking', 'route_sequence', 'from_location', 'to_location',
                  'from_latitude', 'from_longitude', 'to_latitude', 'to_longitude', 'distance_km', 'status', 'created_at']


class DeliveryReviewSerializer(serializers.ModelSerializer):
    reviewer_username = serializers.CharField(source='reviewer.username', read_only=True)
    parcel_tracking = serializers.CharField(source='parcel.tracking_number', read_only=True)

    class Meta:
        model = DeliveryReview
        fields = ['id', 'parcel', 'parcel_tracking', 'reviewer', 'reviewer_username', 'rating', 'title', 'comment',
                  'delivery_speed_rating', 'packaging_quality_rating', 'communication_rating', 'would_recommend', 'created_at', 'updated_at']


class ParcelListSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    type_display = serializers.CharField(source='get_parcel_type_display', read_only=True)

    class Meta:
        model = Parcel
        fields = ['id', 'tracking_number', 'parcel_type', 'type_display', 'status', 'status_display',
                  'sender_name', 'receiver_name', 'current_location', 'created_at', 'delivered_at', 'department', 'department_name']


class ParcelDetailSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    status_history = ParcelStatusHistorySerializer(many=True, read_only=True)
    tracking_locations = TrackingLocationSerializer(many=True, read_only=True)
    delivery_routes = DeliveryRouteSerializer(many=True, read_only=True)
    review = DeliveryReviewSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    type_display = serializers.CharField(source='get_parcel_type_display', read_only=True)

    class Meta:
        model = Parcel
        fields = ['id', 'tracking_number', 'parcel_type', 'type_display', 'status', 'status_display',
                  'sender_name', 'sender_email', 'sender_phone', 'receiver_name', 'receiver_email',
                  'receiver_phone', 'receiver_address', 'weight', 'description', 'value',
                  'current_location', 'latitude', 'longitude', 'created_at', 'delivered_at',
                  'updated_at', 'department', 'organization', 'status_history', 'tracking_locations',
                  'delivery_routes', 'review']


class ParcelCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parcel
        fields = ['tracking_number', 'parcel_type', 'status', 'sender_name', 'sender_email',
                  'sender_phone', 'receiver_name', 'receiver_email', 'receiver_phone',
                  'receiver_address', 'weight', 'description', 'value', 'current_location',
                  'latitude', 'longitude', 'department', 'organization']

    def validate_tracking_number(self, value):
        if Parcel.objects.filter(tracking_number=value).exclude(pk=self.instance.pk if self.instance else None).exists():
            raise serializers.ValidationError("A parcel with this tracking number already exists.")
        return value


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'parcel', 'title', 'message', 'is_read', 'created_at']
