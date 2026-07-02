from ...common_imports import *

class ListTPV01View(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        try:
            record_id = request.query_params.get("id")

            if record_id:
                record = TPV01.objects.filter(id=record_id).first()

                if not record:
                    return ApiResponse(
                        status=404,
                        message="TPV-01 record not found.",
                        http_status=404
                    ).create_response()

                return ApiResponse(
                    status=200,
                    message="TPV-01 record found.",
                    data=TPV01Serializer(record).data,
                    http_status=200
                ).create_response()

            # Get filter parameters
            district_id = request.query_params.get("district")
            tehsil_id = request.query_params.get("tehsil")
            inspection_site_id = request.query_params.get("inspection_site")

            records = TPV01.objects.all().order_by("-id")

            if district_id:
                records = records.filter(district_id=district_id)
            
            if tehsil_id:
                records = records.filter(tehsil_id=tehsil_id)
            
            if inspection_site_id:
                records = records.filter(inspection_site_id=inspection_site_id)

            serializer = TPV01Serializer(records, many=True)

            return ApiResponse(
                status=200,
                message="All TPV-01 records fetched.",
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
