from ...common_imports import *

class DistrictCreateView(viewsets.ViewSet):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        data = request.data

        try:
            serializer = DistrictSerializer(data=data)
            serializer.is_valid(raise_exception=True)

            province = serializer.validated_data['province']
            zone = serializer.validated_data['zone']
            division = serializer.validated_data['division']
            district_name = serializer.validated_data['district_name']

            # =========================
            # ✅ DUPLICATE CHECK (IMPORTANT)
            # =========================
            if District.objects.filter(
                province=province,
                zone=zone,
                division=division,
                district_name__iexact=district_name
            ).exists():
                return ApiResponse(
                    status=status.HTTP_400_BAD_REQUEST,
                    message="Duplicate entry.",
                    data={
                        "district_name": ["District already exists."]
                    },
                    http_status=status.HTTP_400_BAD_REQUEST
                ).create_response()

            # =========================
            # CREATE
            # =========================
            mydistrict = District.objects.create(
                province=province,
                zone=zone,
                division=division,
                district_name=district_name,
            )

            return ApiResponse(
                status=status.HTTP_201_CREATED,
                message="District created successfully.",
                data=DistrictSerializer(mydistrict).data,
                http_status=status.HTTP_201_CREATED
            ).create_response()

        except serializers.ValidationError as e:
            return ApiResponse(
                status=status.HTTP_400_BAD_REQUEST,
                message="Serializer error.",
                data=e.detail,
                http_status=status.HTTP_400_BAD_REQUEST
            ).create_response()

        except Exception as e:
            return ApiResponse(
                status=status.HTTP_400_BAD_REQUEST,
                message="Exception error.",
                data=str(e),
                http_status=status.HTTP_400_BAD_REQUEST
            ).create_response()