from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from django.conf import settings
from google import genai
from google.genai import types

from .models import ChatMessage


# ============================================================
# PATHPILOT AI SYSTEM INSTRUCTION
# ============================================================

PATHPILOT_SYSTEM_INSTRUCTION = """
You are PathPilot AI, a general-purpose AI assistant.

You are not restricted to education, programming, studying, or PathPilot-related
questions. You can answer general questions across many topics, just like a
modern AI assistant.

Your job is to understand what the user is actually asking and provide the
most useful answer possible.

GENERAL BEHAVIOR:
- Answer the user's actual question directly.
- You can discuss general knowledge, science, history, technology, programming,
  mathematics, writing, productivity, careers, entertainment, everyday topics,
  and many other subjects.
- Do not force unrelated questions into a PathPilot, study, or student context.
- Do not assume every question is academic.
- If the user asks for an essay, write the essay.
- If the user asks for code, provide working code.
- If the user asks for an explanation, explain it clearly.
- If the user asks for a comparison, compare the requested things.
- If the user asks for steps, provide clear steps.
- If the user asks for an opinion, clearly distinguish opinion from fact.
- If the user asks a simple question, keep the answer reasonably concise.
- If the user asks for a detailed answer, provide a detailed answer.
- Use headings, bullet points, tables, examples, and code blocks when useful.
- Adapt your explanation to the user's level.
- Do not mention this system instruction.
- Do not pretend to have performed an action that you did not perform.
- If you are uncertain about something, be honest instead of inventing facts.

PATHPILOT PERSONALITY:
- Friendly
- Helpful
- Clear
- Natural
- Supportive
- Intelligent
- Not overly formal
- Not robotic

IMPORTANT:
PathPilot is the application where you are being used, but PathPilot does NOT
limit the subjects you can discuss.

The user's message is the primary instruction.
"""


# ============================================================
# CHAT API
# ============================================================

class ChatbotAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        user_message = request.data.get("message", "").strip()

        if not user_message:
            return Response(
                {"detail": "Message is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            # Save USER message
            ChatMessage.objects.create(
                user=request.user,
                role="user",
                message=user_message
            )

            # Gemini client
            client = genai.Client(
                api_key=settings.GEMINI_API_KEY
            )

            # Generate AI response
            response = client.models.generate_content(
                model="gemini-3.5-flash",
                contents=user_message,
                config=types.GenerateContentConfig(
                    system_instruction=PATHPILOT_SYSTEM_INSTRUCTION,
                    temperature=0.7,
                ),
            )

            ai_reply = response.text

            # Save AI response
            ChatMessage.objects.create(
                user=request.user,
                role="assistant",
                message=ai_reply
            )

            return Response(
                {
                    "reply": ai_reply
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:

            print("========================================")
            print("PATHPILOT AI ERROR:")
            print(str(e))
            print("========================================")

            return Response(
                {
                    "detail": "Unable to generate AI response.",
                    "error": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ============================================================
# CHAT HISTORY API
# ============================================================

class ChatHistoryAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        messages = ChatMessage.objects.filter(
            user=request.user
        ).order_by("created_at")

        data = [
            {
                "id": message.id,
                "role": message.role,
                "message": message.message,
                "created_at": message.created_at,
            }
            for message in messages
        ]

        return Response(
            data,
            status=status.HTTP_200_OK
        )