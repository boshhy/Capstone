# Generated by Django 3.2.9 on 2022-05-07 02:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('capstone', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='imageURL',
            field=models.CharField(blank=True, max_length=1024),
        ),
        migrations.AddField(
            model_name='game',
            name='name',
            field=models.CharField(default='FILL THIS OUT', max_length=64),
            preserve_default=False,
        ),
    ]
