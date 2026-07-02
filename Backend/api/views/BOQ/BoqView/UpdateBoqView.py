from ...common_imports import *

class BOQUpdateView(viewsets.ViewSet):

    permission_classes = [AllowAny]

    def update(self, request, pk=None):

        try:
            boq = BOQ.objects.get(id=pk)

        except BOQ.DoesNotExist:
            return ApiResponse(
                status=404,
                message="BOQ not found.",
                http_status=404
            ).create_response()

        try:
            serializer = BOQSerializer(
                boq,
                data=request.data,
                partial=True
            )

            serializer.is_valid(raise_exception=True)
            boq = serializer.save()   # 🔥 IMPORTANT: capture updated instance

            return ApiResponse(
                status=200,
                message="BOQ updated successfully.",
                data=BOQSerializer(boq).data,  # fresh instance
                http_status=200
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