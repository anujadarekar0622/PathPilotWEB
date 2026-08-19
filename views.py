from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django.conf import settings
from google import genai

from .models import Subject, StudySchedule
from .serializers import SubjectSerializer, StudyScheduleSerializer


# ============================================================
# SUBJECT API
# ============================================================

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all().order_by("-created_at")
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]


# ============================================================
# STUDY SCHEDULE API
# ============================================================

class StudyScheduleViewSet(viewsets.ModelViewSet):
    queryset = StudySchedule.objects.all().order_by(
        "day",
        "start_time"
    )
    serializer_class = StudyScheduleSerializer
    permission_classes = [IsAuthenticated]


# ============================================================
# AI STUDY TOOLS
# ============================================================

class AIStudyToolsAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        subject = request.data.get("subject", "").strip()
        topic = request.data.get("topic", "").strip()
        action = request.data.get("action", "").strip()
        question = request.data.get("question", "").strip()

        if not subject or not topic:
            return Response(
                {"detail": "Subject and topic are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if action not in [
            "summary",
            "questions",
            "explain",
        ]:
            return Response(
                {"detail": "Invalid AI study action."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:

            client = genai.Client(
                api_key=settings.GEMINI_API_KEY
            )

            # ------------------------------------------------
            # SUMMARY
            # ------------------------------------------------

            if action == "summary":

                prompt = f"""
Create a concise study summary for a student.

Subject: {subject}
Topic: {topic}

Include:
- Important concepts
- Key definitions
- Important points
- A simple example where useful

Make it easy to revise before an exam.
Do not invent information unrelated to the topic.
"""

            # ------------------------------------------------
            # QUESTIONS
            # ------------------------------------------------

            elif action == "questions":

                prompt = f"""
Create 5 useful practice questions for a student.

Subject: {subject}
Topic: {topic}

Include a mixture of:
- Conceptual questions
- Short-answer questions
- Exam-style questions

Do not provide the answers.
Keep the questions relevant to the given topic.
"""

            # ------------------------------------------------
            # EXPLAIN
            # ------------------------------------------------

            else:

                if not question:
                    return Response(
                        {
                            "detail": "Question is required for explain action."
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                prompt = f"""
You are explaining a topic to a student.

Subject: {subject}
Topic: {topic}

Student's question:
{question}

Explain the answer clearly and simply.
Use examples when helpful.
Do not assume advanced knowledge unless necessary.
"""

            # ------------------------------------------------
            # GEMINI
            # ------------------------------------------------

            response = client.models.generate_content(
                model="gemini-3.5-flash",
                contents=prompt,
            )

            return Response(
                {
                    "action": action,
                    "reply": response.text,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:

            print("AI STUDY TOOLS ERROR:", e)

            return Response(
                {
                    "detail": "Unable to generate AI study response.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )