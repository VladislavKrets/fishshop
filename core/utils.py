import xml.etree.ElementTree as etree
import os, shutil
from core import models
import re


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


def parse_properties(properties):
    for property in properties:
        property_id = property.find('{urn:1C.ru:commerceml_2}Ид').text
        property_name = property.find('{urn:1C.ru:commerceml_2}Наименование').text
        is_property_exists = models.Property.objects.filter(str_id=property_id).exists()
        if is_property_exists:
            current_property = models.Property.objects.get(str_id=property_id)
            current_property.name = property_name
            current_property.save()
        else:
            current_property = models.Property.objects.create(str_id=property_id, name=property_name)
        values = property.find('{urn:1C.ru:commerceml_2}ВариантыЗначений')
        if values is not None:
            values = values.findall('{urn:1C.ru:commerceml_2}Справочник')
            for value in values:
                value_id = value.find('{urn:1C.ru:commerceml_2}ИдЗначения').text
                property_value = value.find('{urn:1C.ru:commerceml_2}Значение').text
                is_value_exists = models.ItemPropertyValue.objects.filter(str_id=value_id).exists()
                if is_value_exists:
                    current_value =  models.ItemPropertyValue.objects.get(str_id=value_id)
                    current_value.property_value = property_value
                    current_value.property = property
                    current_value.save()
                else:
                    current_value = models.ItemPropertyValue.objects.create(str_id=value_id,
                                                        property_value=property_value, property=current_property)
                    current_value.save()


def parse_files():
    path = os.path.dirname(os.path.abspath(__file__)) + '/../webdata'
    images_path = path + '/../images'
    import_files = path + '/import_files'
    shutil.rmtree(images_path + '/import_files', ignore_errors=True)
    shutil.copytree(import_files, images_path + '/import_files')
    parse_import(path)
    parse_offers(path)


def parse_offers(path):
    for filename in os.listdir(path):
        if re.match(r'offers.+\.xml', filename):
            fullname = os.path.join(path, filename)
            tree = etree.parse(fullname)
            root = tree.getroot()
            offers_package = root.find('{urn:1C.ru:commerceml_2}ПакетПредложений')
            offers = offers_package.find('{urn:1C.ru:commerceml_2}Предложения') \
                .findall('{urn:1C.ru:commerceml_2}Предложение')
            for offer in offers:
                product_id = offer.find('{urn:1C.ru:commerceml_2}Ид').text
                unit = offer.find('{urn:1C.ru:commerceml_2}БазоваяЕдиница') \
                    .attrib.get('НаименованиеПолное', None)
                price = offer.find('{urn:1C.ru:commerceml_2}Цены') \
                    .find('{urn:1C.ru:commerceml_2}Цена') \
                    .find('{urn:1C.ru:commerceml_2}ЦенаЗаЕдиницу').text
                curr_product = models.Item.objects.get(str_id=product_id)
                curr_product.unit = unit
                curr_product.price = price
                curr_product.save()


def parse_import(path):
    for filename in os.listdir(path):
        if re.match(r'import.+\.xml', filename):
            fullname = os.path.join(path, filename)
            tree = etree.parse(fullname)
            root = tree.getroot()
            classifier = root.find('{urn:1C.ru:commerceml_2}Классификатор')
            groups = classifier.find('{urn:1C.ru:commerceml_2}Группы') \
                .findall('{urn:1C.ru:commerceml_2}Группа')
            parse_group(groups[0])
            properties = classifier.find('{urn:1C.ru:commerceml_2}Свойства')
            if properties is not None:
                properties = properties.findall('{urn:1C.ru:commerceml_2}Свойство')
                parse_properties(properties)
            folder = root.find('{urn:1C.ru:commerceml_2}Каталог')
            products = folder.find('{urn:1C.ru:commerceml_2}Товары').findall(
                '{urn:1C.ru:commerceml_2}Товар')
            for product in products:
                product_id = product.find('{urn:1C.ru:commerceml_2}Ид').text
                product_name = product.find('{urn:1C.ru:commerceml_2}Наименование').text
                group_id = product.find('{urn:1C.ru:commerceml_2}Группы') \
                    .find('{urn:1C.ru:commerceml_2}Ид').text
                image = product.find('{urn:1C.ru:commerceml_2}Картинка')
                properties = product.find('{urn:1C.ru:commerceml_2}ЗначенияСвойств')

                if image is not None:
                    image = image.text
                curr_group = models.Topic.objects.get(str_id=group_id)
                if models.Item.objects.filter(str_id=product_id).exists():
                    curr_product = models.Item.objects.get(str_id=product_id)
                    curr_product.name = product_name
                    curr_product.photo = image
                    curr_product.topic = curr_group

                else:
                    curr_product = models.Item.objects.create(topic=curr_group, str_id=product_id,
                                                              name=product_name)
                    curr_product.photo = image

                if properties is not None:
                    properties = properties.findall('{urn:1C.ru:commerceml_2}ЗначенияСвойства')
                    for property in properties:
                        property_id = property.find('{urn:1C.ru:commerceml_2}Ид').text
                        property_value = property.find('{urn:1C.ru:commerceml_2}Значение').text
                        current_property = models.Property.objects.get(str_id=property_id)
                        is_value_exists = models.ItemPropertyValue.objects.filter(property=current_property,
                                                                                  property_value=property_value)
                        if is_value_exists:
                            current_value = models.ItemPropertyValue.objects.get(property=current_property,
                                                                                 property_value=property_value)
                            is_property_exists = curr_product.properties.filter(pk=current_property.pk).exists()
                            if not is_property_exists:
                                curr_product.properties.add(current_value)
                        else:
                            current_value = models.ItemPropertyValue.objects.create(property=current_property,
                                                                                    property_value=property_value)
                            curr_product.properties.add(current_value)
                curr_product.save()
