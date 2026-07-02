from ...common_imports import *

class BOQBillUpdateView(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def update(self, request, pk=None):

        try:
            bill = BOQBill.objects.get(id=pk)
        except BOQBill.DoesNotExist:
            return ApiResponse(
                status=404,
                message="Bill not found.",
                http_status=404
            ).create_response()

        serializer = BOQBillSerializer(bill, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return ApiResponse(
                status=200,
                message="Bill updated successfully.",
                data=serializer.data,
                http_status=200
            ).create_response()

        return ApiResponse(
            status=400,
            message="Validation error.",
            data=serializer.errors,
            http_status=400
        ).create_response()