from ...common_imports import *

class InspectionSiteUpdateView(viewsets.ViewSet):

    permission_classes = [AllowAny]

    def update(self, request, pk=None):

        try:
            site = InspectionSite.objects.get(id=pk)

        except InspectionSite.DoesNotExist:
            return ApiResponse(
                status=404,
                message="Site not found.",
                http_status=404
            ).create_response()

        try:
            serializer = InspectionSiteSerializer(site, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()

                return ApiResponse(
                    status=200,
                    message="Site updated successfully.",
                    data=serializer.data,
                    http_status=200
                ).create_response()

            return ApiResponse(
                status=400,
                message="Validation error.",
                data=serializer.errors,
                http_status=400
            ).create_response()

        except Exception as e:
            return ApiResponse(
                status=500,
                message="Exception error.",
                data=str(e),
                http_status=500
            ).create_response()