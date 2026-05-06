from textblob import TextBlob


class UserBehaviorAnalyzer:
    def __init__(self):
        # Keywords that indicate high urgency
        self.urgency_keywords = ['urgent', 'asap', 'immediately', 'broken', 'emergency', 'help', 'fix', 'stop',
                                 'critical']

    def analyze_message(self, text):
        """
        Analyzes user behavior based on prompt text.
        Returns: A dictionary of behavioral insights.
        """
        # 1. Sentiment Analysis (-1.0 to 1.0)
        # -1 = Very Negative/Frustrated, 1 = Very Positive/Happy
        blob = TextBlob(text)
        sentiment = blob.sentiment.polarity

        # 2. Urgency Detection
        # Check for keywords and excessive exclamation marks
        urgency_score = 0
        text_lower = text.lower()

        for word in self.urgency_keywords:
            if word in text_lower:
                urgency_score += 1

        if '!' in text:
            urgency_score += 1
        if text.isupper():  # Detects SHOUTING
            urgency_score += 2

        # 3. Complexity Detection (Word count)
        word_count = len(text.split())
        complexity = "Simple"
        if word_count > 40:
            complexity = "High"
        elif word_count > 15:
            complexity = "Moderate"

        # 4. Behavioral Prediction / State
        user_state = "Neutral"
        if sentiment < -0.2:
            user_state = "Frustrated"
        elif sentiment > 0.5:
            user_state = "Satisfied/Polite"

        if urgency_score >= 2:
            user_state = "Anxious/Pressured"

        return {
            "sentiment_score": sentiment,
            "urgency_level": "High" if urgency_score >= 2 else "Normal",
            "complexity": complexity,
            "user_state": user_state,
            "word_count": word_count
        }

    def get_behavioral_context(self, text):
        """Returns a string to be injected into the AI system prompt."""
        analysis = self.analyze_message(text)

        context = f"\n[USER BEHAVIOR CONTEXT]\n"
        context += f"- State: {analysis['user_state']}\n"
        context += f"- Urgency: {analysis['urgency_level']}\n"
        context += f"- Complexity: {analysis['complexity']}\n"

        # Suggested AI adjustment
        if analysis['user_state'] == "Frustrated" or analysis['urgency_level'] == "High":
            context += "- Directive: User is under pressure. Skip pleasantries. Be direct, fast, and solution-oriented.\n"
        elif analysis['user_state'] == "Satisfied/Polite":
            context += "- Directive: User is friendly. You may maintain a more helpful, mentoring Lead Architect tone.\n"

        return context