from ...common_imports import *

class BOQBillListView(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):

        bill_id = request.query_params.get("id")
        contract_id = request.query_params.get("contract_id")

        bills = BOQBill.objects.select_related("contract").order_by("-id")

        # single bill
        if bill_id:
            bill = bills.filter(id=bill_id).first()

            if not bill:
                return ApiResponse(
                    status=404,
                    message="Bill not found.",
                    http_status=404
                ).create_response()

            return ApiResponse(
                status=200,
                message="Bill found.",
                data=BOQBillSerializer(bill).data,
                http_status=200
            ).create_response()

        # filter
        if contract_id:
            bills = bills.filter(contract_id=contract_id)

        serializer = BOQBillSerializer(bills, many=True)

        return ApiResponse(
            status=200,
            message="Bills fetched successfully.",
            data=serializer.data,
            http_status=200
        ).create_response()