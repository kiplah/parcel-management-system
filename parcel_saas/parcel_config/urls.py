"""
URL configuration for parcel_config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    OrganizationViewSet, DepartmentViewSet, ParcelViewSet, ParcelStatusHistoryViewSet,
    ParcelDeliveryHistoryViewSet, DeliveryReviewViewSet, TrackingLocationViewSet,
    DeliveryRouteViewSet, NotificationViewSet
)

router = DefaultRouter()
router.register(r'organizations', OrganizationViewSet, basename='organization')
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'parcels', ParcelViewSet, basename='parcel')
router.register(r'parcel-status-history', ParcelStatusHistoryViewSet, basename='parcel-status-history')
router.register(r'parcel-delivery-history', ParcelDeliveryHistoryViewSet, basename='parcel-delivery-history')
router.register(r'reviews', DeliveryReviewViewSet, basename='review')
router.register(r'tracking-locations', TrackingLocationViewSet, basename='tracking-location')
router.register(r'delivery-routes', DeliveryRouteViewSet, basename='delivery-route')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]
