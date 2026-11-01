from django.urls import path, include

from rest_framework import routers

from .views import (
    CategoryListCreate,
    TaskViewset,
    railway_test,
    health_check,
    trigger_error
)

from .auth_views import (
    csrf_token,
    LoginView,
    RefreshView,
    LogoutView,
)

router = routers.DefaultRouter()
router.register('tasks', TaskViewset, basename='tasks')

urlpatterns = [
    # Authentification
    path('auth/csrf/', csrf_token, name='csrf_token'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/refresh/', RefreshView.as_view(), name='refresh'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),

    # Catégories
    path('categories/', CategoryListCreate.as_view(), name='categories'),

    # Tâches
    path('', include(router.urls)),

    # Tests
    path('test-railway/', railway_test, name='railway_test'),
    path('health/', health_check, name='health_check'),
    path('error/', trigger_error, name='trigger_error'),
]