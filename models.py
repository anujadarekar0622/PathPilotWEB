from django.db import models
from django.contrib.auth.models import User


class Task(models.Model):

    TAG_CHOICES = [
        ("Study", "Study"),
        ("Coding", "Coding"),
        ("Project", "Project"),
        ("Personal", "Personal"),
        ("Other", "Other"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="tasks"
    )

    title = models.CharField(
        max_length=200
    )

    description = models.TextField(
        blank=True
    )

    due_date = models.DateField(
        null=True,
        blank=True
    )

    duration = models.PositiveIntegerField(
        default=30
    )

    tag = models.CharField(
        max_length=30,
        choices=TAG_CHOICES,
        default="Study"
    )

    is_completed = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title