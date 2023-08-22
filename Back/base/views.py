from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import CartItem, Discount, Product, Review, UserProfile
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Product, Category, Cart
from .serializers import ProductSerializer, CartItemSerializer, CartSerializer, CategorySerializer, DiscountSerializer, ReviewSerializer
from paypalcheckoutsdk.orders import OrdersCreateRequest, OrdersCaptureRequest
from paypalcheckoutsdk.core import PayPalHttpClient, SandboxEnvironment
from django.db.models import F, Sum
import json
from paypalhttp import HttpError
from .paypal_config import PayPalClient
from paypalcheckoutsdk.orders import OrdersCreateRequest
from base import models
from paypalcheckoutsdk.orders import OrdersCaptureRequest
from paypalcheckoutsdk.orders import OrdersGetRequest
from django.db.models import F
from rest_framework import status
from decimal import Decimal
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.hashers import check_password



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def about(req):
    return Response("about")


@api_view(['GET'])
def contact(req):
    return Response("contact")






# register
@api_view(['POST'])
def register(request):
    user = User.objects.create_user(
        username=request.data['username'],
        email=request.data['email'],
        password=request.data['password']
    )
    user.is_active = True
    user.is_staff = False
    user.save()
    UserProfile.objects.create(user=user)
    Cart.objects.create(user=user)
    return Response("new user born")


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request):
    try:
        user = request.user

        if 'newUsername' in request.data:
            user.username = request.data['newUsername']

        if 'newPassword' in request.data:
            user.set_password(request.data['newPassword'])

        user.save()  
        return Response("User details updated")

    except Exception as e:
        return Response({"error": str(e)})






class ProductView(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        my_model = Product.objects.get(pk=pk)
        serializer = ProductSerializer(my_model, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        my_model = Product.objects.get(pk=pk)
        my_model.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class CategoryView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


class CategoryProductView(APIView):
    def get(self, request, category_id):
        products = Product.objects.filter(category__id=category_id)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


# cart


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        product = get_object_or_404(Product, id=request.data['product_id'])
        quantity = request.data.get('quantity', 1)
        cart = get_object_or_404(Cart, user=request.user)
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart, product=product, defaults={'quantity': quantity}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        total_price = Decimal(0.0)
        for cart_item in cart.cartitems.all():
            product = cart_item.product
            price = product.price
            quantity = cart_item.quantity

            if hasattr(product, 'discount'):
                discount = product.discount
                if discount and quantity >= discount.quantity_threshold:
                    if discount.discount_type == 'PERCENTAGE':
                        price -= price * (Decimal(discount.discount_value) / 100)
                    elif discount.discount_type == 'FLAT_RATE':
                        price -= discount.discount_value
                    price = max(price, 0)
                    cart_item.final_price = price
                    cart_item.save()
            else:
                price = product.price

            cart_item.final_price = price
            cart_item.save()
    
            total_price += Decimal(price) * Decimal(quantity)

        cart.total_price = total_price
        cart.save()

        serializer = CartSerializer(cart)
        print(serializer.data) 
        return Response(serializer.data, status=status.HTTP_200_OK)


    def delete(self, request):
        product = get_object_or_404(Product, id=request.data['product_id'])
        cart = get_object_or_404(Cart, user=request.user)
        CartItem.objects.filter(cart=cart, product=product).delete()
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)



class CartItemUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, cartitem_id):
        cartitem = get_object_or_404(
            CartItem, id=cartitem_id, cart__user=request.user)
        new_quantity = request.data.get('quantity')
        if new_quantity is not None and new_quantity > 0:
            cartitem.quantity = new_quantity
            cartitem.save()
            data = CartItemSerializer(cartitem).data
        return Response(data)

    def delete(self, request, cartitem_id):
        cartitem = get_object_or_404(
            CartItem, id=cartitem_id, cart__user=request.user)
        cartitem.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ClearCartView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        cart.cartitems.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# paypal


class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request = OrdersCreateRequest()
        request.prefer('return=representation')

        cart = get_object_or_404(Cart, user=request.user)
        total = str(cart.total_price)

        request.request_body(
            {
                "intent": "CAPTURE",
                "purchase_units": [
                    {
                        "amount": {
                            "currency_code": "ILS",
                            "value": total
                        }
                    }
                ]
            }
        )


        try:
            client = PayPalClient().object()
            response = client.execute(request)

        except IOError as ioe:
            return Response({"error": ioe}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"orderID": response.result.id})



class CaptureOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get("orderID")
        print(f"Received orderID: {order_id}")

        if order_id is None:
            return Response({"error": "No order ID provided"}, status=status.HTTP_400_BAD_REQUEST)

        request = OrdersCaptureRequest(order_id)


        try:
            client = PayPalClient().object()
            response = client.execute(request)

            if response.result.status == "COMPLETED":
                cart = get_object_or_404(Cart, user=request.user)
                total = cart.cartitems.aggregate(total=Sum(
                    F('product__price')*F('quantity'), output_field=models.DecimalField()))['total']
                user_profile = get_object_or_404(
                    UserProfile, user=request.user)
                user_profile.loyalty_points += total  
                user_profile.save()
        except HttpError as ioe:
            print(f"Error: {ioe}")
            if hasattr(ioe, 'response'):
                print(ioe.response.text)
            print(f"IOError: {str(ioe)}")
            print(str(ioe))
            return Response({"error": str(ioe)}, status=status.HTTP_400_BAD_REQUEST)
            
        print(response.result) 
        return Response({"status": response.result.status})
    


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_profile = get_object_or_404(UserProfile, user=request.user)
        return Response({"loyalty_points": user_profile.loyalty_points})



def calculate_cartitem_total(cart_item):
    product = cart_item.product
    quantity = cart_item.quantity
    price = product.price

    if hasattr(product, 'discount') and quantity >= product.discount.quantity_needed_for_discount:
        discount = product.discount
        if discount.discount_type == 'PERCENTAGE':
            price -= price * (discount.discount_value / 100.0)
        elif discount.discount_type == 'FLAT_RATE':
            price -= discount.discount_value
        price = max(price, 0)

    total_price = float(price) * quantity
    return total_price



class DiscountedProductsView(APIView):
    def get(self, request):
        discounted_products = Product.objects.filter(discount__isnull=False)
        serializer = ProductSerializer(discounted_products, many=True)
        return Response(serializer.data)




