from ...common_imports import *

class BOQBillDeleteView(viewsets.ViewSet):

    permission_classes = [AllowAny]

    def destroy(self, request, pk=None):

        try:
            bill = BOQBill.objects.get(id=pk)

        except BOQBill.DoesNotExist:
            return ApiResponse(
                status=404,
                message="Bill not found.",
                http_status=404
            ).create_response()

        bill.delete()

        return ApiResponse(
            status=200,
            message="Bill deleted successfully.",
            http_status=200
        ).create_response()