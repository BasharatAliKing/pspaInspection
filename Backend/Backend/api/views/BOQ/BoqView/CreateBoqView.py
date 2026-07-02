from ...common_imports import *

class BOQCreateView(viewsets.ViewSet):

    permission_classes = [AllowAny]

    def create(self, request):
        try:
            serializer = BOQSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            boq = serializer.save()

            return ApiResponse(
                status=201,
                message="BOQ created successfully.",
                data=BOQSerializer(boq).data,
                http_status=201
            ).create_response()

        except serializers.ValidationError as e:
            return ApiResponse(
                status=400,
                message="Validation error.",
                data=e.detail,
                http_status=400
            ).create_response()

        except Exception as e:
            return ApiResponse(
                status=500,
                message="Server error.",
                data=str(e),
                http_status=500
            ).create_response()