from ...common_imports import *

class BOQInspectionDeleteView(viewsets.ViewSet):

    permission_classes = [AllowAny]

    def destroy(self, request, pk=None):
        try:
            inspection = BOQInspection.objects.get(id=pk)
            inspection.delete()

            return ApiResponse(
                status=200,
                message="BOQ Inspection deleted successfully.",
                http_status=200
            ).create_response()

        except BOQInspection.DoesNotExist:
            return ApiResponse(
                status=404,
                message="BOQ Inspection not found.",
                http_status=404
            ).create_response()

        except Exception as e:
            return ApiResponse(
                status=500,
                message="Server error.",
                data=str(e),
                http_status=500
            ).create_response()
