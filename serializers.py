from rest_framework import serializers
from .models import Subject, StudySchedule


class SubjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Subject

        fields = [
            "id",
            "subject_name",
            "topic_name",
            "description",
            "pdf",
            "is_completed",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]


class StudyScheduleSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudySchedule

        fields = [
            "id",
            "title",
            "day",
            "start_time",
            "end_time",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]