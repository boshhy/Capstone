from django.contrib import admin
from .models import User, Game, Score

# Register your models here.
admin.site.register(User)
admin.site.register(Game)
admin.site.register(Score)
