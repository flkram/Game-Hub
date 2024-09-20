from django.contrib import admin
from .models import Game

class GameAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_at') 
    search_fields = ('title', 'user__username')  
    list_filter = ('user',)  
    ordering = ('-created_at',) 

admin.site.register(Game, GameAdmin)
