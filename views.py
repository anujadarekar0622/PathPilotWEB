from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import KnowledgeResource
from .serializers import KnowledgeResourceSerializer
from .ai_service import generate_roadmap


class RoadmapAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        goal = request.data.get("goal")
        education = request.data.get("education")
        semester = request.data.get("semester")
        skills = request.data.get("skills")
        hours = request.data.get("hours")

        if not goal:
            return Response(
                {"detail": "Career goal is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not education:
            return Response(
                {"detail": "Education is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not semester:
            return Response(
                {"detail": "Semester is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not skills:
            return Response(
                {"detail": "Current skills are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not hours:
            return Response(
                {"detail": "Available study hours are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            roadmap = generate_roadmap(
                goal=goal,
                education=education,
                semester=semester,
                skills=skills,
                hours=hours,
            )

            return Response(roadmap, status=status.HTTP_200_OK)

        except Exception as error:
            return Response(
                {
                    "detail": "Failed to generate roadmap.",
                    "error": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class KnowledgeVaultAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Get resources belonging only to the logged-in user.

        Optional filters:
        ?search=python
        ?category=documentation
        ?favorite=true
        """

        resources = KnowledgeResource.objects.filter(
            user=request.user
        ).order_by("-created_at")

        search = request.query_params.get("search")

        if search:
            resources = resources.filter(title__icontains=search)

        category = request.query_params.get("category")

        if category:
            resources = resources.filter(category__iexact=category)

        favorite = request.query_params.get("favorite")

        if favorite is not None:
            favorite_value = favorite.lower() == "true"
            resources = resources.filter(is_favorite=favorite_value)

        serializer = KnowledgeResourceSerializer(resources, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Create a new Knowledge Vault resource.
        """

        serializer = KnowledgeResourceSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class KnowledgeVaultDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_resource(self, request, resource_id):
        try:
            return KnowledgeResource.objects.get(
                id=resource_id,
                user=request.user
            )
        except KnowledgeResource.DoesNotExist:
            return None

    def get(self, request, resource_id):
        resource = self.get_resource(request, resource_id)

        if not resource:
            return Response(
                {"detail": "Resource not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = KnowledgeResourceSerializer(resource)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, resource_id):
        resource = self.get_resource(request, resource_id)

        if not resource:
            return Response(
                {"detail": "Resource not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = KnowledgeResourceSerializer(resource, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, resource_id):
        resource = self.get_resource(request, resource_id)

        if not resource:
            return Response(
                {"detail": "Resource not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = KnowledgeResourceSerializer(
            resource,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, resource_id):
        resource = self.get_resource(request, resource_id)

        if not resource:
            return Response(
                {"detail": "Resource not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        resource.delete()

        return Response(
            {"detail": "Resource deleted successfully."},
            status=status.HTTP_204_NO_CONTENT
        )