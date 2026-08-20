from django.db import models
from django.contrib.auth.models import User


class KnowledgeResource(models.Model):
    CATEGORY_CHOICES = [
        ("course", "Course"),
        ("notes", "Notes"),
        ("ebook", "E-Book"),
        ("documentation", "Documentation"),
        ("video", "Video"),
        ("article", "Article"),
        ("other", "Other"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="knowledge_resources"
    )

    title = models.CharField(max_length=200)

    url = models.URLField(max_length=500)

    category = models.CharField(
        max_length=30,
        choices=CATEGORY_CHOICES,
        default="other"
    )

    tags = models.CharField(
        max_length=500,
        blank=True
    )

    is_favorite = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title