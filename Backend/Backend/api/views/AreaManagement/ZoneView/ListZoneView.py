from ...common_imports import *

class ListZoneView(viewsets.ViewSet):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):

        try:
            zone_id = request.query_params.get("id")
            province_id = request.query_params.get("province_id")

            if zone_id:
                zone = Zone.objects.filter(id=zone_id).first()

                if not zone:
                    return ApiResponse(
                        status=status.HTTP_404_NOT_FOUND,
                        message="Zone not found.",
                        http_status=status.HTTP_404_NOT_FOUND
                    ).create_response()

                serializer = ZoneSerializer(zone)
                return ApiResponse(
                    status=status.HTTP_200_OK,
                    message="Zone found.",
                    data=serializer.data,
                    http_status=status.HTTP_200_OK
                ).create_response()

            elif province_id:
                zones = Zone.objects.filter(province_id=province_id)

                if not zones.exists():
                    return ApiResponse(
                        status=status.HTTP_404_NOT_FOUND,
                        message="No zones found for this Province.",
                        http_status=status.HTTP_404_NOT_FOUND
                    ).create_response()

                serializer = ZoneSerializer(zones, many=True)
                return ApiResponse(
                    status=status.HTTP_200_OK,
                    message="Zones found.",
                    data=serializer.data,
                    http_status=status.HTTP_200_OK
                ).create_response()

            else:
                zones = Zone.objects.all()
                serializer = ZoneSerializer(zones, many=True)

                return ApiResponse(
                    status=status.HTTP_200_OK,
                    message="All zones found.",
                    data=serializer.data,
                    http_status=status.HTTP_200_OK
                ).create_response()

        except Exception as e:
            return ApiResponse(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message="Server error.",
                data=str(e),
                http_status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ).create_response()