from ...common_imports import *

class ZoneDeleteView(viewsets.ViewSet):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer
    permission_classes = [AllowAny]

    def destroy(self, request, *args, **kwargs):

        zone_id = kwargs.get('pk')

        try:
            zone = Zone.objects.get(id=zone_id)

        except Zone.DoesNotExist:
            return ApiResponse(
                status=status.HTTP_404_NOT_FOUND,
                message="Zone not found.",
                http_status=status.HTTP_404_NOT_FOUND
            ).create_response()

        try:
            zone.delete()

            return ApiResponse(
                status=status.HTTP_200_OK,
                message="Zone deleted successfully.",
                http_status=status.HTTP_200_OK
            ).create_response()

        except ProtectedError:
            return ApiResponse(
                status=status.HTTP_400_BAD_REQUEST,
                message="Cannot delete zone because it is linked to other records.",
                http_status=status.HTTP_400_BAD_REQUEST
            ).create_response()

        except Exception as e:
            return ApiResponse(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message="Exception error.",
                data=str(e),
                http_status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ).create_response()