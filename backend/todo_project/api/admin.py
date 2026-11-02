"""Gestion de l'admin"""
from django.contrib import admin

from .models import Category, Task


# Register your models here.
class CategoryAdmin(admin.ModelAdmin):
    """Affichage des catégories"""
    list_display = ('id', 'name')

class TaskAdmin(admin.ModelAdmin):
    """Affichage des taches"""
    list_display = ('id', 'description', 'is_completed', 'created_at', 'category')

admin.site.register(Category, CategoryAdmin)
admin.site.register(Task, TaskAdmin)
