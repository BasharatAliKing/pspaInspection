from ...common_imports import *

class TehsilCreateView(viewsets.ViewSet):
    queryset = Tehsil.objects.all()
    serializer_class = TehsilSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        data = request.data
        try:

            # -------------------------------
            # DUPLICATE CHECK
            # -------------------------------
            province = data.get("province")
            zone = data.get("zone")
            division = data.get("division")
            district = data.get("district")
            tehsil_name = data.get("tehsil_name")

            if Tehsil.objects.filter(
                province=province,
                zone=zone,
                division=division,
                district=district,
                tehsil_name__iexact=tehsil_name
            ).exists():
                return ApiResponse(
                    status=status.HTTP_400_BAD_REQUEST,
                    message="Tehsil already exists.",
                    http_status=status.HTTP_400_BAD_REQUEST
                ).create_response()

            # -------------------------------
            # VALIDATION
            # -------------------------------
            serializer = TehsilSerializer(data=data)
            serializer.is_valid(raise_exception=True)

            # -------------------------------
            # CREATE
            # -------------------------------
            mytehsil = Tehsil(
                province=serializer.validated_data['province'],
                zone=serializer.validated_data['zone'],
                division=serializer.validated_data['division'],
                district=serializer.validated_data['district'],
                tehsil_name=serializer.validated_data['tehsil_name'],
            )
            mytehsil.save()

            return ApiResponse(
                status=status.HTTP_201_CREATED,
                message="Tehsil created successfully.",
                data=TehsilSerializer(mytehsil).data,
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