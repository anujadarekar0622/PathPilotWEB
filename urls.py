from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    SubjectViewSet,
    StudyScheduleViewSet,
    AIStudyToolsAPIView,
)


# =========================
# SUBJECT ROUTER
# =========================

router = DefaultRouter()

# NOTE: "schedules" must be registered BEFORE the empty-prefix ""
# route. Otherwise SubjectViewSet's detail route (^(?P<pk>...)/$)
# matches "schedules" as a pk and shadows StudyScheduleViewSet,
# causing a false 404.

router.register(
    "schedules",
    StudyScheduleViewSet,
    basename="schedule",
)

router.register(
    "",
    SubjectViewSet,
    basename="subject",
)


# =========================
# URL PATTERNS
# =========================

urlpatterns = [
    path(
        "ai-tools/",
        AIStudyToolsAPIView.as_view(),
        name="ai-study-tools",
    ),
]

urlpatterns += router.urls