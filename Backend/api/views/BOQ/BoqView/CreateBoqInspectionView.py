from ...common_imports import *

class BOQInspectionCreateView(viewsets.ViewSet):

    permission_classes = [AllowAny]

    def create(self, request):
        try:
            if "boq" not in request.data:
                raise serializers.ValidationError({"boq": "This field is required."})

            serializer = BOQInspectionSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            inspection = serializer.save()

            return ApiResponse(
                status=201,
                message="BOQ Inspection created successfully.",
                data=BOQInspectionSerializer(inspection).data,
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
                status=500,
                message="Server error.",
                data=str(e),
                http_status=500
            ).create_response()
