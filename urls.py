from django.urls import path

from .views import (
    RoadmapAPIView,
    KnowledgeVaultAPIView,
    KnowledgeVaultDetailAPIView,
)


urlpatterns = [
    # ai roadmap
    path("roadmap/", RoadmapAPIView.as_view(), name="ai-roadmap"),

    # knowledge vault - get all / create
    path("vault/", KnowledgeVaultAPIView.as_view(), name="knowledge-vault"),

    # knowledge vault - get one / update / delete
    path(
        "vault/<int:resource_id>/",
        KnowledgeVaultDetailAPIView.as_view(),
        name="knowledge-vault-detail",
    ),
]