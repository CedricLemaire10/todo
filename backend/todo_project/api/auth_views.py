from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import (
    csrf_protect,
    ensure_csrf_cookie,
)
from django.utils.decorators import method_decorator

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

def set_refresh_cookie(response, refresh_token):
    response.set_cookie(
        key="refresh_token",
        value=str(refresh_token),
        httponly=True,
        secure=not settings.DEBUG,
        samesite="Lax",
        max_age=60 * 60 * 24,
        path="/api/auth/",
    )

    return response


# Récupération du token CSRF
@ensure_csrf_cookie
def csrf_token(request):
    return JsonResponse({
        "csrfToken": get_token(request)
    })


# Connexion
@method_decorator(csrf_protect, name="dispatch")
class LoginView(APIView):

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is None:
            return Response(
                {"detail": "Identifiants incorrects."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        response = Response({
            "access": str(access),
        })

        set_refresh_cookie(response, refresh)

        return response


# Renouvellement du token
@method_decorator(csrf_protect, name="dispatch")
class RefreshView(APIView):

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):

        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token manquant."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            old_refresh = RefreshToken(refresh_token)

            user_model = get_user_model()
            user = user_model.objects.get(
                pk=old_refresh[settings.SIMPLE_JWT.get(
                    "USER_ID_CLAIM", "user_id"
                )]
            )

            # Invalidation de l'ancien refresh token
            old_refresh.blacklist()

            # Création d'une nouvelle paire de tokens
            new_refresh = RefreshToken.for_user(user)
            new_access = new_refresh.access_token

            response = Response({
                "access": str(new_access),
            })

            set_refresh_cookie(response, new_refresh)

            return response

        except (TokenError, get_user_model().DoesNotExist, KeyError):
            response = Response(
                {"detail": "Refresh token invalide ou expiré."},
                status=status.HTTP_401_UNAUTHORIZED
            )

            response.delete_cookie(
                "refresh_token",
                path="/api/auth/"
            )

            return response


# Déconnexion
@method_decorator(csrf_protect, name="dispatch")
class LogoutView(APIView):

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):

        refresh_token = request.COOKIES.get("refresh_token")

        if refresh_token:
            try:
                RefreshToken(refresh_token).blacklist()
            except TokenError:
                pass

        response = Response(
            {"detail": "Déconnexion effectuée."},
            status=status.HTTP_200_OK
        )

        response.delete_cookie(
            "refresh_token",
            path="/api/auth/"
        )

        return response
