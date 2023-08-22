from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Category(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

def get_default_category():
    return Category.objects.get_or_create(name="Default")[0].id

class Product(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(default='')
    price = models.DecimalField(max_digits=7, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    image_url = models.URLField(default="https://i.ytimg.com/vi/fesiGOoOJTc/maxresdefault.jpg")

    
    
    def __str__(self):
        return self.name

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    

    def __str__(self):
        return f'{self.user.username} Cart'
    

class CartItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    cart = models.ForeignKey(Cart, related_name='cartitems', on_delete=models.CASCADE)
    final_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=0)
    
    

    def __str__(self):
        return f'{self.product.name} ({self.quantity})'
    

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    loyalty_points = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.user.username


class Discount(models.Model):
    product = models.OneToOneField(Product, related_name='discount', on_delete=models.CASCADE)
    discount_type = models.CharField(max_length=50) # could be "BOGO", "Percentage", "Fixed Amount", etc.
    discount_value = models.DecimalField(max_digits=7, decimal_places=2)
    quantity_threshold = models.PositiveIntegerField()

    def __str__(self):
        return f'Discount for {self.product.name}'
    


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField()
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'{self.user.username} Review for {self.product.name}'

