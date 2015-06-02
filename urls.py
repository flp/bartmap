from django.conf.urls import url

from . import views

urlpatterns = [
    # eg: /bartmap/
    url(r'^$', views.index, name='index'),
]
