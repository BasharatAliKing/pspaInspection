from rest_framework import serializers
# from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import *

# --------------------------------------------------------
# MyUser Serializer
# --------------------------------------------------------
class MyUserSerializer(serializers.ModelSerializer):
    supervisor_name = serializers.SerializerMethodField(read_only=True)
    supervisor_code = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = MyUser
        fields = [
            "id",
            "code",
            "full_name",
            "role",
            "is_active",
            "supervisor",
            "supervisor_name",
            "supervisor_code",
            "date_joined",
             "password", "email", "contact"
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def get_supervisor_name(self, obj):
        return obj.supervisor.full_name if obj.supervisor else None
    def get_supervisor_code(self, obj):
        return obj.supervisor.code if obj.supervisor else None
    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = MyUser(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user


class MyUserLoginDashboardSerializer(serializers.ModelSerializer):
    code = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = MyUser
        fields = [
            "id",
            "code",
            "password",
            "full_name",
            "role",
            "is_active",
            
        ]
        extra_kwargs = {
            "password": {"write_only": True}
        }

class ProvinceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Province
        fields = [
            "id", "province_name",
        ]
    def validate_province_name(self, value):
        if Province.objects.filter(province_name__iexact=value).exists():
            raise serializers.ValidationError("This province already exists.")
        return value
    
class ZoneSerializer(serializers.ModelSerializer):

    province_name = serializers.CharField(source="province.province_name", read_only=True)

    class Meta:
        model = Zone
        fields = [
            "id", "zone_name", "province", "province_name"
        ]

class DivisionSerializer(serializers.ModelSerializer):

    province_name = serializers.CharField(source="province.province_name", read_only=True)
    zone_name = serializers.CharField(source="zone.zone_name", read_only=True)

    class Meta:
        model = Division
        fields = [
            "id", "province", "province_name", "zone", "zone_name", "division_name",
        ]
class DistrictSerializer(serializers.ModelSerializer):

    province_name = serializers.CharField(source="province.province_name", read_only=True)
    zone_name = serializers.CharField(source="zone.zone_name", read_only=True)
    division_name = serializers.CharField(source="division.division_name", read_only=True)

    class Meta:
        model = District
        fields = [
            "id", "province", "zone", "division", "province_name", "zone_name", "division_name", "district_name",
        ]

class TehsilSerializer(serializers.ModelSerializer):

    province_name = serializers.CharField(source="province.province_name", read_only=True)
    zone_name = serializers.CharField(source="zone.zone_name", read_only=True)
    division_name = serializers.CharField(source="division.division_name", read_only=True)
    district_name = serializers.CharField(source="district.district_name", read_only=True)

    class Meta:
        model = Tehsil
        fields = (
            "id", "province", "zone", "division", "district", "province_name", "zone_name", "division_name", "district_name", "tehsil_name",
        )

class ContractSerializer(serializers.ModelSerializer):

    province_name = serializers.CharField(
        source="province.province_name",
        read_only=True
    )

    zone_name = serializers.CharField(
        source="zone.zone_name",
        read_only=True
    )

    division_name = serializers.CharField(
        source="division.division_name",
        read_only=True
    )

    district_name = serializers.CharField(
        source="district.district_name",
        read_only=True
    )

    tehsil_name = serializers.CharField(
        source="tehsil.tehsil_name",
        read_only=True
    )

    class Meta:
        model = Contract
        fields = [
            "id",
            "contract_no",

            "province",
            "province_name",

            "zone",
            "zone_name",

            "division",
            "division_name",

            "district",
            "district_name",

            "tehsil",
            "tehsil_name",

            "created_at"
        ]

        read_only_fields = ["created_at"]

    def validate_contract_no(self, value):
        qs = Contract.objects.filter(contract_no__iexact=value)

        if self.instance:
            qs = qs.exclude(id=self.instance.id)

        if qs.exists():
            raise serializers.ValidationError(
                "Contract already exists."
            )

        return value
class InspectionSiteSerializer(serializers.ModelSerializer):

    contract_no = serializers.CharField(write_only=True, required=False)
    contract_no_display = serializers.CharField(source="contract.contract_no", read_only=True)
    zone_name = serializers.CharField(source="zone.zone_name", read_only=True)
    division_name = serializers.CharField(source="division.division_name", read_only=True)
    district_name = serializers.CharField(source="district.district_name", read_only=True)
    tehsil_name = serializers.CharField(source="tehsil.tehsil_name", read_only=True)

    class Meta:
        model = InspectionSite
        fields = [
            "id", "contract_no", "contract_no_display", "zone", "zone_name", "division", "division_name", "district", "district_name", "tehsil",  "tehsil_name", "phase", "site_name", "latitude", "longitude", "type", "category", "created_at"
        ]

    read_only_fields = ["created_at"]

    def create(self, validated_data):
        contract_no = self.initial_data.get("contract_no")

        if contract_no:
            contract_no = contract_no.strip()

            contract, _ = Contract.objects.get_or_create(
                contract_no=contract_no
            )
            validated_data["contract"] = contract

        return super().create(validated_data)

    def validate(self, data):
        site_name = data.get("site_name")
        tehsil = data.get("tehsil")

        if site_name and tehsil:
            if InspectionSite.objects.filter(
                site_name__iexact=site_name,
                tehsil=tehsil
            ).exists():
                raise serializers.ValidationError(
                    "Site already exists in this tehsil."
                )

        return data

class BOQBillSerializer(serializers.ModelSerializer):

    contract_no = serializers.CharField(source="contract.contract_no", read_only=True)

    # province_name = serializers.CharField(source="contract.province.province_name", read_only=True)
    # zone_name = serializers.CharField(source="contract.zone.zone_name", read_only=True)
    # division_name = serializers.CharField(source="contract.division.division_name", read_only=True)
    # district_name = serializers.CharField(source="contract.district.district_name", read_only=True)
    # tehsil_name = serializers.CharField(source="contract.tehsil.tehsil_name", read_only=True)

    class Meta:
        model = BOQBill
        fields = [
            "id",

            "contract", "contract_no",

            # "province_name", "zone_name", "division_name",
            # "district_name", "tehsil_name",

            "bill_no",
            "bill_title",

            "qty",
            "unit_rate_rs",
            "amount_rs",

            "created_at",
        ]

        read_only_fields = ["amount_rs", "created_at"]
        
        
class BOQInspectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = BOQInspection
        fields = [
            "id",
            "boq",
            "site",
            "inspected_claimed_quantity",
            "inspected_quantity",
            "inspected_unit_rate",
            "inspected_amount",
            "status",
            "submitted_by"
        ]
        read_only_fields = [
            "id",
            "inspected_amount",
        ]

class BOQSerializer(serializers.ModelSerializer):

    contract_no = serializers.CharField(
        source="contract.contract_no",
        read_only=True
    )

    forInspection = BOQInspectionSerializer(
        required=False
    )

    class Meta:
        model = BOQ
        fields = [
            "id",
            "contract",
            "contract_no",
            "item_no",
            "bill_no",
            "bill_no_desc",
            "mrs_ref_no",
            "description",
            "unit",
            "quantity",
            "unit_rate",
            "amount",
            "forInspection",
            "created_at",
        ]

        read_only_fields = [
            "amount",
            "created_at",
        ]

    def create(self, validated_data):

        inspection_data = validated_data.pop(
            "forInspection",
            None
        )

        boq = BOQ.objects.create(**validated_data)

        if inspection_data:
            BOQInspection.objects.create(
                boq=boq,
                **inspection_data
            )

        return boq

    def update(self, instance, validated_data):

        inspection_data = validated_data.pop(
            "forInspection",
            None
        )

        # BOQ fields update
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        # Inspection update/create
        if inspection_data:

            inspection, created = (
                BOQInspection.objects.get_or_create(
                    boq=instance
                )
            )

            for attr, value in inspection_data.items():
                setattr(inspection, attr, value)

            inspection.save()

        return instance
class TPV01Serializer(serializers.ModelSerializer):
    district_name = serializers.CharField(source="district.district_name", read_only=True)
    tehsil_name = serializers.CharField(source="tehsil.tehsil_name", read_only=True)
    inspection_site_name = serializers.CharField(source="inspection_site.site_name", read_only=True)

    site_location = serializers.SerializerMethodField(read_only=True)

    plant_type = serializers.CharField(
        source="inspection_site.type",
        read_only=True
    )

    class Meta:
        model = TPV01
        fields = [
            "id",

            "district",
            "district_name",

            "tehsil",
            "tehsil_name",

            "inspection_site",
            "inspection_site_name",

            "plant_type",

            "date_of_visit",
            "site_location",
            "phase",

            "inspector_name",

            "contractor_rep_present",
            "operator_caretaker_present",
            "gps_app_entry",

            "capacity",
            "operating_at_visit",
            "water_available_to_public",

            "overall_status",

            "physical_checks",
            "record_checks",

            "service_delivery",
            "om_compliance",
            "recommendation",
            "major_observations",

            "inspector_signature",
            "site_representative_signature",

            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "inspector",
            "inspector_name",
            "plant_type",
            "created_at",
            "updated_at",
        ]

    def get_site_location(self, obj):
        return {
            "latitude": obj.inspection_site.latitude,
            "longitude": obj.inspection_site.longitude,
        }
