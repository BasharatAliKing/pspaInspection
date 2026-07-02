from ...common_imports import *

class InspectionSiteDeleteView(viewsets.ViewSet):

    permission_classes = [AllowAny]

    def destroy(self, request, pk=None):

        try:
            site = InspectionSite.objects.get(id=pk)

        except InspectionSite.DoesNotExist:
            return ApiResponse(
                status=404,
                message="Site not found.",
                http_status=404
            ).create_response()

        try:
            site.delete()

            return ApiResponse(
                status=200,
                message="Site deleted successfully.",
                http_status=200
            ).create_response()

        except ProtectedError:
            return ApiResponse(
                status=400,
                message="Cannot delete site due to linked records.",
                http_status=400
            ).create_response()

        except Exception as e:
            return ApiResponse(
                status=500,
                message="Exception error.",
                data=str(e),
                http_status=500
            ).create_response()