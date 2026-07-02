from .common_imports import *

class LoginView(APIView):
    """
    API endpoint for user login.
    """

    permission_classes = []  # AllowAny if you want public access

    def post(self, request):
        code = request.data.get('code')
        password = request.data.get('password')

        if not code or not password:
            return ApiResponse(
                status=status.HTTP_400_BAD_REQUEST,
                message="Credentials missing",
                data={}
            ).create_response()

        user = authenticate(request, code=code, password=password)
        if user is not None:
            login(request, user)  # Django login
            auth_data = get_tokens_for_user(user)
            verified = getattr(user, "is_verified", True)  # if you have is_verified field

            return ApiResponse(
                status=status.HTTP_200_OK,
                message="Login Success",
                data={
                    "login": "Login Success",
                    "verified": verified,
                    **auth_data
                }
            ).create_response()

        return ApiResponse(
            status=status.HTTP_401_UNAUTHORIZED,
            message="Invalid Credentials",
            data={}
        ).create_response()
