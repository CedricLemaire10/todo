from django.contrib import admin
from django.urls import path, include

from rest_framework import routers

from .views import (
    CategoryListCreate,
    TaskViewset,
    railway_test,
    health_check
)

router = routers.DefaultRouter()
router.register('tasks', TaskViewset, basename='tasks')

urlpatterns = [
    path('categories/', CategoryListCreate.as_view(), name='categories'),
    path('', include(router.urls)),
    path('test-railway/', railway_test, name='railway_test'),
    path('health/', health_check, name='health_check'),
]