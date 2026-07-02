from ...common_imports import *

class ProvinceUpdateView(viewsets.ViewSet):
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer
    permission_classes = [AllowAny]

    def update(self, request, *args, **kwargs):
        data = request.data
        province_id = kwargs.get('pk')

        try:
            myprovince = Province.objects.get(id=province_id)

        except Province.DoesNotExist:
            return ApiResponse(
                status=status.HTTP_404_NOT_FOUND,
                message="Province not found.",
                http_status=status.HTTP_404_NOT_FOUND
            ).create_response()

        try:
            new_name = data.get("province_name")

            # ==============================
            # DUPLICATE CHECK (IMPORTANT)
            # ==============================
            if new_name:
                duplicate_exists = Province.objects.filter(
                    province_name__iexact=new_name
                ).exclude(id=province_id).exists()

                if duplicate_exists:
                    return ApiResponse(
                        status=status.HTTP_400_BAD_REQUEST,
                        message="Duplicate entry error.",
                        data={"province_name": ["This province already exists."]},
                        http_status=status.HTTP_400_BAD_REQUEST
                    ).create_response()

            serializer = ProvinceSerializer(myprovince, data=data, partial=True)

            if serializer.is_valid():
                serializer.save()

                return ApiResponse(
                    status=status.HTTP_200_OK,
                    message="Province updated successfully.",
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