from django.contrib import admin
from .models import Product, Category, Cart,CartItem,Discount, Review, UserProfile

admin.site.register(Product)
admin.site.register(Category)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Discount)
admin.site.register(Review)
admin.site.register(UserProfile)




