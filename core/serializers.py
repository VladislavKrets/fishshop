from rest_framework.serializers import ModelSerializer
from core import models


class TopicSerializer(ModelSerializer):
    class Meta:
        model = models.Topic
        fields = '__all__'


class ItemSerializer(ModelSerializer):
    class Meta:
        model = models.Item
        fields = '__all__'
