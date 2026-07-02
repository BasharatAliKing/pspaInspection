from ...common_imports import *

class BOQDeleteView(viewsets.ViewSet):

    permission_classes = [AllowAny]

    def destroy(self, request, pk=None):

        try:
            boq = BOQ.objects.get(id=pk)

            # Delete related inspection if exists
            BOQInspection.objects.filter(boq=boq).delete()

            # Delete BOQ
            boq.delete()

            return ApiResponse(
                status=200,
                message="BOQ deleted successfully.",
                http_status=200
            ).create_response()

        except BOQ.DoesNotExist:
            return ApiResponse(
                status=404,
                message="BOQ not found.",
                http_status=404
            ).create_response()

        except Exception as e:
            return ApiResponse(
                status=500,
                message="Server error.",
                data=str(e),
                http_status=500
            ).create_response()