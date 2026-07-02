from ...common_imports import *

class BOQBillCreateView(viewsets.ViewSet):

    permission_classes = [AllowAny]

    def create(self, request):

        try:
            serializer = BOQBillSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            bill = serializer.save()

            return ApiResponse(
                status=201,
                message="BOQ Bill created successfully.",
                data=BOQBillSerializer(bill).data,
                http_status=201
            ).create_response()

        except serializers.ValidationError as e:
            return ApiResponse(
                status=400,
                message="Validation error.",
                data=e.detail,
                http_status=400
            ).create_response()