from ...common_imports import *
class ZoneUpdateView(viewsets.ViewSet):

    def update(self, request, *args, **kwargs):

        zone_id = kwargs.get('pk')
        data = request.data

        try:
            zone = Zone.objects.get(id=zone_id)

        except Zone.DoesNotExist:
            return ApiResponse(
                status=404,
                message="Zone not found.",
                http_status=404
            ).create_response()

        try:
            serializer = ZoneSerializer(zone, data=data, partial=True)

            if serializer.is_valid():
                province = serializer.validated_data.get('province', zone.province)
                zone_name = serializer.validated_data.get('zone_name', zone.zone_name)

                # 🔴 DUPLICATE CHECK (exclude current record)
                if Zone.objects.filter(
                    province=province,
                    zone_name__iexact=zone_name
                ).exclude(id=zone.id).exists():

                    return ApiResponse(
                        status=400,
                        message="Duplicate Zone",
                        data={"zone_name": ["This zone already exists."]},
                        http_status=400
                    ).create_response()

                serializer.save()

                return ApiResponse(
                    status=200,
                    message="Zone updated successfully.",
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