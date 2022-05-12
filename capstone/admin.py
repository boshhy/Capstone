from django.contrib import admin
from .models import User, Game, Score, Profile


class score_Admin(admin.ModelAdmin):
    list_display = ["points", "username", "game"]


admin.site.register(Score, score_Admin)


# Register your models here.
admin.site.register(User)
admin.site.register(Game)
admin.site.register(Profile)
