import pytest
from rest_framework.test import APIClient
from django.contrib.auth.models import User

from .models import Category, Task

@pytest.fixture
def user_password():
    return "a-strong-password"

@pytest.fixture
def user(db, user_password):
    return User.objects.create_user(
        username="testuser",
        password=user_password
    )

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def authenticated_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client

@pytest.fixture
def test_category():
    return Category.objects.create(name="Maison")

@pytest.fixture
def test_task(test_category):
    return Task.objects.create(description="Ménage", category=test_category)