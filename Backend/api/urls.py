from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import *

router = DefaultRouter()

#--------------------------------- User View ---------------------------------
router.register(r'create-user', UserCreateView, basename='create-user')
router.register(r'list-user', GetUserView, basename='list-user')
router.register(r'update-user', UserUpdateView, basename='update-user') 
router.register(r'login-user', UserLoginDashboardCreateView, basename='login-user')

#--------------------------------- Province View ---------------------------------
router.register(r'create-province', ProvinceCreateView, basename='create-province')
router.register(r'list-province', ListProvinceView, basename='list-province')
router.register(r'update-province', ProvinceUpdateView, basename='update-province') 
router.register(r'delete-province', ProvinceDeleteView, basename='delete-province')

#--------------------------------- Division View ---------------------------------
router.register(r'create-division', DivisionCreateView, basename='create-division')
router.register(r'list-division', ListDivisionView, basename='list-division')
router.register(r'update-division', DivisionUpdateView, basename='update-division') 
router.register(r'delete-division', DivisionDeleteView, basename='delete-division')

#--------------------------------- District View ---------------------------------
router.register(r'create-district', DistrictCreateView, basename='create-district')
router.register(r'list-district', ListDistrictView, basename='list-district')
router.register(r'update-district', DistrictUpdateView, basename='update-district') 
router.register(r'delete-district', DistrictDeleteView, basename='delete-district')

#---------------------------------- Tehsil View ----------------------------------
router.register(r'create-tehsil', TehsilCreateView, basename='create-tehsil')
router.register(r'list-tehsil', ListTehsilView, basename='list-tehsil')
router.register(r'update-tehsil', TehsilUpdateView, basename='update-tehsil') 
router.register(r'delete-tehsil', TehsilDeleteView, basename='delete-tehsil')

#---------------------------------- Zone View ----------------------------------
router.register(r'create-zone', ZoneCreateView, basename='create-zone')
router.register(r'list-zone', ListZoneView, basename='list-zone')
router.register(r'update-zone', ZoneUpdateView, basename='update-zone') 
router.register(r'delete-zone', ZoneDeleteView, basename='delete-zone')

# --------------------------------- Contract View ---------------------------------

router.register(r'create-contract', ContractCreateView, basename='create-contract')
router.register(r'list-contract', ListContractView, basename='list-contract')
router.register(r'update-contract', ContractUpdateView, basename='update-contract')
router.register(r'delete-contract', ContractDeleteView, basename='delete-contract')

#----------------------------------Inspection Site View ----------------------------------
router.register(r'create-inspection-site', InspectionSiteCreateView, basename='create-inspection-site')
router.register(r'list-inspection-site', InspectionSiteListView, basename='list-inspection-site')
router.register(r'update-inspection-site', InspectionSiteUpdateView, basename='update-inspection-site') 
router.register(r'delete-inspection-site', InspectionSiteDeleteView, basename='delete-inspection-site')

#----------------------------------BOQ Bill View ----------------------------------
router.register(r'create-boq-bill', BOQBillCreateView, basename='create-boq-bill')
router.register(r'list-boq-bill', BOQBillListView, basename='list-boq-bill')
router.register(r'update-boq-bill', BOQBillUpdateView, basename='update-boq-bill')
router.register(r'delete-boq-bill', BOQBillDeleteView, basename='delete-boq-bill')

#----------------------------------BOQ View ----------------------------------
router.register(r'create-boq', BOQCreateView, basename='create-boq')
router.register(r'list-boq', BOQListView, basename='list-boq')
router.register(r'update-boq', BOQUpdateView, basename='update-boq')
router.register(r'delete-boq', BOQDeleteView, basename='delete-boq')

#----------------------------------BOQ Inspection View ----------------------------------
router.register(r'create-boq-inspection', BOQInspectionCreateView, basename='create-boq-inspection')
router.register(r'list-boq-inspection', BOQInspectionListView, basename='list-boq-inspection')
router.register(r'update-boq-inspection', BOQInspectionUpdateView, basename='update-boq-inspection')
router.register(r'delete-boq-inspection', BOQInspectionDeleteView, basename='delete-boq-inspection')

#----------------------------------TPV-01 View ----------------------------------
router.register(r'create-tpv-01', CreateTPV01View, basename='create-tpv-01')
router.register(r'list-tpv-01', ListTPV01View, basename='list-tpv-01')
router.register(r'update-tpv-01', UpdateTPV01View, basename='update-tpv-01') 
router.register(r'delete-tpv-01', DeleteTPV01View, basename='delete-tpv-01')


urlpatterns = [
    # path('admin/', admin.site.urls),
    # path('api/', include(router.urls)),
    path('', include(router.urls)),

]