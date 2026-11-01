import pytest
from django.core.exceptions import ValidationError
from rest_framework import status
from django.urls import reverse

from .models import Task, Category

pytestmark = pytest.mark.django_db

def test_create_valid_task(authenticated_client, test_category):
    url = reverse("tasks-list")
    data = {
        "description": "Ménage",
        "category": test_category.id
    }
    response = authenticated_client.post(url, data)
    assert response.status_code == 201 # Created


def test_create_bad_task(authenticated_client, test_category):
    url = reverse("tasks-list")
    data = {
        "category": test_category.id
    }
    response = authenticated_client.post(url, data)
    assert response.status_code == 400 # Bad request

def test_create_task_user_not_connected(api_client, test_category):
    url = reverse("tasks-list")
    data = {
        "description": "Ménage",
        "category": test_category.id
    }
    response = api_client.post(url, data)
    assert response.status_code == 401 # Unauthorized

def test_delete_task(authenticated_client, test_task):
    url = reverse("tasks-detail", args=[test_task.id])

    response = authenticated_client.delete(url)
    assert response.status_code == status.HTTP_204_NO_CONTENT