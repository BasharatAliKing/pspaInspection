from ...common_imports import *

class DeleteTPV01View(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def destroy(self, request, pk=None, *args, **kwargs):
        try:
            record = TPV01.objects.filter(id=pk).first()

            if not record:
                return ApiResponse(
                    status=404,
                    message="TPV-01 record not found.",
                    http_status=404
                ).create_response()

            record.delete()

            return ApiResponse(
                status=200,
                message="TPV-01 record deleted successfully.",
                http_status=200
            ).create_response()

        except ProtectedError:
            return ApiResponse(
                status=400,
                message="Cannot delete record due to related data.",
                http_status=400
            ).create_response()

        except Exception as e:
            return ApiResponse(
                status=500,
                message="Server error.",
                data=str(e),
                http_status=500
            ).create_response()
