from rest_framework import viewsets, mixins, generics
from django.http import JsonResponse

from .models import Category, Task
from .serializers import CategorySerializer, TaskSerializer


class CategoryListCreate(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    generics.GenericAPIView
):
    """Permet à tous d'afficher la liste des catégories et
    d'en créer une nouvelle.
    
    URLs :
    /api/category/ => list / create
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

class TaskViewset(viewsets.ModelViewSet):
    """Permet de gérer toutes les actions CRUD sur le
    modèle Task.
    
    URLs :
    /api/tasks/ => list / create
    /api/tasks/<id_task> => retrieve / update
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

def railway_test(request):
    """Une vue simple pour valider le déploiement sur Railway."""
    return JsonResponse({"message": "API déployée avec succès sur Railway !"})

    from django.http import JsonResponse

def health_check(request):
    """Une vue simple qui renvoie un statut de succès."""
    return JsonResponse({"status": "ok", "message": "API is healthy"})

def trigger_error(request):
    """Une vue conçue pour créer une erreur 500."""
    # Cette ligne va inévitablement provoquer une erreur
    division_by_zero = 1 / 0
    return JsonResponse({"this": "will never be returned"})
