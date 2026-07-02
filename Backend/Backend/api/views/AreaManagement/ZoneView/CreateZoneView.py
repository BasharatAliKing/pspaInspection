from django.db import IntegrityError
from django.db.models import Q
from rest_framework import status, serializers
from ...common_imports import *

class ZoneCreateView(viewsets.ViewSet):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        data = request.data

        try:
            serializer = ZoneSerializer(data=data)
            serializer.is_valid(raise_exception=True)

            province = serializer.validated_data['province']
            zone_name = serializer.validated_data['zone_name']

            # ✅ DUPLICATE CHECK (important)
            if Zone.objects.filter(
                province=province,
                zone_name__iexact=zone_name
            ).exists():
                return ApiResponse(
                    status=status.HTTP_400_BAD_REQUEST,
                    message="Duplicate entry error.",
                    data={"zone_name": ["This zone already exists."]},
                    http_status=status.HTTP_400_BAD_REQUEST
                ).create_response()

            zone = Zone.objects.create(
                province=province,
                zone_name=zone_name,
            )

            return ApiResponse(
                status=status.HTTP_201_CREATED,
                message="Zone created successfully.",
                data=ZoneSerializer(zone).data,
                http_status=status.HTTP_201_CREATED
            ).create_response()

        except serializers.ValidationError as e:
            return ApiResponse(
                status=status.HTTP_400_BAD_REQUEST,
                message="Validation error.",
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