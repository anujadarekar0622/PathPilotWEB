from rest_framework import serializers

from .models import KnowledgeResource


class KnowledgeResourceSerializer(serializers.ModelSerializer):

    class Meta:
        model = KnowledgeResource
        fields = [
            "id",
            "title",
            "url",
            "category",
            "tags",
            "is_favorite",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]