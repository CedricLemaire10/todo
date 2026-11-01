import pytest
from django.core.exceptions import ValidationError

from .models import Task, Category

pytestmark = pytest.mark.django_db

def test_task_creation(test_task):
    """ Doit vérifier que is_completed est False par défaut à la création
    d'une tache. """
    assert test_task.is_completed == False

def test_task_creation_without_category():
    """ Doit renvoyer une erreur si une tâche est créée sans catégorie. """
    task = Task(description="Travailler")

    with pytest.raises(ValidationError):
        task.full_clean()

def test_task_mark_as_complete_method(test_task):
    """ Doit vérifier que la méthode mark_as_complete fonctionne
    passe le champ à True. """

    test_task.mark_as_complete()
    test_task.refresh_from_db()
    
    assert test_task.is_completed == True