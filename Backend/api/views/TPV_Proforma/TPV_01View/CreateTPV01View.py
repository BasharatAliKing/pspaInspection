from ...common_imports import *


class CreateTPV01View(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            serializer = TPV01Serializer(data=request.data)

            if serializer.is_valid():

                serializer.save(
                    inspector=request.user,
                    inspector_name=request.user.full_name
                )

                return ApiResponse(
                    status=201,
                    message="TPV-01 record created successfully.",
                    data=serializer.data,
                    http_status=201
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
                message="Server error.",
                data=str(e),
                http_status=500
            ).create_response()