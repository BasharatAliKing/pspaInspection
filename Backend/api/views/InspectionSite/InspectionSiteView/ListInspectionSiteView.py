from ...common_imports import *

class InspectionSiteListView(viewsets.ViewSet):

    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):

        try:
            site_id = request.query_params.get("id")
            tehsil_id = request.query_params.get("tehsil_id")
            division_id = request.query_params.get("division_id")
            zone_id = request.query_params.get("zone_id")
            contract_id = request.query_params.get("contract")
            #------------ Api for apply filter by contract
            # http://127.0.0.1:8000/api/list-inspection-site/?contract=2
            if site_id:
                site = InspectionSite.objects.filter(id=site_id).first()

                if not site:
                    return ApiResponse(
                        status=404,
                        message="Site not found.",
                        http_status=404
                    ).create_response()

                return ApiResponse(
                    status=200,
                    message="Site found.",
                    data=InspectionSiteSerializer(site).data,
                    http_status=200
                ).create_response()
                
            #----------------- Filtering Here -----------------------#
            sites = InspectionSite.objects.all()
            
            if contract_id:
                sites=sites.filter(contract_id=contract_id)

            if tehsil_id:
               sites = sites.filter(tehsil_id=tehsil_id)

            if division_id:
               sites = sites.filter(division_id=division_id)

            if zone_id:
                sites = sites.filter(zone_id=zone_id)

            sites = sites.order_by("-id")

            serializer = InspectionSiteSerializer(sites, many=True)


            return ApiResponse(
                status=200,
                message="All sites fetched.",
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