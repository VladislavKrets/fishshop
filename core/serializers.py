from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, Serializer
from core import models


class TopicSerializer(ModelSerializer):
    class Meta:
        model = models.Topic
        fields = '__all__'


class ItemSerializer(ModelSerializer):
    class Meta:
        model = models.Item
        fields = '__all__'


class FilterSerializer(Serializer):
    topic_id__in = serializers.ListField(child=serializers.IntegerField(), required=False)
    name__icontains = serializers.CharField(required=False)

    class Meta:
        fields = '__all__'
