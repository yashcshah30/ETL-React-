from django.shortcuts import render
from rest_framework import viewsets         
from .serializers import TodoSerializer      
from .models import Todo                     
from rest_framework.views import APIView
from rest_framework.parsers import FileUploadParser, FormParser, MultiPartParser
from rest_framework.response import Response
from django.shortcuts import redirect

class TodoView(viewsets.ModelViewSet):       
  serializer_class = TodoSerializer          
  queryset = Todo.objects.all()              


# def uploadfile(request):
#   pass

class UploadFile(APIView):
  parser_classes = (FormParser,MultiPartParser)

  def get(self, request):
    pass

  def post(self, request):
      print(request.data)
      file_obj = request.data['file']
      print(type(file_obj))
      data = file_obj.read().decode()
      print(type(data))
      for line in data.split('\n'):
        title = line.split(',')[0]
        description = line.split(',')[1]
        jsonobj = {'title' :  title, 'description':description}
        serializer = TodoSerializer(data = jsonobj)
        if serializer.is_valid():
          serializer.save()
          print("saved")
      # return redirect('/api')
      return Response(status=204)
      # pass