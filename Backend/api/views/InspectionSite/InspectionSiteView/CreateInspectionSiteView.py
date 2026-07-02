from ...common_imports import *

class InspectionSiteCreateView(viewsets.ViewSet):

    permission_classes = [AllowAny]

    def create(self, request):

        try:
            serializer = InspectionSiteSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            site = InspectionSite.objects.create(**serializer.validated_data)

            return ApiResponse(
                status=201,
                message="Inspection site created successfully.",
                data=InspectionSiteSerializer(site).data,
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