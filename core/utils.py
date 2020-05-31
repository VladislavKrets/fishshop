import xml.etree.ElementTree as etree
import os, shutil
from core import models
from django.core.files.images import ImageFile


def parse_group(group, model=None):
    group_id = group.find('{urn:1C.ru:commerceml_2}Ид').text
    name = group.find('{urn:1C.ru:commerceml_2}Наименование').text
    model_topic = None
    if models.Topic.objects.filter(str_id=group_id).exists():
        parent_id = model.id if model is not None else None
        model_topic = models.Topic.objects.get(str_id=group_id, parent_id=parent_id)
        model_topic.name = name
        model_topic.save()
    elif model is not None:
        model_topic = models.Topic.objects.create(str_id=group_id, name=name, parent_id=model.id)
    else:
        model_topic = models.Topic.objects.create(str_id=group_id, name=name)
    groups = group.find('{urn:1C.ru:commerceml_2}Группы')
    if groups:
        groups = groups.findall('{urn:1C.ru:commerceml_2}Группа')
        for current_group in groups:
            parse_group(current_group, model_topic)


def parse_files():
    path = os.path.dirname(os.path.abspath(__file__)) + '/../webdata'
    images_path = path + '/../images'
    import_files = path + '/import_files'
    shutil.rmtree(images_path + '/import_files', ignore_errors=True)
    shutil.copytree(import_files, images_path + '/import_files')
    for filename in os.listdir(path):
        if not filename.endswith('.xml'): continue
        fullname = os.path.join(path, filename)
        tree = etree.parse(fullname)
        root = tree.getroot()
        classifier = root.find('{urn:1C.ru:commerceml_2}Классификатор')
        groups = classifier.find('{urn:1C.ru:commerceml_2}Группы').findall('{urn:1C.ru:commerceml_2}Группа')
        parse_group(groups[0])
        folder = root.find('{urn:1C.ru:commerceml_2}Каталог')
        products = folder.find('{urn:1C.ru:commerceml_2}Товары').findall(
            '{urn:1C.ru:commerceml_2}Товар')
        for product in products:
            product_id = product.find('{urn:1C.ru:commerceml_2}Ид').text
            product_name = product.find('{urn:1C.ru:commerceml_2}Наименование').text
            group_id = product.find('{urn:1C.ru:commerceml_2}Группы') \
                .find('{urn:1C.ru:commerceml_2}Ид').text
            image = product.find('{urn:1C.ru:commerceml_2}Картинка')
            if image is not None:
                image = image.text
            curr_group = models.Topic.objects.get(str_id=group_id)
            if models.Item.objects.filter(str_id=product_id).exists():
                curr_product = models.Item.objects.get(str_id=product_id)
                curr_product.name = product_name
                curr_product.photo = image
                curr_product.topic = curr_group
                curr_product.save()
            else:
                curr_product = models.Item.objects.create(topic=curr_group, str_id=product_id,
                                           name=product_name)
                curr_product.photo = image
                curr_product.save()
