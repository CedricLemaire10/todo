from django.http import JsonResponse
from django.conf import settings

class MethodRestrictionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # On charge les règles depuis settings.py pour une meilleure configuration
        self.rules = getattr(settings, "CORS_METHOD_RULES", {})

    def __call__(self, request):
        # La requête OPTIONS doit toujours être autorisée pour que le pre-flight fonctionne
        if request.method == 'OPTIONS':
            return self.get_response(request)

        origin = request.headers.get('Origin')

        # Si l'origine est dans nos règles, on applique la restriction
        if origin in self.rules:
            allowed_methods = self.rules[origin]
            if request.method not in allowed_methods:
                return JsonResponse(
                    {'detail': f'Method {request.method} is not allowed for your origin.'},
                    status=403
                )

        return self.get_response(request)