from ..common_imports import *

class ContractDeleteView(viewsets.ViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    permission_classes = [AllowAny]

    def destroy(self, request, *args, **kwargs):
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
            contract.delete()

            return ApiResponse(
                status=status.HTTP_200_OK,
                message="Contract deleted successfully.",
                http_status=status.HTTP_200_OK
            ).create_response()

        except ProtectedError:
            return ApiResponse(
                status=status.HTTP_400_BAD_REQUEST,
                message="Cannot delete contract because it is linked to other records.",
                http_status=status.HTTP_400_BAD_REQUEST
            ).create_response()

        except IntegrityError:
            return ApiResponse(
                status=status.HTTP_400_BAD_REQUEST,
                message="Cannot delete contract because it is linked to other records.",
                http_status=status.HTTP_400_BAD_REQUEST
            ).create_response()

        except Exception as e:
            return ApiResponse(
                status=status.HTTP_400_BAD_REQUEST,
                message="Something went wrong.",
                data=str(e),
                http_status=status.HTTP_400_BAD_REQUEST
            ).create_response()