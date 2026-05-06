from textblob import TextBlob
import spacy
import re

try:
    nlp = spacy.load("en_core_web_sm")
except:
    # Fallback for deployment environments
    import os
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

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


class ActionItemExtractor:
    def extract_entities(self, text):
        doc = nlp(text)

        # Lists to store found items
        tasks = []
        assignees = []
        deadlines = []

        # 1. PERSON and DATE extraction
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                assignees.append(ent.text)
            elif ent.label_ == "DATE":
                deadlines.append(ent.text)

        # 2. TASK extraction (Using Dependency Parsing)
        # We look for "ROOT" verbs or "XCOMP" (dependent verbs)
        for sent in doc.sents:
            for token in sent:
                if token.pos_ == "VERB" and token.dep_ in ["ROOT", "xcomp"]:
                    # Capture the verb and its associated objects
                    task_phrase = "".join([w.text_with_ws for w in token.subtree]).strip()
                    if len(task_phrase.split()) > 2:  # Ignore single words like "Regroup"
                        tasks.append(task_phrase.capitalize())

        return {
            "tasks": list(set(tasks))[:10],  # Limit to top 10
            "assignees": list(set(assignees)),
            "deadlines": list(set(deadlines))
        }

    def get_extraction_context(self, text):
        data = self.extract_entities(text)
        if not data["tasks"]: return ""

        return f"""
        [ENTITY EXTRACTION DATA]
        - Tasks: {len(data['tasks'])} items found.
        - People: {', '.join(data['assignees'])}
        - Dates: {', '.join(data['deadlines'])}
        - Directive: Acknowledge these and offer a [CSV_DATA] download.
        """