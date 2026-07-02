from ...common_imports import *

class DistrictUpdateView(viewsets.ViewSet):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    permission_classes = [AllowAny]

    def update(self, request, *args, **kwargs):
        data = request.data
        district_id = kwargs.get('pk')

        try:
            mydistrict = District.objects.get(id=district_id)

        except District.DoesNotExist:
            return ApiResponse(
                status=status.HTTP_404_NOT_FOUND,
                message="District not found.",
                http_status=status.HTTP_404_NOT_FOUND
            ).create_response()

        try:
            serializer = DistrictSerializer(mydistrict, data=data, partial=True)

            if serializer.is_valid():

                province = serializer.validated_data.get('province', mydistrict.province)
                zone = serializer.validated_data.get('zone', mydistrict.zone)
                division = serializer.validated_data.get('division', mydistrict.division)
                district_name = serializer.validated_data.get('district_name', mydistrict.district_name)

                # =========================
                # 🔴 DUPLICATE CHECK
                # =========================
                if District.objects.filter(
                    province=province,
                    zone=zone,
                    division=division,
                    district_name__iexact=district_name
                ).exclude(id=mydistrict.id).exists():

                    return ApiResponse(
                        status=status.HTTP_400_BAD_REQUEST,
                        message="Duplicate entry error.",
                        data={
                            "district_name": [
                                "District already exists."
                            ]
                        },
                        http_status=status.HTTP_400_BAD_REQUEST
                    ).create_response()

                serializer.save()

                return ApiResponse(
                    status=status.HTTP_200_OK,
                    message="District updated successfully.",
                    data=serializer.data,
                    http_status=status.HTTP_200_OK
                ).create_response()

            return ApiResponse(
                status=status.HTTP_400_BAD_REQUEST,
                message="Validation error.",
                data=serializer.errors,
                http_status=status.HTTP_400_BAD_REQUEST
            ).create_response()

        except Exception as e:
            return ApiResponse(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message="Exception error.",
                data=str(e),
                http_status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ).create_response()