# serializers.py
from rest_framework import serializers
from .models import Score

class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = ['id', 'player_name', 'game_name', 'score', 'games_played', 'time_played', 'created_at']
