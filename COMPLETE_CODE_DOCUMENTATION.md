# Parcel Management SaaS - Complete Code Documentation

## Project Overview

A full-stack parcel management system built with Django (backend) and React (frontend) with comprehensive features for tracking, managing, and reviewing parcel deliveries.

---

## BACKEND - DJANGO

### Directory Structure
```
parcel_saas/
├── parcel_config/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── api/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── admin.py
│   ├── apps.py
│   └── migrations/
├── manage.py
└── db.sqlite3
```

### 1. Django Settings (parcel_config/settings.py)

Key configurations:
- Django REST Framework with AllowAny permissions for testing
- CORS enabled for localhost
- SQLite database (can be changed to MySQL)
- Installed apps: rest_framework, corsheaders, django_filters, api

### 2. Models (api/models.py)

**Organization Model**
```python
- name: CharField
- description: TextField
- admin: ForeignKey(User)
- created_at: DateTimeField
- updated_at: DateTimeField
```

**Department Model**
```python
- organization: ForeignKey(Organization)
- name: CharField
- description: TextField
- created_at: DateTimeField
```

**Parcel Model**
```python
- tracking_number: CharField (unique)
- parcel_type: CharField (package, document, letter)
- status: CharField (pending, received, in_transit, delivered, lost, returned)
- sender_name: CharField
- sender_email: EmailField
- sender_phone: CharField
- receiver_name: CharField
- receiver_email: EmailField
- receiver_phone: CharField
- receiver_address: TextField
- weight: DecimalField
- value: DecimalField
- description: TextField
- current_location: CharField
- latitude: DecimalField
- longitude: DecimalField
- organization: ForeignKey(Organization)
- department: ForeignKey(Department)
- created_at: DateTimeField
- delivered_at: DateTimeField
- updated_at: DateTimeField
```

**ParcelStatusHistory Model**
```python
- parcel: ForeignKey(Parcel)
- previous_status: CharField
- new_status: CharField
- changed_by: ForeignKey(User)
- notes: TextField
- created_at: DateTimeField
```

**ParcelDeliveryHistory Model**
```python
- parcel: ForeignKey(Parcel)
- user: ForeignKey(User)
- role: CharField (sender, receiver, handler)
- timestamp: DateTimeField
```

**DeliveryReview Model**
```python
- parcel: ForeignKey(Parcel)
- reviewer: ForeignKey(User)
- rating: IntegerField (1-5)
- title: CharField
- comment: TextField
- delivery_speed_rating: IntegerField (1-5)
- packaging_quality_rating: IntegerField (1-5)
- communication_rating: IntegerField (1-5)
- would_recommend: BooleanField
- created_at: DateTimeField
- updated_at: DateTimeField
```

**TrackingLocation Model**
```python
- parcel: ForeignKey(Parcel)
- latitude: DecimalField
- longitude: DecimalField
- location_name: CharField
- status: CharField
- timestamp: DateTimeField
- notes: TextField
```

**DeliveryRoute Model**
```python
- parcel: ForeignKey(Parcel)
- route_sequence: IntegerField
- from_location: CharField
- to_location: CharField
- from_latitude: DecimalField
- from_longitude: DecimalField
- to_latitude: DecimalField
- to_longitude: DecimalField
- distance_km: DecimalField
- status: CharField
- created_at: DateTimeField
```

**Notification Model**
```python
- user: ForeignKey(User)
- parcel: ForeignKey(Parcel)
- title: CharField
- message: TextField
- is_read: BooleanField
- created_at: DateTimeField
```

### 3. Serializers (api/serializers.py)

- **UserSerializer**: Serializes User model
- **OrganizationSerializer**: Serializes Organization with admin info
- **DepartmentSerializer**: Serializes Department with organization name
- **ParcelListSerializer**: Lightweight parcel serializer for list views
- **ParcelDetailSerializer**: Full parcel serializer with related data
- **ParcelCreateUpdateSerializer**: Serializer for create/update operations
- **ParcelStatusHistorySerializer**: Serializes status history
- **ParcelDeliveryHistorySerializer**: Serializes delivery history
- **DeliveryReviewSerializer**: Serializes reviews with reviewer info
- **TrackingLocationSerializer**: Serializes tracking locations
- **DeliveryRouteSerializer**: Serializes delivery routes
- **NotificationSerializer**: Serializes notifications

### 4. Views (api/views.py)

**OrganizationViewSet**
- List, create, update, delete organizations
- Custom action: `statistics` - Get organization statistics

**DepartmentViewSet**
- List, create, update, delete departments
- Filter by organization

**ParcelViewSet**
- List, create, update, delete parcels
- Filter by status, type, department
- Search by tracking number, sender, receiver
- Custom actions:
  - `search_by_barcode` - Search by tracking number
  - `update_status` - Update parcel status with audit trail
  - `my_parcels` - Get parcels for current user

**ParcelStatusHistoryViewSet**
- Read-only view of status history
- Filter by parcel

**ParcelDeliveryHistoryViewSet**
- Read-only view of delivery history
- Filter by user and role

**DeliveryReviewViewSet**
- List, create, update, delete reviews
- Filter by parcel or reviewer
- Search in title and comment

**TrackingLocationViewSet**
- List, create, update, delete tracking locations
- Filter by parcel and status

**DeliveryRouteViewSet**
- List, create, update, delete delivery routes
- Filter by parcel and status

**NotificationViewSet**
- List, create, update, delete notifications
- Custom actions:
  - `mark_as_read` - Mark single notification as read
  - `mark_all_as_read` - Mark all notifications as read

### 5. URLs (parcel_config/urls.py)

```python
router = DefaultRouter()
router.register(r'organizations', OrganizationViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'parcels', ParcelViewSet)
router.register(r'parcel-status-history', ParcelStatusHistoryViewSet)
router.register(r'parcel-delivery-history', ParcelDeliveryHistoryViewSet)
router.register(r'reviews', DeliveryReviewViewSet)
router.register(r'tracking-locations', TrackingLocationViewSet)
router.register(r'delivery-routes', DeliveryRouteViewSet)
router.register(r'notifications', NotificationViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]
```

---

## FRONTEND - REACT

### Directory Structure
```
parcel_frontend/
├── src/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── ParcelList.jsx
│   │   ├── ParcelDetail.jsx
│   │   ├── CreateParcel.jsx
│   │   ├── BarcodeScanner.jsx
│   │   ├── Reviews.jsx
│   │   ├── TrackingMap.jsx
│   │   ├── DeliveryHistory.jsx
│   │   └── Dashboard.jsx
│   ├── components/
│   │   └── Navbar.jsx
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   ├── Navbar.css
│   │   ├── Home.css
│   │   ├── ParcelList.css
│   │   ├── ParcelDetail.css
│   │   ├── CreateParcel.css
│   │   ├── BarcodeScanner.css
│   │   ├── Reviews.css
│   │   ├── TrackingMap.css
│   │   ├── DeliveryHistory.css
│   │   └── Dashboard.css
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── index.html
```

### 1. API Service (src/services/api.js)

Axios instance configured for Django API:
```javascript
const API_BASE_URL = 'http://localhost:8001/api';

// Parcel APIs
parcelAPI.list(params)
parcelAPI.detail(id)
parcelAPI.create(data)
parcelAPI.update(id, data)
parcelAPI.delete(id)
parcelAPI.searchByBarcode(trackingNumber)
parcelAPI.updateStatus(id, status, notes)
parcelAPI.myParcels()

// Organization APIs
organizationAPI.list()
organizationAPI.detail(id)
organizationAPI.statistics(id)

// Department APIs
departmentAPI.list(params)
departmentAPI.create(data)

// Review APIs
reviewAPI.list(params)
reviewAPI.create(data)
reviewAPI.detail(id)

// Tracking APIs
trackingAPI.locations(parcelId)
trackingAPI.createLocation(data)
trackingAPI.routes(parcelId)
trackingAPI.createRoute(data)

// Notification APIs
notificationAPI.list()
notificationAPI.markAsRead(id)
notificationAPI.markAllAsRead()

// Delivery History APIs
deliveryHistoryAPI.list(params)
```

### 2. Components

**Navbar Component (src/components/Navbar.jsx)**
- Navigation menu with links to all pages
- Sticky positioning
- Responsive design

**Pages:**

**Home.jsx**
- Landing page with hero section
- Feature cards showcasing system capabilities
- Call-to-action buttons

**ParcelList.jsx**
- Display all parcels in a grid layout
- Search by tracking number, sender, or receiver
- Filter by status
- View details and tracking links
- Responsive card design

**ParcelDetail.jsx**
- Complete parcel information
- Sender and receiver details
- Parcel specifications
- Status history timeline
- Related tracking and route information

**CreateParcel.jsx**
- Form to create new parcels
- Fields for sender and receiver information
- Parcel type, weight, value, description
- Form validation
- Success/error handling

**BarcodeScanner.jsx**
- Input field for tracking number
- Search functionality
- Display parcel details after search
- Status badge with color coding

**Reviews.jsx**
- Form to leave reviews for delivered parcels
- Multi-aspect rating system:
  - Overall rating
  - Delivery speed
  - Packaging quality
  - Communication
- Comment field
- Recommendation checkbox
- Display list of all reviews
- Filter by parcel

**TrackingMap.jsx**
- Display parcel tracking information
- Timeline of tracking locations with GPS coordinates
- Delivery routes with distances
- Status updates at each location
- Timestamp information

**DeliveryHistory.jsx**
- Table view of delivery history
- User and role information
- Timestamp tracking
- Sortable and filterable

**Dashboard.jsx**
- Key metrics cards:
  - Total parcels
  - Delivered count
  - In transit count
  - Delivery rate percentage
- Pie chart: Status distribution
- Bar chart: Status count visualization
- Uses Recharts for visualization

### 3. Styling

All pages use consistent styling with:
- Color scheme: Purple (#667eea) and green (#4CAF50)
- Responsive grid layouts
- Card-based design
- Smooth transitions and hover effects
- Mobile-friendly design

---

## Installation & Running

### Backend Setup

```bash
cd parcel_saas

# Install dependencies
pip install django djangorestframework django-cors-headers django-filter

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver 0.0.0.0:8001
```

### Frontend Setup

```bash
cd parcel_frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## API Usage Examples

### Create a Parcel
```bash
curl -X POST http://localhost:8001/api/parcels/ \
  -H "Content-Type: application/json" \
  -d '{
    "tracking_number": "PKG123456",
    "parcel_type": "package",
    "sender_name": "John Doe",
    "receiver_name": "Jane Smith",
    "receiver_address": "123 Main St",
    "organization": 1,
    "department": 1
  }'
```

### Search by Barcode
```bash
curl http://localhost:8001/api/parcels/search_by_barcode/?tracking_number=PKG123456
```

### Update Parcel Status
```bash
curl -X POST http://localhost:8001/api/parcels/1/update_status/ \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_transit",
    "notes": "Package picked up"
  }'
```

### Leave a Review
```bash
curl -X POST http://localhost:8001/api/reviews/ \
  -H "Content-Type: application/json" \
  -d '{
    "parcel": 1,
    "title": "Great Service",
    "comment": "Fast delivery and good packaging",
    "rating": 5,
    "delivery_speed_rating": 5,
    "packaging_quality_rating": 5,
    "communication_rating": 5,
    "would_recommend": true
  }'
```

---

## Key Features Implementation

### 1. Multi-tenancy
- Organizations can have multiple departments
- Parcels are associated with organizations
- Users can be assigned to organizations

### 2. Audit Trail
- ParcelStatusHistory tracks all status changes
- Records who made the change and when
- Includes notes for each change

### 3. Delivery Tracking
- TrackingLocation stores GPS coordinates
- Multiple locations per parcel
- Timestamp for each update

### 4. Review System
- Multi-aspect ratings for comprehensive feedback
- Separate ratings for different delivery aspects
- Recommendation tracking

### 5. Analytics
- Dashboard with key metrics
- Visual charts for status distribution
- Delivery rate calculation

---

## Database Schema Relationships

```
Organization
├── Department
│   └── Parcel
│       ├── ParcelStatusHistory
│       ├── ParcelDeliveryHistory
│       ├── DeliveryReview
│       ├── TrackingLocation
│       ├── DeliveryRoute
│       └── Notification
└── User
    ├── ParcelStatusHistory (changed_by)
    ├── ParcelDeliveryHistory (user)
    ├── DeliveryReview (reviewer)
    └── Notification (user)
```

---

## Performance Considerations

1. **Pagination**: API responses are paginated (50 items per page)
2. **Filtering**: Multiple filter backends for efficient queries
3. **Search**: Full-text search on tracking number, names
4. **Caching**: Can be added for frequently accessed data
5. **Indexing**: Database indexes on frequently queried fields

---

## Security Features

1. **CORS**: Configured for localhost development
2. **Permissions**: AllowAny for testing (should be restricted in production)
3. **Validation**: Input validation on all forms
4. **Error Handling**: Proper error responses with status codes

---

## Future Enhancements

1. Email/SMS notifications
2. WebSocket for real-time updates
3. Advanced analytics and reporting
4. Mobile app
5. Payment integration
6. Multi-language support
7. Advanced search filters
8. Bulk operations
9. Export to CSV/PDF
10. User authentication and authorization

---

## Troubleshooting

### Django Server Issues
- Check if port 8001 is available
- Ensure all dependencies are installed
- Run migrations if database errors occur

### React Server Issues
- Check if port 5173 is available
- Clear node_modules and reinstall if needed
- Check console for CORS errors

### API Connection Issues
- Verify Django server is running on port 8001
- Check CORS settings in Django
- Verify API_BASE_URL in React

---

## Support & Documentation

For more information, refer to:
- Django Documentation: https://docs.djangoproject.com/
- React Documentation: https://react.dev/
- Django REST Framework: https://www.django-rest-framework.org/
- Vite Documentation: https://vitejs.dev/

