from django.db import models
# from django.contrib.gis.db import models as gis_models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from datetime import datetime
from django.db.models import Max, Sum

import uuid

# --------------------------------------------------------
# Custom User Manager
# --------------------------------------------------------
class MyUserManager(BaseUserManager):
    def create_user(self, code, password=None, role="surveyor", **extra_fields):
        if not code:
            raise ValueError("Users must have a code")
        user = self.model(code=code, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, code, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(code, password, role="superadmin", **extra_fields)


# --------------------------------------------------------
# Role Choices (Optional if you want separate Role model)
# --------------------------------------------------------
ROLE_CHOICES = [
    ("superadmin", "Super Admin"),
    ("contractor", "Contractor"),
    ("inspector", "Inspector"),
]

# --------------------------------------------------------
# Custom User Model 
# --------------------------------------------------------
class MyUser(AbstractBaseUser, PermissionsMixin):
    code = models.CharField(max_length=50, unique=True)
    full_name = models.CharField(max_length=150)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="surveyor")
    supervisor = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, blank=True, related_name="surveyors"
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    email = models.EmailField(max_length=255, unique=True, null=True, blank=True)
    contact = models.CharField(max_length=20, null=True, blank=True)
    USERNAME_FIELD = "code"
    REQUIRED_FIELDS = []

    objects = MyUserManager()

    def __str__(self):
        return f"{self.full_name} ({self.role})"

# -------------------------------------------------------------------
# PROVINCE 
# -------------------------------------------------------------------

class Province(models.Model):
    province_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.province_name

# -------------------------------------------------------------------
# ZONE 
# -------------------------------------------------------------------

class Zone(models.Model):
    province = models.ForeignKey(Province, on_delete=models.CASCADE)
    zone_name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.province.province_name}"

# -------------------------------------------------------------------
# DIVISION
# -------------------------------------------------------------------

class Division(models.Model):
    province = models.ForeignKey(
        Province,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="divisions"
    )
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, null=True, blank=True, related_name="divisions")
    division_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return f"{self.province.province_name} - {self.zone.zone_name} - {self.division_name}"

# -------------------------------------------------------------------
# DISTRICT 
# -------------------------------------------------------------------

class District(models.Model):
    province = models.ForeignKey(
        Province,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="districts"
    )
    zone= models.ForeignKey(
        Zone,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="districts"
    )
    division = models.ForeignKey(
        Division,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="districts"
    )

    district_name = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.province.province_name} - {self.zone.zone_name} - {self.division.division_name} - {self.district_name}"

# -------------------------------------------------------------------
# TEHSIL 
# -------------------------------------------------------------------


class Tehsil(models.Model):
    province = models.ForeignKey(
        Province,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="tehsils"
    )
    zone= models.ForeignKey(
        Zone,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="tehsils"
    )
    division = models.ForeignKey(
        Division,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="tehsils"
    )
    district = models.ForeignKey(
        District,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="tehsils"
    )

    tehsil_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return f"{self.province.province_name} - {self.zone.zone_name} - {self.division.division_name} - {self.district.district_name} - {self.tehsil_name}"

# --------------------------------------------------------
# Target Survey
# --------------------------------------------------------
class TargetSurvey(models.Model):
    supervisor = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name="assigned_targets_supervisor")
    surveyor = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name="assigned_targets_surveyor")

    province = models.ForeignKey(Province, on_delete=models.CASCADE, default=None)
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, default=None)
    division = models.ForeignKey(Division, on_delete=models.CASCADE, default=None)
    district = models.ForeignKey(District, on_delete=models.CASCADE, default=None)
    tehsil = models.ForeignKey(Tehsil, on_delete=models.CASCADE, default=None)
    
    no_of_target = models.PositiveIntegerField(default=0)
    no_of_target_done = models.PositiveIntegerField(default=0)
    target_date = models.DateField()
    target_status = models.CharField(
        max_length=20,
        choices=[('not_started', 'Not Started'), ('in_progress', 'In Progress'), ('completed', 'Completed')],
        default='not_started'
    )                    

    is_approved = models.BooleanField(default=False)
    is_approved_count = models.PositiveIntegerField(default=0) 
    approved_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # 🟢 Fix Target Status
        if self.no_of_target_done >= self.no_of_target and self.no_of_target > 0:
            self.target_status = "completed"
        elif self.no_of_target_done > 0:
            self.target_status = "in_progress"
        else:
            self.target_status = "not_started"

        if self.is_approved_count >= self.no_of_target and self.no_of_target > 0:
            self.is_approved = True
            if not self.approved_at:
                self.approved_at = timezone.now()

        # 🟢 Auto add approved_at timestamp
        if self.is_approved and not self.approved_at:
            self.approved_at = timezone.now()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.survey_code} - {self.surveyor.full_name}"
    
class Contract(models.Model):
    contract_no = models.CharField(max_length=100, unique=True)

    province = models.ForeignKey(
        Province,
        on_delete=models.PROTECT,
        related_name="contracts",
        null=True,
        blank=True
    )

    zone = models.ForeignKey(
        Zone,
        on_delete=models.PROTECT,
        related_name="contracts",
        null=True,
        blank=True
    )

    division = models.ForeignKey(
        Division,
        on_delete=models.PROTECT,
        related_name="contracts",
        null=True,
        blank=True
    )

    district = models.ForeignKey(
        District,
        on_delete=models.PROTECT,
        related_name="contracts",
        null=True,
        blank=True
    )

    tehsil = models.ForeignKey(
        Tehsil,
        on_delete=models.PROTECT,
        related_name="contracts",
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.contract_no
# --------------------------------------------------------
# Inspection Site
# --------------------------------------------------------
class InspectionSite(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name="sites", db_index=True, null=True, blank=True)
    zone = models.ForeignKey("Zone", on_delete=models.PROTECT, related_name="sites", null=True, blank=True)
    division = models.ForeignKey("Division", on_delete=models.PROTECT, related_name="sites", null=True, blank=True)
    district = models.ForeignKey("District", on_delete=models.PROTECT, related_name="sites", null=True, blank=True)
    tehsil = models.ForeignKey("Tehsil", on_delete=models.PROTECT, related_name="sites", null=True, blank=True)
    
    phase = models.PositiveSmallIntegerField(null=True, blank=True)

    site_name = models.CharField(max_length=255)

    latitude = models.DecimalField(max_digits=12, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=12, decimal_places=8, null=True, blank=True)

    TYPE_CHOICES = (
        ("RO", "RO"),
        ("UF", "UF"),
        ("MF", "MF"),
        ("PF", "PF"),
    )
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)

    CATEGORY_CHOICES = (
        ("Revamped", "Revamped"),
        ("New", "New"),
        ("Old", "Old"),
        ("Functional", "Functional"),
        ("Dysfunctional", "Dysfunctional"),
        ("Not functional", "Not functional"),
        ("Abondoned", "Abondoned"),
    )
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        
        return self.site_name

# --------------------------------------------------------
# Bill of Quantities (BOQ Header - Bill Information)
# --------------------------------------------------------
class BOQBill(models.Model):

    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name="boq_bills", null=True, blank=True)

    bill_no = models.PositiveIntegerField()

    bill_title = models.CharField(max_length=255)

    qty = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    unit_rate_rs = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0
    )

    amount_rs = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def calculate_total(self):
        total = self.items.aggregate(
            total=Sum("amount_rs")
        )["total"] or 0

        self.amount_rs = total
        self.save(update_fields=["amount_rs"])

    def save(self, *args, **kwargs):

        self.amount_rs = (
            (self.qty or 0)
            * (self.unit_rate_rs or 0)
        )

        super().save(*args, **kwargs)

    def __str__(self):
        return self.bill_title
    
# --------------------------------------------------------
# Bill of Quantities (BOQ)
# --------------------------------------------------------
class BOQ(models.Model):

    # bill = models.ForeignKey(
    #     BOQBill,
    #     on_delete=models.CASCADE,
    #     related_name="items",
    #     db_index=True
    # )

    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    
    item_no = models.CharField(max_length=100, null=True, blank=True )
    
    bill_no = models.CharField(max_length=100, null=True, blank=True )
    bill_no_desc = models.CharField(
    max_length=255,
    null=True,
    blank=True
   )
    mrs_ref_no = models.CharField(max_length=100, null=True, blank=True)

    description = models.TextField()

    unit = models.CharField(max_length=50)

    quantity = models.DecimalField(max_digits=12, decimal_places=2)

    unit_rate = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):

        self.amount = (self.quantity or 0) * (self.unit_rate or 0)

        super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.item_no} - {self.description[:50]}"
# --------------------------------------------------------
# BOQ Inspection (BOQ)
# --------------------------------------------------------    
class BOQInspection(models.Model):

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    boq = models.OneToOneField(
        BOQ,
        on_delete=models.CASCADE,
        related_name="forInspection"
    )
    
    site = models.OneToOneField(
        InspectionSite,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="inspectionSite"
    )

    inspected_claimed_quantity = models.CharField(max_length=50)

    inspected_quantity = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    inspected_unit_rate = models.DecimalField(
        max_digits=15,
        decimal_places=2
    )

    inspected_amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
#     User = get_user_model()
    
#     submitted_by = models.ForeignKey(
#     User,
#     on_delete=models.SET_NULL,
#     null=True,
#     blank=True,
#     related_name="boq_inspections"
# )
    submitted_by = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )
    def save(self, *args, **kwargs):
        self.inspected_amount = (
            self.inspected_quantity *
            self.inspected_unit_rate
        )
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.boq} - {self.status}"
# --------------------------------------------------------
# TPV 01 - PLANT VISIT PROFORMA
# --------------------------------------------------------
class TPV01(models.Model):
    PHASE_CHOICES = [
        ("Phase I", "Phase I"),
        ("Phase II", "Phase II"),
        ("Phase III", "Phase III"),
    ]
        
    CAPACITY_CHOICES = [
        ("500 LPH", "500 LPH"),
        ("1000 LPH", "1000 LPH"),
        ("2000 LPH", "2000 LPH"),
        ("4000 LPH", "4000 LPH"),
    ]
    
    OVERALL_STATUS_CHOICES = [
        ("Functional", "Functional"),
        ("Functional with Minor Issues", "Functional with Minor Issues"),
        ("Partially Functional", "Partially Functional"),
        ("Non-Functional", "Non-Functional"),
        ("Not Accessible", "Not Accessible"),
    ]
    
    RECOMMENDATION_CHOICES = [
        ("Acceptable", "Acceptable"),
        ("Acceptable with Observations", "Acceptable with Observations"),
        ("Corrective Action Required", "Corrective Action Required"),
        ("Serious Deficiency / Revisit Required", "Serious Deficiency / Revisit Required"),
    ]

    # Basic Information
    district = models.ForeignKey("District", on_delete=models.CASCADE, related_name="tpv01_records")
    tehsil = models.ForeignKey("Tehsil", on_delete=models.CASCADE, related_name="tpv01_records")
    inspection_site = models.ForeignKey("InspectionSite", on_delete=models.CASCADE, related_name="tpv01_records")
    
    date_of_visit = models.DateField()
    # plant_location = models.CharField(max_length=255, blank=True, null=True)
    phase = models.CharField(max_length=50, choices=PHASE_CHOICES)

    inspector = models.ForeignKey(MyUser, on_delete=models.SET_NULL, null=True, blank=True, related_name="tpv01_inspections")
    inspector_name = models.CharField(max_length=255)
    
    # Presence Information
    contractor_rep_present = models.BooleanField(default=False)
    operator_caretaker_present = models.BooleanField(default=False)
    gps_app_entry = models.BooleanField(default=False)

    capacity = models.CharField(max_length=50, choices=CAPACITY_CHOICES)
    operating_at_visit = models.BooleanField(default=False)
    water_available_to_public = models.BooleanField(default=False)
    
    # Overall Assessment
    overall_status = models.CharField(max_length=100, choices=OVERALL_STATUS_CHOICES)
    
    # Checklists - stored as JSON
    physical_checks = models.JSONField(default=list, blank=True)
    record_checks = models.JSONField(default=list, blank=True)
    
    # Assessment Details
    service_delivery = models.CharField(max_length=50, blank=True, null=True)
    om_compliance = models.CharField(max_length=50, blank=True, null=True)
    recommendation = models.CharField(max_length=100, choices=RECOMMENDATION_CHOICES)
    major_observations = models.TextField(blank=True, null=True)
    
    # Signatures
    inspector_signature = models.TextField(blank=True, null=True)
    site_representative_signature = models.TextField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"TPV-01 {self.inspection_site.site_name} - {self.date_of_visit}"

