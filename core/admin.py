from django.contrib import admin
from django.forms import ModelForm, ChoiceField

from core.models import Topic, Item


class TopicForm(ModelForm):
    topic_choices = list(Topic.objects.all().values_list('id', 'name'))

    def __init__(self, *args, **kwargs):
       super(TopicForm, self).__init__(*args, **kwargs)
       if self.instance.id:
           CHOICES_INCLUDING_DB_VALUE = [(self.instance.id,)*2] + self.topic_choices
           self.initial['parent_id'] = None
           self.fields['parent_id'] = ChoiceField(
                choices=CHOICES_INCLUDING_DB_VALUE, label='Parent name')
       else:
           self.fields['parent_id'] = ChoiceField(
               choices=self.topic_choices, label='Parent name')

class TopicAdmin(admin.ModelAdmin):
    form = TopicForm


admin.site.register(Topic, TopicAdmin)
admin.site.register(Item)

# Register your models here.
