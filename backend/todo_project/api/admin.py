from django.contrib import admin
from .models import Category, Task

# Register your models here.
class CategoryAdmin(admin.ModelAdmin):
	list_display = ('id', 'name')
	
class TaskAdmin(admin.ModelAdmin):
	list_display = ('id', 'description', 'is_completed', 'created_at', 'category')

admin.site.register(Category, CategoryAdmin)
admin.site.register(Task, TaskAdmin)