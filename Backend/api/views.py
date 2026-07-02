from django.shortcuts import render

# Create your views here.
from rest_framework import generics

class BOQCreateAPIView(generics.CreateAPIView):
    queryset = BOQ.objects.all()
    serializer_class = BOQSerializer


class BOQDetailAPIView(generics.RetrieveUpdateAPIView):
    queryset = BOQ.objects.all()
    serializer_class = BOQSerializer


class BOQListAPIView(generics.ListAPIView):
    queryset = BOQ.objects.all().select_related(
        "contract",
        "forInspection"
    )
    serializer_class = BOQSerializer