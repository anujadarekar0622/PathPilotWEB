from django.urls import path

from .views import (
    ChatbotAPIView,
    ChatHistoryAPIView,
)


urlpatterns = [

    path(
        "chat/",
        ChatbotAPIView.as_view(),
        name="chatbot-chat",
    ),

    path(
        "history/",
        ChatHistoryAPIView.as_view(),
        name="chatbot-history",
    ),

]