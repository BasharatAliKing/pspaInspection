from ...common_imports import *

class ProvinceCreateView(viewsets.ViewSet):
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        data = request.data

        try:
            serializer = ProvinceSerializer(data=data)
            serializer.is_valid(raise_exception=True)

            province_name = serializer.validated_data.get("province_name").strip()

            # ✅ DUPLICATE CHECK (case-insensitive)
            if Province.objects.filter(province_name__iexact=province_name).exists():
                return ApiResponse(
                    status=400,
                    message="Duplicate entry error.",
                    data={"province_name": ["This province already exists."]},
                    http_status=400
                ).create_response()

            # ✅ CREATE
            myprovince = Province.objects.create(
                province_name=province_name
            )

            return ApiResponse(
                status=201,
                message="Province created successfully.",
                data=ProvinceSerializer(myprovince).data,
                http_status=201
            ).create_response()

        except serializers.ValidationError as e:
            return ApiResponse(
                status=400,
                message="Validation error.",
                data=e.detail,
                http_status=400
            ).create_response()

        except Exception as e:
            return ApiResponse(
                status=400,
                message="Exception error.",
                data=str(e),
                http_status=400
            ).create_response()