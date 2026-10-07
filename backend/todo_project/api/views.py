from rest_framework import viewsets, mixins, generics

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