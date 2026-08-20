import os
import json
from google import genai


MODEL_NAME = "gemini-3.6-flash"


def generate_ai_response(prompt):
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise ValueError("GEMINI_API_KEY is not configured.")

    client = genai.Client(api_key=api_key)

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
    )

    return response.text


def generate_roadmap(goal, education, semester, skills, hours):
    prompt = f"""
You are PathPilot AI, a personalized learning roadmap generator.

Create a practical learning roadmap for a student.

Student information:
Career goal: {goal}
Current education: {education}
Semester: {semester}
Current skills: {skills}
Available study hours per day: {hours}

Return ONLY valid JSON.

Use exactly this structure:

{{
    "career": "string",
    "estimated_duration": "string",
    "difficulty": "Beginner/Intermediate/Advanced",
    "phases": [
        {{
            "title": "string",
            "duration": "string",
            "topics": ["topic 1", "topic 2"],
            "projects": ["project 1", "project 2"],
            "resources": ["resource 1", "resource 2"]
        }}
    ]
}}

Requirements:
- Create 4 to 6 phases.
- Make the roadmap appropriate for the student's current education and skills.
- Consider the number of study hours available each day.
- Do not repeat skills the student already knows unnecessarily.
- Include practical projects.
- Include realistic learning resources.
- Keep the roadmap suitable for a student.
"""

    raw_response = generate_ai_response(prompt)

    # Remove markdown JSON fences if Gemini returns them
    cleaned = raw_response.strip()

    if cleaned.startswith("```"):
        cleaned = cleaned.replace("```json", "")
        cleaned = cleaned.replace("```", "")
        cleaned = cleaned.strip()

    return json.loads(cleaned)