from django.urls import path
from core import views

urlpatterns = [
    path('topics/', views.TopicList.as_view()),
    path('items/', views.ItemList.as_view()),
    path('parse_xml/', views.ParseXml.as_view()),
]
