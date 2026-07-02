from ...common_imports import *

class BOQListView(viewsets.ViewSet):

    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):

        try:
            boq_id = request.query_params.get("id")
            contract_id = request.query_params.get("contract")

            # Single BOQ
            if boq_id:

                boq = BOQ.objects.select_related(
                    "contract"
                ).filter(id=boq_id).first()

                if not boq:
                    return ApiResponse(
                        status=404,
                        message="BOQ not found.",
                        http_status=404
                    ).create_response()

                return ApiResponse(
                    status=200,
                    message="BOQ found.",
                    data=BOQSerializer(boq).data,
                    http_status=200
                ).create_response()

            # All BOQs
            boqs = BOQ.objects.select_related(
                "contract"
            )

            # Filter by contract
            if contract_id:
                boqs = boqs.filter(
                    contract_id=contract_id
                )

            boqs = boqs.order_by("-id")

            serializer = BOQSerializer(
                boqs,
                many=True
            )

            return ApiResponse(
                status=200,
                message="All BOQ records fetched.",
                data=serializer.data,
                http_status=200
            ).create_response()

        except Exception as e:
            return ApiResponse(
                status=500,
                message="Server error.",
                data=str(e),
                http_status=500
            ).create_response()