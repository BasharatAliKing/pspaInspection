from ...common_imports import *

class BOQInspectionListView(viewsets.ViewSet):

    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        try:
            inspection_id = request.query_params.get("id")
            boq_id = request.query_params.get("boq")

            if inspection_id:
                inspection = BOQInspection.objects.select_related("boq").filter(id=inspection_id).first()
                if not inspection:
                    return ApiResponse(
                        status=404,
                        message="BOQ Inspection not found.",
                        http_status=404
                    ).create_response()

                return ApiResponse(
                    status=200,
                    message="BOQ Inspection found.",
                    data=BOQInspectionSerializer(inspection).data,
                    http_status=200
                ).create_response()

            inspections = BOQInspection.objects.select_related("boq")
            if boq_id:
                inspections = inspections.filter(boq_id=boq_id)

            inspections = inspections.order_by("-id")
            serializer = BOQInspectionSerializer(inspections, many=True)

            return ApiResponse(
                status=200,
                message="BOQ Inspection records fetched.",
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
