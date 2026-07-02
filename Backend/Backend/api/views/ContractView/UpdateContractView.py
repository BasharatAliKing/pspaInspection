from ..common_imports import *

class ContractUpdateView(viewsets.ViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    permission_classes = [AllowAny]

    def update(self, request, *args, **kwargs):
        data = request.data
        contract_id = kwargs.get("pk")

        try:
            contract = Contract.objects.get(id=contract_id)

        except Contract.DoesNotExist:
            return ApiResponse(
                status=status.HTTP_404_NOT_FOUND,
                message="Contract not found.",
                http_status=status.HTTP_404_NOT_FOUND
            ).create_response()

        try:

            # -------------------------------
            # DUPLICATE CHECK (EXCLUDE SELF)
            # -------------------------------
            contract_no = data.get("contract_no", contract.contract_no)

            if Contract.objects.filter(
                contract_no__iexact=contract_no
            ).exclude(id=contract_id).exists():
                return ApiResponse(
                    status=status.HTTP_400_BAD_REQUEST,
                    message="Contract already exists.",
                    http_status=status.HTTP_400_BAD_REQUEST
                ).create_response()

            # -------------------------------
            # UPDATE
            # -------------------------------
            serializer = ContractSerializer(contract, data=data, partial=True)

            if serializer.is_valid():
                serializer.save()

                return ApiResponse(
                    status=status.HTTP_200_OK,
                    message="Contract updated successfully.",
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