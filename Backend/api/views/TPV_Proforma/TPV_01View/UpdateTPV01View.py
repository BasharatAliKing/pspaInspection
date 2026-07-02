from ...common_imports import *

class UpdateTPV01View(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def update(self, request, pk=None, *args, **kwargs):
        try:
            record = TPV01.objects.filter(id=pk).first()

            if not record:
                return ApiResponse(
                    status=404,
                    message="TPV-01 record not found.",
                    http_status=404
                ).create_response()

            serializer = TPV01Serializer(record, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return ApiResponse(
                    status=200,
                    message="TPV-01 record updated successfully.",
                    data=serializer.data,
                    http_status=200
                ).create_response()
            else:
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
