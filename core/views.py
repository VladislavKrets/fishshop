from rest_framework import mixins
from rest_framework.views import APIView
from core import models
from core import serializers
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework import status
from core import utils
from rest_framework.pagination import PageNumberPagination


class TopicList(APIView):
    def get(self, request):
        root_topics = models.Topic.objects.filter(parent_id=None)
        serializer = serializers.TopicSerializer(instance=root_topics, many=True)
        data = serializer.data
        self.forward_topics(data)
        return Response(data=data, status=status.HTTP_200_OK)

    def forward_topics(self, root_topics):
        for i in range(len(root_topics)):
            curr_topics = models.Topic.objects.filter(parent_id=root_topics[i]['id'])
            if curr_topics.exists():
                curr_serializer = serializers.TopicSerializer(instance=curr_topics, many=True)
                data = curr_serializer.data
                root_topics[i]['children'] = data
                self.forward_topics(data)


class ParseXml(APIView):
    def get(self, request):
        utils.parse_files()
        return Response(status=status.HTTP_200_OK)


class PagePagination(PageNumberPagination):
    page_size = 50


class ItemList(ListAPIView):
    serializer_class = serializers.ItemSerializer
    paginate_by = 10
    paginate_by_param = 'page_size'
    max_paginate_by = 100
    pagination_class = PagePagination

    def get_queryset(self):
        data = self.request.data
        serializer = serializers.FilterSerializer(data=data)
        if serializer.is_valid():
            return models.Item.objects.filter(**serializer.validated_data)

    def post(self, request, *args, **kwargs):
        return self.list(request, args, kwargs)


class CurrentItem(mixins.RetrieveModelMixin, GenericAPIView):
    queryset = models.Item.objects.all()
    serializer_class = serializers.ItemSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, args, kwargs)


class BestsellerItem(mixins.ListModelMixin, GenericAPIView):
    queryset = models.Item.objects.filter(is_bestseller=True)
    serializer_class = serializers.ItemSerializer

    def get(self, request, *args, **kwargs):
        return self.list(self, request, args, kwargs)


class PromotionItem(mixins.ListModelMixin, GenericAPIView):
    queryset = models.Item.objects.filter(is_promotion=True)
    serializer_class = serializers.ItemSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, args, kwargs)


