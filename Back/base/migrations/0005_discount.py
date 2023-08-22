# Generated by Django 4.0.6 on 2023-07-25 13:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_userprofile'),
    ]

    operations = [
        migrations.CreateModel(
            name='Discount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('discount_type', models.CharField(max_length=50)),
                ('discount_value', models.DecimalField(decimal_places=2, max_digits=7)),
                ('quantity_needed_for_discount', models.PositiveIntegerField()),
                ('product', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='base.product')),
            ],
        ),
    ]
