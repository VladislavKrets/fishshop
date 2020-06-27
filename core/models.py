from django.db import models


class Topic(models.Model):
    str_id = models.CharField(max_length=500, verbose_name='1c id')
    name = models.CharField(max_length=500, verbose_name='Name')
    parent_id = models.IntegerField(null=True, verbose_name='Parent topic')

    def __str__(self):
        return 'Topic: ' + self.name


class Item(models.Model):
    str_id = models.CharField(max_length=500, verbose_name='1c id')
    name = models.CharField(max_length=500, verbose_name='Name')
    price = models.FloatField(null=True, blank=True, verbose_name='Price')
    topic = models.ForeignKey(to=Topic,
                              on_delete=models.deletion.CASCADE,
                              related_name='items', verbose_name='Topic')
    photo = models.ImageField(upload_to='images', null=True, verbose_name='Photo', blank=True)
    is_promotion = models.BooleanField(default=False, verbose_name='Promotion')
    is_bestseller = models.BooleanField(default=False, verbose_name='Bestseller')

    def save(self, *args, **kwargs):
        if not self.price:
            self.price = None
        if not self.photo:
            self.photo = None
        super(Item, self).save(*args, **kwargs)

    def __str__(self):
        return 'Item: ' + self.name

