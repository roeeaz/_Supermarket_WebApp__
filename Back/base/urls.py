from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from  . import views

urlpatterns = [
    path('login/', TokenObtainPairView.as_view()),
    path('about/', views.about),
    path('contact/', views.contact),
    path('register/', views.register),
    path('product/', views.ProductView.as_view()),
    path('product/<int:pk>/', views.ProductView.as_view()),
    path('category/', views.CategoryView.as_view()),
    path('category/<int:category_id>/products/', views.CategoryProductView.as_view()),
    path('cart/', views.CartView.as_view()),
    path('cartitem/<int:cartitem_id>/', views.CartItemUpdateView.as_view(), name='cartitem-update'),
    path('cart/clear/', views.ClearCartView.as_view()),
    path('create_order/', views.CreateOrderView.as_view()),
    path('capture_order/', views.CaptureOrderView.as_view(), name='capture_order'),
    path('user_profile/', views.UserProfileView.as_view()),
    path('discounted_products/', views.DiscountedProductsView.as_view()),
    path('update_user/', views.update_user),


]

