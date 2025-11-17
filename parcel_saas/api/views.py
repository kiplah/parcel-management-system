from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import (
    Organization, Department, Parcel, ParcelStatusHistory, ParcelDeliveryHistory,
    DeliveryReview, TrackingLocation, DeliveryRoute, Notification
)
from .serializers import (
    OrganizationSerializer, DepartmentSerializer, ParcelListSerializer, ParcelDetailSerializer,
    ParcelCreateUpdateSerializer, ParcelStatusHistorySerializer, ParcelDeliveryHistorySerializer,
    DeliveryReviewSerializer, TrackingLocationSerializer, DeliveryRouteSerializer, NotificationSerializer
)


class OrganizationViewSet(viewsets.ModelViewSet):
    """ViewSet for managing organizations"""
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'description']
    filterset_fields = ['id', 'name']

    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """Get organization statistics"""
        organization = self.get_object()
        stats = {
            'total_parcels': Parcel.objects.filter(organization=organization).count(),
            'delivered': Parcel.objects.filter(organization=organization, status='delivered').count(),
            'in_transit': Parcel.objects.filter(organization=organization, status='in_transit').count(),
            'pending': Parcel.objects.filter(organization=organization, status='pending').count(),
            'lost': Parcel.objects.filter(organization=organization, status='lost').count(),
        }
        return Response(stats)


class DepartmentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing departments"""
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name']
    filterset_fields = ['organization', 'name']


class ParcelViewSet(viewsets.ModelViewSet):
    """ViewSet for managing parcels"""
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['organization', 'status', 'parcel_type', 'department']
    search_fields = ['tracking_number', 'sender_name', 'receiver_name']
    ordering_fields = ['created_at', 'tracking_number']
    ordering = ['-created_at']

    def get_queryset(self):
        return Parcel.objects.all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ParcelDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ParcelCreateUpdateSerializer
        return ParcelListSerializer

    @action(detail=False, methods=['get'])
    def search_by_barcode(self, request):
        """Search parcel by tracking number/barcode"""
        tracking_number = request.query_params.get('tracking_number', '')
        if not tracking_number:
            return Response({'error': 'tracking_number parameter required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            parcel = Parcel.objects.get(tracking_number=tracking_number)
            serializer = ParcelDetailSerializer(parcel)
            return Response(serializer.data)
        except Parcel.DoesNotExist:
            return Response({'error': 'Parcel not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update parcel status"""
        parcel = self.get_object()
        new_status = request.data.get('status')
        notes = request.data.get('notes', '')

        if not new_status:
            return Response({'error': 'status field required'}, status=status.HTTP_400_BAD_REQUEST)

        if new_status not in dict(Parcel.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        # Create status history
        ParcelStatusHistory.objects.create(
            parcel=parcel,
            previous_status=parcel.status,
            new_status=new_status,
            changed_by=request.user,
            notes=notes
        )

        # Update parcel status
        parcel.status = new_status
        if new_status == 'delivered':
            parcel.delivered_at = timezone.now()
        parcel.save()

        # Create notification
        Notification.objects.create(
            user=request.user,
            parcel=parcel,
            title=f"Status Updated: {parcel.tracking_number}",
            message=f"Parcel status changed to {new_status}"
        )

        serializer = ParcelDetailSerializer(parcel)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_parcels(self, request):
        """Get parcels for current user"""
        histories = ParcelDeliveryHistory.objects.filter(user=request.user).values_list('parcel_id', flat=True)
        parcels = Parcel.objects.filter(id__in=histories)
        serializer = ParcelListSerializer(parcels, many=True)
        return Response(serializer.data)


class ParcelStatusHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing parcel status history"""
    queryset = ParcelStatusHistory.objects.all()
    serializer_class = ParcelStatusHistorySerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['parcel']


class ParcelDeliveryHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing parcel delivery history"""
    queryset = ParcelDeliveryHistory.objects.all()
    serializer_class = ParcelDeliveryHistorySerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['user', 'role']
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']

    def get_queryset(self):
        return ParcelDeliveryHistory.objects.filter(user=self.request.user)


class DeliveryReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for managing delivery reviews"""
    queryset = DeliveryReview.objects.all()
    serializer_class = DeliveryReviewSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['parcel', 'reviewer']
    search_fields = ['title', 'comment']
    ordering_fields = ['created_at', 'rating']
    ordering = ['-created_at']

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)


class TrackingLocationViewSet(viewsets.ModelViewSet):
    """ViewSet for managing tracking locations"""
    queryset = TrackingLocation.objects.all()
    serializer_class = TrackingLocationSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['parcel', 'status']
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']


class DeliveryRouteViewSet(viewsets.ModelViewSet):
    """ViewSet for managing delivery routes"""
    queryset = DeliveryRoute.objects.all()
    serializer_class = DeliveryRouteSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['parcel', 'status']
    ordering_fields = ['route_sequence', 'created_at']
    ordering = ['route_sequence']


class NotificationViewSet(viewsets.ModelViewSet):
    """ViewSet for managing notifications"""
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['is_read']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Mark all notifications as read"""
        notifications = self.get_queryset().filter(is_read=False)
        notifications.update(is_read=True)
        return Response({'status': 'All notifications marked as read'})

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark a single notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'Notification marked as read'})
