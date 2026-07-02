from ..common_imports import *

class ContractCreateView(viewsets.ViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        data = request.data

        try:

            # -------------------------------
            # DUPLICATE CHECK
            # -------------------------------
            contract_no = data.get("contract_no")

            if Contract.objects.filter(contract_no__iexact=contract_no).exists():
                return ApiResponse(
                    status=status.HTTP_400_BAD_REQUEST,
                    message="Contract already exists.",
                    http_status=status.HTTP_400_BAD_REQUEST
                ).create_response()

            # -------------------------------
            # VALIDATION
            # -------------------------------
            serializer = ContractSerializer(data=data)
            serializer.is_valid(raise_exception=True)

            # -------------------------------
            # CREATE
            # -------------------------------
            contract = Contract.objects.create(
                contract_no=serializer.validated_data["contract_no"],
                province=serializer.validated_data["province"],
                zone=serializer.validated_data["zone"],
                division=serializer.validated_data["division"],
                district=serializer.validated_data["district"],
                tehsil=serializer.validated_data["tehsil"],
            )

            return ApiResponse(
                status=status.HTTP_201_CREATED,
                message="Contract created successfully.",
                data=ContractSerializer(contract).data,
                http_status=status.HTTP_201_CREATED
            ).create_response()

        except serializers.ValidationError as e:
            return ApiResponse(
                status=status.HTTP_400_BAD_REQUEST,
                message="Serializer error.",
                data=e.detail,
                http_status=status.HTTP_400_BAD_REQUEST
            ).create_response()

        except Exception as e:
            return ApiResponse(
                status=status.HTTP_400_BAD_REQUEST,
                message="Exception error.",
                data=str(e),
                http_status=status.HTTP_400_BAD_REQUEST
            ).create_response()