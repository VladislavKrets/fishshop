from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, Serializer
from core import models


class TopicSerializer(ModelSerializer):
    class Meta:
        model = models.Topic
        fields = '__all__'


class ItemSerializer(ModelSerializer):

    def to_representation(self, instance):
        data = super().to_representation(instance)
        properties = instance.properties.all()
        description = ''
        for property in properties:
            is_value_exists = models.ItemPropertyValue\
                .objects.filter(str_id=property.property_value)
            description += ("<div>" + property.property.name + ": ")
            if is_value_exists:
                current_value = models.ItemPropertyValue\
                .objects.get(str_id=property.property_value)
                value = current_value.property_value
            else:
                value = property.property_value
            description += value + "</div>"
        print(description)
        data['description'] = description
        return data

    class Meta:
        model = models.Item
        exclude = ('properties', )


class FilterSerializer(Serializer):
    topic_id__in = serializers.ListField(child=serializers.IntegerField(), required=False)
    pk__in = serializers.ListField(child=serializers.IntegerField(), required=False)
    name__icontains = serializers.CharField(required=False)

    class Meta:
        fields = '__all__'
