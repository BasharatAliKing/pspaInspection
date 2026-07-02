from ...common_imports import *

class DivisionCreateView(viewsets.ViewSet):
    queryset = Division.objects.all()
    serializer_class = DivisionSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        data = request.data
        try:

            # -------------------------------
            # DUPLICATE CHECK
            # -------------------------------
            province = data.get("province")
            zone = data.get("zone")
            division_name = data.get("division_name")

            if Division.objects.filter(
                province=province,
                zone=zone,
                division_name__iexact=division_name
            ).exists():
                return ApiResponse(
                    status=status.HTTP_400_BAD_REQUEST,
                    message="Division already exists.",
                    http_status=status.HTTP_400_BAD_REQUEST
                ).create_response()

            # -------------------------------
            # VALIDATION
            # -------------------------------
            serializer = DivisionSerializer(data=data)
            serializer.is_valid(raise_exception=True)

            # -------------------------------
            # CREATE
            # -------------------------------
            mydivision = Division(
                province=serializer.validated_data['province'],
                zone=serializer.validated_data['zone'],
                division_name=serializer.validated_data['division_name'],
            )
            mydivision.save()

            return ApiResponse(
                status=status.HTTP_201_CREATED,
                message="Division created successfully.",
                data=DivisionSerializer(mydivision).data,
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