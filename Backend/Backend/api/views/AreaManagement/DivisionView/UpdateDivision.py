from ...common_imports import *

class DivisionUpdateView(viewsets.ViewSet):
    queryset = Division.objects.all()
    serializer_class = DivisionSerializer
    permission_classes = [AllowAny]

    def update(self, request, *args, **kwargs):
        data = request.data
        division_id = kwargs.get('pk') 

        try:
            mydivision = Division.objects.get(id=division_id)

        except Division.DoesNotExist:
            return ApiResponse(
                status=status.HTTP_404_NOT_FOUND,
                message="Division not found.",
                http_status=status.HTTP_404_NOT_FOUND
            ).create_response()

        try:
            # -------------------------------
            # DUPLICATE CHECK (EXCLUDE SELF)
            # -------------------------------
            province = data.get("province", mydivision.province_id)
            zone = data.get("zone", mydivision.zone_id)
            division_name = data.get("division_name", mydivision.division_name)

            duplicate_exists = Division.objects.filter(
                province=province,
                zone=zone,
                division_name__iexact=division_name
            ).exclude(id=division_id).exists()

            if duplicate_exists:
                return ApiResponse(
                    status=status.HTTP_400_BAD_REQUEST,
                    message="Division already exists.",
                    http_status=status.HTTP_400_BAD_REQUEST
                ).create_response()

            # -------------------------------
            # UPDATE
            # -------------------------------
            serializer = DivisionSerializer(mydivision, data=data, partial=True)  

            if serializer.is_valid():
                serializer.save()
                return ApiResponse(
                    status=status.HTTP_200_OK,
                    message="Division updated successfully.",
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