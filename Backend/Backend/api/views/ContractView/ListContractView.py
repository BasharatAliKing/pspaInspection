from ..common_imports import *

class ListContractView(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        try:

            contract_id = request.query_params.get("id")
            tehsil_id = request.query_params.get("tehsil_id")
            # -------------------------------
            # SINGLE CONTRACT
            # -------------------------------
            if contract_id:
                contract = Contract.objects.filter(id=contract_id).first()

                if not contract:
                    return ApiResponse(
                        status=status.HTTP_404_NOT_FOUND,
                        message="Contract not found.",
                        http_status=status.HTTP_404_NOT_FOUND
                    ).create_response()

                serializer = ContractSerializer(contract)

                return ApiResponse(
                    status=status.HTTP_200_OK,
                    message="Contract found.",
                    data=serializer.data,
                    http_status=status.HTTP_200_OK
                ).create_response()

            # -------------------------------
            # ALL CONTRACTS
            # -------------------------------
            contracts = Contract.objects.all()
            # Apply filter here
            if tehsil_id:
                contracts = contracts.filter(tehsil_id=tehsil_id)
            contracts = contracts.order_by("-id")
            serializer = ContractSerializer(contracts, many=True)

            return ApiResponse(
                status=status.HTTP_200_OK,
                message="Contracts fetched successfully.",
                data=serializer.data,
                http_status=status.HTTP_200_OK
            ).create_response()

        except Exception as e:
            return ApiResponse(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message="Server error.",
                data=str(e),
                http_status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ).create_response()