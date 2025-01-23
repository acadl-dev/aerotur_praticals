from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('executarAPICEP/<str:cep>/', views.executarAPICEP, name='executar_api_cep'),
    
]

