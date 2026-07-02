from ...common_imports import *

class BOQInspectionUpdateView(viewsets.ViewSet):

    permission_classes = [AllowAny]

    def update(self, request, pk=None):
        try:
            inspection = BOQInspection.objects.get(id=pk)

        except BOQInspection.DoesNotExist:
            return ApiResponse(
                status=404,
                message="BOQ Inspection not found.",
                http_status=404
            ).create_response()

        try:
            serializer = BOQInspectionSerializer(
                inspection,
                data=request.data,
                partial=True
            )
            serializer.is_valid(raise_exception=True)
            inspection = serializer.save()

            return ApiResponse(
                status=200,
                message="BOQ Inspection updated successfully.",
                data=BOQInspectionSerializer(inspection).data,
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
