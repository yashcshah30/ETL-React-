from django.contrib import admin
from django.urls import path, include             
from rest_framework import routers                
from todo import views         
from django.conf.urls.static import static             
from django.conf import settings      

router = routers.DefaultRouter()                      
router.register(r'todos', views.TodoView, 'todo')     

urlpatterns = [
    path('admin/', admin.site.urls),         
    path('api/', include(router.urls)),
    path('api/uploadfiles', views.UploadFile.as_view()),             
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)