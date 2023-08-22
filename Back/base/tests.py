from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from base.models import Product, Category, Cart

class TestViews(TestCase):

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.category = Category.objects.create(name='Test Category')
        self.product = Product.objects.create(name='Test Product', category=self.category, price=100)

    def test_product_list_GET(self):
        self.client.login(username='testuser', password='testpassword')

        response = self.client.get(reverse('product_list'))

        self.assertEquals(response.status_code, 200)
        self.assertTemplateUsed(response, 'myapp/product_list.html')

    def test_product_detail_GET(self):
        self.client.login(username='testuser', password='testpassword')

        response = self.client.get(reverse('product_detail', args=[self.product.id]))

        self.assertEquals(response.status_code, 200)
        self.assertTemplateUsed(response, 'myapp/product_detail.html')

