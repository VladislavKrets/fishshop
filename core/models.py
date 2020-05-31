from django.db import models


class Topic(models.Model):
    str_id = models.CharField(max_length=500)
    name = models.CharField(max_length=500)
    parent_id = models.IntegerField(null=True)


class Item(models.Model):
    str_id = models.CharField(max_length=500)
    name = models.CharField(max_length=500)
    price = models.FloatField(null=True)
    topic = models.ForeignKey(to=Topic,
                              on_delete=models.deletion.CASCADE,
                              related_name='items')
    photo = models.ImageField(upload_to='images', null=True)

