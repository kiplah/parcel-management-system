import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Parcel APIs
export const parcelAPI = {
  list: (params = {}) => api.get('/parcels/', { params }),
  detail: (id) => api.get(`/parcels/${id}/`),
  create: (data) => api.post('/parcels/', data),
  update: (id, data) => api.patch(`/parcels/${id}/`, data),
  delete: (id) => api.delete(`/parcels/${id}/`),
  searchByBarcode: (trackingNumber) => api.get('/parcels/search_by_barcode/', { params: { tracking_number: trackingNumber } }),
  updateStatus: (id, status, notes = '') => api.post(`/parcels/${id}/update_status/`, { status, notes }),
  myParcels: () => api.get('/parcels/my_parcels/'),
};

// Organization APIs
export const organizationAPI = {
  list: () => api.get('/organizations/'),
  detail: (id) => api.get(`/organizations/${id}/`),
  statistics: (id) => api.get(`/organizations/${id}/statistics/`),
};

// Department APIs
export const departmentAPI = {
  list: (params = {}) => api.get('/departments/', { params }),
  create: (data) => api.post('/departments/', data),
};

// Review APIs
export const reviewAPI = {
  list: (params = {}) => api.get('/reviews/', { params }),
  create: (data) => api.post('/reviews/', data),
  detail: (id) => api.get(`/reviews/${id}/`),
};

// Tracking APIs
export const trackingAPI = {
  locations: (parcelId) => api.get('/tracking-locations/', { params: { parcel: parcelId } }),
  createLocation: (data) => api.post('/tracking-locations/', data),
  routes: (parcelId) => api.get('/delivery-routes/', { params: { parcel: parcelId } }),
  createRoute: (data) => api.post('/delivery-routes/', data),
};

// Notification APIs
export const notificationAPI = {
  list: () => api.get('/notifications/'),
  markAsRead: (id) => api.post(`/notifications/${id}/mark_as_read/`),
  markAllAsRead: () => api.post('/notifications/mark_all_as_read/'),
};

// Delivery History APIs
export const deliveryHistoryAPI = {
  list: (params = {}) => api.get('/parcel-delivery-history/', { params }),
};

export default api;
